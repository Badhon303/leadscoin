const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
// const uuid = require('uuid/v1');
const { v1: uuidv1 } = require('uuid');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuidv1().split('-').join('');

const leadscoin = new Blockchain();


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


// broadcast transaction
app.post('/transaction/broadcast', function (req, res) {
    const newTransaction = leadscoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    leadscoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    leadscoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(data => {
            res.json({ note: 'Transaction created and broadcast successfully.' });
        });
});


// app.get('/mine', function (req, res) {
//     const lastBlock = leadscoin.getLastBlock();
//     const previousBlockHash = lastBlock['hash'];
//     const currentBlockData = {
//         transections: leadscoin.pendingTransactions,
//         index: lastBlock['inex'] + 1
//     };
//     const nonce = leadscoin.proofOfWork(previousBlockHash, currentBlockData);
//     const blockHash = leadscoin.hashBlock(previousBlockHash, currentBlockData, nonce);
//     leadscoin.createNewTransaction(12.5, "00", nodeAddress);
//     const newBlock = leadscoin.createNewBlock(nonce, previousBlockHash, blockHash);



//     res.json({
//         note: "New Block Mined Successfully",
//         block: newBlock
//     });
// });

// mine a block
app.get('/mine', function (req, res) {
    const lastBlock = leadscoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: leadscoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = leadscoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = leadscoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = leadscoin.createNewBlock(nonce, previousBlockHash, blockHash);

    const requestPromises = [];
    leadscoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock },
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(data => {
            const requestOptions = {
                uri: leadscoin.currentNodeUrl + '/transaction/broadcast',
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: "00",
                    recipient: nodeAddress
                },
                json: true
            };

            return rp(requestOptions);
        })
        .then(data => {
            res.json({
                note: "New block mined & broadcast successfully",
                block: newBlock
            });
        });
});



// receive new block
app.post('/receive-new-block', function (req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = leadscoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if (correctHash && correctIndex) {
        leadscoin.chain.push(newBlock);
        leadscoin.pendingTransactions = [];
        res.json({
            note: 'New block received and accepted.',
            newBlock: newBlock
        });
    } else {
        res.json({
            note: 'New block rejected.',
            newBlock: newBlock
        });
    }
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
    if (leadscoin.networkNodes.indexOf(newNodeUrl) == -1 && leadscoin.currentNodeUrl !== newNodeUrl) {
        leadscoin.networkNodes.push(newNodeUrl);
    };
    res.json({ note: 'New node registered successfully.' });
});


// register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        if (leadscoin.networkNodes.indexOf(networkNodeUrl) == -1 && leadscoin.currentNodeUrl !== networkNodeUrl) {
            leadscoin.networkNodes.push(networkNodeUrl);
        };
    });
    res.json({ note: 'Bulk registration successful.' });
});


// consensus
app.get('/consensus', function (req, res) {
    const requestPromises = [];
    leadscoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(blockchains => {
            const currentChainLength = leadscoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;

            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainLength) {
                    maxChainLength = blockchain.chain.length;
                    newLongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.pendingTransactions;
                };
            });


            if (!newLongestChain || (newLongestChain && !leadscoin.chainIsValid(newLongestChain))) {
                res.json({
                    note: 'Current chain has not been replaced.',
                    chain: leadscoin.chain
                });
            }
            else {
                leadscoin.chain = newLongestChain;
                leadscoin.pendingTransactions = newPendingTransactions;
                res.json({
                    note: 'This chain has been replaced.',
                    chain: leadscoin.chain
                });
            }
        });
});


// // get block by blockHash
// app.get('/block/:blockHash', function (req, res) {
//     const blockHash = req.params.blockHash;
//     const correctBlock = leadscoin.getBlock(blockHash);
//     res.json({
//         block: correctBlock
//     });
// });


// // get transaction by transactionId
// app.get('/transaction/:transactionId', function (req, res) {
//     const transactionId = req.params.transactionId;
//     const trasactionData = leadscoin.getTransaction(transactionId);
//     res.json({
//         transaction: trasactionData.transaction,
//         block: trasactionData.block
//     });
// });


// // get address by address
// app.get('/address/:address', function (req, res) {
//     const address = req.params.address;
//     const addressData = leadscoin.getAddressData(address);
//     res.json({
//         addressData: addressData
//     });
// });


// // block explorer
// app.get('/block-explorer', function (req, res) {
//     res.sendFile('./block-explorer/index.html', { root: __dirname });
// });


app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});