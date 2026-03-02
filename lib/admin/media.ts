import fs from 'fs/promises';
import path from 'path';
import {
  canUseMediaDb,
  listMediaDb,
  upsertMediaDb,
} from '@/lib/admin/mediaDb';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export interface MediaItem {
  id: string;
  url: string;
  path: string;
}

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function shouldIncludeFilesystem(storageBucket: string) {
  if (!storageBucket) return true;
  const override = (process.env.MEDIA_INCLUDE_FILESYSTEM || '').trim().toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(override);
}

function getStorageBucket() {
  return (
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    ''
  );
}

function isImageByPath(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

async function listStorageItemsRecursive(
  siteId: string,
  bucket: string
): Promise<MediaItem[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const out: MediaItem[] = [];
  const queue: string[] = [siteId];

  while (queue.length > 0) {
    const currentPrefix = queue.shift()!;
    const { data, error } = await supabase.storage.from(bucket).list(currentPrefix, {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) {
      console.error('Supabase storage list error:', error);
      continue;
    }
    for (const entry of data || []) {
      const name = (entry as any).name as string;
      const id = (entry as any).id as string | null | undefined;
      const metadata = (entry as any).metadata as { mimetype?: string } | null | undefined;
      const objectPath = `${currentPrefix}/${name}`;

      // Folders usually have no id/metadata; traverse them recursively.
      if (!id) {
        queue.push(objectPath);
        continue;
      }

      const mime = (metadata?.mimetype || '').toLowerCase();
      if (!mime.startsWith('image/') && !isImageByPath(name)) {
        continue;
      }

      const relative = objectPath.startsWith(`${siteId}/`)
        ? objectPath.slice(siteId.length + 1)
        : objectPath;
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      out.push({
        id: relative,
        path: relative,
        url: publicData.publicUrl,
      });
    }
  }

  return out.sort((a, b) => a.path.localeCompare(b.path));
}

async function walkDirectory(dir: string, baseDir: string, items: MediaItem[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDirectory(fullPath, baseDir, items);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        const relative = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        items.push({
          id: relative,
          path: relative,
          url: `/uploads/${relative}`,
        });
      }
    }
  }
}

export async function listMedia(siteId: string): Promise<MediaItem[]> {
  const storageBucket = getStorageBucket();
  const includeFilesystem = shouldIncludeFilesystem(storageBucket);
  const normalizedFilesystemItems: MediaItem[] = [];
  if (includeFilesystem) {
    const baseDir = path.join(process.cwd(), 'public', 'uploads', siteId);
    const filesystemItems: MediaItem[] = [];
    try {
      await walkDirectory(baseDir, baseDir, filesystemItems);
    } catch (error) {
      // ignore; directory may not exist yet
    }
    normalizedFilesystemItems.push(
      ...filesystemItems
        .map((item) => ({
          ...item,
          url: `/uploads/${siteId}/${item.path}`,
        }))
        .sort((a, b) => a.path.localeCompare(b.path))
    );
  }

  if (canUseMediaDb()) {
    const dbItems = await listMediaDb(siteId);
    const storageItems = storageBucket
      ? await listStorageItemsRecursive(siteId, storageBucket)
      : [];

    // Keep DB synchronized with discovered filesystem/storage items.
    const discoveredItems = [...normalizedFilesystemItems, ...storageItems];
    await Promise.all(
      discoveredItems.map((item) =>
        upsertMediaDb({ siteId, path: item.path, url: item.url })
      )
    );

    // Return union: prefer storage URL, then DB, then filesystem URL.
    const byPath = new Map<string, MediaItem>();
    for (const item of normalizedFilesystemItems) byPath.set(item.path, item);
    for (const item of dbItems) byPath.set(item.path, item);
    for (const item of storageItems) byPath.set(item.path, item);
    return Array.from(byPath.values()).sort((a, b) => a.path.localeCompare(b.path));
  }

  if (storageBucket) {
    const storageItems = await listStorageItemsRecursive(siteId, storageBucket);
    const byPath = new Map<string, MediaItem>();
    for (const item of normalizedFilesystemItems) byPath.set(item.path, item);
    for (const item of storageItems) byPath.set(item.path, item);
    return Array.from(byPath.values()).sort((a, b) => a.path.localeCompare(b.path));
  }

  return normalizedFilesystemItems;
}
