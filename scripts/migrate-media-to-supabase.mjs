#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.avif',
])

function readArgValue(flag, fallback = '') {
  const index = process.argv.findIndex((arg) => arg === flag)
  if (index === -1) return fallback
  return process.argv[index + 1] || fallback
}

function hasFlag(flag) {
  return process.argv.includes(flag)
}

async function loadDotEnvLocal(projectRoot) {
  const envPath = path.join(projectRoot, '.env.local')
  let raw = ''
  try {
    raw = await fs.readFile(envPath, 'utf-8')
  } catch {
    return
  }

  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index <= 0) continue
    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

function resolveSupabaseUrl() {
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_PROD_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PROD_URL ||
    ''
  )
}

function resolveServiceRoleKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PROD_SERVICE_ROLE_KEY ||
    ''
  )
}

function resolveBucket() {
  return (
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    ''
  )
}

function resolveSites() {
  const raw = readArgValue('--sites', '')
  if (!raw) return []
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

function isImageFile(filePath) {
  return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

async function walk(dir, baseDir, out) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(fullPath, baseDir, out)
      continue
    }
    if (!isImageFile(entry.name)) continue
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')
    out.push({ fullPath, relativePath })
  }
}

async function listLocalFiles(siteId, projectRoot) {
  const baseDir = path.join(projectRoot, 'public', 'uploads', siteId)
  const files = []
  try {
    await walk(baseDir, baseDir, files)
  } catch {
    return []
  }
  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath))
}

async function listBucketFiles(supabase, bucket, siteId) {
  const out = new Set()
  const queue = [siteId]

  while (queue.length > 0) {
    const prefix = queue.shift()
    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' },
    })
    if (error) {
      console.error(`Failed listing bucket prefix "${prefix}":`, error.message)
      continue
    }

    for (const entry of data || []) {
      const objectPath = `${prefix}/${entry.name}`
      if (!entry.id) {
        queue.push(objectPath)
        continue
      }
      if (isImageFile(entry.name)) out.add(objectPath)
    }
  }

  return out
}

function getPublicUrl(supabase, bucket, objectPath) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath)
  return data.publicUrl
}

async function upsertMediaRow(supabase, siteId, relativePath, url) {
  const { error } = await supabase.from('media_assets').upsert(
    {
      site_id: siteId,
      path: relativePath,
      url,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'site_id,path' }
  )
  if (error) {
    throw new Error(error.message)
  }
}

async function migrateSite({ supabase, bucket, siteId, projectRoot, dryRun }) {
  const localFiles = await listLocalFiles(siteId, projectRoot)
  const bucketFiles = await listBucketFiles(supabase, bucket, siteId)

  const stats = {
    siteId,
    localFiles: localFiles.length,
    alreadyInBucket: 0,
    toUpload: 0,
    uploaded: 0,
    dbUpserts: 0,
    errors: 0,
  }

  for (const file of localFiles) {
    const objectPath = `${siteId}/${file.relativePath}`
    const alreadyInBucket = bucketFiles.has(objectPath)
    const publicUrl = getPublicUrl(supabase, bucket, objectPath)

    if (alreadyInBucket) {
      stats.alreadyInBucket += 1
      if (!dryRun) {
        try {
          await upsertMediaRow(supabase, siteId, file.relativePath, publicUrl)
          stats.dbUpserts += 1
        } catch (error) {
          stats.errors += 1
          console.error(`[${siteId}] DB upsert failed for ${file.relativePath}:`, error.message)
        }
      }
      continue
    }

    stats.toUpload += 1
    if (dryRun) continue

    try {
      const buffer = await fs.readFile(file.fullPath)
      const contentType = guessContentType(file.relativePath)
      const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
        contentType,
        upsert: false,
        cacheControl: '3600',
      })
      if (error) throw new Error(error.message)
      stats.uploaded += 1
    } catch (error) {
      stats.errors += 1
      console.error(`[${siteId}] Upload failed for ${file.relativePath}:`, error.message)
      continue
    }

    try {
      await upsertMediaRow(supabase, siteId, file.relativePath, publicUrl)
      stats.dbUpserts += 1
    } catch (error) {
      stats.errors += 1
      console.error(`[${siteId}] DB upsert failed for ${file.relativePath}:`, error.message)
    }
  }

  return stats
}

function guessContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  if (ext === '.svg') return 'image/svg+xml'
  if (ext === '.avif') return 'image/avif'
  return 'application/octet-stream'
}

async function main() {
  const projectRoot = process.cwd()
  await loadDotEnvLocal(projectRoot)
  const dryRun = hasFlag('--dry-run')
  const sites = resolveSites()
  const supabaseUrl = resolveSupabaseUrl()
  const serviceRoleKey = resolveServiceRoleKey()
  const bucket = resolveBucket()

  if (!sites.length) {
    console.error('Missing required --sites flag (comma-separated).')
    process.exit(1)
  }
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
    process.exit(1)
  }
  if (!bucket) {
    console.error('Missing SUPABASE_STORAGE_BUCKET.')
    process.exit(1)
  }

  const targetHost = new URL(supabaseUrl).host
  console.log('--- Media migration target ---')
  console.log(`Supabase host: ${targetHost}`)
  console.log(`Bucket: ${bucket}`)
  console.log(`Sites: ${sites.join(', ')}`)
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'EXECUTE'}`)
  console.log('------------------------------')

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const allStats = []
  for (const siteId of sites) {
    console.log(`\n[${siteId}] scanning local uploads and bucket...`)
    const stats = await migrateSite({ supabase, bucket, siteId, projectRoot, dryRun })
    allStats.push(stats)
    console.log(
      `[${siteId}] local=${stats.localFiles} alreadyInBucket=${stats.alreadyInBucket} toUpload=${stats.toUpload} uploaded=${stats.uploaded} dbUpserts=${stats.dbUpserts} errors=${stats.errors}`
    )
  }

  const total = allStats.reduce(
    (acc, item) => {
      acc.localFiles += item.localFiles
      acc.alreadyInBucket += item.alreadyInBucket
      acc.toUpload += item.toUpload
      acc.uploaded += item.uploaded
      acc.dbUpserts += item.dbUpserts
      acc.errors += item.errors
      return acc
    },
    {
      localFiles: 0,
      alreadyInBucket: 0,
      toUpload: 0,
      uploaded: 0,
      dbUpserts: 0,
      errors: 0,
    }
  )

  console.log('\n=== Summary ===')
  console.log(`localFiles: ${total.localFiles}`)
  console.log(`alreadyInBucket: ${total.alreadyInBucket}`)
  console.log(`toUpload: ${total.toUpload}`)
  console.log(`uploaded: ${total.uploaded}`)
  console.log(`dbUpserts: ${total.dbUpserts}`)
  console.log(`errors: ${total.errors}`)

  if (dryRun) {
    console.log('\nDry run complete. Re-run without --dry-run to apply changes.')
  } else {
    console.log('\nMigration complete.')
  }
}

main().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
