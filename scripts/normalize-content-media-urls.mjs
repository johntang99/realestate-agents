#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const UPLOADS_PREFIX = '/uploads/'

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

function getPublicBaseUrl(supabaseUrl, bucket) {
  const origin = new URL(supabaseUrl).origin
  return `${origin}/storage/v1/object/public/${bucket}`
}

function normalizeString(src, siteId, publicBase) {
  if (typeof src !== 'string') return src
  if (/^https?:\/\//i.test(src)) return src
  if (!src.startsWith(UPLOADS_PREFIX)) return src

  const trimmed = src.slice(UPLOADS_PREFIX.length)
  const segments = trimmed.split('/').filter(Boolean)
  if (segments.length === 0) return src

  const hasSitePrefix = segments.length >= 2
  const objectPath = hasSitePrefix ? trimmed : `${siteId}/${trimmed}`
  return `${publicBase}/${objectPath}`
}

function normalizeData(input, siteId, publicBase, stats) {
  if (typeof input === 'string') {
    const next = normalizeString(input, siteId, publicBase)
    if (next !== input) stats.replacements += 1
    return next
  }
  if (Array.isArray(input)) {
    return input.map((value) => normalizeData(value, siteId, publicBase, stats))
  }
  if (input && typeof input === 'object') {
    const out = {}
    for (const [key, value] of Object.entries(input)) {
      out[key] = normalizeData(value, siteId, publicBase, stats)
    }
    return out
  }
  return input
}

async function listEntriesForSites(supabase, sites) {
  const all = []
  for (const siteId of sites) {
    let from = 0
    const pageSize = 1000
    while (true) {
      const to = from + pageSize - 1
      const { data, error } = await supabase
        .from('content_entries')
        .select('id,site_id,locale,path,data')
        .eq('site_id', siteId)
        .order('site_id', { ascending: true })
        .order('locale', { ascending: true })
        .order('path', { ascending: true })
        .range(from, to)
      if (error) throw new Error(error.message)
      const rows = data || []
      all.push(...rows)
      if (rows.length < pageSize) break
      from += pageSize
    }
  }
  return all
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

  const publicBase = getPublicBaseUrl(supabaseUrl, bucket)
  const targetHost = new URL(supabaseUrl).host
  console.log('--- Content URL normalization target ---')
  console.log(`Supabase host: ${targetHost}`)
  console.log(`Bucket: ${bucket}`)
  console.log(`Sites: ${sites.join(', ')}`)
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'EXECUTE'}`)
  console.log('---------------------------------------')

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const rows = await listEntriesForSites(supabase, sites)
  let scanned = 0
  let changedRows = 0
  let replacements = 0
  let updates = 0
  let revisions = 0
  let errors = 0

  for (const row of rows) {
    scanned += 1
    const stats = { replacements: 0 }
    const normalized = normalizeData(row.data, row.site_id, publicBase, stats)
    if (stats.replacements === 0) continue

    changedRows += 1
    replacements += stats.replacements

    if (dryRun) continue

    try {
      const { error: revisionError } = await supabase.from('content_revisions').insert({
        entry_id: row.id,
        data: row.data,
        created_by: 'script:normalize-media-urls',
        note: 'Normalize /uploads paths to Supabase public URLs',
      })
      if (revisionError) throw new Error(revisionError.message)
      revisions += 1

      const { error: updateError } = await supabase
        .from('content_entries')
        .update({
          data: normalized,
          updated_by: 'script:normalize-media-urls',
        })
        .eq('id', row.id)
      if (updateError) throw new Error(updateError.message)
      updates += 1
    } catch (error) {
      errors += 1
      console.error(
        `[${row.site_id}/${row.locale}/${row.path}] normalize failed:`,
        error.message
      )
    }
  }

  console.log('\n=== Summary ===')
  console.log(`scanned: ${scanned}`)
  console.log(`changedRows: ${changedRows}`)
  console.log(`replacements: ${replacements}`)
  console.log(`revisionsInserted: ${revisions}`)
  console.log(`rowsUpdated: ${updates}`)
  console.log(`errors: ${errors}`)
  if (dryRun) {
    console.log('\nDry run complete. Re-run without --dry-run to apply changes.')
  } else {
    console.log('\nNormalization complete.')
  }
}

main().catch((error) => {
  console.error('Normalization failed:', error)
  process.exit(1)
})
