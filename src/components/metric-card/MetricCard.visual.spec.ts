// @ts-nocheck
/**
 * Playwright visual and geometry assertions for MetricCard.
 * Ensures vertical center alignment, typography hierarchy, and hover effects stay pixel-perfect.
 */
import { test, expect } from '@playwright/test';

test.describe('MetricCard Visual Geometry and Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard or development server
    await page.goto('/');
  });

  test('A. Icon and Title Alignment (Vertical Center Alignment)', async ({ page }) => {
    const cards = page.locator('[data-slot="metric-card"]');
    const count = await cards.count();
    
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const icon = card.locator('[data-slot="metric-card-icon"]');
      const title = card.locator('[data-slot="metric-card-title"]');
      
      if ((await icon.count()) > 0 && (await title.count()) > 0) {
        const iconBox = await icon.boundingBox();
        const titleBox = await title.boundingBox();
        
        if (iconBox && titleBox) {
          const iconCenterY = iconBox.y + iconBox.height / 2;
          const titleCenterY = titleBox.y + titleBox.height / 2;
          const absoluteDifference = Math.abs(iconCenterY - titleCenterY);
          
          // CRITICAL: absolute difference between vertical centers must be <= 3px
          expect(absoluteDifference).toBeLessThanOrEqual(3);
        }
      }
    }
  });

  test('B. Typography Hierarchy Constraints', async ({ page }) => {
    const cards = page.locator('[data-slot="metric-card"]');
    const count = await cards.count();
    
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const title = card.locator('[data-slot="metric-card-title"]');
      const value = card.locator('[data-slot="metric-card-value"]');
      
      if ((await title.count()) > 0 && (await value.count()) > 0) {
        const titleFontSizeStr = await title.evaluate((el) => window.getComputedStyle(el).fontSize);
        const valueFontSizeStr = await value.evaluate((el) => window.getComputedStyle(el).fontSize);
        
        const titleFontSize = parseFloat(titleFontSizeStr);
        const valueFontSize = parseFloat(valueFontSizeStr);
        
        // Ensure standard/compact title font size is at least 15px
        expect(titleFontSize).toBeGreaterThanOrEqual(15);
        
        // If value is numeric, check that its font size is strictly larger than the title's
        const isNumeric = await value.evaluate((el) => el.textContent && /\d/.test(el.textContent));
        if (isNumeric) {
          expect(valueFontSize).toBeGreaterThan(titleFontSize);
        } else {
          // Otherwise, text/status/empty values must never exceed title font size
          expect(valueFontSize).toBeLessThanOrEqual(titleFontSize);
        }
      }
    }
  });

  test('C. Card Effects and Hover Transitions', async ({ page }) => {
    const card = page.locator('[data-slot="metric-card"]').first();
    if ((await card.count()) > 0) {
      // 1. Hover off state
      const initialBox = await card.boundingBox();
      
      // 2. Hover on state
      await card.hover();
      await page.waitForTimeout(350); // wait for spring transition
      
      const hoveredBox = await card.boundingBox();
      if (initialBox && hoveredBox) {
        const liftAmount = initialBox.y - hoveredBox.y;
        
        // Premium restrained hover lift should be 2px to 3px
        expect(liftAmount).toBeGreaterThanOrEqual(1.5);
        expect(liftAmount).toBeLessThanOrEqual(3.5);
      }
    }
  });
});
