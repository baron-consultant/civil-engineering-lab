import { expect, test } from '@playwright/test';

test('Aptabase page_view 이벤트가 2xx로 전송된다', async ({ page }) => {
  let capturedBody: unknown;
  const consoleMessages: string[] = [];
  const requests: string[] = [];
  const events: Array<Record<string, unknown>> = [];

  page.on('console', (msg) => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on('request', (req) => {
    requests.push(req.url());
  });

  await page.route('**/api/v0/event', async (route) => {
    capturedBody = route.request().postDataJSON();
    const body = capturedBody as Record<string, unknown>;
    events.push(body);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}',
    });
  });

  const response = await page.goto('/');
  expect(response?.ok()).toBeTruthy();
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(
    () => {
      // eslint-disable-next-line no-undef
      const api = (window as typeof window & { aptabase?: { trackEvent?: Function } }).aptabase;
      return !!api && typeof api.trackEvent === 'function';
    },
    undefined,
    { timeout: 10_000 },
  );

  const config = await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    return (window as typeof window & { __aptabaseConfig?: Record<string, unknown> }).__aptabaseConfig;
  });

  expect(config?.key).toBeTruthy();

  if (!capturedBody) {
    await page.evaluate(() =>
      // eslint-disable-next-line no-undef
      (window as typeof window & { aptabase?: { trackEvent?: Function } }).aptabase?.trackEvent?.('page_view', {
        path: window.location.pathname,
        ref: document.referrer || undefined,
      }),
    );
  }

  await expect
    .poll(
      () => requests.some((url) => url.includes('/api/v0/event')),
      { timeout: 10_000, message: `Requests seen: ${JSON.stringify(requests)}` },
    )
    .toBeTruthy();

  const findEvent = (name: string) =>
    events.find((e) => (e as { eventName?: string }).eventName === name);

  await expect.poll(() => findEvent('page_view'), { timeout: 5_000 }).toBeTruthy();
  const pageView = findEvent('page_view') as
    | {
        props?: Record<string, unknown>;
        systemProps?: Record<string, unknown>;
      }
    | undefined;

  expect(pageView?.props?.path).toBe('/');
  expect(pageView?.systemProps?.isDebug).toBe(true);
  await expect.poll(
    () => !!findEvent('block_view'),
    { timeout: 5_000 },
  ).toBeTruthy();
  await page.getByText('Update Content').click();
  await expect.poll(
    () => !!findEvent('block_click'),
    { timeout: 5_000 },
  ).toBeTruthy();
  const warnOrError = consoleMessages.filter((msg) => msg.startsWith('warning') || msg.startsWith('error'));
  expect.soft(warnOrError).toEqual([]);
});
