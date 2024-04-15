import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';

export default function VerTalhao() {
  const navigation = useNavigation();
  const route = useRoute();
  const [idtalhao, setIdTalhao] = useState(null);
  const [talhao, setTalhao] = useState(null);
  const [filteredArmadilhas, setFilteredArmadilhas] = useState([]);

  const [nome, setNome] = useState('');
  const [tipoPlantacao, setTipoPlantacao] = useState('');

  const handleSeeMore = (talhaoId) => {
    navigation.navigate('EditarTalhao', { talhaoId: talhaoId });
  };

  const handleArmadilha = (armadilhaId) => {
    navigation.navigate('EditarArmadilha', { armadilhaId: armadilhaId });
  };

  const handleCadastro = () => {
    navigation.navigate('CriarArmadilha', { talhaoId: idtalhao});
  };

  useEffect(() => {
    const fetchTalhao = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { talhaoId } = route.params;
      setIdTalhao(talhaoId)
      try {
        const response = await axios.get(`http://10.0.2.2:3000/talhao/completo/${talhaoId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setTalhao(response.data);
      } catch (error) {
        console.error('Erro ao buscar talhao:', error);
      }
    };

    fetchTalhao();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTalhao();
    });

    return unsubscribe;
}, [navigation, route.params]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {talhao && (
            <View style={styles.firstHalfContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.title}>Ver/Editar {talhao.nomeTalhao}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.secondHalf}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} editable={false} placeholder={talhao ? talhao.nomeTalhao : ''}/>

          <Text style={styles.label}>Tipo de plantação</Text>
          <TextInput style={styles.input}
            placeholder={talhao ? talhao.tipoPlantacao: ''} editable={false}/>

          <View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleSeeMore(talhao.id)}>
              <Text style={styles.seeMore}>Ver mais</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.armadilhas}>Armadilhas</Text>

        <ScrollView contentContainerStyle={styles.armadilhaContainer}>
        {talhao && talhao.armadilha && talhao.armadilha.length > 0 ? (
          talhao.armadilha.map(armadilha => (
            <TouchableOpacity key={armadilha.id} style={styles.armadilha} onPress={() => handleArmadilha(armadilha.id)}>
              <View style={styles.armadilhaContent}>
                <View style={styles.armadilhaFoto} />

                <View>
                  <Text style={styles.armadilhaNome}>{armadilha.nomeArmadilha}</Text>
                </View>

                <TouchableOpacity style={styles.arrowIcon} onPress={() => handleArmadilha(armadilha.id)}>
                  <Feather name="arrow-right" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))): <Text> Não há armadilhas neste talhão.</Text>
          }
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={() => handleCadastro()}>
          <Text style={styles.buttonText}>Criar armadilha</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00',
  },
  firstHalf: {
    flex: 1.7,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  firstHalfContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goBackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#fff"
  },
  titleAgri: {
    fontSize: 14,
    fontWeight: '500',
    color: "#fff"
  },
  secondHalf: {
    flex: 8.3,
    backgroundColor: '#E9EEEB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
  },
  secondHalfInputs: {
    marginTop: 45,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  input: {
    height: 44,
    fontSize: 15,
    backgroundColor: '#ddd',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  seeMore: {
    color: '#FF8C00',
    fontSize: 16,
    textAlign: 'right',
    fontWeight: '500',
  },
  armadilhas: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  armadilha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  armadilhaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  armadilhaFoto: {
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: '#8194D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  button: {
    backgroundColor: '#FF8C00',
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
    marginBottom: 18,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

});
