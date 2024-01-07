import type { Request, Log } from 'crawlee'

export const start = async ({
  request,
  page,
  enqueueLinks,
  log,
}: {
  request: Request
  page: any
  enqueueLinks: any
  log: Log
}) => {
  log.debug(`Enqueueing categories from page: ${request.url}`)

  await page.waitForSelector('.collection-block-item')
  await enqueueLinks({
    selector: '.collection-block-item',
    label: 'CATEGORY',
  })
}
