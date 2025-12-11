import express from "express";
import { chromium } from "@playwright/test";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/scrape", async (req, res) => {
  try {
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    const targetUrl = "https://www.osaa.org/api/schools/65?year=2025";

    await page.setExtraHTTPHeaders({
        "x-user-key": process.env.USER_KEY,
        "x-user-pass": process.env.USER_PASS
    });

    await page.goto(targetUrl, {
      waitUntil: "networkidle",
      timeout: 60000
    });

    const content = await page.evaluate(() => document.body.innerText);

    await browser.close();

    res.json({
      success: true,
      data: content,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.toString(),
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
