import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
//import { Provider } from '../../server/node_modules/@truffle/hdwallet-provider';
//import { Provider } from '../../server/node_modules/@truffle/hdwallet-provider/dist/constructor/types';
//import { Provider } from 'react';
import HDWalletProvider from '../../server/node_modules/@truffle/hdwallet-provider/dist';
import MyContract from '../src/abis/MyContract.json';
import './App.css';

function App() {

  const [value, setValue] = useState();
  //const ropstenPro = 'https://ropsten.infura.io/v3/bf2aa466a0b54373b677c2dc1b830d49';
  const ropstenPro = 'wss://ropsten.infura.io/ws/v3/bf2aa466a0b54373b677c2dc1b830d49';
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    //Thats how you write function inside useEffect()
    async function init4(){}
    init4();
  });

  async function init1(){
    const web3 = new Web3(ropstenPro);
    const id = await web3.eth.net.getId();
    console.log("Network Id: ", id);
    const address = await MyContract.networks[id].address;
    console.log("Address: ", address);

    const myContract = new web3.eth.Contract(
      MyContract.abi,
      address
    )
    
    const fromAdd = await web3.utils.toChecksumAddress('0xAaa25FB3d2b4617793Fa58fC1881F4bb76E6bd62')
    const priKey = 'b8ed812a73ca25905a534c4afc5b0f5ba2b387727cf73e4700fe843dcb7971b6';
    let val = await myContract.methods.data().call();
    console.log("Old Data: ", val);

    const tx = await myContract.methods.setData(7);
    const data = tx.encodeABI();
    const gas = await tx.estimateGas({from: '0x3EEe74823c59E709606d89BF10f2424465Ba69F9'});
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(fromAdd);

    console.log("data: ", data);
    console.log("gas: ", gas);
    console.log("gasP: ", gasPrice);
    console.log("nonce: ", nonce);

    const txParams = {
      to: address,
      //from: '0x3EEe74823c59E709606d89BF10f2424465Ba69F9',
      gas: gasPrice,
      data: data,
      gasLimit: gas,
      value: 10,
      //nonce: nonce,
      chainId: id
    };

    console.log("TxPrams: ", txParams);

    const signTx = await web3.eth.accounts.signTransaction(txParams,priKey);

    const receipt = await web3.eth.sendSignedTransaction(signTx.rawTransaction);
    let txHash = receipt.transactionHash;
    console.log("TxHash: ", txHash);

    const val2 = await myContract.methods.data().call();
    console.log("New Data: ", val2);

    const results = await myContract.getPastEvents(
      'Data',
      {}
    )
  
    await myContract.events.Data({fromBlock: 0})
    .on('data', event => console.log("Second Event", event));

    console.log("TxEvents: ", receipt)
    console.log("Results: ", results);
    console.log("Data: ", results[0].returnValues.data);
    console.log("Num", results[0].returnValues.num);
  }

  async function init2(){
    //const web3 = new Web3(ropstenPro);
    const web3 = new Web3(new Web3.providers.WebsocketProvider(ropstenPro));
    const id = await web3.eth.net.getId();
    console.log("Network Id: ", id);
    const address = await MyContract.networks[id].address;
    console.log("Address: ", address);

    const myContract = new web3.eth.Contract(
      MyContract.abi,
      address
    )

    const fromAdd = await web3.utils.toChecksumAddress('0xAaa25FB3d2b4617793Fa58fC1881F4bb76E6bd62')
    const priKey = 'b8ed812a73ca25905a534c4afc5b0f5ba2b387727cf73e4700fe843dcb7971b6';

    web3.eth.accounts.wallet.add(priKey);
    
    const tx = await myContract.methods.setData(9);
    const data = tx.encodeABI();
    const gas = await tx.estimateGas({from: '0x3EEe74823c59E709606d89BF10f2424465Ba69F9'});
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(fromAdd);

    console.log("data: ", data);
    console.log("gas: ", gas);
    console.log("gasP: ", gasPrice);
    console.log("nonce: ", nonce);

    const txParams = {
      from: fromAdd,
      to: address,
      gas: gasPrice,
      data: data,
      gasLimit: gas,
      value: 10,
      nonce: nonce,
      chain: 'ropsten',
      hardfork: 'London'
    };

    console.log("TxPrams: ", txParams);

    const receipt = await web3.eth.sendTransaction(txParams);
    let txHash = receipt.transactionHash;
    console.log("TxHash: ", txHash);

    const val2 = await myContract.methods.data().call();
    console.log("New Data: ", val2);

    const results = await myContract.getPastEvents(
      'Data',
      {}
    )
    
    myContract.events.allEvents({
                    fromBlock: 0,
                    toBlock: 'latest'
                })
      .on('data', function(event) {
          console.log("ALL EVENTS: ", event)
      });

    myContract.events.Data({fromBlock: 0})
      // .on("connected", function (x) {
      //   console.log("Connected: ", x)
      // })
      .on('data', function (x) {
        console.log("Data: ", x)
      })
      .on('error', function (x) {
        console.log("Error: ", x)
      });

  console.log("TxEvents: ", receipt)
  console.log("Results: ", results);
  console.log("Data: ", results[0].returnValues.data);
  console.log("Num", results[0].returnValues.num);
  }

  async function init3() {
    const priKey = 'b8ed812a73ca25905a534c4afc5b0f5ba2b387727cf73e4700fe843dcb7971b6';
    
    const provider = new HDWalletProvider(priKey, ropstenPro)
    
    const web3 = new Web3(provider);
    const fromAdd = await web3.utils.toChecksumAddress('0xAaa25FB3d2b4617793Fa58fC1881F4bb76E6bd62');
    const id = await web3.eth.net.getId();
    console.log("Network Id: ", id);
    const address = await MyContract.networks[id].address;
    console.log("Address: ", address);

    const myContract = new web3.eth.Contract(
      MyContract.abi,
      address
    )

    const val1 = await myContract.methods.data().call();
    console.log("Old Data: ", val1);

    const receipt = await myContract.methods.setData(13).send({from: fromAdd});

    myContract.events.Data({fromBlock: 0})
      .on("connected", function (x) {
        console.log("Connected: ", x)
      })
      .on('data', function (x) {
        console.log("Data: ", x)
      })
      .on('error', function (x) {
        console.log("Error: ", x)
      });

    // myContract.events.Data({fromBlock: 0})
    // .on('Data', event => console.log("Second Event", event));

    const val2= await myContract.methods.data().call();
    console.log("New Data: ", val2);

    const results = await myContract.getPastEvents(
      'Data',
      {}
    )


  console.log("TxEvents: ", receipt)
  console.log("Results: ", results);
  console.log("Data: ", results[0].returnValues.data);
  console.log("Num", results[0].returnValues.num);
  }

  return (
    <div className="App">
      <h1>Hello crypto</h1>      
      <button onClick={init1}>Init1</button>
      <button onClick={init2}>Init2</button>
      <button onClick={init3}>Init3</button>
    </div>
  );
}

export default App;
