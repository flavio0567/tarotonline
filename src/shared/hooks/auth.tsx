import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Facebook from 'expo-facebook';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

import { api } from '../service/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  qtdcreditos: number;
}

interface Token {
  token: string;
  expiration: Date;
}

interface AuthState {
  user: User;
  token: Token;
}

interface SignInCredentials {
  email: string;
  password: string;
}
  
interface AuthContextData {
  user: User;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signInWithApple(): Promise<void>;
  signInWithGoogle(): Promise<void>;
  signInWithFacebook(): Promise<void>;
  signOut(): Promise<void>;
  loading: boolean;
  selectedMode: (mode: string) => Promise<void>;
  mode: string;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

interface AuthorizationFacebookResponse {
  token: string;
  type: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [mode, setMode] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function clearAll(): Promise<void> {
      await AsyncStorage.multiRemove([
        '@TarotOnline:user',
        '@TarotOnline:token'
      ]);
    }
    clearAll();
  }, []);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [user, token] = await AsyncStorage.multiGet([
        '@TarotOnline:user',
        '@TarotOnline:token',
      ]);

      const { APIKEY } = process.env;
      api.defaults.headers.APIKEY = APIKEY;
      
      if (user[1] && token[1]) {
        api.defaults.headers.TOKEN = JSON.parse(token[1]).token;

        setData({
          user: JSON.parse(user[1]),
          token: {
            token: JSON.parse(token[1]).token,
            expiration: new Date()
          }
        });
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });
      if (credential) {
        const name = credential.fullName!.givenName!;
        const avatar = `https://ui-avatars.com/api/?name=${name}&length=1`;

        const dataValues = {
          id: String(credential.user),
          email: credential.email!,
          name,
          avatar,
          qtdcreditos: 0,
        };

        // const tokenApple: Token = {
        //   token: credential.identityToken!,
        //   expiration: new Date
        // }

        try {
          if (name) {
            await AsyncStorage.setItem(
              '@TarotOnline:user', JSON.stringify(dataValues),
            );
            setData({ user: dataValues, token: {token: '', expiration: new Date('')} });
          } else {
            const userLoaded = await AsyncStorage.getItem(
              '@TarotOnline:user');
            // await AsyncStorage.setItem(
            //   '@TarotOnline:token', JSON.stringify(tokenApple),
            // );
            setData({ user: JSON.parse(userLoaded!), token: {token: '', expiration: new Date('')} });
          }
        } catch (error) {
          console.log('Cant set asyncstorage credentials:', error);
          Alert.alert("Não foi possível armazenar seus dados no dispositivo!");
        }
      }
    } catch (error: any) {
      console.log('Social athentication is not working:', error);
      throw new Error(error);
    }
  }
  
  async function signInWithFacebook() {
    try {
      const { facebookAppId } = process.env;

      await Facebook.initializeAsync({ appId: facebookAppId });
      
      const data = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });
      
      if (data.type === 'success') {
        const response = await fetch(
          `https://graph.facebook.com/me?fields=id,name,picture.type(large),email&access_token=${data.token}`
        );
        const userInfo = await response.json();
        // console.log('fb_userInfo:', userInfo, userInfo.picture.data.url);
        setData({
          user: {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.picture.data.url,
            qtdcreditos: 0,
          },
          token: { token: '', expiration: new Date('') }
        });


      }
    } catch (error: any) {
      console.log('Social athentication is not working:', error);
      throw new Error(error);
    }
  }

  async function signInWithGoogle() {
    try {
      const { CLIENT_ID } = process.env;
      const { REDIRECT_URI } = process.env;
      const RESPONSE_TYPE = 'token'
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
      
      const { type, params } = await AuthSession
        .startAsync({ authUrl }) as AuthorizationResponse;
      
      if (type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();
        
        const dataValues = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          avatar: userInfo.picture,
          qtdcreditos: 0,
        }

        try {
          await AsyncStorage.setItem(
            '@TarotOnline:user', JSON.stringify(dataValues)
          );

          setData({ user: dataValues, token: { token: '', expiration: new Date('') } });
        } catch (error) {
          console.log('Cant set asyncstorage credentials:', error);
          Alert.alert("Não foi possível armazenar seus dados no dispositivo.");
        }
      } else {
        console.log('retorno do google por desistencia:');
      }
    } catch (error: any) {
      console.log('Social athentication is not working:', error);
      throw new Error(error);
    }
  }

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const { APIKEY } = process.env;
      api.defaults.headers.APIKEY = APIKEY;

      const signInResponse = await api.post('autenticacao/login/', {
        Email: email,
        Senha: password,
      });
      
      const { Token, DataExpiracao } = signInResponse.data;

      api.defaults.headers.TOKEN = Token;

      try {
        const authenticationResponse = await api
          .get('autenticacao/detalhes-cliente/');
    
        const { Codigo, Email, Nome, QtdCreditos } = authenticationResponse.data;
        
        const dataValues = {
          id: Codigo,
          email: Email,
          name: Nome,
          qtdcreditos: QtdCreditos
        }

        try {
          await AsyncStorage.multiSet([
            ['@TarotOnline:user', JSON.stringify(dataValues)],
            ['@TarotOnline:token', JSON.stringify({ Token, DataExpiracao})],
          ]);

          setData({user: dataValues, token: Token });
        } catch (error) {
          console.log('Cant set asyncstorage credentials:', error);
          Alert.alert("Não foi possível armazenar seus dados no dispositivo.");
        }
      } catch (err) {
        console.log('Could not get client informations:', err);
        Alert.alert('Erro ao obter detalhes do cliente!')
      }
    } catch (error) {
      console.log('Could not login on app:', error);
      Alert.alert('Erro ao tentar realizar Login no app, verifique suas credenciais!');
    }

  }

  async function signOut() {
    await AsyncStorage.multiRemove([
      // '@TarotOnline:user', retirado por conta do login Apple que so entrega o nome no primeiro acesso
      '@TarotOnline:token', 
    ]);

    setData({} as AuthState);
  }

  async function selectedMode(mode: string) {
    setMode(mode);
  }

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        selectedMode,
        mode,
        signIn,
        signInWithApple,
        signInWithFacebook,
        signInWithGoogle,
        signOut,
        loading
      }}  
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };