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

    setTimeout(trade, 2000)
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function buy() {
  try {
    // get luno eth price
    let tickers = ( (await luno.getAllTickers()).tickers).filter(pair => pair.pair === 'XRPXBT')

console.log(await binance.allBookTickers())


  } catch (err) {
    console.error(err)
    throw err
  }
}
