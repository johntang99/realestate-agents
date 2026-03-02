#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']
const IMAGE_KEY_PATTERN = /(image|photo|logo|icon|thumbnail|avatar|cover|banner|portrait|src)$/i
const IMAGE_HOSTS = ['images.unsplash.com', 'images.pexels.com']

function readArgValue(flag, fallback = '') {
  const index = process.argv.findIndex((arg) => arg === flag)
  if (index === -1) return fallback
  return process.argv[index + 1] || fallback
}

function hasFlag(flag) {
  return process.argv.includes(flag)
}

function resolveSites() {
  const raw = readArgValue('--sites', '')
  if (!raw) return []
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
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
    if (!(key in process.env)) process.env[key] = value
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

function getPublicUrl(supabaseUrl, bucket, objectPath) {
  const origin = new URL(supabaseUrl).origin
  return `${origin}/storage/v1/object/public/${bucket}/${objectPath}`
}

function isLikelyImageUrl(value, keyHint = '') {
  if (typeof value !== 'string') return false
  const raw = value.trim()
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) return false
  const lower = raw.toLowerCase()
  if (IMAGE_HOSTS.some((host) => lower.includes(host))) return true
  if (IMAGE_EXTENSIONS.some((ext) => lower.includes(ext))) return true
  return IMAGE_KEY_PATTERN.test(keyHint)
}

function detectExtFromUrl(urlString) {
  try {
    const parsed = new URL(urlString)
    const lower = parsed.pathname.toLowerCase()
    const matched = IMAGE_EXTENSIONS.find((ext) => lower.endsWith(ext))
    if (matched) return matched
  } catch {
    // ignore
  }
  return ''
}

function detectExtFromContentType(contentType) {
  const normalized = (contentType || '').toLowerCase()
  if (normalized.includes('jpeg')) return '.jpg'
  if (normalized.includes('png')) return '.png'
  if (normalized.includes('webp')) return '.webp'
  if (normalized.includes('gif')) return '.gif'
  if (normalized.includes('svg')) return '.svg'
  if (normalized.includes('avif')) return '.avif'
  return '.jpg'
}

function collectImageUrls(node, out, keyPath = []) {
  if (typeof node === 'string') {
    const keyHint = keyPath[keyPath.length - 1] || ''
    if (isLikelyImageUrl(node, keyHint)) out.add(node.trim())
    return
  }
  if (Array.isArray(node)) {
    node.forEach((item, index) => collectImageUrls(item, out, [...keyPath, String(index)]))
    return
  }
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      collectImageUrls(value, out, [...keyPath, key])
    }
  }
}

function replaceImageUrls(node, map) {
  if (typeof node === 'string') {
    return map.get(node.trim()) || node
  }
  if (Array.isArray(node)) {
    return node.map((item) => replaceImageUrls(item, map))
  }
  if (node && typeof node === 'object') {
    const out = {}
    for (const [key, value] of Object.entries(node)) {
      out[key] = replaceImageUrls(value, map)
    }
    return out
  }
  return node
}

function deepEqual(a, b) {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (a === null || b === null) return a === b
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false
    return a.every((value, index) => deepEqual(value, b[index]))
  }
  if (typeof a === 'object') {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) return false
    return aKeys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]))
  }
  return false
}

async function upsertMediaRow(supabase, siteId, mediaPath, publicUrl) {
  const { error } = await supabase
    .from('media_assets')
    .upsert(
      {
        site_id: siteId,
        path: mediaPath,
        url: publicUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'site_id,path' }
    )
  if (!error) return

  const { data: existing, error: existingError } = await supabase
    .from('media_assets')
    .select('id')
    .eq('site_id', siteId)
    .eq('file_path', mediaPath)
    .maybeSingle()
  if (existingError) throw new Error(existingError.message)

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from('media_assets')
      .update({
        file_name: path.posix.basename(mediaPath),
        storage_url: publicUrl,
      })
      .eq('id', existing.id)
    if (updateError) throw new Error(updateError.message)
    return
  }

  const { error: insertError } = await supabase.from('media_assets').insert({
    site_id: siteId,
    file_name: path.posix.basename(mediaPath),
    file_path: mediaPath,
    storage_url: publicUrl,
  })
  if (insertError) throw new Error(insertError.message)
}

