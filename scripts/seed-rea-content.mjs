#!/usr/bin/env node

import { spawnSync } from 'child_process';

const result = spawnSync(
  'node',
  ['scripts/sync-content-db.mjs', '--mode=import', '--site=jinpanghomes', '--locales=en,zh'],
  { stdio: 'inherit' }
);

process.exit(result.status ?? 1);
