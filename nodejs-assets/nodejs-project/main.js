// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

var rn_bridge = require('rn-bridge');

const { Api, JsonRpc} = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig'); // development only
const fetch = require('node-fetch'); // node only; not needed in browsers
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

// Return Values
const returnResult = (type, code, message) => {
  const return_value = {
    type, code, message
  }
  console.log(JSON.stringify(return_value));
  rn_bridge.channel.send(JSON.stringify(return_value));
}

// Create an account
const createAccount = async (url, private_key, name, myKey) => {
  returnResult('create_account', 204, '11111');
  try {
    const privateKeys = [private_key];
    const signatureProvider = new JsSignatureProvider(privateKeys);

    returnResult('create_account', 201, JSON.stringify(signatureProvider));
    
    const rpc = new JsonRpc(url, { fetch });
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    
    await api.transact({
      actions: [{
        account: 'eosio',
        name: 'newaccount',
        authorization: [{
          actor: 'eosio',
          permission: 'active',
        }],
        data: {
          creator: 'eosio',
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
      }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });

    console.log('success')

    returnResult('create_account', 200, 'You successfully created new account.');
  } catch(err) {
    console.log(err);
    returnResult('create_account', 400, err);
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
