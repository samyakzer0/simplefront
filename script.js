// Replace with your contract address and ABI
const contractAddress = '0xa12428454296732F8dE029a94eBB4fA837126b66';
const contractABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "owner", "type": "address"},
            {"internalType": "address", "name": "spender", "type": "address"}
        ],
        "name": "allowance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "spender", "type": "address"},
            {"internalType": "uint256", "name": "value", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];
const web3Utils = Web3.utils;
const BigNumber = web3Utils.BN;


async function transferTokens() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        console.log('MetaMask detected');
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const recipient = document.getElementById('recipient').value;
            const amount = document.getElementById('amount').value;

            if (!web3.utils.isAddress(recipient)) {
                alert('Invalid recipient address');
                return;
            }

            if (amount <= 0) {
                alert('Amount should be greater than zero');
                return;
            }

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const accounts = await web3.eth.getAccounts();
            const sender = accounts[0];

            const decimals = await contract.methods.decimals().call();
            const amountInWei = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals));

            const tx = await contract.methods.transfer(recipient, amountInWei.toString()).send({ from: sender });
            alert('Transfer successful! Transaction hash: ' + tx.transactionHash);
        } catch (error) {
            console.error('Error details:', error);
            if (error.code === 4001) {
                alert('User denied account access.');
            } else if (error.code === -32002) {
                alert('Request already pending.');
            } else {
                alert('Error during transfer: ' + (error.message || error));
            }
        }
    } else {
        alert('MetaMask is not installed.');
    }
}
