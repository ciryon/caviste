const baseUrl = 'https://www.caviste.se/cav/'
const cheerio = require('cheerio')
const axios = require('axios')
const PDFDocument = require('pdfkit')
const fs = require('fs')

class Caviste {
  getHTML(url) {
    console.log('Loading data...')
    const data = axios.get(url).then((r) => r.data)
    return data
  }

  getDom(html) {
    return cheerio.load(html)
  }

  parseWines($) {
    const bottlesTable = $(
      '.woocommerce-Tabs-panel--description > table > tbody > tr'
    )
    return bottlesTable.get().map((node) => {
      const wineNode = $(node)
      const header = wineNode.find('h4').text()
      const regex = /(\d+)\s(?:flaska|flaskor)\s(.*)\s–\s(\d+)/
      const wineData = regex.exec(header)
      const whenString = wineNode.find('em').text()
      const desc = wineNode.find('em').text().split(' Drick')[0]
      const when = /(?:Drick:\s|Drick\s)(\d\d\d\d)\-(\d\d\d\d)/.exec(whenString)
      console.log(wineNode.find('p').text())
      const pairingString = wineNode.find('p').text()
      let pairing = ''
      if (/\still\s(.*)\./.exec(pairingString)) {
        pairing = /\still\s(.*)\./.exec(pairingString)[1]
      } else if (/\svin att\s(.*)\./.exec(pairingString)) {
        pairing = 'att ' + /\svin att\s(.*)\./.exec(pairingString)[1]
      }
      return {
        bottles: parseInt(wineData[1]),
        title: wineData[2],
        pricePerBottle: wineData[3],
        desc,
        when: { start: when[1], end: when[2] },
        pairing
      }
    })
  }

  saveAsPdf(wines, cavNumber) {
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream(`${cavNumber}.pdf`))

    // one page per bottle of each wine
    wines.forEach((wine, i) => {
      console.log(wine)
      for (let bottle = 1; bottle <= wine.bottles; bottle++) {
        if (i || bottle > 1) {
          doc.addPage()
        }
        doc
          // .font('fonts/PalatinoBold.ttf')
          .fontSize(28)
          .text(wine.title, 100, 100)

        if (wine.bottles > 1) {
          doc.fontSize(20).text(` ${bottle}/${wine.bottles}`, 550, 100)
        }
        doc
          .fontSize(22)
          .text(
            `Pris: ${wine.pricePerBottle} kr - Tidigast: ${wine.when.start} - Senast: ${wine.when.end} `,
            100,
            230
          )
          .text(`Till: ${wine.pairing} `, 100, 280)

          .fontSize(21)
          .text(`${wine.desc}`, 100, 400)

        // .save()
        // .moveTo(100, 70)
        // .lineTo(500, 70)
        // .fill('#FF3300');
      }
    })
    doc.save()
    doc.end()
  }
}

const main = async ({ cavNumber }) => {
  console.log(`Getting ${cavNumber}...`)
  const c = new Caviste()
  const html = await c.getHTML(`${baseUrl}/${cavNumber}`)
  const dom = c.getDom(html)
  const wines = c.parseWines(dom)
  console.log(wines)
  c.saveAsPdf(wines, cavNumber)
  console.log('Done!')
}

var args = process.argv.slice(2)
const cavNumber = args[0]

if (!process.env.TESTING) {
  if (cavNumber) {
    main({ cavNumber })
  } else {
    console.log('Usage: index.js [cav release]')
    console.log('')
    console.log('i.e. index.js cav0128')
  }
}

module.exports = {
  Caviste
}
