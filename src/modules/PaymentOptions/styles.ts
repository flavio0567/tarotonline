import styled from 'styled-components/native';
import { Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { RFValue } from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.SafeAreaView`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  margin-right: 64px;
`;

export const LogoView = styled.View`
  margin-left: 10px;
`;

export const SafeView = styled.View`
  align-items: center;
  margin-top: ${RFValue(10)}px;
`;

export const BackButton = styled(RectButton)`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Icon = styled(Ionicons)`
  margin-top: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${RFValue(22)}px;
`;

export const Content = styled.ScrollView.attrs({
  contentContainerStyle: {
    // marginLeft: 10,
    paddingBottom: 10
  },
  showsVerticalScrollIndicator: false
})``;


export const IconView = styled.View`
  width: ${Platform.OS === 'ios' ? RFValue(74) : RFValue(97)}px;
  height: ${Platform.OS === 'ios' ? RFValue(74) : RFValue(97)}px;
  justify-content: center;
  align-items: center;
  border-radius: ${Platform.OS === 'ios' ? RFValue(36) : RFValue(50)}px;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 10px;
`;

export const CreditImage = styled.Image`
  margin: 4px;
`;

export const BankImage = styled.Image`
  margin: 12px;
`;

export const CardIcon = styled(Ionicons).attrs({
  name: "cart-outline"
})`
  font-size: 30px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const IconText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  font-family: ${({ theme}) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.shape};
`;

export const SelectionText = styled.Text`
  font-size: 16px;
  font-family: ${({ theme}) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Box = styled(RectButton)`
  width: ${RFValue(154)}px;
  height: ${RFValue(152)}px;
  border-radius: 10px;
  margin: 10px;
`;

export const BoxLogo = styled.View`
  width: ${RFValue(154)}px;
  height: ${RFValue(42)}px;
  align-items: center;
  justify-content: center;

  background: #F6F6F6;
  border-radius: 6px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: solid 2px ${({ theme }) => theme.colors.secondary};
`;

export const ImageIcon = styled.Image`
  margin: ${Platform.OS === 'ios' ? RFValue(6) : RFValue(4)}px;
`;

export const BoxCards = styled.View`
  width: ${RFValue(154)}px;
  height: ${RFValue(114)}px;
  margin-top: 3px;
  border-radius: 6px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const CardView = styled.View`
  flex-direction: row;
  margin: 10px;
  padding-top: 6px;
`;

export const CardText = styled.Text`
  width: ${RFValue(120)};
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  padding-left: 4px;
  margin-top: 8px;
`;

export const MultiCardView = styled.View`
  flex-direction: column;
`;

export const BoxTimeToRelease = styled.View`
  margin: 4px;
  border-radius: 5px;
  background-color: ${({ theme}) => theme.colors.primary_dark};
`;

export const TimeToReleaseTextText = styled.Text`
  font-size: ${RFValue(11)};
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.attention};
  text-align: center;
  padding: 4px;
`;

export const IconCardView = styled.View`
  flex-direction: row;
  padding: 8px;
`;
