import React, {createContext, ReactNode, useState} from 'react';
import {Platform} from 'react-native';
import Web3 from 'web3';
import {Account} from 'web3-core';
// @ts-ignore
import bip39 from 'react-native-bip39';
import {hdkey} from 'ethereumjs-wallet';

type WalletContextType = {
  web3: Web3;
  balance: string;
  account?: Account;
  address: string;
  mnemonic: string;
  load: () => void;
  createAccount: () => void;
  recoverAccount: (fromMnemonic: string) => void;
  receiveFromPrivateKey: (privateKey: string) => void;
  send: (address: string, value: string) => void;
};

export const WalletContext = createContext({} as WalletContextType);

type Props = {
  children?: ReactNode;
};

export function WalletProvider({children}: Props) {
  const web3 = new Web3(
    `http://${Platform.OS === 'android' ? '10.0.2.2' : 'localhost'}:7545`,
  );
  const [balance, setBalance] = useState('0.00');
  const [account, setAccount] = useState<Account>();
  const [address, setAddress] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const wallet_hdpath = "m/44'/60'/0'/0/0";

  const load = async () => {
    if (!account) {
      setAddress('');
      setBalance('0.00');
      return;
    }

    const currentBalance = await web3.eth.getBalance(account.address);
    const parsedBalance = web3.utils.fromWei(currentBalance);
    setBalance(parsedBalance);
    setAddress(account.address);
  };

  const createAccount = async () => {
    const newMnemonic = await bip39.generateMnemonic();
    const privateKey = await _getPrivateKey(newMnemonic);
    const newAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    setAccount(newAccount);
    setMnemonic(newMnemonic);
  };

  const recoverAccount = async (fromMnemonic: string) => {
    const privateKey = await _getPrivateKey(fromMnemonic);
    console.log(privateKey);
    try {
      const recoveredAccount =
        web3.eth.accounts.privateKeyToAccount(privateKey);
      setAccount(recoveredAccount);
      setMnemonic(fromMnemonic);
    } catch (e) {
      console.log('ERROR');
      console.log(e);
    }
  };

  const _getPrivateKey = async (fromMnemonic: string) => {
    const seed = await bip39.mnemonicToSeed(fromMnemonic);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet = hdwallet.derivePath(wallet_hdpath).getWallet();
    return wallet.getPrivateKey().toString('hex');
  };

  const receiveFromPrivateKey = async (privateKey: string) => {
    if (!account) {
      return;
    }
    const sendAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    const nonce = await web3.eth.getTransactionCount(
      sendAccount.address,
      'latest',
    );
    const gasPrice = await web3.eth.getGasPrice();
    const amountToSend = web3.utils.toWei('5.0', 'ether');

    const signTx = await web3.eth.accounts.signTransaction(
      {
        nonce,
        from: sendAccount.address,
        gasPrice,
        gas: 2000000,
        to: account.address,
        value: amountToSend,
      },
      privateKey,
    );

    web3.eth.sendSignedTransaction(signTx.rawTransaction!);

    const currentBalance = await web3.eth.getBalance(account.address);
    const parsedBalance = web3.utils.fromWei(currentBalance);
    setBalance(parsedBalance);
  };

  const send = async (toAddress: string, value: string) => {
    if (!account) {
      return;
    }
    const nonce = await web3.eth.getTransactionCount(address, 'latest');
    const gasPrice = await web3.eth.getGasPrice();
    const amountToSend = web3.utils.toWei(value, 'ether');

    const signTx = await web3.eth.accounts.signTransaction(
      {
        nonce,
        from: address,
        gasPrice,
        gas: 2000000,
        to: toAddress,
        value: amountToSend,
      },
      account.privateKey,
    );

    web3.eth.sendSignedTransaction(signTx.rawTransaction!);

    const currentBalance = await web3.eth.getBalance(account.address);
    const parsedBalance = web3.utils.fromWei(currentBalance);
    setBalance(parsedBalance);
  };

  return (
    <WalletContext.Provider
      value={{
        web3,
        balance,
        account,
        address,
        mnemonic,
        load,
        createAccount,
        recoverAccount,
        receiveFromPrivateKey,
        send,
      }}>
      {children}
    </WalletContext.Provider>
  );
}
