const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const Blockchain = require('./blockchain');
const leadscoin = new Blockchain();
const { v1: uuidv1 } = require('uuid');
const nodeAddress = uuidv1().split('-').join('');
// console.log(nodeAddress);
const port = process.argv[2];

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.get('/blockchain', function (req, res) {
    res.send(leadscoin);
});

app.post('/transection', function (req, res) {
    const blockIndex = leadscoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({ note: `transection will be added in the block number ${blockIndex}` });
});

app.get('/mine', function (req, res) {
    const lastBlock = leadscoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transections: leadscoin.pendingTransactions,
        index: lastBlock['inex'] + 1
    };
    const nonce = leadscoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = leadscoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    leadscoin.createNewTransaction(12.5, "00", nodeAddress);
    const newBlock = leadscoin.createNewBlock(nonce, previousBlockHash, blockHash);

    res.json({
        note: "New Block Mined Successfully",
        block: newBlock
    });
});

app.listen(port, function () {
    console.log(`listening to port ${port}`);
});