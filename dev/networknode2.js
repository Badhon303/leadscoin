const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const Blockchain = require('./blockchain');
const leadscoin = new Blockchain();
const { v1: uuidv1 } = require('uuid');
const nodeAddress = uuidv1().split('-').join('');
// console.log(nodeAddress);
const port = process.argv[2];
const rp = require('request-promise');

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

app.post('/register-and-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = leadscoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = leadscoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) leadscoin.networkNodes.push(newNodeUrl);
    const regNodesPromises = [];
    leadscoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        };

        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
        .then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                method: 'POST',
                body: { allNetworkNodes: [...leadscoin.networkNodes, leadscoin.currentNodeUrl] }, //... bringing array out of array 
                json: true
            };

            return rp(bulkRegisterOptions);
        })
        .then(data => {
            res.json({ note: 'New node registered with network successfully.' });
        });
});

app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = leadscoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = leadscoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) leadscoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'New node registered successfully.' });
});

app.post('/register-nodes-bulk', function (req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        if (leadscoin.networkNodes.indexOf(networkNodeUrl) == -1 && leadscoin.currentNodeUrl !== networkNodeUrl) {
            leadscoin.networkNodes.push(networkNodeUrl);
        };
    });

    res.json({ note: 'Bulk registration successful.' });
});

app.listen(port, function () {
    console.log(`listening to port ${port}`);
});