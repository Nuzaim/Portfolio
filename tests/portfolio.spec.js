import { test, expect } from '@playwright/test';
import { projects } from '../src/content/portfolio';

test('phone starts with text, preserves links and aliases, and requests no 3D code or assets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/#skills');
  await expect(page.locator('#knowledge')).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Explore in 3D' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(requests.filter(url => /Workspace|three|fiber|\.glb/.test(url))).toEqual([]);
  await expect(page.locator('a[href="https://github.com/Nuzaim/distributed-audio-transcoder"]')).toHaveCount(1);
  for (const project of projects) await expect(page.locator(`a[href="${project.link}"]`).first()).toBeAttached();
  await page.goto('/#education');
  await expect(page.locator('#knowledge')).toBeInViewport();
  await page.goto('/#about');
  await expect(page.locator('#contact')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/phone.png', fullPage: true });
});

test('all four physical props select content, orbit does not click, and reset restores camera', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const canvas = page.locator('canvas[data-ready]');
  await expect(canvas).toBeVisible();
  const targets = [
    { id: 'experience', x: 675, y: 400 },
    { id: 'projects', x: 1020, y: 500 },
    { id: 'knowledge', x: 535, y: 415 },
    { id: 'contact', x: 709, y: 470 },
  ];
  for (const { id, x, y } of targets) {
    await page.mouse.move(x, y);
    await expect(page.locator('.objectLabel')).toContainText(new RegExp(id, 'i'));
    await page.mouse.click(x, y);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#dialog-title')).toHaveText(id);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.mouse.move(1300, 500);
  }
  await page.mouse.move(1300, 500);
  const initial = await canvas.screenshot({ path: 'test-results/camera-initial.png' });
  await page.mouse.move(675, 400);
  await page.mouse.down();
  await page.mouse.move(900, 420, { steps: 12 });
  await page.mouse.up();
  await page.mouse.move(1300, 500);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect((await canvas.screenshot()).equals(initial)).toBe(false);
  await page.getByRole('button', { name: 'Reset view' }).click();
  await page.mouse.move(1300, 500);
  await canvas.screenshot({ path: 'test-results/camera-reset.png' });
  await expect.poll(async () => (await canvas.screenshot()).equals(initial)).toBe(true);
  expect(errors).toEqual([]);
});

test('mobile opt-in loads models, touch drag does not select, and view choice survives reload', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button', { name: 'Explore in 3D' }).tap();
  await expect(page.locator('canvas[data-ready]')).toBeVisible();
  const client = await context.newCDPSession(page);
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: 440 }] });
  await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 265, y: 490 }] });
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset view' }).tap();
  await page.reload();
  await expect(page.locator('canvas[data-ready]')).toBeVisible();
  await page.screenshot({ path: 'test-results/mobile-scene.png' });
  await context.close();
});

test('dialogs, keyboard focus, history, and explicit view preference', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas[data-ready]')).toBeVisible();
  for (const section of ['experience', 'projects', 'knowledge', 'contact']) {
    const link = page.locator(`[data-section="${section}"]`);
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: section, exact: true })).toBeVisible();
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(link).toBeFocused();
  }
  await page.locator('[data-section="projects"]').click();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.goBack();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Text view' }).click();
  await page.reload();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button', { name: 'Explore in 3D' }).click();
  await expect(page.locator('canvas[data-ready]')).toBeVisible();
  await page.screenshot({ path: 'test-results/desktop.png' });
});

test('direct legacy fragment opens accessible scene dialog', async ({ page }) => {
  await page.goto('/#about');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'contact', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-section="contact"]')).toBeFocused();
});

test('missing assets fall back to text and retry recovers', async ({ page }) => {
  await page.route('**/models/polyfork/exercise-books.glb', route => route.abort());
  await page.goto('/');
  await expect(page.getByText('The 3D workspace could not be displayed.', { exact: false })).toBeVisible();
  await expect(page.locator('#experience')).toBeVisible();
  await page.unroute('**/models/polyfork/exercise-books.glb');
  await page.getByRole('button', { name: 'Retry 3D' }).click();
  await expect(page.locator('canvas[data-ready]')).toBeVisible();
});

test('unavailable WebGL and context loss preserve portfolio access', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) { return /webgl/.test(type) ? null : original.call(this, type, ...args); };
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Retry 3D' })).toBeVisible();
  await context.close();
  const good = await browser.newPage();
  await good.goto('/');
  await expect(good.locator('canvas[data-ready]')).toBeVisible();
  await good.locator('canvas').evaluate(canvas => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  await expect(good.getByRole('button', { name: 'Retry 3D' })).toBeVisible();
  await good.close();
});

test('tablet and optional mobile scene support reduced motion and fullscreen dialogs', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('canvas[data-ready]')).toBeVisible();
  await page.screenshot({ path: 'test-results/tablet.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-section="knowledge"]').click();
  const box = await page.getByRole('dialog').boundingBox();
  expect(box.width).toBe(390);
  expect(box.height).toBe(844);
});
