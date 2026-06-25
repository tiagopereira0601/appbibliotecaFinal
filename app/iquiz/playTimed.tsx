import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlayTimed() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const quiz = params.quiz ? JSON.parse(params.quiz as string) : null;

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeRefRef = useRef(0);

  useEffect(() => {
    if (!quiz || !quiz.questions) return;
    startQuestion();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, quiz?.questions.length]);

  const startQuestion = useCallback(() => {
    if (!quiz || !quiz.questions || !quiz.questions[index]) return;
    
    setLocked(false);
    setSelected(null);
    const t = quiz.timePerQuestion || 20;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Initialize time
    setTimeLeft(t);
    timeRefRef.current = t;
    progress.setValue(0);
    
    Animated.timing(progress, {
      toValue: 1,
      duration: t * 1000,
      useNativeDriver: false
    }).start();

    // Create new interval
    intervalRef.current = setInterval(() => {
      timeRefRef.current -= 1;
      
      if (timeRefRef.current <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setTimeLeft(0);
        setLocked(true);
        setTimeout(() => {
          nextQuestionHandler();
        }, 1500);
      } else {
        setTimeLeft(timeRefRef.current);
      }
    }, 1000);
  }, [index, quiz]);

  const nextQuestionHandler = () => {
    if (!quiz || !quiz.questions) return;
    
    if (index + 1 >= quiz.questions.length) {
      router.replace({
        pathname: '/iquiz/results',
        params: {
          score: String(score),
          total: String(quiz.questions.length),
          title: quiz.title
        }
      });
    } else {
      setIndex(index + 1);
    }
  };

  const choose = (i: number) => {
    if (locked || !quiz) return;
    
    setSelected(i);
    setLocked(true);
    
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    const q = quiz.questions[index];
    if (i === q.correctIndex) {
      setScore(s => s + 1);
    }
    
    setTimeout(() => {
      nextQuestionHandler();
    }, 1200);
  };

  const goBack = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/iquiz');
    }
  };

  if (!quiz) return <View style={styles.container}><Text>Quiz inválido</Text></View>;

  const q = quiz.questions[index];
  const colors = ['#ff5b5b', '#4d78ff', '#ffb84d', '#7ddf4d'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{quiz.title}</Text>
      </View>

      <View style={styles.timerRow}>
        <Text style={styles.timerText}>Tempo: {timeLeft}s</Text>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { flex: progress }]} />
        </View>
      </View>

      {q.thumbnail ? (
        <Image source={{ uri: q.thumbnail }} style={styles.thumbnail} />
      ) : null}

      <Text style={styles.question}>{q.text}</Text>

      <View style={styles.grid}>
        {q.options.map((opt: string, idx: number) => {
          const isCorrect = idx === q.correctIndex;
          const isSelected = selected === idx;
          const bg = locked ? (isCorrect ? '#2ecc71' : (isSelected ? '#e74c3c' : '#fff')) : '#fff';
          return (
            <TouchableOpacity key={idx} style={[styles.cardOption, { borderColor: colors[idx % colors.length] }]} onPress={() => choose(idx)} disabled={locked}>
              <View style={[styles.colorPill, { backgroundColor: colors[idx % colors.length] }]} />
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.progressText}>{index + 1} / {quiz.questions.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fffaf5' },
  title: { fontSize: 22, fontWeight: '800', color: '#7a5b00', marginBottom: 10 },
  timerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  timerText: { color: '#7a5b00', fontWeight: '700', marginRight: 12 },
  progressBar: { flex: 1, height: 10, backgroundColor: '#f1e6c8', borderRadius: 6, overflow: 'hidden' },
  progressFill: { backgroundColor: '#b58900' },
  question: { fontSize: 18, marginBottom: 12, color: '#5a4300' },
  thumbnail: { width: '100%', height: 140, borderRadius: 8, marginBottom: 12, backgroundColor: '#eee' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardOption: { width: '48%', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 2, marginBottom: 10, backgroundColor: '#fff' },
  colorPill: { width: 14, height: 28, borderRadius: 4, marginRight: 12 },
  optionText: { color: '#3b2f00', fontWeight: '700', flexShrink: 1 },
  progressText: { marginTop: 12, color: '#7a5b00', fontWeight: '700', textAlign: 'center' },
});
