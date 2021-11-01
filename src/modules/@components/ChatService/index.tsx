// @ refresh reset
import React, { useState, useEffect, useCallback } from 'react';
import { Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../shared/service/api';
import { useAuth } from '../../../shared/hooks/auth';
import { uid } from 'uid/single'; 
import { Button } from '../../../shared/components/Button';
import { GiftedChat } from 'react-native-gifted-chat';
import tarotIcon from '../../assets/tarot_icon.png';
import { useTheme } from 'styled-components';
import { initializeApp } from 'firebase/app';

import {
  getDatabase,
  ref,
  onValue,
  push,
  DatabaseReference
} from 'firebase/database';

import {
  Container,
  Icon,
  Separator,
  SeparatorText,
  BackButton,
  TimeInfoWrapper,
  TimeInfoLabel,
  TimeInfo,
  Time,
} from './styles';

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

interface AttDetailProps {
  AttUltimoKey: number;
  AttValorPorMinuto: number;
  ChatUltimoCodigo: number;
  CliCreditos: number;
  CliQtdMinutos: number;
  CliQtdSegundos: number;
  CliUltimoKey: number;
  CodigoStatus: number;
  ComissaoPorc: number;
  InicioCobranca: number;
  IsIniciadoCobranca: string;
  IsTipo: string;
  QtdCreditosGanhos: number;
  QtdSegundosGanhos: number;
  Sta: string;
  Tipo: string;
}

export function ChatService({ route }: any) {
  const { attendant } = route.params;
  const { goBack, navigate } = useNavigation();
  const [messages, setMessages] = useState<MsgProps[]>([]);
  const { user } = useAuth();
  const theme = useTheme();

  const [isLoaded, setLoaded] = useState(false);
  const [serviceCode, setServiceCode] = useState(0);
  const [progress, setProgress] = useState(0);
  const { Cadastro } = attendant;

  const [attDetail, setAttDetail] = useState<AttDetailProps>();
  const [time, setTime] = useState(0);
  const [amountSeconds, setAmountSeconds] = useState(0);
  const [amountTime, setAmountTime] = useState(0);
  const [amountMinutes, setAmountMinutes] = useState(0);
  const [timeFormatted, setTimeFormatted] = useState('');
  const [spendingTime, setSpendingTime] = useState('');

  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [diffTime, setDiffTime] = useState(0);

  const [databaseRef, setDatabaseRef] = useState<DatabaseReference>();

  const [serverTime, setServerTime] = useState(0);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Por favor aguarde, seu atendimento terá início em instantes!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Tarot Online',
          avatar: tarotIcon
        },
      },
    ])

    const getServerTime = async () => {
      await api.get('outros/hora-servidor/')
        .then((res) => {
          const { Mktime } = res.data;
          console.log('Mktime:', format(Mktime, 'dd/MM/yyyy'));
          setServerTime(Mktime);
        })
   
      await api.post(`atendimentos/chat/219/`)
        .then((responseChat) => {
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
    const timer = setTimeout(function () { 
      setServerTime(serverTime + 1);
      handleRemainingMinutes();
      handleRemainingTime();
      handleSpendingTime();
    }, 1000)
    return () => clearTimeout(timer);
  }, [serverTime]);
  
  const handleRemainingMinutes = () => {
    if (attDetail?.IsIniciadoCobranca === "S") {
      setTime(serverTime - attDetail.InicioCobranca);
      setAmountSeconds(attDetail.CliQtdSegundos);
      setDiffTime(amountSeconds - time);
      setAmountMinutes(Math.round(diffTime / 60));
      
      setRemainingMinutes(amountMinutes);
      setRemainingTime(diffTime);
    } else {
      setRemainingMinutes(-1);
      setRemainingTime(-1);
    }
  }

  const handleRemainingTime = () => {
    const diff: number = Math.ceil(parseFloat(String(remainingTime)));
    let timeFormatted: string = '';

    if (diff > 0) {
      if (diff < 60) {
        console.log('Alerta de crédito:', 'Menos de 1 minuto');
      } else {
        const day 		  	  = Math.floor(diff / 86400);
        const hours: number = Math.floor((diff - ( day * 86400 )) / 3600);
        const	minutes 		  = Math.floor((diff - ( day * 86400 ) - ( hours * 3600 )) / 60);
        const	seconds 		  = Math.round(diff - ( day * 86400 ) - ( hours * 3600 ) - ( minutes * 60 ));
            
        const	xhours 			  = ("00" + hours).substring(("00" + hours).length-2);
        const	xminutes 		  = ("00" + minutes).substring(("00" + minutes).length-2);
        const	xseconds 		  = ("00" + seconds).substring(("00" + seconds).length-2);
            
        if( hours > 0 ) {
          timeFormatted = timeFormatted + "" + xhours + "h";
        }
        
        if( minutes > 0 || hours > 0 ) {
          timeFormatted = timeFormatted + " " + xminutes + "m";
        }

        setTimeFormatted(timeFormatted);
      }
    }
  }

  const handleSpendingTime = () => {
		if( serverTime && attDetail?.InicioCobranca! > 0 ) {
			const diff		= serverTime - attDetail?.InicioCobranca!;
			
			const day 			= Math.floor(diff / 86400);
			const hours 			= Math.floor((diff - ( day * 86400 )) / 3600);
			const minutes 		= Math.floor((diff - ( day * 86400 ) - ( hours * 3600 )) / 60);
			const seconds 		= Math.round(diff - ( day * 86400 ) - ( hours * 3600 ) - ( minutes * 60 ));
			
			const xhours 			= ("00" + hours).substring(("00" + hours).length-2);
			const xminutes 		= ("00" + minutes).substring(("00" + minutes).length-2);
			const xseconds 		= ("00" + seconds).substring(("00" + seconds).length-2);
			
			let timeFormatted	= "";
			
			if( hours > 0 ) {
			  timeFormatted	= timeFormatted + "" + xhours + "h";
			}
			
			if( minutes > 0 || hours > 0 ) {
			  timeFormatted	= timeFormatted + " " + xminutes + "m";
			}
			
			if( seconds > 0 || minutes > 0 || hours > 0 ) {
			  timeFormatted	= timeFormatted + " " + xseconds + "s";
			}
			
      setSpendingTime(timeFormatted);
		} else {
			setSpendingTime('--');
  	}
		
	}

  function init(config: ConfigProps) {
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
              setAttDetail(snapshot.val());
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
          const msg = snapshot.val();
          const key = Object.keys(msg)[Object.keys(msg).length - 1];
          const val = msg[key];
          if (val.OriTipo === "A") {
            setMessages(previous => GiftedChat.append(previous, 
              {
                _id: uid(16),
                text: val.Mensagem,
                createdAt: new Date(),
                user: {
                  // _id: Cadastro.Codigo,
                  _id: 219,
                  name: "Atendente Teste",
                  avatar: Cadastro.Foto
                },
              }),
            )
          }         
        } else {
              console.log("No data available");
            }
          })
  };

  function send(messages: any[]) {
    messages.map((item: any) => {
      const messages = {
        OriTipo: 'C',
        Mensagem: item.text,
        Mktime: serverTime,
        Mktime2: serverTime
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
      user={{ _id: user.id }}
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
      <TimeInfoWrapper>
        <TimeInfo>
          <TimeInfoLabel>
            <Time>Tempo Restante</Time>
          </TimeInfoLabel>
          <Time>
            {timeFormatted}
          </Time>
        </TimeInfo>
        <TimeInfo>
          <TimeInfoLabel>
            <Time>Tempo Gasto</Time>
          </TimeInfoLabel>
          <Time>
            {spendingTime}
          </Time>
        </TimeInfo>
      </TimeInfoWrapper>
      <Button
        title="Finalizar Atendimento"
        color={theme.colors.attention}
        onPress={handleChatOff}
        style={{ marginBottom: 20 }}
      />
    </Container>
  )
}
