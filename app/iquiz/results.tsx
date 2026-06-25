import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

function Confetti() {
  const pieces = Array.from({ length: 30 }).map((_, i) => ({
    left: Math.random() * width,
    delay: Math.random() * 800,
    rotate: Math.random() * 360,
    color: ['#FFD700', '#FFB84D', '#FFE79E', '#D4AF37'][Math.floor(Math.random() * 4)],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} left={p.left} delay={p.delay} rotate={p.rotate} color={p.color} />
      ))}
    </View>
  );
}

function ConfettiPiece({ left, delay, rotate, color }: any) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 2200, delay, useNativeDriver: true }).start();
  }, [anim, delay]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-50, height + 50] });
  const rotateInter = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${rotate + 180}deg`] });

  return (
    <Animated.View style={[styles.confetti, { left, transform: [{ translateY }, { rotate: rotateInter }], backgroundColor: color }]} />
  );
}

export default function Results() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const score = parseInt(params.score || '0', 10);
  const total = parseInt(params.total || '0', 10);
  const title = params.title || 'Quiz';

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(t);
  }, []);

  const playAgain = () => {
    router.replace('/iquiz');
    setTimeout(() => router.push('/iquiz'), 200);
  };

  const backToList = () => router.replace('/iquiz');
  const backToHome = () => router.replace('/');

  return (
    <View style={styles.container}>
      {showConfetti && <Confetti />}

      <Text style={styles.heading}>Resultado</Text>
      <Text style={styles.sub}>{title}</Text>

      <View style={styles.card}>
        <Text style={styles.score}>{score} / {total}</Text>
        <Text style={styles.detail}>Acertos: {score}</Text>
        <Text style={styles.detail}>Erros: {total - score}</Text>
        <Text style={styles.detail}>Percentual: {total ? Math.round((score / total) * 100) : 0}%</Text>
      </View>

      <View style={styles.rowThree}>
        <TouchableOpacity style={styles.button} onPress={playAgain}>
          <Text style={styles.buttonText}>Voltar à lista</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.ghost]} onPress={backToHome}>
          <Text style={[styles.buttonText, styles.ghostText]}>Voltar ao Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.ghost]} onPress={backToList}>
          <Text style={[styles.buttonText, styles.ghostText]}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fffaf5', alignItems: 'center' },
  heading: { fontSize: 26, fontWeight: '900', color: '#7a5b00', marginTop: 20 },
  sub: { color: '#8a6a00', marginBottom: 12 },
  card: { width: '90%', padding: 20, borderRadius: 12, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, elevation: 2, alignItems: 'center' },
  score: { fontSize: 40, fontWeight: '900', color: '#b58900' },
  detail: { marginTop: 6, color: '#5a4300', fontWeight: '700' },
  row: { flexDirection: 'row', marginTop: 22, width: '90%', justifyContent: 'space-between' },
  rowThree: { flexDirection: 'row', marginTop: 22, width: '100%', justifyContent: 'space-between' },
  button: { flex: 1, backgroundColor: '#b58900', padding: 12, borderRadius: 10, marginHorizontal: 6, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '800' },
  ghost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#b58900' },
  ghostText: { color: '#b58900' },
  confetti: { position: 'absolute', width: 10, height: 20, borderRadius: 2 },
});
