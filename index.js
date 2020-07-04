const Luno = require('luno-node')

const luno = new Luno({
  pair: 'XRPXBT'
});

(async () => {
  try {
    console.log(await luno.getTicker({
      pair: 'ETHXBT'
    }))
  } catch (err) {
    console.error(err)
    throw err
  }
})()
