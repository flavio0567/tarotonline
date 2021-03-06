import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {¬†NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { api } from '../shared/service/api';
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
} from './PaymentOptions/styles';

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
            "Forma de Pagamento N√£o Dispon√≠vel:",
            "Cliente entrou com login social e n√£o possui Token!")
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
                  <ImageIcon source={redeImg} />
                </BoxLogo>
                <BoxCards>
                  <CardView>
                    <FontAwesome
                      name="credit-card"
                      size={22}
                    />
                    <CardText>Cart√£o de Cr√©dito</CardText>
                  </CardView>
                  <BoxTimeToRelease style={{ marginTop: 42 }}>
                    <TimeToReleaseTextText>
                      Libera√ß√£o Imediata
                    </TimeToReleaseTextText>
                  </BoxTimeToRelease>
                </BoxCards>
              </Box>
              <Box onPress={() => handlePayment('PAYMEE')}>
                <BoxLogo>
                  <ImageIcon source={paymeeImg} />
                </BoxLogo>
                <BoxCards>
                  <MultiCardView>
                    <IconCardView>
                      <FontAwesome name="bank" size={20} />
                      <CardText>Transfer√™ncia</CardText>
                    </IconCardView>
                    <IconCardView>
                      <ImageIcon source={pixImg} />
                      <CardText style={{ marginTop: 4 }}>Pix</CardText>
                    </IconCardView>
                  </MultiCardView>
                  <BoxTimeToRelease style={{ marginTop: 4 }}>
                    <TimeToReleaseTextText>
                      Libera√ß√£o de 5 a 30 minutos
                    </TimeToReleaseTextText>
                  </BoxTimeToRelease>
                </BoxCards>
              </Box>
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
                    <CardText>Cart√£o de Cr√©dito</CardText>
                  </CardView>
                  <BoxTimeToRelease style={{ marginTop: 42 }}>
                    <TimeToReleaseTextText>
                      Libera√ß√£o Imediata
                    </TimeToReleaseTextText>
                  </BoxTimeToRelease>
                </BoxCards>
              </Box>
            </View>
            <View style={{
              width: 190,
            }}>
              <Box onPress={() => handlePayment('PAGSEGURO')}>
                <BoxLogo>
                  <ImageIcon source={pagseguroImg} />
                </BoxLogo>
                <BoxCards>
                  <MultiCardView>
                    <IconCardView>
                      <FontAwesome
                        name="credit-card"
                        size={24}
                        style={{ marginTop: -4 }}
                      />
                      <CardText style={{ marginTop: -2 }}>Cart√£o de Cr√©dito</CardText>
                    </IconCardView>
                    <IconCardView>
                      <ImageIcon source={pixImg} style={{ marginTop: -14 }} />
                      <CardText style={{ marginTop: -10 }}>Pix</CardText>
                    </IconCardView>
                    <IconCardView>
                      <ImageIcon source={barcodeImg} style={{ marginTop: -16 }} />
                      <CardText style={{ marginTop: -12 }}>Boleto</CardText>
                    </IconCardView>
                  </MultiCardView>
                  <BoxTimeToRelease style={{ marginTop: -6 }}>
                    <TimeToReleaseTextText>
                      Libera√ß√£o ap√≥s aprova√ß√£o
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
                      <FontAwesome name="bank" size={20} />
                      <CardText>Transfer√™ncia</CardText>
                    </IconCardView>
                    <IconCardView>
                      <ImageIcon source={pixImg} />
                      <CardText style={{ marginTop: 4 }}>Pix</CardText>
                    </IconCardView>
                  </MultiCardView>
                  <BoxTimeToRelease style={{ marginTop: 4 }}>
                    <TimeToReleaseTextText>
                      Libera√ß√£o ap√≥s aprova√ß√£o via WhatsApp
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
