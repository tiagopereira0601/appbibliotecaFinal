import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import safeAsyncStorage from '../../ganchos/useStorage';

const STORAGE_KEY = 'iquest_quizzes';

export default function IQuizJogar() {
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const raw = await safeAsyncStorage.getItem(STORAGE_KEY);
    if (raw) setQuizzes(JSON.parse(raw));
  };

  const play = (quiz: any) => {
    router.push({ pathname: '/iquiz/playTimed', params: { quiz: JSON.stringify(quiz) } });
  };

  const limparTodos = async () => {
    if (confirm('Tem certeza que deseja limpar todos os quizzes?')) {
      await safeAsyncStorage.removeItem(STORAGE_KEY);
      setQuizzes([]);
      alert('Todos os quizzes foram removidos!');
    }
  };

  return (
    <View style={{ flex:1, padding:16, backgroundColor:'#fffaf5' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize:20, fontWeight:'800', color:'#7a5b00' }}>Jogar IQUIZ</Text>
        {quizzes.length > 0 && (
          <TouchableOpacity onPress={limparTodos} style={{ backgroundColor: '#e74c3c', padding: 8, borderRadius: 6 }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Limpar Tudo</Text>
          </TouchableOpacity>
        )}
      </View>
      {quizzes.length === 0 ? <Text style={{ marginTop:12 }}>Nenhum quiz disponível.</Text> : (
        <FlatList data={quizzes} keyExtractor={(i:any)=>i.id} renderItem={({item}:any)=> (
          <View style={{ backgroundColor:'#fff', padding:12, borderRadius:8, marginTop:10, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
            <View>
              <Text style={{ fontWeight:'700', color:'#5a4300' }}>{item.title}</Text>
              <Text style={{ color:'#7a5b00' }}>{item.questions.length} perguntas</Text>
            </View>
            <View style={{ flexDirection:'row' }}>
              <TouchableOpacity onPress={() => play(item)} style={{ backgroundColor:'#b58900', padding:8, borderRadius:8 }}><Text style={{ color:'#fff', fontWeight:'700' }}>Jogar</Text></TouchableOpacity>
            </View>
          </View>
        )} />
      )}
    </View>
  );
}
