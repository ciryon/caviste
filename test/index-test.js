
const { Caviste } = require('../index')
const chai = require('chai')
const assert = chai.assert

const testCavData = require('fs').readFileSync('test/test.html', 'utf8')
const c = new Caviste()

describe('Index', () => {
  context('Parsing', () => {
    it('Can parse table of wines', () => {
      const dom = c.getDom(testCavData)
      const wines = c.parseWines(dom)
      wines.forEach(wine => console.log(wine))
      // console.log(wines)
      assert.equal(wines.length, 5)
      assert.equal(wines[0].title, '2019 Patrick Piuze Petit Chablis')
      assert.equal(wines[0].bottles, 1)
      assert.equal(wines[0].pairing, 'fisk och skaldjur')
    })
  })
})