const Blockchain = require('./blockchain');
const leadscoin = new Blockchain;

const previousBlockHash = '8d6fs7d6f8s7d6f8s6fs7d';
const currentBlockData = [
    {
        amount: 10,
        sender: 'badhondf0s8d080sd',
        recipient: 'Alex56dfs6f46sf87f68'
    },
    {
        amount: 50,
        sender: 'badhondf0s8d080sd',
        recipient: 'Alex56dfs6f46sf87f68'
    },
    {
        amount: 100,
        sender: 'badhondf0s8d080sd',
        recipient: 'Alex56dfs6f46sf87f68'
    }
];


// console.log(leadscoin.proofOfWork(previousBlockHash, currentBlockData));
// console.log(leadscoin.hashBlock(previousBlockHash, currentBlockData, 104263));  
console.log(leadscoin); 