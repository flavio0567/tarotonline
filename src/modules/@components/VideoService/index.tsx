// @ refresh reset
import React, { useState, useEffect, useCallback } from 'react';
import { Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../shared/service/api';
import { useAuth } from '../../../shared/hooks/auth';
import { uid } from 'uid/single'; 
import theme from '../../../shared/global/styles/theme';
import { Button } from '../../../shared/components/Button';
import { GiftedChat } from 'react-native-gifted-chat';
import Fire from '../../../shared/components/Fire';

import { initializeApp } from 'firebase/app';

import {
  getDatabase,
  ref,
  onValue,
  serverTimestamp,
  push,
  onChildAdded,
  DatabaseReference
} from 'firebase/database';

import {
  Container,
  Content,
  Icon,
  Separator,
  SeparatorText,
  BackButton,
  ConfirmationButton,
} from './styles';
import { string } from 'yup/lib/locale';

export interface MsgProps {
  _id: number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar?: string;
  }
}

interface ConfigProps {
  apiKey: string;
  databaseURL: string;
  hash: string;
}

type AttMsgProps = {
  [key: string]: {
    Mensagem: string;
    Mktime: number;
    Mktime2: number;
    OriTipo: string;
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
 
  const [databaseRef, setDatabaseRef] = useState<DatabaseReference>();

  const [serverTime, setServerTime] = useState(0);

  useEffect (() => {
    const getServerTime = async () => {
      await api.get('outros/hora-servidor/')
        .then((res) => {
          const { Mktime } = res.data;
          setServerTime(Mktime);
        })
   
      await api.post(`atendimentos/chat/219/`)
        .then((responseChat) => {
          console.log('* * * Atendimento Criado * * * ', responseChat.data);
          const { Atendimento } = responseChat.data;
          setServiceCode(Atendimento.Codigo);

          const { ApiKey, DatabaseURL, Hash } = responseChat.data.Firebase;
    
          const config = {
            apiKey: ApiKey,
            databaseURL: DatabaseURL,
            hash: Hash
          }

          init(config);
        })
    }
    getServerTime();

  }, []);

  useEffect(() => {
    setTimeout(function () { 
      setServerTime(serverTime + 1);
    }, 1000)
  }, [serverTime]);
  

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ])
  // }, [])

  function init(config: ConfigProps) {
    console.log('* * * Criando Atendimento * * *', config);

    const { apiKey, databaseURL, hash} = config;

        const app = initializeApp({apiKey, databaseURL});
        const database = getDatabase(app);

        const databaseDataRef = ref(
          database,
          `/atendimentos/${hash}/dados/`
        );

        onValue(
          databaseDataRef,
          (snapshot: { exists: () => any; val: () => any; }) => {
            if (snapshot.exists()) {
              console.log('snapshot nos dados: ', snapshot.val());
            }
          });
        
        const databaseMsgRef: DatabaseReference = ref(
          database, 
          `/atendimentos/${hash}/mensagens/`
        );
        
        setDatabaseRef(databaseMsgRef);
    
    onValue(
      databaseMsgRef,
      (snapshot) => {
        if (snapshot.exists()) {
          console.log('====>', snapshot.val());
          const msg = snapshot.val();
          const key = Object.keys(msg)[Object.keys(msg).length - 1];
          const val = msg[key];
          if (val.OriTipo === "A") {
            setMessages(previous => GiftedChat.append(previous, 
              {
                _id: uid(16),
                text: val.Mensagem,
                createdAt: val.Mktime,
                user: {
                  _id: 219,
                  name: "Atendente Teste",
                  avatar: 'https://placeimg.com/140/140/any',
                },
              }),
            )
          }         

              // console.log('snap.val key =>', key);
              // const message: any =
              // {
              //   _id: uid(32),
              //   text: val.Mensagem,
              //   createdAt: val.Mktime,
              //   user: {
              //     _id: user.id,
              //     name: user.name,
              //     avatar: user.avatar
              //   }
              // };
              // setMessages(previous => GiftedChat.append(previous, message))
              // setMessages(message);
              
              // console.log('m e s s :', message)
        } else {
              console.log("No data available");
            }
          })
  };

  function send(messages: any[]) {
    console.log('==== messages =====', messages)
    messages.map((item: any) => {
      const messages = {
        OriTipo: 'C',
        Mensagem: item.text,
        Mktime: serverTimestamp(),
        Mktime2: serverTimestamp()
      };
      push(databaseRef!, messages)

    })
  }

  const onSend = useCallback((message = []) => {
    setMessages(previous => GiftedChat.append(previous, message))
  }, [])
  
  const chat =
    <GiftedChat
      messages={messages}
      onSend={(message) => {onSend(message), send(message)}}
      user={
        { _id: user.id }}
    />;
  
  function handleChatOff() {
    api.post(`atendimentos/finalizar/${serviceCode}/`)
      .then((res) =>
        console.log('retorno no final:', res.data)
      );

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
