import { PlaywrightCrawler, Dataset, log } from 'crawlee'

log.setLevel(log.LEVELS.DEBUG);

log.debug('Setting up crawler.')
const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page, request, enqueueLinks }) => {
    console.log(`Processing: ${request.url}`)

    if (request.label == 'DETAIL') {
      const urlPart = request.url.split('/').slice(-1) // ['sennheiser-mke-440-professional-stereo-shotgun-microphone-mke-440']
      const manufacturer = urlPart[0].split('-')[0] // 'sennheiser'

      const title = await page.locator('.product-meta h1').textContent()
      const sku = await page
        .locator('span.product-meta__sku-number')
        .textContent()

      const priceElement = page
        .locator('span.price')
        .filter({
          hasText: '$',
        })
        .first()

      const currentPriceString = await priceElement.textContent()
      const rawPrice = currentPriceString?.split('$')[1] || ''
      const price = Number(rawPrice.replaceAll(',', ''))

      const inStockElement = page
        .locator('span.product-form__inventory')
        .filter({ hasText: 'In stock' })
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

      await Dataset.pushData(results)
    } else if (request.label == 'CATEGORY') {
      // we are now on a category page. we can paginate through the pages and grab and enqueue all the products
      // and pages that we find

      await page.waitForSelector('.product-item > a')
      await enqueueLinks({
        selector: '.product-item > a',
        label: 'DETAIL', // note the different label
      })

      // we need to find the "Next" button and enqueue the next page of results (if it exists)
      const nextButton = await page.$('a.pagination__next')
      if (nextButton) {
        await enqueueLinks({
          selector: 'a.pagination__next',
          label: 'CATEGORY', // note the same label
        })
      }
    } else {
      // we are on the start page and have no label
      // on this page we just want to enqueue all the category pages

      // wait for the category cards to render
      // otherwise enqueueLinks will not enqueue anything
      await page.waitForSelector('.collection-block-item')

      // add links to the queue but only from elements that match the provided selector
      await enqueueLinks({
        selector: '.collection-block-item',
        label: 'CATEGORY',
      })
    }
  },
})

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections'])
