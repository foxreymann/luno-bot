const Luno = require('luno-node')

const luno = new Luno(
  process.env.LUNO_KEY_ID,
  process.env.LUNO_SECRET
);

(async () => {
  try {
    let balance = (await luno.getBalance()).balance
console.log(balance)

    // determine the state
    // find XBT balance
    let xbtBalance = balance.filter(asset => asset.asset === 'XBT')

console.log(xbtBalance)

  } catch (err) {
    console.error(err)
    throw err
  }
})()
