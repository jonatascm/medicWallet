import React from 'react';
import Home from './pages/Home';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {WalletProvider} from './contexts/WalletContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <Home />
      </WalletProvider>
    </SafeAreaProvider>
  );
};

export default App;
