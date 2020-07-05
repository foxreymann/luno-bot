const Luno = require('luno-node')

const luno = new Luno(
  process.env.LUNO_KEY_ID,
  process.env.LUNO_SECRET
);

(async () => {
  try {
    console.log(await luno.getBalance())
  } catch (err) {
    console.error(err)
    throw err
  }
})()
