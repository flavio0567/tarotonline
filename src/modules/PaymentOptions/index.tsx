import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { api } from '../../shared/service/api';
import { Alert, View, Dimensions } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import LogoSvg from '../assets/tarotonline_logo.svg';

import Intl from 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import redeImg from '../assets/rede.png';
import paymeeImg from '../assets/paymee.png';
import paypalImg from '../assets/paypal.png';
import pagseguroImg from '../assets/pagseguro.png';
import pixImg from '../assets/pix.png';
import barcodeImg from '../assets/barcode.png';
import tarotImg from '../assets/tarot.png';
import creditImg from '../assets/credit.png';
import bankImg from '../assets/bank.png';

import {
  Container,
  Header,
  BackButton,
  Icon,
  LogoView,
  SafeView,
  CardIcon,
  IconView,
  IconText,
  CreditImage,
  BankImage,
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
  IconCardView,
} from './styles';

type NavProps = NavigationProp<ParamListBase>;

export function PaymentOptions({ route }: any) {
  const { attendant, price, paymentMethods } = route.params;
  const { width } = Dimensions.get('window');
  const navigation = useNavigation<NavProps>();
  
  const formatter = new Intl.NumberFormat([], {
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
            navigation.navigate('PaymentWebView', { price, Link, attendant, paymentMethods });
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
        <BackButton
          onPress={() => navigation.goBack()}
        >
          <Icon
            name="chevron-back"
          />
        </BackButton>
        <LogoView>
          <LogoSvg
              width={width/1.6}
          />
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
        Selecione a forma de pagamento
      </SelectionText>
      </SafeView>
      <Content>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{
            flexGrow: 1,
          }}>
            <Box onPress={() => handlePayment('Rede_Credito')}>
              <BoxLogo>
                <ImageIcon source={redeImg} style={{ marginLeft: 55, marginTop: 3.5 }} />
              </BoxLogo>
              <BoxCards>
                <CardView
                  style={{ marginTop: 30 }}
              >
                <CreditImage source={creditImg} />
                  <CardText>Cartão de Crédito</CardText>
                </CardView>
                <BoxTimeToRelease style={{ marginTop: 18 }}>
                  <TimeToReleaseTextText>
                    Liberação Imediata
                  </TimeToReleaseTextText>
                </BoxTimeToRelease>
              </BoxCards>
            </Box>
            <Box onPress={() => handlePayment('PAYMEE')}>
              <BoxLogo>
                <ImageIcon source={paymeeImg} style={{ marginTop: 16, marginLeft: 15 }}/>
              </BoxLogo>
              <BoxCards>
                <MultiCardView>
                  <IconCardView>
                    <BankImage source={bankImg}/>
                    <CardText style={{ marginTop: 14 }}>Transferência</CardText>
                  </IconCardView>
                  <IconCardView>
                    <ImageIcon source={pixImg} style={{ marginTop: -8, marginLeft: 12 }} />
                    <CardText style={{ marginTop: 0-4, marginLeft: 6 }}>Pix</CardText>
                  </IconCardView>
                </MultiCardView>
                <BoxTimeToRelease style={{ marginTop: -2 }}>
                  <TimeToReleaseTextText>
                    Liberação de 5 a 30 minutos
                  </TimeToReleaseTextText>
                </BoxTimeToRelease>
              </BoxCards>
            </Box>
            <Box onPress={() => handlePayment('PAYPAL')}>
              <BoxLogo>
                <ImageIcon source={paypalImg} />
              </BoxLogo>
              <BoxCards>
                <CardView
                  style={{ marginTop: 30 }}
              >
                <CreditImage source={creditImg} />
                  <CardText>Cartão de Crédito</CardText>
                </CardView>
                <BoxTimeToRelease style={{ marginTop: 18 }}>
                  <TimeToReleaseTextText>
                    Liberação Imediata
                  </TimeToReleaseTextText>
                </BoxTimeToRelease>
              </BoxCards>
            </Box>
          </View>
          <View style={{
            width: 196,
          }}>
            <Box onPress={() => handlePayment('PAGSEGURO')}>
              <BoxLogo>
                <ImageIcon source={pagseguroImg} />
              </BoxLogo>
              <BoxCards>
                <MultiCardView>
                <IconCardView>
                  <CreditImage source={creditImg} style={{ margin: 5 }} />
                    <CardText style={{ marginTop: 9 }}>Cartão de Crédito</CardText>
                  </IconCardView>
                  <IconCardView>
                    <ImageIcon source={pixImg} style={{ marginTop: -16, marginLeft: 10 }} />
                    <CardText style={{ marginTop: -12, marginLeft: 8 }}>Pix</CardText>
                  </IconCardView>
                  <IconCardView>
                    <ImageIcon source={barcodeImg} style={{ marginTop: -20, marginLeft: 10 }} />
                    <CardText style={{ marginTop: -14, marginLeft: 6 }}>Boleto</CardText>
                  </IconCardView>
                </MultiCardView>
                <BoxTimeToRelease style={{ marginTop: -12 }}>
                  <TimeToReleaseTextText>
                    Liberação após aprovação
                  </TimeToReleaseTextText>
                </BoxTimeToRelease>
              </BoxCards>
            </Box>
            <Box onPress={() => handlePayment('tarotonline')}>
              <BoxLogo>
                <ImageIcon source={tarotImg} />
              </BoxLogo>
              <BoxCards>
                <MultiCardView>
                  <IconCardView>
                    <BankImage source={bankImg} style={{ marginTop: 6 }} />
                    <CardText style={{ marginTop: 10 }}>Transferência</CardText>
                  </IconCardView>
                  <IconCardView>
                    <ImageIcon source={pixImg} style={{ marginTop: -14, marginLeft: 12 }} />
                    <CardText style={{ marginTop: -10, marginLeft: 6 }}>Pix</CardText>
                  </IconCardView>
                </MultiCardView>
                <BoxTimeToRelease style={{ marginTop: -4 }}>
                  <TimeToReleaseTextText>
                    Liberação após aprovação via WhatsApp
                  </TimeToReleaseTextText>
                </BoxTimeToRelease>
              </BoxCards>
            </Box>      
          </View>
        </View>
      </Content>
    </Container>
  )
}
