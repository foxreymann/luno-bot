const Luno = require('luno-node')
const binance = (require('binance-api-node').default)()
const fs = require('fs')

const luno = new Luno(
  process.env.LUNO_KEY_ID,
  process.env.LUNO_SECRET
);

setTimeout(trade, 0)

buyTrigger = 0.005
buyVolumeFactor = 0.1
sellTrigger = 0.005
minTradableBtcBalance = 0.0007

const alts = {
  'ETH': {
    minTradableBalance: 0.01
  },
  'XRP': {
    minTradableBalance: 1
  },
  'BCH': {
    minTradableBalance: 0.01
  },
  'LTC': {
    minTradableBalance: 0.01
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

    await Promise.all(
      Object.keys(alts).map(async alt => {
        xbtAlt = alt + 'XBT'
        btcAlt = alt + 'BTC'
        let lunoPrice = (lunoTickers.filter(pair => pair.pair === xbtAlt))[0].ask
        let binancePrice = +(binanceTickers[btcAlt].askPrice)

        binanceTrigger = binancePrice * (1 - buyTrigger)

        binanceTrigger = +((binanceTrigger + '').substring(0, lunoPrice.length))
        lunoPrice = +lunoPrice

        if(lunoPrice < binanceTrigger) {
          // execute a buy order
          fs.appendFileSync('action.log', JSON.stringify({
            action: 'BUY',
            xbtAlt,
            lunoPrice,
            binancePrice,
            binanceTrigger
          }) + '\n')

          // calculate volume
          btcToTrade = xbtBalance * buyVolumeFactor
          if(btcToTrade < minTradableBtcBalance) {
            btcToTrade = xbtBalance
          }

          btcToTrade = btcToTrade.toFixed(4)

          await luno.postMarketBuyOrder({
            volume: btcToTrade, pair: xbtAlt
          })
        } else {
          fs.appendFileSync('action.log', JSON.stringify({
            action: 'DONT BUY',
            xbtAlt,
            lunoPrice,
            binancePrice,
            binanceTrigger
          }) + '\n')
        }
      })
    )
  } catch (err) {
    console.error(err)
  }
}

async function toSellOrNotToSell({
  balance, lunoTickers, binanceTickers
}) {
  try {
    let filteredAlts = Object.keys(alts)
    .filter(alt => {
      altBalance = +((balance.filter(asset => asset.asset === alt))[0].balance)
      return (altBalance > alts[alt].minTradableBalance)
    })

    await Promise.all(
      filteredAlts.map(async alt => {
        xbtAlt = alt + 'XBT'
        btcAlt = alt + 'BTC'

        let lunoPrice = (lunoTickers.filter(pair => pair.pair === xbtAlt))[0].ask
        let binancePrice = +(binanceTickers[btcAlt].askPrice)

        binanceTrigger = binancePrice * (1 + sellTrigger)

        binanceTrigger = +((binanceTrigger + '').substring(0, lunoPrice.length))
        lunoPrice = +lunoPrice

        if(lunoPrice > binanceTrigger) {
          // execute a sell market order
          fs.appendFileSync('action.log', JSON.stringify({
            action: 'SELL',
            xbtAlt,
            lunoPrice,
            binancePrice,
            binanceTrigger
          }) + '\n')

          altBalance = +((balance.filter(asset => asset.asset === alt))[0].balance)
          altBalance = 0.9975 * altBalance

          if(alt === 'XRP') {
            altBalance = Math.floor(altBalance)
          } else {
            altBalance = altBalance.toFixed(2)
          }

          await luno.postMarketSellOrder({
            volume: altBalance, pair: xbtAlt
          })
        } else {
          fs.appendFileSync('action.log', JSON.stringify({
            action: 'DONT SELL',
            xbtAlt,
            lunoPrice,
            binancePrice,
            binanceTrigger
          }) + '\n')
        }
      })
    )
  } catch (err) {
    console.error(err)
  }
}
