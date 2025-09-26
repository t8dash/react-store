import { expect, type Page, test } from "@playwright/test";
import { type Server, serve } from "@t8/serve";

class Playground {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async clickPlusButton() {
    await this.page.getByRole("button", { name: "+" }).click();
  }
  async hasCounterValue(value: number) {
    await expect(this.page.locator("#app > span")).toHaveText(String(value));
  }
}

let server: Server;

test.beforeAll(async () => {
  server = await serve({
    path: "tests/with_immer",
    bundle: "src/index.tsx",
    spa: true,
  });
});

test.afterAll(() => {
  server.close();
});

test("with immer", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.hasCounterValue(42);
  await p.clickPlusButton();
  await p.hasCounterValue(43);
  await p.clickPlusButton();
  await p.clickPlusButton();
  await p.hasCounterValue(45);
});
