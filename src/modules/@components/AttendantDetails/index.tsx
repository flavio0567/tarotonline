import React, { useState, useEffect, useRef } from 'react';
import { MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';
import he from 'he';
import { Rating } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components';
import { SafeAreaView } from 'react-native';
import { useAuth } from '../../../shared/hooks/auth';


import {
  Container,
  PhotoWrapper,
  Photo,
  Title,
  BackButton,
  Icon,
  StatusWrapper,
  IconStart,
  Availability,
  AttendantWrapper,
  Attendant,
  AttendantName,
  AttendantDescription,
  ProfileDetailsText,
  ButtonWrapper,
  Button,
  Separator,
  SeparatorText,
  TimeTableText,
  CommentView,
  CommentHeader,
  CommentNameView,
  CommentedBy,
  CommentDate,
  Comments,
  CommentsWrapper,
} from './styles';

interface Props {
  type: 'Disponível' | 'Em atendimento';
}

interface CadastroProps {
  Codigo: string;
  Descricao: string;
  Experiencia: string;
  Foto: string;
  Frase: string;
  HorarioAtendimento: string;
  Link: string;
  Nome: string;
  Nota: number;
  Oraculos: string;
  Status: string;
}

interface ClientCommentsProps {
  Atendente: {
    Codigo: number;
    Foto: string;
    Link: string;
    Nome: string;
  },
  Cliente:  {
    Codigo: number,
    Nome: string,
  },
  Depoimento: {
    Codigo: number;
    DataCadastro: Date;
    Nota: number;
    Texto: string;
  }
}

export function AttendantDetails({ route }: any) {
  const { item: attendant, clientComments, attendantCard } = route.params;
  const { navigate } = useNavigation();
  const { mode, selectedMode } = useAuth();
  const [serviceChannel, setServiceChannel] = useState(mode);
  const theme = useTheme();
  const description = sanitizeHTML(attendantCard.Descricao);
  const timeTable = attendantCard.HorarioAtendimento;
  const oracle = attendantCard.Oraculos;


  const { Cadastro } = attendant;
  const comments = clientComments.Dados;

  const [attendantDetails, setAttendantDetails] = useState<CadastroProps>({} as CadastroProps);

  const { goBack } = useNavigation();

  useEffect(() => {
    setAttendantDetails(Cadastro);

    clientComments.Dados.map((item: any) => {
      return (
        item.Atendente,
        item.Client,
        he.decode(item.Cliente.Nome.replace(/<[^>]*>?/gm, '')),
        item.Depoimento,
        he.decode(item.Depoimento.Texto.replace(/<[^>]*>?/gm, ''))
      );
    })
   }, []);

  function sanitizeHTML(text: string) {
    let sanitizedText = text.replace(/<[^>]*>?/gm, '');
    return he.decode(sanitizedText);
  }

  function handleSelection(mode: string) {
    selectedMode(mode);
    setServiceChannel(mode);
    navigate('SelectedAttendant', { mode, attendant });
  }
  
  return (
    <MotiView
      delay={200}
      from={{
        opacity: 0,
        translateY: 0
      }}
      animate={{
        opacity: 1,
        translateY: -300
      }}
      transition={{
        type: 'timing',
        duration: 2000
      }}
    >
    <Container>
      <AttendantWrapper>
        <PhotoWrapper>
          <Photo
            source={{ uri: `${attendantDetails.Foto}` }}>
          </Photo>
          <StatusWrapper>
            <Availability type={attendantDetails.Status}>{attendantDetails.Status}</Availability>
            {attendant.Cadastro.Nota &&
              <Rating  readonly imageSize={20} startingValue={attendant.Cadastro.Nota} />
            }
          </StatusWrapper>
        </PhotoWrapper>
        <Attendant>
          <AttendantName>
            <Title>{attendant.Cadastro.Nome}</Title>

            <BackButton onPress={() => goBack()}/>
          </AttendantName>
          <AttendantDescription>
            <ProfileDetailsText>{description}</ProfileDetailsText>
          </AttendantDescription>
          <ButtonWrapper>
            {attendant.FormasAtt.Telefone === 'DISPONIVEL' &&
              (
                <Button
                  onPress={() => handleSelection('call')}
                >
                  <Icon
                    name="call"
                    style={{color: mode === 'call'
                      ? theme.colors.secondary
                      : "#fff", top: 4
                    }}
                  />
                </Button>
              )
              }
            {attendant.FormasAtt.Chat !== 'NAOATENDENTE' &&
              (
                <Button
                  onPress={() => handleSelection('chat')}
                >
                  <Icon
                    name="ios-chatbubbles"
                    style={{color: mode === 'chat' 
                      ? theme.colors.secondary
                      : "#fff", top: 4
                    }}
                  />
                </Button>
              )
            }
            {attendant.FormasAtt.Video === 'DISPONIVEL' &&
              (
                <Button
                  onPress={() => handleSelection('videocam')}
                >
                  <Icon
                    name="videocam"
                    style={{color: mode === 'videocam' 
                      ? theme.colors.secondary
                      : "#fff", top: 4
                    }}
                  />
                </Button>
              )
            }
            {attendant.FormasAtt.Email !== 'NAOATENDENTE' &&
              (
                <Button
                  onPress={() => handleSelection('mail')}
                >
                  <Icon
                    name="mail"
                    style={{color: mode === 'mail' 
                      ? theme.colors.secondary
                      : "#fff", top: 4
                    }}
                  />
                </Button>
              )
            }
          </ButtonWrapper>
        </Attendant>
      </AttendantWrapper>
        <Separator>
        <SeparatorText>Horário</SeparatorText>
      </Separator>
      <TimeTableText>
        {timeTable}
      </TimeTableText>
      <Separator>
        <SeparatorText>Oráculos</SeparatorText>
      </Separator>
      <TimeTableText>
        {oracle}
      </TimeTableText>
      <Separator>
        <SeparatorText>Depoimentos</SeparatorText>
      </Separator>
      <SafeAreaView style={{ height: 300}}>
        <FlatList showsVerticalScrollIndicator={false} style={{ height: 500 }}
          data={comments}
          keyExtractor={(item) => item.index}
          renderItem={({ item: comment }) =>
          (
            <CommentsWrapper key={comment.index}>
              <CommentHeader>
                <CommentNameView>
                  <CommentedBy>
                    {comment.Cliente.Nome} 
                  </CommentedBy>
                </CommentNameView>
                <CommentDate>
                  {comment.Depoimento.DataCadastro}
                </CommentDate>
                <Rating
                  readonly
                  imageSize={14}
                  startingValue={comment.Depoimento.Nota}
                />
              </CommentHeader>
              <Comments>
                {comment.Depoimento.Texto}
              </Comments>
            </CommentsWrapper>
          )}
        />
      </SafeAreaView>
    </Container>
  </MotiView>
  )
    
}
