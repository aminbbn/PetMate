import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATTERNS = [
  { name: '<CardCornerIcon usage', pattern: /<CardCornerIcon/ },
  { name: 'absolute icon positioning top-* right-*', pattern: /absolute\s+top-[a-z0-9-\[\]]+_right-[a-z0-9-\[\]]+/ },
  { name: 'pr-[56px] title compensation', pattern: /pr-\[56px\]/ },
  { name: 'isNumericValue helper function', pattern: /isNumericValue/ },
  { name: 'value.length heuristic resizing', pattern: /value\.length\s*>/ },
  { name: 'custom metric-card cursor glow', pattern: /cursorGlow\s*=\s*\{\s*(?!true|false)[^}]+\}/ },
  { name: 'custom metric-card edge glow', pattern: /edgeGlow\s*=\s*\{\s*(?!true|false)[^}]+\}/ },
  { name: '10px-13px small title typography classes', pattern: /(?:text-\[10px\]|text-\[11px\]|text-\[12px\]|text-\[13px\]).*(?:title|label|metric|card)/ }
];

const TARGET_DIRECTORIES = [
  'src/pages/growth',
  'src/pages/health',
  'src/pages/reminders',
  'src/pages/vets',
  'src/pages'
];

let filesChecked = 0;
let errorsFound = 0;

function checkFile(filePath) {
  // Skip directories, compiled outputs, and non-component/page files
  if (fs.statSync(filePath).isDirectory()) return;
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  // Ignore components folder to allow definition of components themselves
  if (filePath.includes('components/metric-card') || filePath.includes('components/metric/')) return;
  if (filePath.includes('check-metric-card-usage.mjs')) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Only verify files that actually import/use MetricCard or are target migrated pages
  const isTargetMigrated = [
    'Dashboard.tsx',
    'ReminderMetricCard.tsx',
    'ReminderSummary.tsx',
    'HealthOverview.tsx',
    'WeightOverview.tsx',
    'VetsPage.tsx'
  ].some(name => filePath.endsWith(name));

  if (!isTargetMigrated && !content.includes('MetricCard')) return;

  filesChecked++;

  for (const rule of FORBIDDEN_PATTERNS) {
    if (rule.pattern.test(content)) {
      console.error(`\x1b[31m❌ REGRESSION DETECTED in ${filePath}:\x1b[0m Found forbidden pattern [${rule.name}]`);
      errorsFound++;
    }
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      // Don't walk inside node_modules or dist
      if (file !== 'node_modules' && file !== 'dist' && file !== 'components') {
        walk(fullPath);
      }
    } else {
      checkFile(fullPath);
    }
  }
}

console.log('🐾 Running Pet Mate Source-Level Metric Card Regression Check...');

// Walk target directories
for (const dir of TARGET_DIRECTORIES) {
  const absolutePath = path.resolve(dir);
  if (fs.existsSync(absolutePath)) {
    if (fs.statSync(absolutePath).isDirectory()) {
      walk(absolutePath);
    } else {
      checkFile(absolutePath);
    }
  }
}

console.log(`\n🐾 Checked ${filesChecked} files.`);
if (errorsFound > 0) {
  console.error(`\x1b[31m❌ Failed! Found ${errorsFound} regression(s). Please migrate the pages to the standard unified MetricCard component.\x1b[0m`);
  process.exit(1);
} else {
  console.log('\x1b[32m✔ Excellent! All pages comply with the final unified MetricCard layout system.\x1b[0m');
  process.exit(0);
}
