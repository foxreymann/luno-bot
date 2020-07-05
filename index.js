const Luno = require('luno-node')
var socket = require('socket.io-client')(
  'wss://ws.luno.com/api/1/stream/XRPXBT'
)


const luno = new Luno(keyId, keySecret, {
  pair: 'XRPXBT'
});

socket.on('connect', function(){
  console.trace('connected')
});
socket.on('event', function(data){
  console.trace(data)
});
socket.on('disconnect', function(){
  console.trace('disconnected')
});

(async () => {
  try {
    // console.trace(await luno.getOrderBook())
  } catch (err) {
    console.error(err)
    throw err
  }
})()
