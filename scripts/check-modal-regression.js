import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('./src');

// Files explicitly exempted because they are anchored panels/drawers as authorized by the product specifications
const EXEMPT_FILES = [
  'MotionDialog.tsx',            // The core modal primitive itself
  'Sidebar.tsx',                 // Mobile sidebar drawer
  'SidebarPetSelector.tsx',      // Compact pet selector dropdown overlay
  'NavigatorPage.tsx',           // Contextual category drawer
];

let violationCount = 0;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (stat.isFile() && file.endsWith('.tsx')) {
      const filename = path.basename(fullPath);
      if (EXEMPT_FILES.includes(filename)) {
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for manual modal backdrop markup: combination of fixed, inset-0, and backdrop-blur / bg-black overlay classes
      const hasFixedInset = content.includes('fixed inset-0') || content.includes('fixed inset-y-0') || content.includes('fixed inset-x-0');
      const hasBackdropBlur = content.includes('backdrop-blur');
      const hasDimOverlay = content.includes('bg-black/') || content.includes('bg-slate-950/') || content.includes('bg-gray-900/');
      
      // If a file implements custom backdrop-dimmed overlay with inset positioning, it's bypassing the portalled MotionDialog system
      if (hasFixedInset && (hasBackdropBlur || hasDimOverlay)) {
        console.error(`\x1b[31m[REGRESSION CHECK ERROR] Non-compliant modal overlay detected in:\x1b[0m ${fullPath}`);
        console.error(`\x1b[33mReason:\x1b[0m File defines a manual viewport overlay. All popup dialogs, forms, and confirmations must migrate to the global, portalled '<MotionDialog>' component to ensure full viewport dimming and blur across all columns (including sidebars).`);
        console.error(`\x1b[36mHow to Fix:\x1b[0m Import and wrap your dialog content in '<MotionDialog isOpen={...} onClose={...}>...</MotionDialog>'.\n`);
        violationCount++;
      }
    }
  }
}

console.log('🐾 Running Pet Mate Modal Regression Guard...');
scanDirectory(SRC_DIR);

if (violationCount > 0) {
  console.error(`\x1b[31m❌ Regression Guard Failed: ${violationCount} non-compliant overlay(s) found. Build process stopped.\x1b[0m`);
  process.exit(1);
} else {
  console.log('\x1b[32m✔ Global Modal Regression Guard Passed! No custom overlays detected.\x1b[0m');
  process.exit(0);
}
