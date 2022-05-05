// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

var rn_bridge = require('rn-bridge');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Echo every message received from react-native.
rn_bridge.channel.on('message', async (msg) => {
  console.log('[node] app paused.');
  try {
    let result = await fetch('https://api.github.com/users/github');
    let returnValue = await result.json();
    rn_bridge.channel.send(returnValue);
  } catch(err) {
    rn_bridge.channel.send(err);
  }
  
} );

// Inform react-native node is initialized.
rn_bridge.channel.send("Node was initialized.");