import styled, { css } from 'styled-components/native';
import { Platform, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { MotiImage as Image } from 'moti';

import { Ionicons } from '@expo/vector-icons';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';

interface TypeProps {
  type: 'DISPONIVEL' | 'OCUPADO';
}

const { width } = Dimensions.get('window');

export const Container = styled.View`
  flex: 1;
  margin-top: ${Platform.OS === 'ios' ? RFPercentage(6) : RFPercentage(4)}px;
  background-color: ${({ theme }) => theme.colors.shape};
`;

export const PhotoWrapper = styled.View`
`;

export const Photo = styled(Image).attrs({
  from: {
    rotate: '100deg',
    opacity: 0
  },
  animate: {
    rotate: '0deg',
    opacity: 1
  },
  transitions: {
    type: 'timing',
    duration: 5000,
    repeat: 5
  }
})`
  width: ${RFValue(210)}px;
  height: ${RFValue(210)}px;
  margin-top: 10px;
  margin-left: ${width / 2 - 105}px;
`;

export const AttendantWrapper = styled.View`
  margin-top: 5px;
`;

export const Attendant = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 6px 40px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${RFValue(16)}px;
  margin-left: 20px;
`;

export const Availability = styled.Text<TypeProps>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(12)}px;
  ${({ type }) => type === 'DISPONIVEL' && css`
    color: ${({ theme }) => theme.colors.success};
  `};

  ${({ type }) => type === 'OCUPADO' && css`
    color: ${({ theme }) => theme.colors.attention};
  `};
  text-transform: capitalize;
`;

export const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  /* margin-top: 10px; */
`;

export const ButtonServiceChannel = styled(RectButton)`
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: ${RFValue(44)}px;
  height: ${RFValue(44)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 25px;
  margin: 12px;
  padding-bottom: 5px;
`;

export const BackButton = styled(RectButton)`
  margin-top: 24px;
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.title};
  padding-left: 10px;
  font-size: 10px;
`;

export const Icon = styled(Ionicons)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${RFValue(22)}px;
`;

export const Separator = styled.SafeAreaView`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: ${RFValue(28)}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const SeparatorText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 18px;
  font-weight: bold;
`;

export const TimeTableText = styled.Text`
  text-align: center;
  text-transform: none;
  color: ${({ theme }) => theme.colors.text};
`;

export const ConfirmationButton = styled.View`
  width: 100%;
  padding: 4px 24px 24px;
`;

export const PickerView = styled.View`
  margin: ${Platform.OS === 'ios' ? RFValue(-26) : RFValue(0)}px;
  /* padding: 20px; */
  /* background-color: ${({ theme }) => theme.colors.background}; */
`;

export const PickerButton = styled(Picker)`
  /* font-family: ${({ theme }) => theme.fonts.regular}; */
  color: ${({ theme }) => theme.colors.secondary};
  /* font-size: 12px; */
`;