async function tryInsertRevision(supabase, row, previousContent) {
  try {
    await supabase.from('content_revisions').insert({
      entry_id: row.id,
      data: previousContent,
      created_by: 'script:migrate-content-images',
      note: 'Move external images to Supabase media bucket',
    })
  } catch {
    // optional safeguard; ignore schema differences
  }
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
    console.error('Missing --sites (comma-separated).')
    process.exit(1)
  }
  if (!supabaseUrl || !serviceRoleKey || !bucket) {
    console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_STORAGE_BUCKET.')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  console.log('--- Content image migration ---')
  console.log(`Sites: ${sites.join(', ')}`)
  console.log(`Bucket: ${bucket}`)
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'EXECUTE'}`)
  console.log('-------------------------------')

  let scannedRows = 0
  let imageRefs = 0
  let uploaded = 0
  let contentUpdated = 0
  let errors = 0

  for (const siteId of sites) {
    const { data: rows, error: listError } = await supabase
      .from('content_entries')
      .select('id,site_id,locale,path,content')
      .eq('site_id', siteId)
    if (listError) {
      console.error(`[${siteId}] failed to load content entries: ${listError.message}`)
      errors += 1
      continue
    }

    const urlSet = new Set()
    for (const row of rows || []) {
      scannedRows += 1
      collectImageUrls(row.content || {}, urlSet)
    }
    imageRefs += urlSet.size
    console.log(`[${siteId}] discovered ${urlSet.size} unique external image URL(s)`)

    const urlToBucketUrl = new Map()
    for (const sourceUrl of urlSet) {
      try {
        const hash = createHash('sha1').update(sourceUrl).digest('hex').slice(0, 20)
        const extFromUrl = detectExtFromUrl(sourceUrl)
        if (dryRun) {
          const dryExt = extFromUrl || '.jpg'
          const objectPath = `${siteId}/imported/${hash}${dryExt}`
          urlToBucketUrl.set(sourceUrl, getPublicUrl(supabaseUrl, bucket, objectPath))
          continue
        }

        const response = await fetch(sourceUrl)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const contentType = response.headers.get('content-type') || ''
        const ext = extFromUrl || detectExtFromContentType(contentType)
        const objectPath = `${siteId}/imported/${hash}${ext}`
        const publicUrl = getPublicUrl(supabaseUrl, bucket, objectPath)

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(objectPath, buffer, {
            contentType: contentType || 'image/jpeg',
            cacheControl: '3600',
            upsert: true,
          })
        if (uploadError) throw new Error(uploadError.message)

        const mediaPath = `imported/${hash}${ext}`
        await upsertMediaRow(supabase, siteId, mediaPath, publicUrl)
        urlToBucketUrl.set(sourceUrl, publicUrl)
        uploaded += 1
      } catch (error) {
        errors += 1
        console.error(`[${siteId}] image migrate failed: ${sourceUrl} -> ${error.message}`)
      }
    }

    if (dryRun) continue

    for (const row of rows || []) {
      const current = row.content || {}
      const next = replaceImageUrls(current, urlToBucketUrl)
      if (deepEqual(current, next)) continue
      try {
        await tryInsertRevision(supabase, row, current)
        const { error: updateError } = await supabase
          .from('content_entries')
          .update({ content: next })
          .eq('id', row.id)
        if (updateError) throw new Error(updateError.message)
        contentUpdated += 1
      } catch (error) {
        errors += 1
        console.error(`[${siteId}] content update failed: ${row.locale}/${row.path} -> ${error.message}`)
      }
    }
  }

  console.log('\n=== Migration Summary ===')
  console.log(`scannedRows: ${scannedRows}`)
  console.log(`imageRefs: ${imageRefs}`)
  console.log(`uploadedOrPrepared: ${uploaded}`)
  console.log(`contentUpdated: ${contentUpdated}`)
  console.log(`errors: ${errors}`)
  console.log(dryRun ? '\nDry run done.' : '\nMigration complete.')
}

main().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
