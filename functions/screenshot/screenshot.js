const chromium = require("@sparticuz/chromium")
const defaults = require("lodash.defaults")
const puppeteer = require("puppeteer-core")
const qs = require("qs")
const regexMerge = require("regex-merge")

const pattern = regexMerge(
  /^(?:\/\.netlify\/functions)?/,
  /(?:\/screenshot)?/,
  /(?:\/(?<width>[0-9]+)x(?<height>[0-9]+))?/,
  /(?<path>\/.*?)/,
  /(?:\.png)?$/,
)

const options = {
  base: process.env.BASE_URL,
  width: 1200,
  height: 630,
  maxage: 60 * 60 * 24 * 7,
}

exports.handler = async (event, context) => {
  const { base, path, width, height, maxage } = (() => {
    const settings = defaults(event.path.match(pattern).groups, options)

    settings.width = parseInt(settings.width)
    settings.height = parseInt(settings.height)

    return settings
  })()

  await chromium.font("https://raw.githack.com/googlefonts/noto-emoji/main/fonts/NotoColorEmoji.ttf");

  const url = `${base}${path}${qs.stringify(event.queryStringParameters, { addQueryPrefix: true })}`

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

  await page.setViewport({ width, height })

  await page.goto(url, { waitUntil: "networkidle0" })

  const screenshot = await page.screenshot()

  await browser.close()

  return {
    statusCode: 200,
    headers: {
      "Cache-Control": `public, max-age=${maxage}`,
      "Content-Type": "image/png",
      "Expires": new Date(Date.now() + maxage * 1000).toUTCString(),
    },
    body: screenshot.toString("base64"),
    isBase64Encoded: true,
  }
}
