import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import firebase from '@react-native-firebase/app';
import axios from 'axios';
import MapaArmadilhaEditar from '../Mapa/mapaArmadilhaEditar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditarArmadilha() {
  const navigation = useNavigation();
  const route = useRoute();
  const [armadilha, setArmadilha] = useState(null);
  const [nome, setNome] = useState(null);

  useEffect(() => {
    const fetchArmadilha = async () => {
      const currentUser = firebase.auth().currentUser;
      const idToken = await currentUser.getIdToken();
      const { armadilhaId } = route.params;
      
      try {
        const response = await axios.get(`http://10.0.2.2:3000/armadilha/${armadilhaId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        setArmadilha(response.data);
        setNome(response.data.nome)
      } catch (error) {
        console.log('Erro ao buscar usuário:', error);
      }
    };

    fetchArmadilha();
  }, [route.params]);

  const handleDeletar = () => {
    Alert.alert(
      `Deletar armadilha`,
      "Você realmente deseja deletar essa armadilha? \n \nEssa ação é irreversível e irá apagar todos os dados!",
      [{
        text: "Confirmar",
        onPress: () => {  const deleteArmadilha = async () => {
          try {
            const currentUser = firebase.auth().currentUser;
            const idToken = await currentUser.getIdToken();
            const { armadilhaId } = route.params;
            const response = await axios.delete(`http://10.0.2.2:3000/armadilha/${armadilhaId}`, {
              headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
              }
            });
            navigation.goBack();           
            navigation.goBack();
          } catch (error) {
            console.log('Erro ao deletar usuario:', error);
          }
        };
        deleteArmadilha() }
      },
      {
        text: "Cancelar",
        style: "cancel"
      }]
    );
  };

  const handleSalvar = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        const idToken = await currentUser.getIdToken();
        const coordenadas = await AsyncStorage.getItem('poligno');
        const coordenadasObjeto = JSON.parse(coordenadas);
        const { armadilhaId } = route.params;
        const response = await axios.put(`http://10.0.2.2:3000/armadilha/${armadilhaId}`, {
          nomeArmadilha: nome,
          coordenada: coordenadasObjeto
        }, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        navigation.goBack();
      } catch (error) {
        console.log('Erro ao salvar alterações:', error);
      }
    };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstHalf}>
        <View>
          {armadilha && (
            <View style={styles.firstHalfContent}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackContainer}>
                <Feather name="arrow-left" size={30} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.title}>Ver/Editar {armadilha.nomeArmadilha}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.secondHalf}>
        <ScrollView contentContainerStyle={styles.armadilhaContainer}>
        <View style={styles.secondHalfInputs}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} placeholder={armadilha ? armadilha.nomeArmadilha : ''} value={armadilha ? armadilha.nomeArmadilha : ''} onChangeText={(text) => setNome(text)} />


          <Text style={styles.label}>Localização</Text>
          <MapaArmadilhaEditar />
          
        </View>
        </ScrollView>

        <View style={styles.secondHalfButtons}>
          <TouchableOpacity style={styles.buttonDeletar} onPress={() => handleDeletar()}>
            <Text style={styles.buttonText}>Deletar armadilha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSalvar} onPress={() => handleSalvar()}>
            <Text style={styles.buttonText}>Salvar alterações</Text>
          </TouchableOpacity>
        </View>
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
  secondHalf: {
    flex: 8.3,
    backgroundColor: '#E9EEEB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
  },
  armadilhaContainer: {
    height: "100%",
  },
  secondHalfInputs: {
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  input: {
    height: 44,
    fontSize: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  secondHalfButtons: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 42,
  },
  buttonDeletar: {
    backgroundColor: '#DE1B00',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    width: '48%',
    height: 44,
  },
  buttonSalvar: {
    backgroundColor: '#2C8C1D',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    width: '48%',
    height: 44,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

});
