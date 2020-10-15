const Blockchain = require('./blockchain');
const leadscoin = new Blockchain();

const bc1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1602745940602,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1602746014009,
            "transactions": [],
            "nonce": 18140,
            "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1602746017757,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "c40d56900eb511eb8e1ec9944d74501b",
                    "transactionId": "efd22c100eb511eb8e1ec9944d74501b"
                }
            ],
            "nonce": 135072,
            "hash": "0000c87bb8be9828f498dd5135648e78e3af53944a970ffff39904988c3f3046",
            "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
        },
        {
            "index": 4,
            "timestamp": 1602746021243,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "c40d56900eb511eb8e1ec9944d74501b",
                    "transactionId": "f20b05100eb511eb8e1ec9944d74501b"
                }
            ],
            "nonce": 15167,
            "hash": "00001287092e128c21512817dca39cc7df1ac9e6592069a5ef1b02bfe1dcf2ff",
            "previousBlockHash": "0000c87bb8be9828f498dd5135648e78e3af53944a970ffff39904988c3f3046"
        },
        {
            "index": 5,
            "timestamp": 1602746191225,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "c40d56900eb511eb8e1ec9944d74501b",
                    "transactionId": "f41ea2d00eb511eb8e1ec9944d74501b"
                },
                {
                    "amount": 30,
                    "sender": "Badhon435hk35hk345",
                    "recipient": "79gf8dg798dfg79",
                    "transactionId": "534501000eb611eb8e1ec9944d74501b"
                },
                {
                    "amount": 760,
                    "sender": "Badhon435hk35hk345",
                    "recipient": "79gf8dg798dfg79",
                    "transactionId": "56caf3700eb611eb8e1ec9944d74501b"
                }
            ],
            "nonce": 15197,
            "hash": "00008ccdd2ff34131a8e7aa74712a655f9a30d36a8baa4dfc74698b62b19cddb",
            "previousBlockHash": "00001287092e128c21512817dca39cc7df1ac9e6592069a5ef1b02bfe1dcf2ff"
        },
        {
            "index": 6,
            "timestamp": 1602746343351,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "c40d56900eb511eb8e1ec9944d74501b",
                    "transactionId": "596fd4b00eb611eb8e1ec9944d74501b"
                },
                {
                    "amount": 60,
                    "sender": "Badhon435hk35hk345",
                    "recipient": "79gf8dg798dfg79",
                    "transactionId": "b167aad00eb611eb8e1ec9944d74501b"
                }
            ],
            "nonce": 56237,
            "hash": "0000e276518ca50359b52d1e2c85a0ebae49d45d2e1035a0e656d3218497700d",
            "previousBlockHash": "00008ccdd2ff34131a8e7aa74712a655f9a30d36a8baa4dfc74698b62b19cddb"
        },
        {
            "index": 7,
            "timestamp": 1602746353238,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "00",
                    "recipient": "c40d56900eb511eb8e1ec9944d74501b",
                    "transactionId": "b41c43800eb611eb8e1ec9944d74501b"
                },
                {
                    "amount": 900,
                    "sender": "Badhon435hk35hk345",
                    "recipient": "79gf8dg798dfg79",
                    "transactionId": "b82214500eb611eb8e1ec9944d74501b"
                }
            ],
            "nonce": 64745,
            "hash": "00005e774d8b97e28059bfcf65ee66a3b928a9df859a207a4005a3d8182dc892",
            "previousBlockHash": "0000e276518ca50359b52d1e2c85a0ebae49d45d2e1035a0e656d3218497700d"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "00",
            "recipient": "c40d56900eb511eb8e1ec9944d74501b",
            "transactionId": "ba00e6700eb611eb8e1ec9944d74501b"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
}


console.log('VALID:', leadscoin.chainIsValid(bc1.chain));





