import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';

import * as Progress from 'react-native-progress';
import { WebView } from 'react-native-webview';

import {
  Container,
  Separator,
  BackButton,
  SeparatorText,
  Icon
} from './styles';
import { Platform } from 'react-native';

export function PaymentWebView({ route }: any) {
  const { Link, attendant, paymentMethods, price, mode } = route.params;

  const { navigate } = useNavigation();
  const theme = useTheme();

  const [progress, setProgress] = useState(0);
  const [isLoaded, setLoaded] = useState(false);

  const js = `window.alert('Você esta sendo direcionado para a site TarotOnline onde poderá realizar o pagamento contratado. A qualquer momento use a seta no canto superior esquerdo para retornar ao app!')`;

  const localFile = Platform.OS === 'ios' ? require('../../assets/chat.html') :
    { uri: 'file:///android_asset/chat.html' };
  
  return (
    <Container>
      <Separator>
        <BackButton
          onPress={() => navigate('SelectedAttendant', {attendant, mode})}
        >
          <Icon
            name="chevron-back"
          />
        </BackButton>
        <SeparatorText>Comprar Créditos</SeparatorText>
      </Separator>
      {!isLoaded &&
        <Progress.Bar
          borderWidth={0}
          borderRadius={0}
          color={theme.colors.secondary}
          progress={progress}
          width={null}
        />
      }
      <WebView
        source={{ uri: `${Link}` }}
        injectedJavaScriptBeforeContentLoaded={js}
        onError={(event) => alert(`WebView error ${event.nativeEvent.description}`)}
        onLoadProgress={(event) => setProgress(event.nativeEvent.progress)}
        onLoadEnd={() => setLoaded(true)}
        />
    </Container>
  )
}
