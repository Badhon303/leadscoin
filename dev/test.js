const Blockchain = require('./blockchain');
const leadscoin = new Blockchain();

leadscoin.createNewBlock(797593, '78f6s8df68sdf68s7df', '9d7f9s8d7f9s0s');
leadscoin.createNewTransaction(100, 'badhon0f8d0s9f', 'alex0d9s0d9fv98ds');
leadscoin.createNewBlock(342342, '78f6s8dff9sfsdf07df', '9d7fdflsdf9s0s');
leadscoin.createNewTransaction(10, 'badhon0f8d0s9f', 'alex0d9s0d9fv98ds');
leadscoin.createNewTransaction(50, 'badhon0f8d0s9f', 'alex0d9s0d9fv98ds');
leadscoin.createNewTransaction(100, 'badhon0f8d0s9f', 'alex0d9s0d9fv98ds');
leadscoin.createNewBlock(797434, '78f6dfsfsfsdf982fg', 'f9fsfsd9809s97fg');

console.log(leadscoin);
console.log(leadscoin.chain[0]);
console.log(leadscoin.chain[1]);
console.log(leadscoin.chain[2]);





