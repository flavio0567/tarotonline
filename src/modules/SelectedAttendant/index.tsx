import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
// import { MotiView } from 'moti';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from 'styled-components';
import { Button } from '../../shared/components/Button';
import { Alert } from 'react-native';
import { api } from '../../shared/service/api';
import { useAuth } from '../../shared/hooks/auth';

import {
  Container,
  PhotoWrapper,
  Photo,
  Title,
  Icon,
  BackButton,
  Availability,
  AttendantWrapper,
  Attendant,
  ButtonWrapper,
  ButtonServiceChannel,
  Separator,
  SeparatorText,
  // TimeTableText,
  ConfirmationButton,
  PickerView,
  PickerButton,
} from './styles';

// interface Props {
//   type: 'Disponível' | 'Em atendimento';
// }

// interface CadastroProps {
//   Codigo: string;
//   Descricao: string;
//   Experiencia: string;
//   Foto: string;
//   Frase: string;
//   HorarioAtendimento: string;
//   Link: string;
//   Nome: string;
//   Nota: number;
//   Oraculos: string;
//   Status: string;
// }

// interface ClientCommentsProps {
//   Atendente: {
//     Codigo: number;
//     Foto: string;
//     Link: string;
//     Nome: string;
//   },
//   Cliente:  {
//     Codigo: number,
//     Nome: string,
//   },
//   Depoimento: {
//     Codigo: number;
//     DataCadastro: Date;
//     Nota: number;
//     Texto: string;
//   }
// }

interface PriceProps {
  Codigo: number;
  Titulo: string;
  Valor: number;
}

