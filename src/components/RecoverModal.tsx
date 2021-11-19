import React, {useContext, useState} from 'react';
import styled from 'styled-components/native';
import {Button, Input, Overlay} from 'react-native-elements';
import {WalletContext} from '../contexts/WalletContext';
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

type Prop = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

const RecoverModal: React.FC<Prop> = ({isVisible, setIsVisible}) => {
  const {recoverAccount} = useContext(WalletContext);
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState(false);

  const sendValue = async () => {
    if (mnemonic === '') {
      setError(true);
      return;
    }

    await recoverAccount(mnemonic);
    Snackbar.show({
      text: 'Wallet recovered',
    });
  };

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      overlayStyle={{width: '90%', padding: 30}}>
      <Title>Recover</Title>
      <Subtitle>Insert Mnemonic and recover your wallet</Subtitle>
      <InputContainer>
        <Input
          value={mnemonic}
          placeholder="Mnemonic"
          onChangeText={value => setMnemonic(value)}
          errorStyle={{color: 'red'}}
          errorMessage={error ? 'Enter a private key' : ''}
          autoCompleteType={'none'}
        />
      </InputContainer>
      <Button
        title="Recover"
        onPress={sendValue}
        titleStyle={{marginLeft: 15}}
      />
    </Overlay>
  );
};

export default RecoverModal;
