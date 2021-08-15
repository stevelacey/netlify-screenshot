const chromium = require("chrome-aws-lambda")
const qs = require("qs")

const width = 1024
const height = 1200

exports.handler = async (event, context) => {
  const path = event.path.replace("/.netlify/functions", "").replace("/print", "").replace(".pdf", "")
  const url = `${process.env.BASE_URL}${path}${qs.stringify(event.queryStringParameters, { addQueryPrefix: true })}`

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  })

  const page = await browser.newPage()

  await page.on("dialog", async dialog => dialog.accept(" "))

  await page.setViewport({ width, height })

  await page.goto(url, { waitUntil: "networkidle2" })

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
