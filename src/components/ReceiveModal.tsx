import React, {useContext, useState} from 'react';
import styled from 'styled-components/native';
import {Button, Input, Overlay} from 'react-native-elements';
import {WalletContext} from '../contexts/WalletContext';
import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';

const Title = styled.Text`
  font-size: 30px;
`;
const Subtitle = styled.Text`
  font-size: 20px;
  padding: 20px 0px;
  text-align: center;
`;

const InputContainer = styled.View`
  display: flex;
  padding: 50px 0px;
`;

const TouchContainer = styled.TouchableOpacity``;

type Prop = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

const ReceiveModal: React.FC<Prop> = ({isVisible, setIsVisible}) => {
  const {address, receiveFromPrivateKey} = useContext(WalletContext);
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState(false);

  const receiveValue = async () => {
    if (privateKey === '') {
      setError(true);
      return;
    }

    await receiveFromPrivateKey(privateKey);
    Snackbar.show({
      text: '5.0 received!',
    });
  };

  const copyToClipboard = () => {
    if (address !== '') {
      Clipboard.setString(address);
      Snackbar.show({
        text: 'Public key copied!',
      });
    }
  };

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      overlayStyle={{width: '90%', padding: 30}}>
      <Title>Receive</Title>
      <TouchContainer onPress={copyToClipboard}>
        <Subtitle>
          {address !== ''
            ? `You wallet public key is: ${address}`
            : 'Empty wallet'}
        </Subtitle>
      </TouchContainer>
      <InputContainer>
        <Input
          value={privateKey}
          placeholder="Private Key"
          onChangeText={value => setPrivateKey(value)}
          errorStyle={{color: 'red'}}
          errorMessage={error ? 'Enter a private key' : ''}
          autoCompleteType={'none'}
        />
      </InputContainer>
      <Subtitle>test purpose only!</Subtitle>
      <Button
        title="Receive from private key"
        onPress={receiveValue}
        titleStyle={{marginLeft: 15}}
        disabled={address === ''}
      />
    </Overlay>
  );
};

export default ReceiveModal;
