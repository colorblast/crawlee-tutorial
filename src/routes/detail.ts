import { Dataset } from 'crawlee'
import type { Request, Log } from 'crawlee'

export const detail = async ({
  request,
  page,
  log,
}: {
  request: Request
  page: any // Page class is not exported
  log: Log
}) => {
  log.debug(`Extracting data: ${request.url}`)
  // ['sennheiser-mke-440-professional-stereo-shotgun-microphone-mke-440']
  const urlPart = request.url.split('/').slice(-1) // last part after slash
  const manufacturer = urlPart[0].split('-')[0] // 'sennheiser'

  const title = await page.locator('.product-meta h1').textContent()
  const sku = await page.locator('span.product-meta__sku-number').textContent()

  const priceElement = page
    .locator('span.price')
    .filter({
      hasText: '$',
    })
    .first()

  const currentPriceString = await priceElement.textContent()
  const rawPrice = currentPriceString.split('$')[1]
  const price = Number(rawPrice.replaceAll(',', ''))

  const inStockElement = page
    .locator('span.product-form__inventory')
    .filter({
      hasText: 'In stock',
    })
    .first()

  const inStock = (await inStockElement.count()) > 0

  const results = {
    url: request.url,
    manufacturer,
    title,
    sku,
    currentPrice: price,
    availableInStock: inStock,
  }

  log.debug(`Saving data: ${request.url}`)
  await Dataset.pushData(results)
}
