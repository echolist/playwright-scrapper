import express from "express";
import { chromium as playwrightChromium } from "playwright-extra";



const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/check-playwright", async (req, res) => {
  try {
    const browser = await playwrightChromium.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent("<h1>Playwright OK</h1>");
    const html = await page.content();
    await browser.close();
    res.send(html);
  } catch (e) {
    res.status(500).json({ success: false, message: e.toString() });
  }
});

app.get("/api/scrape/:id", async (req, res) => {
  try {
    const school_id = req.params.id || "0";
    const browser = await playwrightChromium.launch({
      headless: true,
      args: ["--no-sandbox", '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      "x-api-user": process.env.USER_KEY || "xxxxx",
      "x-api-key": process.env.USER_PASS || "yyyyy",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept": "application/json, text/plain, */*",
    });

    // URL target
    const targetUrl = `https://www.osaa.org/api/schools/${school_id}?year=2025`;

    await page.goto(targetUrl, { waitUntil: "networkidle" });

    // Jika Cloudflare page terdeteksi
    const body = await page.content();
    
    if (body.includes("cloudflare") || body.includes("Ray ID")) {
      await browser.close();
      return res.json({
        success: false,
        message: "Cloudflare blocked the request"
      });
    }

    // Ambil JSON langsung (lebih aman)
    const raw = await page.evaluate(() => document.body.innerText);
    
    const json = JSON.parse(raw);

    await browser.close();

    return res.json({ success: true, data: json });
  } catch (err) {
    return res.json({ success: false, message: err.toString() });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
