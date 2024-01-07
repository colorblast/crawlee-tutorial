import { CheerioCrawler } from 'crawlee'

// const requestQueue = await RequestQueue.open()
// await requestQueue.addRequest({ url: 'https://crawlee.dev'})

const crawler = new CheerioCrawler({
  maxRequestsPerCrawl: 20,
  async requestHandler({ $, request }) {
    const title = $('title').text()
    console.log(`The title of "${request.url}" is ${title}.`)

    const links = $('a[href]')
      .map((_, el) => $(el).attr('href'))
      .get()

    const hostname = new URL(request.loadedUrl!).hostname
    const absoluteUrls: URL[] = links.map(
      (link) => new URL(link, request.loadedUrl),
    )

    const sameHostnameLinks = absoluteUrls
      .filter((url) => url.hostname === hostname)
      .map((url) => ({ url: url.href }))

    await crawler.addRequests(sameHostnameLinks)
  },
})

await crawler.run(['https://crawlee.dev'])
