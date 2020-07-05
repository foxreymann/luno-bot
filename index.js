const Luno = require('luno-node')

const luno = new Luno(
  process.env.LUNO_KEY_ID,
  process.env.LUNO_SECRET
);

setInterval(trade, 2500)

async function trade() {
  try {

    let balance = (await luno.getBalance()).balance

    // determine the state

    // find XBT balance
    xbtBalance = +((balance.filter(asset => asset.asset === 'XBT'))[0].balance)

    if(xbtBalance > 0.01) {
      console.log('we have XBT to trade')
    } else {
      console.log('we dont have xbt to trade')
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}
