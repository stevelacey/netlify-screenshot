const chromium = require("@sparticuz/chromium")
const puppeteer = require("puppeteer-core")
const qs = require("qs")

const width = 1024
const height = 1200

exports.handler = async (event, context) => {
  const path = event.path.replace("/.netlify/functions", "").replace("/print", "").replace(".pdf", "")
  const url = `${process.env.BASE_URL}${path}${qs.stringify(event.queryStringParameters, { addQueryPrefix: true })}`

  await chromium.font("https://raw.githack.com/googlefonts/noto-emoji/main/fonts/NotoColorEmoji.ttf");

  const browser = await puppeteer.launch({
    args: [
      ...chromium.args,
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
    ],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  })

  const page = await browser.newPage()

  page.on("dialog", async dialog => dialog.accept(" "))

  await page.setViewport({ width, height })

  await page.goto(url, { waitUntil: "networkidle0" })

  const pdf = await page.pdf({
    format: "A4",
    margin: {
      top: 20,
      right: 40,
      bottom: 20,
      left: 40,
    },
  })

  await browser.close()

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
    body: pdf.toString("base64"),
    isBase64Encoded: true,
  }
}
