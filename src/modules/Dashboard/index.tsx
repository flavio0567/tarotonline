import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../../shared/hooks/auth';
import { api } from '../../shared/service/api';

import { LoadAnimation } from '../../shared/components/LoadAnimation';
import { AttendantCard } from '../@components/AttendantCard';
import { AttendantDTO } from '../../dtos/AttendantDTO';

import {
  Container,
  Header,
  SearchAttendant,
  UserWrapper,
  UserInfo,
  Button,
  Photo,
  User,
  UserGreeting,
  UserName,
  SideWrapper,
  BalanceView,
  BalanceText,
  Icon,
  SearchView,
  AttendantList,
} from './styles';

export function Dashboard() {
  const [attendants, setAttendants] = useState<AttendantDTO[]>([]);
  const [pagination, setPagination] = useState([]);
  const [page, setPage] = useState(0);
  const [pricePerMinute, setPricePerMinute] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  
  // const [selectedLanguage, setSelectedLanguage] = useState(
  //   'Pesquise seu Consultor por Especialidade');
  // const pickerRef = useRef();

  // function Open() {
  //   pickerRef.current.focus();
  // }
  
  // function Close() {
  //   pickerRef.current.blur();
  // }

  useEffect(() => {
    let isMounted = true;

    const { APIKEY } = process.env;
    api.defaults.headers.APIKEY = APIKEY;

    async function fetchAttendants() {
      const [user, token] = await AsyncStorage.multiGet([
        '@TarotOnline:user',
        '@TarotOnline:token',
      ]);

      if (user && token) {
        try {
          await api.get('atendentes/',
            { params: { 'PaginaAtual': 1, 'QtdPaginas': 200 } })
            .then((res) => {
              if (isMounted) {
                const { Dados, Paginacao } = res.data;

                setPagination(Paginacao);
                
                api.get('outros/valor-por-minutos/')
                  .then((res) => {
                    const { Chat } = res.data;
                    setPricePerMinute(Chat);
                    const returnedAttendant = Dados.map(({ ...rest }) => {
                      return {
                        ValorPorMinuto: Chat,
                        ...rest
                      }
                    })
                    setAttendants(returnedAttendant);
                  })
              }
            });
        } catch (error) {
          console.log('Error:', error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };
    fetchAttendants();

    return () => {
      isMounted = false;
    }
  }, []);

  const handleSignOut = useCallback(() => {
      Alert.alert(
        'Sair do App',
        'Você está saindo do app de forma segura, confirma?',
        [
          {
            text: 'Sim', onPress: () => (signOut())
          },
          {
            text: 'Não',
          },
        ],
        { cancelable: false },
      );
  }, []);

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            {user.avatar
              ? (
                <Photo
                  source={{ uri: user.avatar }}>
                </Photo>
              ) : (
                <Photo
                  source={{ uri: `https://ui-avatars.com/api/?name=${user.name}` }}>
                </Photo>
              )}
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>{user.name}</UserName>
            </User>
          </UserInfo>
          <SideWrapper>
            <Button
              onPress={handleSignOut}
            >
              <Icon
                size={16}
                style={{ color: "#E83F5B", top: 4 }}
              />
            </Button>
            <BalanceView>
              <BalanceText>Meu Saldo</BalanceText>
              <BalanceText>R$ {user.qtdcreditos}</BalanceText>
            </BalanceView>
          </SideWrapper>
         </UserWrapper>
      </Header>
      {/* <Text>Selecione seu Consultor pela Especialidade</Text> */}
      {/* <SearchAttendant
        // ref={pickerRef}
        numberOfLines={1}
        mode="dropdown"
        selectedValue={selectedLanguage}
        onValueChange={(_itemValue, itemIndex) =>
          handlSearchAttendant(_itemValue)
        }>
        {values.map((v, i) => {
          return (
            <SearchAttendant mode="dropdown">
              <SearchAttendant.Item label="21" value="21" ></SearchAttendant.Item>
            </SearchAttendant>
            )
          })}
      </SearchAttendant> */}
      {/* <SearchView>
        <Search />
      </SearchView> */}
      {loading
        ?
        <LoadAnimation />
        :
        <AttendantList
          data={attendants}
          numColumns={1}
          keyExtractor={(att : any, index: number) => String(index)}
          renderItem={(att) => <AttendantCard attendant={att} />}
        />
      }
    </Container>
  );
}
