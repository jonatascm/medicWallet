import React, {useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPrescriptionBottleAlt,
  faHandHoldingMedical,
  faFileMedicalAlt,
  faHeartbeat,
  faFirstAid,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components/native';
import {Button} from 'react-native-elements';
import {WalletContext} from '../../contexts/WalletContext';
import ReceiveModal from '../../components/ReceiveModal';
import TransferModal from '../../components/TransferModal';

import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';
import RecoverModal from '../../components/RecoverModal';

const Title = styled.Text`
  font-size: 30px;
  padding: 30px 0px;
`;

const Subtitle = styled.Text`
  font-size: 20px;
  padding-bottom: 20px;
`;

const BalanceContainer = styled.View`
  display: flex;
  flex-direction: row;
  padding: 30px 0px;
`;

const BalanceValue = styled.Text`
  font-size: 70px;
  padding-right: 20px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-bottom: 20px;
`;

const SafeArea = styled.SafeAreaView`
  display: flex;
  flex: 1;
  align-items: center;
`;

const BottomContainer = styled.View`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-top: 20px;
`;

const AccountContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  z-index: 1;
`;

const TouchableContainer = styled.TouchableOpacity`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
`;

const Mnemonic = styled.Text`
  font-size: 20px;
  padding-bottom: 20px;
  color: #0492c2;
`;

const Home: React.FC = () => {
  const {address, balance, mnemonic, load, createAccount} =
    useContext(WalletContext);
  const [isVisibleReceive, setIsVisibleReceive] = useState(false);
  const [isVisibleTransfer, setIsVisibleTransfer] = useState(false);
  const [isVisibleRecover, setIsVisibleRecover] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeArea>
      <Title>Medic Wallet</Title>
      <Subtitle>Account</Subtitle>
      <AccountContainer>
        <TouchableContainer
          onPress={() => {
            Clipboard.setString(address);
            Snackbar.show({
              text: 'Address copied!',
            });
          }}>
          <Subtitle>
            {address !== ''
              ? `${address.slice(0, 2)}${address
                  .slice(2, 5)
                  .toUpperCase()}...${address.slice(-5).toUpperCase()}`
              : 'None'}
          </Subtitle>
        </TouchableContainer>
      </AccountContainer>
      <BalanceContainer>
        <BalanceValue>{balance}</BalanceValue>
        <FontAwesomeIcon icon={faHeartbeat} color="#000" size={30} />
      </BalanceContainer>
      {/*
      NOT IMPLEMENTED
      <ButtonContainer>
        <Button
          title="Receive"
          onPress={() => setIsVisibleReceive(true)}
          icon={
            <FontAwesomeIcon
              icon={faHandHoldingMedical}
              color="#fff"
              size={20}
            />
          }
          titleStyle={{marginLeft: 15}}
        />
        <Button
          title="Transfer"
          onPress={() => setIsVisibleTransfer(true)}
          icon={
            <FontAwesomeIcon icon={faFileMedicalAlt} color="#fff" size={20} />
          }
          titleStyle={{marginLeft: 15}}
        />
      </ButtonContainer>
        */}
      <Title>Accounts</Title>
      <ButtonContainer>
        <Button
          title="Create"
          onPress={() => createAccount()}
          icon={
            <FontAwesomeIcon
              icon={faPrescriptionBottleAlt}
              color="#fff"
              size={20}
            />
          }
          titleStyle={{marginLeft: 15}}
        />
        <Button
          title="Recover"
          onPress={() => setIsVisibleRecover(true)}
          icon={<FontAwesomeIcon icon={faFirstAid} color="#fff" size={20} />}
          titleStyle={{marginLeft: 15}}
        />
      </ButtonContainer>

      <BottomContainer>
        <TouchableContainer
          onPress={() => {
            Clipboard.setString(mnemonic);
            Snackbar.show({
              text: 'Mnemonic copied!',
            });
          }}>
          <Mnemonic>Mnemonic: {mnemonic}</Mnemonic>
        </TouchableContainer>
        <Subtitle>Connectoin: localhost</Subtitle>
      </BottomContainer>
      <ReceiveModal
        isVisible={isVisibleReceive}
        setIsVisible={setIsVisibleReceive}
      />
      <TransferModal
        isVisible={isVisibleTransfer}
        setIsVisible={setIsVisibleTransfer}
      />
      <RecoverModal
        isVisible={isVisibleRecover}
        setIsVisible={setIsVisibleRecover}
      />
    </SafeArea>
  );
};

export default Home;
