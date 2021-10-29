import React from 'react';
import LottieView from 'lottie-react-native';
import { useTheme } from 'styled-components';
import loadAnimation from '../../../modules/assets/tarot.json';

import { Container } from './styles';

export function LoadAnimation() {
  const theme = useTheme();

  return (
    <Container>
      <LottieView
        source={loadAnimation}
        style={{ height: 200, backgroundColor: theme.colors.secondary }}
        resizeMode="contain"
        autoPlay
        loop
      />
    </Container>
  )
}
