import styled from 'styled-components/native';
import { Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { RFValue } from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View``;

export const LogoView = styled.View`
  align-items: center;
  margin-top: ${Platform.OS === 'ios' ? getStatusBarHeight() + RFValue(14) : RFValue(16)}px;
`;

export const SafeView = styled.View`
  align-items: center;
  margin-top: ${RFValue(10)}px;
`;

export const Content = styled.ScrollView`
  padding-left: ${Platform.OS === 'ios' ? RFValue(10) : RFValue(8)}px;
`;

export const IconView = styled.View`
  width: ${Platform.OS === 'ios' ? RFValue(74) : RFValue(97)}px;
  height: ${Platform.OS === 'ios' ? RFValue(74) : RFValue(97)}px;
  justify-content: center;
  align-items: center;
  border-radius: ${Platform.OS === 'ios' ? RFValue(36) : RFValue(50)}px;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 10px;
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
  width: ${RFValue(142)}px;
  height: ${RFValue(152)}px;
  border-radius: 10px;
  margin: 10px;
`;

export const BoxLogo = styled.View`
  width: ${RFValue(142)}px;
  height: ${RFValue(42)}px;
  align-items: center;
  justify-content: center;

  background: #F6F6F6;
  border-radius: 6px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: solid 2px ${({ theme }) => theme.colors.secondary};
`;

export const ImageIcon = styled.Image`
  /* margin: ${Platform.OS === 'ios' ? RFValue(10) : RFValue(4)}px; */
`;

export const BoxCards = styled.View`
  width: ${RFValue(142)}px;
  height: ${RFValue(110)}px;
  margin-top: 2px;
  border-radius: 6px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const CardView = styled.View`
  flex-direction: row;
  margin: 10px;
  padding-top: 10px;
`;

export const CardText = styled.Text`
  width: ${RFValue(120)};
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.primary};
  padding-left: 8px;
  margin-top: 4px;
`;


export const MultiCardView = styled.View`
  flex-direction: column;
`;

export const BoxTimeToRelease = styled.View`
  margin: 6px;
  border-radius: 5px;
  background-color: ${({ theme}) => theme.colors.primary};
`;

export const TimeToReleaseTextText = styled.Text`
  font-size: ${RFValue(11)};
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.attention};
  text-align: center;
  padding: 4px;
`;

export const TitleView = styled.View`
  color: ${({ theme }) => theme.colors.title};
`;

export const IconCardView = styled.View`
  flex-direction: row;
  padding: 8px;
`;

export const ImagePagSeguroView = styled.View`
  flex-direction: row;
  margin-top: -10px;
`;