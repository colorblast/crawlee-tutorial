import { PlaywrightCrawler, log } from 'crawlee'
import { router } from './routes'

log.setLevel(log.LEVELS.DEBUG)

log.debug('Setting up crawler.')
const crawler = new PlaywrightCrawler({
  requestHandler: router,
})

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections'])
