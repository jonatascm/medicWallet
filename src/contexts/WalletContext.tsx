import React, {createContext, ReactNode, useState} from 'react';
import Web3 from 'web3';
import {Account} from 'web3-core';
// @ts-ignore
import bip39 from 'react-native-bip39';
import {hdkey} from 'ethereumjs-wallet';
import {Transaction} from '@ethereumjs/tx';
import Common from '@ethereumjs/common';
import {Buffer} from 'buffer';

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
  const web3 = new Web3('http://localhost:7545');
  const [balance, setBalance] = useState('0.00');
  const [account, setAccount] = useState<Account>();
  const [address, setAddress] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const wallet_hdpath = "m/44'/60'/0'/0/0";

  const load = async () => {
    console.log('load');
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
    const recoveredAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    setAccount(recoveredAccount);
    setMnemonic(fromMnemonic);
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

    var privateKeyHex = Buffer.from(privateKey, 'hex');

    var rawTx = {
      nonce: web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(gasPrice),
      to: account.address,
      value: web3.utils.toHex(amountToSend),
    };

    var tx = new Transaction(rawTx);

    tx.sign(privateKeyHex);

    var serializedTx = tx.serialize();

    console.log('PASSOU AQUI');

    web3.eth
      .sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt', console.log);

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

    const privateKey = Buffer.from(account.privateKey.slice(2), 'hex');
    const chainId = await web3.eth.getChainId();

    var rawTx = {
      nonce: web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(gasPrice),
      to: toAddress,
      value: web3.utils.toHex(amountToSend),
      chain: web3.utils.toHex(chainId),
    };

    var tx = new Transaction(rawTx);
    tx.sign(privateKey);

    var serializedTx = tx.serialize();

    web3.eth
      .sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt', console.log);

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