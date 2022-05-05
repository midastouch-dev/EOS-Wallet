/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  Button
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const bip39 = require('@medardm/react-native-bip39');
import ecc from 'eosjs-ecc-rn';
import nodejs from 'nodejs-mobile-react-native';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [strMnemonic, setStrMnemonic] = useState('');
  const [strPrivateKey, setStrPrivateKey] = useState('');
  const [strPublicKey, setStrPublicKey] = useState('');

  useEffect(() => {
    nodejs.start('main.js');
    nodejs.channel.addListener(
      'message',
      (msg) => {
        console.log(msg);
      },
    );
  }, []);

  const consoleData = async () => {
    let mnemonic = await bip39.generateMnemonic(128);
    let seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    let privateKey = await ecc.seedPrivate(seed);
    let publicKey = ecc.privateToPublic(privateKey);
    setStrMnemonic(mnemonic);
    setStrPrivateKey(privateKey);
    setStrPublicKey(publicKey)
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Button onPress={consoleData} title="Generate Keys"/>
      <Button title="Message Node"
    onPress={() => nodejs.channel.send('A message123!')}
    />
      <Text>Seed Phrases</Text> 
      <Text>{strMnemonic}</Text>
      <Text>Private Key</Text> 
      <Text>{strPrivateKey}</Text> 
      <Text>Public Key</Text> 
      <Text>{strPublicKey}</Text> 
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
