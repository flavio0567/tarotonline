// @ refresh reset
import React, { useState, useEffect, useCallback } from 'react';
import { Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../shared/service/api';
import { useAuth } from '../../../shared/hooks/auth';

import theme from '../../../shared/global/styles/theme';
import { Button } from '../../../shared/components/Button';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import Fire from '../../../shared/components/Fire';

import {
  Container,
  Content,
  Icon,
  Separator,
  SeparatorText,
  BackButton,
  ConfirmationButton,
} from './styles';

export interface MsgProps {
  _id: number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar: string;
  }
}

export function ChatService({ route }: any) {
  const { attendant } = route.params;
  const { goBack, navigate } = useNavigation();
  const [messages, setMessages] = useState<MsgProps[]>([]);
  const { user } = useAuth();

  const [isLoaded, setLoaded] = useState(false);
  const [serviceCode, setServiceCode] = useState(0);
  const [progress, setProgress] = useState(0);
  const { Cadastro } = attendant;
 
  const [serverTime, setServerTime] = useState(0);

  useEffect(() => {
    api.get('outros/hora-servidor/')
      .then((res) => {
        const { Mktime } = res.data;
        setServerTime(Mktime);
      })
  }, []);

  useEffect(() => {
    setTimeout(function () { 
      setServerTime(serverTime + 1);
    }, 1000)
  }, [serverTime]);

  useEffect(() => {
    const att = Fire.init();
    console.log('numero do atendimento: ', att);
    setServiceCode(Number(att));
  }, [messages]);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    console.log('msg do cliente:', messages);
  }, [])
  
  const chat =
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={
        { _id: user.id }}
    />;
  
  function handleChatOff() {
    Fire.off();
    navigate('Main');
  }
  
  return (
    <Container>
      
      <Separator>
        <BackButton
          onPress={() => goBack()}
        >
          <Icon
            name="chevron-back"
          />
        </BackButton>
        <SeparatorText>Atendimento Chat</SeparatorText>
      </Separator>

      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={30} enabled >
          {chat}
        </KeyboardAvoidingView>
      ): (
          <SafeAreaView style={{ flex: 1 }}>{chat}</SafeAreaView>
      )}
      <Button
        title="Finalizar Atendimento"
        color={theme.colors.attention}
        onPress={handleChatOff}
        style={{ marginBottom: 20 }}
      />
    </Container>
  )
}
