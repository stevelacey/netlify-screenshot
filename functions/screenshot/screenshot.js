const chromium = require("chrome-aws-lambda")
const qs = require("qs")

const width = 1200
const height = 630
const maxage = 60 * 60 * 24 * 7

exports.handler = async (event, context) => {
  const path = event.path.replace("/.netlify/functions", "").replace("/screenshot", "").replace(".png", "")
  const url = `${process.env.BASE_URL}${path}${qs.stringify(event.queryStringParameters, { addQueryPrefix: true })}`

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  })

  const page = await browser.newPage()

  await page.setViewport({ width, height })

  await page.goto(url, { waitUntil: "networkidle2" })

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
