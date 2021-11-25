import React, { useCallback } from 'react';
import { useTheme } from 'styled-components';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Dashboard } from '../../modules/Dashboard';
import { Credits } from '../../modules/Credits';
import { Historic } from '../../modules/Historic';
import { Points } from '../../modules/Points';
import { AttendantDetails } from '../../modules/@components/AttendantDetails';
import { SelectedAttendant } from '../../modules/SelectedAttendant';
import { PaymentOptions } from '../../modules/PaymentOptions';
import { PaymentWebView } from '../../modules/@components/PaymentWebView';
import { VideoService } from '../../modules/@components/VideoService';
import { CallService } from '../../modules/@components/CallService';
import { EmailService } from '../../modules/@components/EmailService';
import { ChatService } from '../../modules/@components/ChatService';
import { OtherOptionsWebView } from '../../modules/@components/OtherOptionsWebView';

 type IconsVariation = {
  [key: string]: keyof typeof MaterialCommunityIcons.glyphMap; 
 }

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();

  const MainTab = useCallback(() => {
    return (
      <Tab.Navigator>
        <Tab.Group
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              const icons: IconsVariation = {
                Consultar: 'cards-playing-outline',
                Créditos: 'cart-outline',
                Histórico: 'text-to-speech',
                Pontos: 'currency-brl'
              };
          
              return (
                <MaterialCommunityIcons
                  name={icons[route.name]}
                  color={color}
                  size={size}
                />
              );
            },
            tabBarActiveTintColor: theme.colors.secondary,
            tabBarInactiveTintColor: theme.colors.primary
          })
          }
        >
          <Tab.Screen
            name="Consultar"
            component={Dashboard}
          />
          <Tab.Screen
            name="Histórico"
            component={Historic}
          />
          <Tab.Screen
            name="Créditos"
            component={Credits}
            options={{
              tabBarItemStyle: {
                width: 10
              }
            }}
          />
          <Tab.Screen
            name="Pontos"
            component={Points}
          />
        </Tab.Group>
      </Tab.Navigator>
    )
  }, []);
    
  const AttendantDetailsStack = useCallback(() => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="AttendantDetails"
          component={AttendantDetails}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="SelectedAttendant"
          component={SelectedAttendant}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="PaymentOptions"
          component={PaymentOptions}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="PaymentWebView"
          component={PaymentWebView}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="OtherOptions"
          component={OtherOptionsWebView}
          options={{
            headerShown: false
          }}
        /> 
        <Stack.Screen
          name="ChatService"
          component={ChatService}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="VideoService"
          component={VideoService}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="CallService"
          component={CallService}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="EmailService"
          component={EmailService}
          options={{
            headerShown: false
          }}
        />  
      </Stack.Navigator>
    )
  }, []);
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainTab}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="DetailsOfAnAttendant"
        component={AttendantDetailsStack}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}
