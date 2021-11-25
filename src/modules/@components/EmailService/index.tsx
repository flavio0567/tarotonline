// @ refresh reset
import React, { useState, useEffect, useMemo } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../shared/service/api';
import { Button } from '../../../shared/components/Button';
import { useTheme } from 'styled-components';
import { Input } from '../../../shared/components/Input';

import {
  Container,
  Icon,
  Separator,
  SeparatorText,
  BackButton,
  PriceLabel,
  Form,
  Content,
  MessageText
} from './styles';

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

type NavProps = NavigationProp<ParamListBase>;

export function EmailService({ route }: any) {
  const { attendant } = route.params;
  const navigation = useNavigation<NavProps>();

  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  // const [serviceCode, setServiceCode] = useState(0);
  const [consultantName, setConsultantName] = useState('');
  const [relatedName, setRelatedName] = useState('');
  const [dob, setDob] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');


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

  const [serverTime, setServerTime] = useState(0);

  useEffect(() => {
    const getServerTime = async () => {
      await api.get('outros/hora-servidor/')
        .then((res) => {
          const { Mktime } = res.data;
          console.log('serverTime:', Mktime);
          setServerTime(Mktime);
          startTimerCounter(Mktime);
        })
    }
    getServerTime();
  }, []);
  
  const startNewService = async () => {
    setIsLoading(true);
    console.log(
      'Nome:', consultantName,
      'NomeEnvolvido:', relatedName,
      'DataNascimento:', dob,
      'Assunto:', subject,
      'Mensagem:', message
    );
    await api.post(`atendimentos/email/219/`,
      {
        Nome: consultantName,
        NomeEnvolvido: relatedName,
        DataNascimento: dob,
        Assunto: subject,
        Mensagem: message
      }
    )
    .then((responseEmail) => {
      console.log('responseEmail:', responseEmail.headers)
      setIsLoading(false);
      
      handleServiceOff();

    })
      .catch((error) => {
        setIsLoading(false);
        console.log('error no call atendimentos/email/att', error);
        handleServiceOff();
    })
  }

  const startTimerCounter = (Mktime: number) => {
    console.log('Mktime in useMemo:', Mktime);
    useMemo(() => {
      const timer = setTimeout(function () {
        setServerTime(Mktime + 1);
        handleRemainingMinutes();
        handleRemainingTime();
        handleSpendingTime();
      }, 1000)
      return () => clearTimeout(timer);
    }, [serverTime]);
  };

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

  function handleServiceOff() {
    navigation.navigate('Main');
  }

  return (
      <Container>
        <Separator>
          <BackButton
            onPress={() => navigation.goBack()}
          >
            <Icon
              name="chevron-back"
            />
          </BackButton>
          <SeparatorText>Consulta por E-mail</SeparatorText>
        </Separator>

        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={30}
            enabled
           >
            <Content>
              <PriceLabel>Valor: R$ 49,90</PriceLabel>
              <Form>
                <Input
                  onChangeText={setConsultantName}
                  value={consultantName}
                  placeholder="Nome"
                  iconName={'user'}
                />
                <Input
                  onChangeText={setRelatedName}
                  value={relatedName}
                  placeholder="Nome do Envovido"
                  iconName={'users'}
                />
                <Input
                  onChangeText={setDob}
                  value={dob}
                  style={{ fontSize: 14 }}
                  placeholder="Data de Nasc. Ex.:14/11/1989"
                  iconName={'calendar'}
                />
                <Input
                  onChangeText={setSubject}
                  value={subject}
                  placeholder="Assunto"
                  iconName={'book-open'}
                />
                <Input
                  onChangeText={setMessage}
                  value={message}
                  placeholder="Mensagem"
                  iconName={'file-text'}
                />
              </Form>
              <Button
                title="Enviar Consulta"
                onPress={() => startNewService()}
                enabled={consultantName ? true : false}
                color={theme.colors.success}
              />
            </Content>
          </KeyboardAvoidingView>
      ) : (
        <KeyboardAvoidingView behavior="position" enabled>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Content>
              <PriceLabel>Valor: R$ 49,90</PriceLabel>
              <Form>
                <Input
                  onChangeText={setConsultantName}
                  value={consultantName}
                  placeholder="Nome"
                  iconName={'user'}
                />
                <Input
                  onChangeText={setRelatedName}
                  value={relatedName}
                  placeholder="Nome do(a) Envovido(a)"
                  iconName={'users'}
                />
                <Input
                  onChangeText={setDob}
                  value={dob}
                  style={{ fontSize: 14 }}
                  placeholder="Data de Nasc. Ex.:14/11/1989"
                  iconName={'calendar'}
                />
                <Input
                  onChangeText={setSubject}
                  value={subject}
                  placeholder="Assunto"
                  iconName={'book-open'}
                  />
                  
                <MessageText
                    onChangeText={setMessage}
                    value={message}
                    placeholder="Mensagem"
                    multiline={true}
                />
              </Form>
              <Button
                title="Enviar Consulta"
                onPress={() => startNewService()}
                enabled={consultantName ? true : false}
                color={theme.colors.success}
              />
              </Content>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        )}
    </Container>

  )
}
