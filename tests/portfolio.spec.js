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
    if (['experience', 'projects'].includes(id)) await expect(page.locator('.laptopTerminal')).toBeVisible();
    else if (id === 'knowledge') await expect(page.getByRole('button', { name: 'Close knowledge book' })).toBeFocused();
    else { await expect(page.getByRole('dialog')).toBeVisible(); await expect(page.locator('#dialog-title')).toHaveText(id); }
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
    if (['experience', 'projects'].includes(section)) {
      await expect(page.locator('.laptopTerminal')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Terminal command' })).toBeFocused();
    } else if (section === 'knowledge') {
      await expect(page.getByRole('button', { name: 'Close knowledge book' })).toBeFocused();
    } else {
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { level: 2, name: section, exact: true })).toBeVisible();
      await page.keyboard.press('Shift+Tab');
      expect(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(link).toBeFocused();
  }
  await page.locator('[data-section="projects"]').click();
  await page.getByRole('button', { name: 'Back to workspace', exact: true }).click();
  await page.goBack();
  await expect(page.locator('.laptopTerminal')).toBeVisible();
  await page.goForward();
  await expect(page.locator('.laptopTerminal')).toHaveCount(0);
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
  await page.locator('[data-section="contact"]').click();
  const box = await page.getByRole('dialog').boundingBox();
  expect(box.width).toBe(390);
  expect(box.height).toBe(844);
});


test('laptop terminal commands share portfolio content and support history, clear and exit', async ({ page }) => {
  await page.goto('/#experience');
  const terminal = page.locator('.laptopTerminal');
  await expect(terminal).toBeVisible();
  await expect(terminal.getByRole('heading', { name: 'Software Engineer · Turbolab Technologies' })).toBeVisible();
  const input = page.getByRole('textbox', { name: 'Terminal command' });
  await input.fill('projects'); await input.press('Enter');
  for (const project of projects) await expect(terminal.locator(`a[href="${project.link}"]`).first()).toBeAttached();
  await expect(page).toHaveURL(/#projects$/);
  await input.fill('unknown'); await input.press('Enter');
  await expect(terminal.getByRole('status')).toContainText('Unknown command');
  await input.press('ArrowUp'); await expect(input).toHaveValue('unknown');
  await input.press('ArrowDown'); await expect(input).toHaveValue('');
  await terminal.getByRole('button', { name: 'clear', exact: true }).click();
  await expect(terminal.locator('.terminalEntry')).toHaveCount(0);
  await input.fill('help'); await input.press('Enter');
  await expect(terminal).toContainText('command history');
  await input.fill('exit'); await input.press('Enter');
  await expect(terminal).toHaveCount(0);
  await expect(page.locator('nav a[data-section="projects"]')).toBeFocused();
});


test('laptop camera moves before the terminal fades in and supports interrupted navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas[data-ready]')).toBeVisible();
  await page.evaluate(() => {
    window.terminalMotion = [];
    window.terminalObserver = new MutationObserver(() => {
      const element = document.querySelector('.laptopTerminal');
      if (element) window.terminalMotion.push({ transform: element.style.transform, inert: element.hasAttribute('inert') });
    });
    window.terminalObserver.observe(document.querySelector('.sceneStage'), { childList: true, subtree: true, attributes: true });
  });
  await page.locator('nav a[data-section="experience"]').click();
  const terminal = page.locator('.laptopTerminal');
  await expect(terminal).toBeAttached();
  await expect(terminal).toHaveClass(/isActive/);
  const frames = await page.evaluate(() => { window.terminalObserver.disconnect(); return window.terminalMotion; });
  expect(frames.some(frame => frame.inert)).toBe(true);
  expect(new Set(frames.map(frame => frame.transform)).size).toBeGreaterThan(1);
  await expect(page.getByRole('textbox', { name: 'Terminal command' })).toBeFocused();
  await page.keyboard.press('Escape');
  await page.locator('nav a[data-section="projects"]').click();
  await expect(terminal).toHaveClass(/isActive/);
  await expect(terminal.getByRole('heading', { name: 'Selected projects' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(terminal).toHaveCount(0);
});


test('Knowledge opens inside the book with skills, education and keyboard return', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas[data-ready]')).toBeVisible();
  await page.mouse.click(535, 415);
  const close = page.getByRole('button', { name: 'Close knowledge book' });
  await expect(close).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Languages', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Education', exact: false }).click();
  await expect(page.locator('.bookPageBody')).toContainText('Government Engineering College Palakkad');
  await page.getByRole('button', { name: 'Previous knowledge page' }).click();
  await expect(page.getByRole('heading', { name: 'AI & LLM', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.bookChapter')).toHaveCount(0);
  await expect(page.locator('nav a[data-section="knowledge"]')).toBeFocused();
  await page.locator('nav a[data-section="projects"]').click();
  await expect(page.locator('.laptopTerminal')).toHaveClass(/isActive/);
});

test('mobile knowledge page fits the screen and offers every chapter', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#knowledge');
  await page.getByRole('button', { name: 'Explore in 3D' }).click();
  const close = page.getByRole('button', { name: 'Close knowledge book' });
  await expect(close).toBeFocused();
  const box = await page.locator('.bookChapter').boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  for (let i = 0; i < 6; i++) await page.getByRole('button', { name: 'Next knowledge page' }).click();
  await expect(page.getByRole('heading', { name: 'Education', exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/knowledge-mobile.png' });
});
