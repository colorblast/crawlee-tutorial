import type { Request, Log } from 'crawlee'

export const category = async ({
  page,
  enqueueLinks,
  request,
  log,
}: {
  page: any
  enqueueLinks: any
  request: Request
  log: Log
}) => {
  log.debug(`Enqueueing pagination for: ${request.url}`)

  // we are now on a category page. We can use this to paginate through and enqueue all products,
  // as well as any subsequent pages we can find.

  await page.waitForSelector('.product-item > a')
  await enqueueLinks({
    selector: '.product-item > a',
    label: 'DETAIL',
  })

  const nextButton = await page.$('a.pagination__next')
  if (nextButton) {
    await enqueueLinks({
      selector: 'a.pagination__next',
      label: 'CATEGORY',
    })
  }
}
