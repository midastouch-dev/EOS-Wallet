/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  Button,
  TextInput
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const bip39 = require('@medardm/react-native-bip39');
import ecc from 'eosjs-ecc-rn';
import nodejs from 'nodejs-mobile-react-native';
import {EOS_SERVER_URL, EOS_PRIVATE_KEY} from "@env"

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [strMnemonic, setStrMnemonic] = useState('');
  const [strPrivateKey, setStrPrivateKey] = useState('');
  const [strPublicKey, setStrPublicKey] = useState('');
  const [strName, setStrName] = useState('');
  let checkCreateAccount = useRef(0);

  useEffect(() => {
    nodejs.start('main.js');
  }, []);

  const setListner = () => {
    let susbcription = null
    try {
      if(susbcription != null) {
        susbcription.remove();
      }
      susbcription= nodejs.channel.addListener(
        'message',
        (msg) => {
          console.log(msg);
          let jsonData = JSON.parse(msg);
          if(jsonData.type == 'get_account') {
            if(checkCreateAccount.current == 1) {
              if(jsonData.code == 400) {
                checkCreateAccount.current = 0;
                nodejs.channel.send('create_account', EOS_SERVER_URL, EOS_PRIVATE_KEY, strName, strPublicKey)
              } else {
                console.log("This account was already existed.");
              }
            } else {
              console.log(jsonData.message);
            }
          } else if(jsonData.type == 'create_account') {
            console.log(jsonData.message);
          }
        },
      );
    } catch(e) {
      console.log(e);
    }
  }

  const generateKeys = async () => {
    let mnemonic = await bip39.generateMnemonic(128);
    let seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    let privateKey = await ecc.seedPrivate(seed);
    let publicKey = ecc.privateToPublic(privateKey);
    setStrMnemonic(mnemonic);
    setStrPrivateKey(privateKey);
    setStrPublicKey(publicKey);
    console.log(publicKey);
  }

  const GetAccount = (createAccount:any) => {
    setListner();
    checkCreateAccount.current = createAccount;
    nodejs.channel.send('get_account', EOS_SERVER_URL, EOS_PRIVATE_KEY, strName, strPublicKey)
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Button onPress={generateKeys} title="Generate Keys"/>
      <Text>Seed Phrases</Text> 
      <Text>{strMnemonic}</Text>
      <Text>Private Key</Text> 
      <Text>{strPrivateKey}</Text> 
      <Text>Public Key</Text> 
      <Text>{strPublicKey}</Text>
      <TextInput value={strName} onChangeText={text => setStrName(text)} placeholder="User Name"/>
      <Button title="Create Account" onPress={() => GetAccount(1)} />
      <Button title="Get Account" onPress={() => GetAccount(0)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
