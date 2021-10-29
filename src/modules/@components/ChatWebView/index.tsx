import React, { useState } from 'react';
import * as Progress from 'react-native-progress';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';

import { WebView } from 'react-native-webview';

import {
  Container,
  Separator,
  BackButton,
  SeparatorText,
  Icon
} from './styles';
import { Platform } from 'react-native';

export function ChatWebView({ route }: any) {
  const { attendant, paymentMethods, price } = route.params;

  const { goBack } = useNavigation();
  const theme = useTheme();

  const [progress, setProgress] = useState(0);
  const [isLoaded, setLoaded] = useState(false);

  const localFile = Platform.OS === 'ios' ? require('../../assets/chat.html') :
    { uri: 'file:///android_asset/chat.html' };
  
  const INJECTED_JAVASCRIPT = `(function() {
    <script src="https://www.gstatic.com/firebasejs/5.8.3/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.8.3/firebase-database.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.8.3/firebase-auth.js"></script>
  })();`;
  
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
        source={localFile}
        injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
        onError={(event) => alert(`WebView error ${event.nativeEvent.description}`)}
        onLoadProgress={(event) => setProgress(event.nativeEvent.progress)}
        onLoadEnd={() => setLoaded(true)}
        />
    </Container>
  )
}
