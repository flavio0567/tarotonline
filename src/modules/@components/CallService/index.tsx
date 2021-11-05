// @ refresh reset
import React, { useState, useEffect } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import { CountryPickerModal } from '../../@components/CountryPickerModal';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../shared/service/api';
import { useAuth } from '../../../shared/hooks/auth';
import { Button } from '../../../shared/components/Button';
import { useTheme } from 'styled-components';
import { initializeApp } from 'firebase/app';
import { Input } from '../../../shared/components/Input';

import {
  getDatabase,
  ref,
  onValue
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
  Country,
  ModalText,
  ModalTextLabel,
  Form,
  // Input
} from './styles';

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

export function CallService({ route }: any) {
  const { attendant } = route.params;
  const { goBack, navigate } = useNavigation();
  const { user, callingCode } = useAuth();
  const theme = useTheme();

  const [phoneNumber, onChangePhoneNumber] = useState('');
  const [pickupCallingCode, setPickupCallingCode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [serviceCode, setServiceCode] = useState(0);
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

  const getServerTime = async () => {
    console.log('P A I S:', selectedCountry)
    await api.get('outros/hora-servidor/')
      .then((res) => {
        const { Mktime } = res.data;
        console.log('serverTime:', Mktime);
        setServerTime(Mktime);
      })
    console.log('pais selecionado aqui:', selectedCountry);
    await api.post(`atendimentos/telefone/219/`,
      {
        "TelefoneDDI": selectedCountry,
        "Telefone": phoneNumber
      }
    )
      .then((responseCall) => {
        console.log('responseCall:', responseCall);
        const { Atendimento } = responseCall.data;

        setServiceCode(Atendimento.Codigo);

        const { ApiKey, DatabaseURL, Hash } = responseCall.data.Firebase;
  
        const config = {
          apiKey: ApiKey,
          databaseURL: DatabaseURL,
          hash: Hash
        }

        init(config);
      })
  }

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
      }
    );
    
  };

  function handleSelectedCountry() {
    console.log('selecionando pais', callingCode)
    setPickupCallingCode(!pickupCallingCode);
    setSelectedCountry(callingCode);
  }

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
          <SeparatorText>Consulta por Telefone</SeparatorText>
        </Separator>

        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={30}
            enabled
          >
            <CountryPickerModal />
          </KeyboardAvoidingView>
      ) : (
        <KeyboardAvoidingView behavior="height" enabled>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Country>
                <ModalTextLabel>Informe o número do seu celular</ModalTextLabel>
                <Button
                  title="Selecione o País"
                  onPress={async () => handleSelectedCountry()}
                />
                {pickupCallingCode &&
                  <CountryPickerModal />
                }
                <ModalTextLabel>Preencha o seu Telefone com DDD</ModalTextLabel>
                <Form>
                  <Input
                    onChangeText={onChangePhoneNumber}
                    value={phoneNumber}
                    placeholder="número do seu celular"
                    keyboardType="numeric"
                    iconName={'smartphone'}
                  />
                </Form>
                <Button
                  title="Iniciar a Consulta"
                  onPress={() => getServerTime()}
                  enabled={phoneNumber ? true : false}
                  color={theme.colors.success}
                />
              </Country>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
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
