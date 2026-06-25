import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Play() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const quiz = params.quiz ? JSON.parse(params.quiz as string) : null;

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  if (!quiz) {
    return (
      <View style={styles.container}><Text style={{ color: '#000' }}>Quiz inválido</Text></View>
    );
  }

  const q = quiz.questions[index];

  const choose = (i: number) => {
    if (i === q.correctIndex) setScore(s => s + 1);
    if (index + 1 >= quiz.questions.length) {
      router.replace('/(abas)');
      setTimeout(() => alert(`Você acertou ${score + (i === q.correctIndex ? 1 : 0)} de ${quiz.questions.length}`), 200);
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{quiz.title}</Text>
      <Text style={styles.question}>{q.text}</Text>
      {q.options.map((opt: string, idx: number) => (
        <TouchableOpacity key={idx} style={styles.option} onPress={() => choose(idx)}>
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fffaf5' },
  title: { fontSize: 20, fontWeight: '800', color: '#7a5b00', marginBottom: 12 },
  question: { fontSize: 16, marginBottom: 12 },
  option: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#efe3b8' },
  optionText: { color: '#5a4300', fontWeight: '700' },
});
