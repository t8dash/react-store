import { expect, type Page, test } from "@playwright/test";
import { type Server, serve } from "@t8/serve";

const cellValueMap: Record<string, string> = {
  x: "❌",
  o: "⭕",
};

class Playground {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  getCell(index: number) {
    return this.page.locator(`.board button:nth-of-type(${index + 1})`);
  }
  async clickCell(index: number) {
    await this.getCell(index).click({ force: true });
  }
  async clickCells(indices: number[]) {
    for (let index of indices) await this.clickCell(index);
  }
  async restart() {
    await this.page.getByRole("button", { name: "Restart" }).click();
  }
  async rollbackTo(moveIndex: number) {
    await this.page
      .locator(`.history li:nth-of-type(${moveIndex + 1}) button`)
      .click();
  }
  async hasStatus(value: string) {
    await expect(this.page.locator(".status")).toHaveText(value);
  }
  async hasSelection(indices: number[]) {
    for (let i = 0; i < 9; i++) {
      let cell = this.getCell(i);

      if (indices.includes(i)) await expect(cell).toContainClass("selected");
      else await expect(cell).not.toContainClass("selected");
    }
  }
  async hasCellValue(index: number, value: "x" | "o" | "") {
    await expect(this.getCell(index)).toHaveText(cellValueMap[value] ?? value);
  }
}

let server: Server;

test.beforeAll(async () => {
  server = await serve({
    path: "tests/tic-tac-toe",
    bundle: "src/index.tsx",
    spa: true,
  });
});

test.afterAll(() => {
  server.close();
});

test("play and win", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.hasStatus("playing");

  await p.clickCell(4);
  await p.hasCellValue(4, "x");
  await p.hasCellValue(3, "");
  await p.hasStatus("playing");

  await p.clickCell(3);
  await p.hasCellValue(4, "x");
  await p.hasCellValue(3, "o");
  await p.hasStatus("playing");

  await p.clickCell(2);
  await p.hasCellValue(4, "x");
  await p.hasCellValue(3, "o");
  await p.hasCellValue(2, "x");
  await p.hasStatus("playing");

  await p.clickCell(5);
  await p.hasCellValue(4, "x");
  await p.hasCellValue(3, "o");
  await p.hasCellValue(2, "x");
  await p.hasCellValue(5, "o");
  await p.hasStatus("playing");

  await p.clickCell(6);
  await p.hasCellValue(4, "x");
  await p.hasCellValue(3, "o");
  await p.hasCellValue(2, "x");
  await p.hasCellValue(5, "o");
  await p.hasCellValue(6, "x");
  await p.hasStatus("win");
  await p.hasSelection([2, 4, 6]);
});

test("no moves after game ends", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.clickCells([4, 3, 2, 5, 6]);
  await p.hasStatus("win");
  await p.hasSelection([2, 4, 6]);

  await p.clickCell(0);
  await p.hasCellValue(0, "");
  await p.hasStatus("win");
  await p.hasSelection([2, 4, 6]);
});

test("rollback", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.clickCells([4, 3, 2, 5, 6]);
  await p.hasStatus("win");
  await p.hasSelection([2, 4, 6]);
  await p.hasCellValue(4, "x");
  await p.hasCellValue(3, "o");
  await p.hasCellValue(2, "x");
  await p.hasCellValue(5, "o");
  await p.hasCellValue(6, "x");

  await p.rollbackTo(2);
  await p.hasStatus("playing");
  await p.hasSelection([]);
  await p.hasCellValue(4, "x");
  await p.hasCellValue(3, "o");
  await p.hasCellValue(2, "x");
  await p.hasCellValue(5, "");
  await p.hasCellValue(6, "");

  await p.rollbackTo(3);
  await p.hasStatus("playing");
  await p.hasSelection([]);
  await p.hasCellValue(4, "x");
  await p.hasCellValue(3, "o");
  await p.hasCellValue(2, "x");
  await p.hasCellValue(5, "o");
  await p.hasCellValue(6, "");

  await p.rollbackTo(4);
  await p.hasStatus("win");
  await p.hasSelection([2, 4, 6]);
  await p.hasCellValue(4, "x");
  await p.hasCellValue(3, "o");
  await p.hasCellValue(2, "x");
  await p.hasCellValue(5, "o");
  await p.hasCellValue(6, "x");
});

test("draw", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.clickCells([4, 8, 6, 2, 5, 3, 1, 7]);
  await p.hasStatus("playing");
  await p.hasSelection([]);

  await p.clickCell(0);
  await p.hasStatus("draw");
  await p.hasSelection([]);

  await p.clickCell(1);
  await p.hasStatus("draw");
  await p.hasSelection([]);
});

test("restart", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.clickCells([4, 5, 0]);
  await p.hasStatus("playing");
  await p.hasCellValue(4, "x");
  await p.hasCellValue(5, "o");
  await p.hasCellValue(0, "x");
  await p.hasCellValue(1, "");
  await p.hasSelection([]);

  await p.restart();
  await p.hasStatus("playing");
  await p.hasCellValue(4, "");
  await p.hasCellValue(5, "");
  await p.hasCellValue(0, "");
  await p.hasCellValue(1, "");
  await p.hasSelection([]);

  await p.clickCells([4, 5, 0, 8, 2, 1, 6]);
  await p.hasStatus("win");
  await p.hasCellValue(0, "x");
  await p.hasCellValue(1, "o");
  await p.hasCellValue(2, "x");
  await p.hasSelection([2, 4, 6]);

  await p.restart();
  await p.hasStatus("playing");
  await p.hasCellValue(0, "");
  await p.hasCellValue(1, "");
  await p.hasCellValue(2, "");
  await p.hasSelection([]);
});
