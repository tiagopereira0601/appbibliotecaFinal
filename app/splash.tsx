import { View, Text, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';

export default function Splash() {
  const router = useRouter();
  const auth = useAuth();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (auth.user) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [auth.user]);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2d6a4f',
    }}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <Text style={{
          fontSize: 48,
          fontWeight: 'bold',
          color: '#a7c957',
          letterSpacing: 2,
          textAlign: 'center',
        }}>
          iBook
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#fff',
          letterSpacing: 1,
          textAlign: 'center',
          marginTop: 10,
        }}>
          📚 Sua Biblioteca Digital
        </Text>
      </Animated.View>

      <View style={{ position: 'absolute', bottom: 50 }}>
        <LoadingIndicator />
      </View>
    </View>
  );
}

function LoadingIndicator() {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    dots.forEach((dot, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(dot, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#a7c957',
            opacity: dot,
          }}
        />
      ))}
    </View>
  );
}
