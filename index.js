const Luno = require('luno-node')
const binance = (require('binance-api-node').default)()
const fs = require('fs')

const luno = new Luno(
  process.env.LUNO_KEY_ID,
  process.env.LUNO_SECRET
);

const alts = ['ETH', 'XRP', 'BCH', 'LTC']

setTimeout(trade, 0)

buyTrigger = 0.003

async function trade() {
  try {
    let balance = (await luno.getBalance()).balance

    // determine the state

    // find XBT balance
    xbtBalance = +((balance.filter(asset => asset.asset === 'XBT'))[0].balance)
console.log(xbtBalance)
    if(xbtBalance > 0.000001) {
      console.log('we have XBT to trade')
      await toBuyOrNotToBuy()
    } else {
      console.log('we dont have xbt to trade')
      console.log('we have to check alts')
      // await toSellOrNotToSell()
    }

  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(trade, 2000)
  }
}

async function toBuyOrNotToBuy() {
  try {
    // get all tickers
    let [lunoTickers, binanceTickers] = await Promise.all([
      (await luno.getAllTickers()).tickers,
      await binance.allBookTickers()
    ])

    alts.map(alt => {
      xbtAlt = alt + 'XBT'
      btcAlt = alt + 'BTC'
      let lunoPrice = (lunoTickers.filter(pair => pair.pair === xbtAlt))[0].ask
      let binancePrice = +(binanceTickers[btcAlt].askPrice)

      binanceTrigger = binancePrice * (1 - buyTrigger)

      binanceTrigger = +((binanceTrigger + '').substring(0, lunoPrice.length))
      lunoPrice = +lunoPrice

console.log({lunoPrice})
console.log({binancePrice})
console.log({binanceTrigger})

      if(lunoPrice < binanceTrigger) {
        // execute a buy order
        fs.appendFileSync('buy.log', JSON.stringify({
          xbtAlt,
          lunoPrice,
          binancePrice
        }))
      }


    })
  } catch (err) {
    console.error(err)
  }
}