export function SelectedAttendant({ route }: any) {
  const { attendant, mode } = route.params;
  const { selectedMode } = useAuth();
  const [serviceChannel, setServiceChannel] = useState(mode);
  const [selectedSalesPrice, setSelectedSalesPrice] = useState<any>();
  
  const [showSalesPrice, setshowSalesPrice] = useState(true);
  const [salesPrice, setSalesPrice] = useState([]);
  const { navigate, goBack } = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    api.get('comprar-pacotes-creditos/listagem/')
      .then((res) => {
        const price = res.data;
        setSelectedSalesPrice(price[0]),
        setSalesPrice(res.data)
      })
  }, []);

  async function handlePaymentOptions() {
    const price = salesPrice?.filter(
      (value: PriceProps) => {
        let val;
        if (selectedSalesPrice.Valor) {
          val = selectedSalesPrice.Valor
        } else {
          val = selectedSalesPrice
        }
        return value.Valor === val
      });
    await api.get('outros/formas-pagamento/')
      .then((res) => {
        const paymentMethods = res.data;
        navigate('PaymentOptions', { attendant, price, paymentMethods })
      });
  }

  async function handleChatService() {
    setServiceChannel('chat');
    selectedMode('chat');

    if (attendant.Cadastro.Status === 'DISPONIVEL') {
      async function callAPI() {
        try {
          if (api.defaults.headers.TOKEN) {
            navigate('ChatService', { attendant });
          } else {
            Alert.alert(
              "Consulta não disponível:",
              "Token do Cliente não encontrado, favor tentar novamente!")
          }
        } catch (error) {
          console.log(error);
        }
      }
      callAPI();
    } else {
      Alert.alert(
      "Consulta não disponível:",
        "O consultor não está disponível, tente novamente mais tarde!")
    }
  }

  async function handleCallService() {
    console.log('call activated!')
    setServiceChannel('call');
    selectedMode('call');

    if (attendant.Cadastro.Status === 'DISPONIVEL') {
      async function callAPI() {
        try {
          if (api.defaults.headers.TOKEN) {
            navigate('CallService', { attendant });
          } else {
            Alert.alert(
              "Consulta não disponível:",
              "Token do Cliente não encontrado, favor tentar novamente!")
          }
        } catch (error) {
          console.log(error);
        }
      }
      callAPI();
    } else {
      Alert.alert(
      "Consulta não disponível:",
        "O consultor não está disponível, tente novamente mais tarde!")
    }
  }

  async function handleVideocamService() {
    setServiceChannel('videocam');
    selectedMode('videocam');

    if (attendant.Cadastro.Status === 'DISPONIVEL') {
      async function callAPI() {
        try {
          if (api.defaults.headers.TOKEN) {
            navigate('VideoService', { attendant });
          } else {
            Alert.alert(
              "Consulta não disponível:",
              "Token do Cliente não encontrado, favor tentar novamente!")
          }
        } catch (error) {
          console.log(error);
        }
      }
      callAPI();
    } else {
      Alert.alert(
      "Consulta não disponível:",
        "O consultor não está disponível, tente novamente mais tarde!")
    }
  }

  async function handleMailService() {
    setServiceChannel('mail');
    selectedMode('mail');
    console.log('Mail service activated!!!!!')
    if (attendant.Cadastro.Status === 'DISPONIVEL') {
      async function callAPI() {
        try {
          if (api.defaults.headers.TOKEN) {
            navigate('CallService', { attendant });
          } else {
            Alert.alert(
              "Consulta não disponível:",
              "Token do Cliente não encontrado, favor tentar novamente!")
          }
        } catch (error) {
          console.log(error);
        }
      }
      callAPI();
    } else {
      Alert.alert(
      "Consulta não disponível:",
        "O consultor não está disponível, tente novamente mais tarde!")
    }
  }

  return (
    // <MotiView
    //   delay={200}
    //   from={{
    //     opacity: 0,
    //     translateY: 0
    //   }}
    //   animate={{
    //     opacity: 1,
    //     translateY: -300
    //   }}
    //   transition={{
    //     type: 'timing',
    //     duration: 2000
    //   }}
    // >
    <Container>
      <Separator>
        <BackButton
          style={{ marginLeft: -65 }}
          onPress={() => goBack()}
        >
          <Icon
            name="chevron-back"
          />
        </BackButton>
        <SeparatorText style={{ marginLeft: 40 }}>Consultor Selecionado</SeparatorText>
      </Separator>
      <AttendantWrapper>
        <PhotoWrapper>
          <Photo
            source={{ uri: `${attendant.Cadastro.Foto}` }}>
          </Photo>
        </PhotoWrapper>
        <Attendant>
          <Title>{attendant.Cadastro.Nome}</Title>
          <Availability
            type={attendant.Cadastro.Status}>{attendant.Cadastro.Status}
          </Availability>
        </Attendant>
      </AttendantWrapper>
      <Separator>
        <SeparatorText>Criar Atendimento</SeparatorText>
      </Separator>
      <ButtonWrapper>
        {attendant.FormasAtt.Telefone === 'DISPONIVEL' &&
          (
          <ButtonServiceChannel
            onPress={handleCallService}
          >
            <Icon
              name="call"
              style={{color: serviceChannel === 'call'
                ? theme.colors.secondary
                : "#fff", top: 4
              }}
            />
          </ButtonServiceChannel>
          )
        }
        {attendant.FormasAtt.Chat !== 'NAOATENDENTE' &&
          (
          <ButtonServiceChannel
            onPress={handleChatService}
          >
            <Icon
              name="ios-chatbubbles"
              style={{color: serviceChannel === 'chat' 
                ? theme.colors.secondary
                : "#fff", top: 4
              }}
            />
          </ButtonServiceChannel>
          )
        }
        {attendant.FormasAtt.Video === 'DISPONIVEL' &&
          (
          <ButtonServiceChannel
            onPress={handleVideocamService}
          >
            <Icon
              name="videocam"
              style={{color: serviceChannel === 'videocam' 
                ? theme.colors.secondary
                : "#fff", top: 4
              }}
            />
          </ButtonServiceChannel>
          )
        }
        {attendant.FormasAtt.Email !== 'NAOATENDENTE' &&
          (
          <ButtonServiceChannel
            onPress={handleMailService}
          >
            <Icon
              name="mail"
              style={{color: serviceChannel === 'mail' 
                ? theme.colors.secondary
                : "#fff", top: 4
              }}
            />
          </ButtonServiceChannel>
          )
        }
      </ButtonWrapper>

      <Separator>
        <SeparatorText>Selecione Tempo</SeparatorText>
      </Separator>

      {/* <OpenDataPickerButton onPress={handleToggleDatePicker}>
        <OpenDataPickerButtonText
          allowFontScaling={false}
          accessibilityLabel="Selecione o valor da compra"
        >
          Selecione o valor da compra
        </OpenDataPickerButtonText>
      </OpenDataPickerButton>     */}

      {/* <Button
        title="Selecione o valor da compra"
        onPress={() => setshowSalesPrice(!showSalesPrice)}
        enabled={!isLoading}
        loading={isLoading}
        color={theme.colors.primary}
        // style={{ borderRadius: 10, height: 20, width: 200 }}
      /> */}

      {showSalesPrice && (
          <PickerView>
            <PickerButton
            selectedValue={selectedSalesPrice}
            onValueChange={(item) => setSelectedSalesPrice(item)}
            >
              {
                salesPrice.map((item, index) =>
                  {
                  return <PickerButton.Item
                    value={item.Valor}
                    label={item.Titulo}
                    key={index} />
                  }
                )
              }
            </PickerButton>
         </PickerView>
      )}

      <ConfirmationButton>
        <Button
          title="Efetuar pagamento"
          onPress={handlePaymentOptions}
        />
      </ConfirmationButton>
    </Container>
  // </MotiView>
  )
    
}
