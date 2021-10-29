import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../shared/service/api';
import { Alert, FlatList } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import LogoSvg from '../assets/tarotonline_logo.svg';
import { useTheme } from 'styled-components';

import Intl from 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import redeImg from '../assets/rede.png';
import paymeeImg from '../assets/paymee.png';
import paypalImg from '../assets/paypal.png';
import pagseguroImg from '../assets/pagseguro.png';
import pixImg from '../assets/pix.png';
import barcodeImg from '../assets/barcode.png';
import tarotImg from '../assets/tarot.png';

import {
  Container,
  Header,
  LogoView,
  SafeView,
  CardIcon,
  IconView,
  IconText,
  SelectionText,
  Content,
  Box,
  BoxLogo,
  BoxCards,
  BoxTimeToRelease,
  TimeToReleaseTextText,
  ImageIcon,
  CardView,
  CardText,
  MultiCardView,
  TitleView,
  IconCardView,
  ImagePagSeguroView,
} from './styles';

type Props = {
    [key: string]: string;
}

export function PaymentOptions({ route }: any) {
  const { attendant, price, paymentMethods } = route.params;
  console.log('forma de pagto:',paymentMethods)
  const { navigate } = useNavigation();

  const theme = useTheme();

  let formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'BRL'
  })

  function handlePayment(mode: string) {
    let packetCode: string;

    if (mode === 'tarotonline') {
      packetCode = 'DEP';
    } else {
      packetCode = mode;
    }

    async function callAPI() {
      try {
        const token = await AsyncStorage.getItem(
          '@TarotOnline:token');
        
        if (token) {
          await api.post(`comprar-pacotes-creditos/${price[0].Codigo}/`, {
            "CodigoFormaPagamento": packetCode
          }).then((res) => {
            const { Link } = res.data;
            navigate('PaymentWebView', { price, Link, attendant, paymentMethods });
          })
        } else {
          Alert.alert(
            "Forma de Pagamento Não Disponível:",
            "Cliente entrou com login social e não possui Token!")
        }
      } catch (error) {
        console.log(error);
      }
    }
    callAPI();
    
  }

  return (
    <Container>
      <Header>
        <LogoView>
          <LogoSvg />
        </LogoView>
      </Header>
      <SafeView>
      <IconView>
        <CardIcon />
          <IconText>{formatter.format(price[0].Valor)}</IconText>
      </IconView>
      </SafeView>
      <SafeView>
      <SelectionText>
        Selecione a opção desejada
      </SelectionText>
      </SafeView>
      {/* <Content> */}
      <FlatList
        data={paymentMethods}
        numColumns={2}
        keyExtractor={item => item}
        renderItem={() => {
          return (
            paymentMethods.map((payment: { Codigo: string, Titulo: string }) => (
              payment.Codigo === 'Rede_Credito' &&
              (
                <Box onPress={() => handlePayment('Rede_Credito')}>
                  <BoxLogo>
                    <ImageIcon source={redeImg} />
                  </BoxLogo>
                  <BoxCards>
                    <CardView>
                      <FontAwesome
                        name="credit-card"
                        size={22}
                      />
                      <CardText>{payment.Titulo}</CardText>
                    </CardView>
                    <BoxTimeToRelease style={{ marginTop: 42 }}>
                      <TimeToReleaseTextText>
                        Liberação Imediata
                      </TimeToReleaseTextText>
                    </BoxTimeToRelease>
                  </BoxCards>
                </Box>
              )
            )),
            paymentMethods.map((payment: { Codigo: string, Titulo: string }) => (
              payment.Codigo === 'PAYMEE' &&
              (
                <Box onPress={() => handlePayment('PAYMEE')}>
                  <BoxLogo>
                    <ImageIcon source={paymeeImg} />
                  </BoxLogo>
                  <BoxCards>
                    <MultiCardView>
                      <IconCardView>
                        <FontAwesome name="bank" size={20} />
                        <CardText>Transferência</CardText>
                      </IconCardView>
                      <IconCardView>
                        <ImageIcon source={pixImg} />
                        <CardText style={{ marginTop: 4 }}>Pix</CardText>
                      </IconCardView>
                    </MultiCardView>
                    <BoxTimeToRelease style={{ marginTop: 36 }}>
                      <TimeToReleaseTextText>
                        Liberação de 5 a 30 minutos
                      </TimeToReleaseTextText>
                    </BoxTimeToRelease>
                  </BoxCards>
                </Box>
              )
            )),
            paymentMethods.map((payment: { Codigo: string, Titulo: string }) => (
              payment.Codigo === 'PAYPAL' &&
              (
                <Box onPress={() => handlePayment('PAYPAL')}>
                  <BoxLogo>
                    <ImageIcon source={paypalImg} />
                  </BoxLogo>
                  <BoxCards>
                    <CardView>
                      <FontAwesome
                        name="credit-card"
                        size={24}
                      />
                      <CardText>Cartão de Crédito</CardText>
                    </CardView>
                    <BoxTimeToRelease style={{ marginTop: 42 }}>
                      <TimeToReleaseTextText>
                        Liberação Imediata
                      </TimeToReleaseTextText>
                    </BoxTimeToRelease>
                  </BoxCards>
                </Box>
              )
            )),
            paymentMethods.map((payment: { Codigo: string, Titulo: string }) => (
              payment.Codigo === 'PAGSEGURO' &&
              (
                <Box onPress={() => handlePayment('PAGSEGURO')}>
                  <CardView>
                    <ImageIcon source={pagseguroImg} />
                    <IconCardView>
                      <FontAwesome
                        name="credit-card"
                        size={24}
                        style={{
                          color: theme.colors.secondary,
                          // marginLeft: 40
                        }}
                      />
                      <ImagePagSeguroView>
                        <ImageIcon source={pixImg} />
                        <ImageIcon source={barcodeImg} />
                      </ImagePagSeguroView>
                    </IconCardView>
                  </CardView>
                  <TitleView>
                    <CardText>{payment.Titulo}</CardText>
                  </TitleView>
                </Box>
              )
            )),
            paymentMethods.map((payment: { Codigo: string, Titulo: string }) => (
              payment.Codigo === 'PIX' &&
              (
                <Box onPress={() => handlePayment('tarotonline')}>
                  <BoxLogo>
                    <ImageIcon source={tarotImg} />
                  </BoxLogo>
                  <BoxCards>
                    <MultiCardView>
                      <IconCardView>
                        <FontAwesome name="bank" size={20} />
                        <CardText>Transferência</CardText>
                      </IconCardView>
                      <IconCardView>
                        <ImageIcon source={pixImg} />
                        <CardText style={{ marginTop: 4 }}>Pix</CardText>
                      </IconCardView>
                    </MultiCardView>
                    <BoxTimeToRelease>
                      <TimeToReleaseTextText>
                        Liberação após aprovação via WhatsApp
                      </TimeToReleaseTextText>
                    </BoxTimeToRelease>
                  </BoxCards>
                </Box>
              )
            ))
          )
        }}
      />
        {/* </Content> */}
    </Container>
  )
}
