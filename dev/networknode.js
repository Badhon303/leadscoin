const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { v1: uuidv1 } = require('uuid');
const nodeAddress = uuidv1().split('-').join('');
const leadscoin = new Blockchain();

const port = process.argv[2];
const rp = require('request-promise');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// get entire blockchain
app.get('/blockchain', function (req, res) {
    res.send(leadscoin);
});


// create a new transaction
app.post('/transaction', function (req, res) {
    const newTransaction = req.body;
    const blockIndex = leadscoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});


// mine a block
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


// register a node and broadcast it the network
app.post('/register-and-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (leadscoin.networkNodes.indexOf(newNodeUrl) == -1) {
        leadscoin.networkNodes.push(newNodeUrl);
    };

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
                body: { allNetworkNodes: [...leadscoin.networkNodes, leadscoin.currentNodeUrl] },
                json: true
            };

            return rp(bulkRegisterOptions);
        })
        .then(data => {
            res.json({ note: 'New node registered with network successfully.' });
        });
});


// register a node with the network
app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = leadscoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = leadscoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) {
        leadscoin.networkNodes.push(newNodeUrl);
    };
    res.json({ note: 'New node registered successfully.' });
});


// register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = leadscoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = leadscoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) {
            leadscoin.networkNodes.push(networkNodeUrl);
        };
    });
    res.json({ note: 'Bulk registration successful.' });
});


app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});