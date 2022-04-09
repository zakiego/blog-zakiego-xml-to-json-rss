import { parseString } from 'xml2js'
import fetch from 'node-fetch'

export async function handleRequest(request: Request): Promise<Response> {
  const source = 'https://blog.zakiego.my.id/feed.xml'
  const dataXML = await fetch(source).then((resp) => resp.text())
  let dataJSON: any

  parseString(dataXML, function (err, result) {
    dataJSON = result
  })

  if (dataJSON == undefined) {
    return new Response(JSON.stringify({ ok: false }))
  }

  const data = dataJSON.rss.channel[0].item.map((obj: any) => {
    const title = obj.title[0]
    const slug = obj.link[0]
    const summary = obj.description ? obj.description[0] : ''
    const pubDate = new Date(obj.pubDate[0]).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const fullText = `${title} ${summary} ${pubDate}`

    return {
      title,
      slug,
      summary,
      pubDate,
      fullText,
    }
  })

  return new Response(JSON.stringify({ data }))
}
