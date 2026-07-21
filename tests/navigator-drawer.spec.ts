import { test, expect } from '@playwright/test';

test.describe('Service Navigator Detail Drawer Layering & Geometry', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the navigator page
    await page.goto('/navigator');
    // Ensure mock data or results are loaded
    await page.waitForSelector('[data-slot="service-card"]');
  });

  test('Desktop Expanded Sidebar - Detail Drawer Layout and Positioning', async ({ page }) => {
    // Set desktop screen size
    await page.setViewportSize({ width: 1440, height: 900 });

    // Identify first service card
    const firstServiceCard = page.locator('[data-slot="service-card"]').first();
    const serviceNameText = await firstServiceCard.locator('h3').innerText();
    
    // Focus and click to open
    await firstServiceCard.click();

    // 1. Assert drawer is visible
    const drawerRoot = page.locator('[data-slot="modal-drawer-root"]');
    const drawerBackdrop = page.locator('[data-slot="modal-drawer-backdrop"]');
    const drawerPanel = page.locator('[data-slot="modal-drawer-panel"]');
    const detailDrawer = page.locator('[data-slot="service-detail-drawer"]');

    await expect(drawerRoot).toBeVisible();
    await expect(drawerBackdrop).toBeVisible();
    await expect(drawerPanel).toBeVisible();
    await expect(detailDrawer).toBeVisible();

    // Assert that the drawer root is portalled directly to document.body
    const isPortalledToBody = await drawerRoot.evaluate((el) => el.parentElement === document.body);
    expect(isPortalledToBody).toBe(true);

    // 2. Assert drawer’s right edge equals viewport right edge within 1px
    const drawerBox = await drawerPanel.boundingBox();
    const viewport = page.viewportSize();
    expect(drawerBox).not.toBeNull();
    expect(viewport).not.toBeNull();

    if (drawerBox && viewport) {
      const drawerRightEdge = drawerBox.x + drawerBox.width;
      expect(Math.abs(drawerRightEdge - viewport.width)).toBeLessThanOrEqual(1);
    }

    // 3. Assert drawer overlaps the persistent sidebar rectangle
    const sidebar = page.locator('[data-slot="sidebar"]');
    const sidebarBox = await sidebar.boundingBox();
    
    if (drawerBox && sidebarBox) {
      // Since drawer is on the right and covers sidebar completely, we assert x overlap
      expect(drawerBox.x).toBeLessThan(sidebarBox.x + sidebarBox.width);
      expect(drawerBox.x + drawerBox.width).toBeGreaterThan(sidebarBox.x);
    }

    // 4. Assert backdrop covers complete viewport width and height
    const backdropBox = await drawerBackdrop.boundingBox();
    expect(backdropBox).not.toBeNull();
    if (backdropBox && viewport) {
      expect(backdropBox.x).toBe(0);
      expect(backdropBox.y).toBe(0);
      expect(backdropBox.width).toBe(viewport.width);
      expect(backdropBox.height).toBe(viewport.height);
    }

    // 5. Assert computed styles for backdrop and panel layers are higher than sidebar
    const backdropZ = await drawerBackdrop.evaluate((el) => window.getComputedStyle(el).zIndex);
    const panelZ = await drawerPanel.evaluate((el) => window.getComputedStyle(el).zIndex);
    const sidebarZ = await sidebar.evaluate((el) => window.getComputedStyle(el).zIndex);

    expect(Number(backdropZ)).toBeGreaterThan(Number(sidebarZ));
    expect(Number(panelZ)).toBeGreaterThan(Number(sidebarZ));

    // Assert backdrop has the custom styling: dark neutral scrim and blur
    const backdropFilter = await drawerBackdrop.evaluate((el) => window.getComputedStyle(el).backdropFilter);
    expect(backdropFilter).toContain('blur');

    // 6. Assert body does not scroll
    const bodyOverflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    expect(bodyOverflow).toBe('hidden');

    // 7. Assert escape closes drawer and restores focus to clicked service card
    await page.keyboard.press('Escape');
    await expect(drawerRoot).not.toBeVisible();
    
    // Assert focus returned to the service card
    const focusedElementText = await page.evaluate(() => {
      const active = document.activeElement;
      return active ? (active as HTMLElement).innerText : '';
    });
    expect(focusedElementText).toContain(serviceNameText);
  });

  test('Desktop Collapsed Sidebar - Detail Drawer Layout and Positioning', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Collapse sidebar if toggle is present
    const collapseToggle = page.locator('[data-slot="sidebar-toggle"]');
    if (await collapseToggle.isVisible()) {
      await collapseToggle.click();
    }

    const firstServiceCard = page.locator('[data-slot="service-card"]').first();
    await firstServiceCard.click();

    const drawerRoot = page.locator('[data-slot="modal-drawer-root"]');
    const drawerBackdrop = page.locator('[data-slot="modal-drawer-backdrop"]');
    const drawerPanel = page.locator('[data-slot="modal-drawer-panel"]');

    await expect(drawerRoot).toBeVisible();

    const drawerBox = await drawerPanel.boundingBox();
    const viewport = page.viewportSize();
    if (drawerBox && viewport) {
      const drawerRightEdge = drawerBox.x + drawerBox.width;
      expect(Math.abs(drawerRightEdge - viewport.width)).toBeLessThanOrEqual(1);
    }

    const backdropBox = await drawerBackdrop.boundingBox();
    if (backdropBox && viewport) {
      expect(backdropBox.width).toBe(viewport.width);
      expect(backdropBox.height).toBe(viewport.height);
    }

    // Close using click outside (backdrop click)
    await drawerBackdrop.click({ position: { x: 10, y: 10 } });
    await expect(drawerRoot).not.toBeVisible();
  });

  test('Mobile - Drawer Layout and Overflow Constraints', async ({ page }) => {
    // Standard iPhone / Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    const firstServiceCard = page.locator('[data-slot="service-card"]').first();
    await firstServiceCard.click();

    const drawerRoot = page.locator('[data-slot="modal-drawer-root"]');
    const drawerPanel = page.locator('[data-slot="modal-drawer-panel"]');

    await expect(drawerRoot).toBeVisible();

    // On mobile, the drawer is full width (100vw)
    const drawerBox = await drawerPanel.boundingBox();
    const viewport = page.viewportSize();
    if (drawerBox && viewport) {
      expect(drawerBox.width).toBe(viewport.width);
    }

    // Assert body scroll is locked
    const bodyOverflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    expect(bodyOverflow).toBe('hidden');

    // Close using close button inside drawer
    await page.locator('[aria-label="بستن پنجره"]').click();
    await expect(drawerRoot).not.toBeVisible();
  });
});
