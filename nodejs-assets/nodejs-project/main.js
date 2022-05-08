// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

var rn_bridge = require('rn-bridge');

const { Api, JsonRpc} = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { TextDecoder, TextEncoder } = require('util');

// Echo every message received from react-native.
rn_bridge.channel.on('message', (type, url, private_key, name, key) => {
  switch(type) {
    case 'create_account':
      createAccount(url, private_key, name, key);
      break;
    case 'get_account':
      getAccount(url, name);
      break;
  }
});

// Create an account
const createAccount = async (url, private_key, name, myKey) => {
  try {
    const privateKeys = [private_key];
    const signatureProvider = new JsSignatureProvider(privateKeys);

    returnResult('create_account', 201, JSON.stringify(signatureProvider));
    
    const rpc = new JsonRpc(url, { fetch });
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    let x = await api.signatureProvider.getAvailableKeys(); 
    
    returnResult('create_account', 202, JSON.stringify(x));

    await api.transact({
      actions: [{
        account: 'eosio',
        name: 'newaccount',
        authorization: [{
          actor: 'eosio',
          permission: 'active',
        }],
        data: {
          creator: 'useraaaaaaaa',
          name: name,
          owner: {
            threshold: 1,
            keys: [{
              key: myKey,
              weight: 1
            }],
            accounts: [],
            waits: []
          },
          active: {
            threshold: 1,
            keys: [{
              key: myKey,
              weight: 1
            }],
            accounts: [],
            waits: []
          },
        },
      },
      {
        account: 'eosio',
        name: 'buyrambytes',
        authorization: [{
          actor: name,
          permission: 'active',
        }],
        data: {
          payer: name,
          receiver: 'mynewaccount',
          bytes: 8192,
        },
      },
      {
        account: 'eosio',
        name: 'delegatebw',
        authorization: [{
          actor: name,
          permission: 'active',
        }],
        data: {
          from: name,
          receiver: 'eosio',
          stake_net_quantity: '1.0000 SYS',
          stake_cpu_quantity: '1.0000 SYS',
          transfer: false,
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });

    returnResult('create_account', 200, 'You successfully created new account.');
  } catch(err) {
    returnResult('create_account', 400, 'Failed to create an account.');
  }
}

// Get the account
const getAccount = async (url, name) => {
  try{
    const rpc = new JsonRpc(url, { fetch });
    const account = await rpc.get_account(name);
    
    returnResult('get_account', 200, account);
} catch(e) {
    returnResult('get_account', 400, 'Failed to get the account info.');
  }
}

// Return Values
const returnResult = (type, code, message) => {
  const return_value = {
    type, code, message
  }
  rn_bridge.channel.send(JSON.stringify(return_value));
}