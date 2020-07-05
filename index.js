const Luno = require('luno-node')
const binance = (require('binance-api-node').default)()

const luno = new Luno(
  process.env.LUNO_KEY_ID,
  process.env.LUNO_SECRET
);

const alts = ['ETH', 'XRP', 'BCH', 'LTC']

setTimeout(trade, 0)

async function trade() {
  try {
    let balance = (await luno.getBalance()).balance

    // determine the state

    // find XBT balance
    xbtBalance = +((balance.filter(asset => asset.asset === 'XBT'))[0].balance)
console.log(xbtBalance)
    if(xbtBalance > 0.000001) {
      console.log('we have XBT to trade')
      await buy()
    } else {
      console.log('we dont have xbt to trade')
    }

    setTimeout(trade, 20000)
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function buy() {
  try {
    // get all tickers
    let lunoTickers = (await luno.getAllTickers()).tickers
    let binanceTickers = await binance.allBookTickers()

console.log(Object.keys(binanceTickers).length)


  } catch (err) {
    console.error(err)
    throw err
  }
}
