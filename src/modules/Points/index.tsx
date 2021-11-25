import React from 'react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import theme from '../../shared/global/styles/theme';

import {
  Container,
  BoxSelection,
  SelectButton,
  ModalTextLabel,
  Title,
  TitleText,
  Separator,
  BackButton,
  Icon,
  IconBack
} from './styles';

type NavProps = NavigationProp<ParamListBase>;

export function Points() {
  const navigation = useNavigation<NavProps>();

  return (
    <Container>
      <Title>
        <BackButton
          onPress={() => navigation.goBack()}
        >
          <IconBack
            name="chevron-back"
          />
        </BackButton>
        <TitleText>Pontos</TitleText>
      </Title>
      <BoxSelection>
        <SelectButton onPress={() =>
          navigation.navigate('DetailsOfAnAttendant', {
            screen:
              'OtherOptions',
              params: { Link: 'https://www.tarotonline.com.br/Cliente/Pontos_Trocar.php'}

          })}>
          <Icon
            name="exchange-alt"
            style={{ color: theme.colors.shape, marginLeft: -26 }}
            />
          <ModalTextLabel>Trocar</ModalTextLabel>
        </SelectButton>
        <Separator />
        <SelectButton onPress={() =>
          navigation.navigate('DetailsOfAnAttendant', {
            screen:
              'OtherOptions',
              params: { Link: 'https://www.tarotonline.com.br/Cliente/Pontos_Relatorio.php'}

          })}>
          <Icon
            name="file-alt"
            style={{ color: theme.colors.shape}}
          />
          <ModalTextLabel>Relatório</ModalTextLabel>
        </SelectButton>
      </BoxSelection>
    </Container>
  )
}
