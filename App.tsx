/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
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

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [strMnemonic, setStrMnemonic] = useState('');
  const [strPrivateKey, setStrPrivateKey] = useState('');
  const [strPublicKey, setStrPublicKey] = useState('');

  const consoleData = async () => {
    // ecc.randomKey().then(privateKey => {
    //   console.log('Private Key:\t', privateKey) // wif
    //   console.log('Public Key:\t', ecc.privateToPublic('5JjkrT2ptuTY3F8GQghiP7d6idahFjnLV1gLm6vq2fbc4VK8Hoo')) // EOSkey...
    // })
    let mnemonic = await bip39.generateMnemonic(128);
    let seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    // let privateKey = await ecc.seedPrivate(seed);
    // let publicKey = ecc.privateToPublic(privateKey);
    setStrMnemonic(mnemonic);
    // setStrPrivateKey(privateKey);
    // setStrPublicKey(publicKey)
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Button onPress={consoleData} title="Generate Keys"/>
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
