import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import safeAsyncStorage from '../../ganchos/useStorage';
import { useAuth } from '../context/AuthContext';

const draftKey = 'iquest_draft';

const optionColor = ['#e94e77', '#4e8cff', '#ffcd4e', '#6ddc9f'];

export default function IQuizCriar() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);

  const addQuestionToDraft = async () => {
    const opts = [optionA, optionB, optionC, optionD].map(s => s.trim()).filter(Boolean);
    if (!questionText || opts.length < 2) return Alert.alert('Preencha pergunta e ao menos 2 opções');
    const q = { id: Date.now().toString(), text: questionText, options: opts, correctIndex: Math.max(0, Math.min(opts.length - 1, correctIndex)), thumbnail };
    const raw = await safeAsyncStorage.getItem(draftKey);
    const draft = raw ? JSON.parse(raw) : { title: title || '', questions: [] };
    draft.questions.push(q);
    await safeAsyncStorage.setItem(draftKey, JSON.stringify(draft));
    setQuestionText(''); setOptionA(''); setOptionB(''); setOptionC(''); setOptionD(''); setThumbnail(''); setCorrectIndex(0);
    Alert.alert('Pergunta adicionada ao rascunho');
  };

  const createQuizFromDraft = async () => {
    const opts = [optionA, optionB, optionC, optionD].map(s => s.trim()).filter(Boolean);
    const raw = await safeAsyncStorage.getItem(draftKey);
    const draft = raw ? JSON.parse(raw) : { title: title || '', questions: [] };

    if ((!draft.questions || draft.questions.length === 0) && questionText && opts.length >= 2) {
      draft.questions = [{ id: Date.now().toString(), text: questionText, options: opts, correctIndex: Math.max(0, Math.min(opts.length - 1, correctIndex)), thumbnail }];
      draft.title = title || draft.title || 'Quiz sem título';
    }

    if (!draft.questions || draft.questions.length === 0) {
      return Alert.alert('Adicione pelo menos uma pergunta ou preencha os campos atuais');
    }

    const newQuiz = {
      id: Date.now().toString(),
      title: draft.title || title || 'Quiz sem título',
      questions: draft.questions.slice(0,10),
      creatorId: user?.id || 'guest',
      timePerQuestion: 20,
    };

    const STORAGE_KEY = 'iquest_quizzes';
    const existingRaw = await safeAsyncStorage.getItem(STORAGE_KEY);
    const list = existingRaw ? JSON.parse(existingRaw) : [];
    list.unshift(newQuiz);
    await safeAsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    await safeAsyncStorage.removeItem(draftKey);
    setTitle(''); setQuestionText(''); setOptionA(''); setOptionB(''); setOptionC(''); setOptionD(''); setThumbnail(''); setCorrectIndex(0);
    Alert.alert('Quiz criado com sucesso');
  };

  const renderOption = (label: string, value: string, setter: (text: string) => void, idx: number) => (
    <View key={label} style={[styles.optionRow, { borderColor: optionColor[idx] }]}>
      <TouchableOpacity onPress={() => setCorrectIndex(idx)} style={[styles.radio, correctIndex === idx && styles.radioSelected, { borderColor: optionColor[idx] }]}> 
        {correctIndex === idx ? <Text style={styles.radioMark}>✓</Text> : null}
      </TouchableOpacity>
      <TextInput
        placeholder={`Opção ${label}`}
        value={value}
        onChangeText={setter}
        style={[styles.optionInput, { backgroundColor: `${optionColor[idx]}22` }]}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>CRIAR QUIZ</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Título do Quiz</Text>
        <TextInput placeholder='Título' value={title} onChangeText={setTitle} style={styles.textInput} />
        <Text style={styles.label}>Pergunta</Text>
        <TextInput placeholder='Escreva a pergunta' value={questionText} onChangeText={setQuestionText} style={styles.textInput} />
        <Text style={styles.label}>Selecione a resposta correta</Text>
        {renderOption('A', optionA, setOptionA, 0)}
        {renderOption('B', optionB, setOptionB, 1)}
        {renderOption('C', optionC, setOptionC, 2)}
        {renderOption('D', optionD, setOptionD, 3)}
        <TextInput placeholder='Thumbnail URL (opcional)' value={thumbnail} onChangeText={setThumbnail} style={styles.textInput} />
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={addQuestionToDraft} style={[styles.actionButton, styles.addButton]}><Text style={styles.actionLabel}>Salvar Pergunta</Text></TouchableOpacity>
          <TouchableOpacity onPress={createQuizFromDraft} style={[styles.actionButton, styles.createButton]}><Text style={styles.actionLabel}>Criar Quiz</Text></TouchableOpacity>
        </View>
        <Text style={styles.note}>Você pode criar o quiz com apenas uma pergunta preenchendo a pergunta e as opções acima.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#120a2f' },
  content: { padding: 20 },
  heading: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#1f154d', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#4e3f92' },
  label: { color: '#d1c7ff', fontWeight: '700', marginBottom: 8 },
  textInput: { backgroundColor: '#2c1f5b', color: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#5245a6' },
  optionRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderRadius: 16, padding: 10, marginBottom: 10 },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { backgroundColor: '#fff' },
  radioMark: { color: '#120a2f', fontWeight: '900' },
  optionInput: { flex: 1, color: '#120a2f', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  actionButton: { flex: 1, padding: 14, borderRadius: 14, alignItems: 'center', marginHorizontal: 4 },
  addButton: { backgroundColor: '#4d7cff' },
  createButton: { backgroundColor: '#ff8b4d' },
  actionLabel: { color: '#fff', fontWeight: '800' },
});
