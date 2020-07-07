const Luno = require('luno-node')
const binance = (require('binance-api-node').default)()
const fs = require('fs')

const luno = new Luno(
  process.env.LUNO_KEY_ID,
  process.env.LUNO_SECRET
);

setTimeout(trade, 0)

buyTrigger = 0.003
sellTrigger = 0.003
minTradableBtcBalance = 0.0007

const alts = {
  'ETH': {
    minTradableBalance: 1
  },
  'XRP': {
    minTradableBalance: 1
  },
  'BCH': {
    minTradableBalance: 1
  },
  'LTC': {
    minTradableBalance: 1
  }
}

async function trade() {
  try {
    let [balance, lunoTickers, binanceTickers] = await Promise.all([
      (await luno.getBalance()).balance,
      (await luno.getAllTickers()).tickers,
      await binance.allBookTickers()
    ])

    await Promise.all([
      await toSellOrNotToSell({
        balance, lunoTickers, binanceTickers
      }),
      await toBuyOrNotToBuy({
        balance, lunoTickers, binanceTickers
      })
    ])
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(trade, 2000)
  }
}

async function toBuyOrNotToBuy({
  balance, lunoTickers, binanceTickers
}) {
  try {
    xbtBalance = +((balance.filter(asset => asset.asset === 'XBT'))[0].balance)
    console.log({xbtBalance})

    if(xbtBalance < minTradableBtcBalance) {
      return
    }

    Object.keys(alts).map(alt => {
      xbtAlt = alt + 'XBT'
      btcAlt = alt + 'BTC'
      let lunoPrice = (lunoTickers.filter(pair => pair.pair === xbtAlt))[0].ask
      let binancePrice = +(binanceTickers[btcAlt].askPrice)

      binanceTrigger = binancePrice * (1 - buyTrigger)

      binanceTrigger = +((binanceTrigger + '').substring(0, lunoPrice.length))
      lunoPrice = +lunoPrice

console.log({xbtAlt})
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

async function toSellOrNotToSell({
  balance, lunoTickers, binanceTickers
}) {
  try {
    alts.map(alt => {
/*
      xbtBalance = +((balance.filter(asset => asset.asset === 'XBT'))[0].balance)
      console.log({xbtBalance})

      if(xbtBalance < minTradableBtcBalance) {
        return
      }
*/

      xbtAlt = alt + 'XBT'
      btcAlt = alt + 'BTC'

      let lunoPrice = (lunoTickers.filter(pair => pair.pair === xbtAlt))[0].ask
      let binancePrice = +(binanceTickers[btcAlt].askPrice)

      binanceTrigger = binancePrice * (1 - buyTrigger)

      binanceTrigger = +((binanceTrigger + '').substring(0, lunoPrice.length))
      lunoPrice = +lunoPrice

console.log({xbtAlt})
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
