const Luno = require('luno-node')

const luno = new Luno({
  pair: 'XRPXBT'
});

(async () => {
  try {
    console.log(await luno.getOrderBook({ })) 
  } catch (err) {
    console.error(err)
    throw err
  }
})()
