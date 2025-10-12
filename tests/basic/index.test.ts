import { expect, type Locator, type Page, test } from "@playwright/test";
import { type Server, serve } from "@t8/serve";

class Playground {
  readonly page: Page;
  readonly counterButton: Locator;
  readonly resetButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.counterButton = page.locator("button:first-of-type");
    this.resetButton = page.locator("button:last-of-type");
  }
  async clickCounter() {
    await this.counterButton.click();
  }
  async reset() {
    await this.resetButton.click();
  }
  async hasCounterValue(value: number) {
    await expect(this.counterButton).toHaveText(`+ ${value}`);
  }
}

let server: Server;

test.beforeAll(async () => {
  server = await serve({
    path: "tests/basic",
    bundle: "index.tsx",
    spa: true,
  });
});

test.afterAll(() => {
  server.close();
});

test("counter without context", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.hasCounterValue(0);
  await p.clickCounter();
  await p.hasCounterValue(1);
  await p.clickCounter();
  await p.clickCounter();
  await p.hasCounterValue(3);
  await p.reset();
  await p.hasCounterValue(0);
  await p.clickCounter();
  await p.clickCounter();
  await p.hasCounterValue(2);
});
