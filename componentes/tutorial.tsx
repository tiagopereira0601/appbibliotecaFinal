import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export interface TutorialSlide {
  title: string;
  description: string;
  icon: string;
  color: string;
  details?: string[];
}

const SLIDES: TutorialSlide[] = [
  {
    title: 'Bem-vindo ao IBOOK',
    description: 'Sistema de Biblioteca Virtual com Google Sign-In',
    icon: 'book-open-variant',
    color: '#6366f1',
    details: [
      '✅ Autenticação com Email/Senha',
      '✅ Google Sign-In integrado',
      '✅ Gerenciamento de empréstimos',
      '✅ Sistema de avaliações',
      '✅ Segurança OWASP',
    ],
  },
  {
    title: '🔐 Como Fazer Cadastro',
    description: 'Registre sua conta em poucos segundos',
    icon: 'account-plus',
    color: '#ec4899',
    details: [
      '1. Clique em "Criar uma conta"',
      '2. Preencha Email, Nome e Senha',
      '3. Senha mínimo 6 caracteres',
      '4. Clique em "Registrar"',
      '5. Pronto! Você está logado',
    ],
  },
  {
    title: '🔑 Como Fazer Login',
    description: 'Acesse sua conta',
    icon: 'login-variant',
    color: '#f59e0b',
    details: [
      '1. Digite seu Email',
      '2. Digite sua Senha',
      '3. Clique em "Entrar"',
      'OU',
      '4. Use "Entrar com Google"',
    ],
  },
  {
    title: '📚 Como Emprestar Livros',
    description: 'Veja todos os livros disponíveis',
    icon: 'bookmark-multiple',
    color: '#10b981',
    details: [
      '1. Vá para aba "HOME"',
      '2. Veja lista de livros',
      '3. Clique no livro desejado',
      '4. Clique "Emprestar Livro"',
      '5. Livro adicionado aos seus empréstimos',
    ],
  },
  {
    title: '🔄 Meus Empréstimos',
    description: 'Gerencie seus livros emprestados',
    icon: 'truck-delivery-outline',
    color: '#0ea5e9',
    details: [
      '1. Vá para aba "EMPRÉSTIMOS"',
      '2. Veja todos seus empréstimos ativo',
      '3. Limite: máximo 3 livros',
      '4. Clique no livro para Devolver',
      '5. Deixe uma avaliação (1-5 estrelas)',
    ],
  },
  {
    title: '⭐ Deixar Comentários',
    description: 'Compartilhe sua opinião sobre livros',
    icon: 'comment-multiple-outline',
    color: '#f97316',
    details: [
      '1. Vá para aba "FEED"',
      '2. Veja comentários de outros',
      '3. Ao devolver um livro',
      '4. Deixe sua avaliação (1-5)',
      '5. Escreva um comentário',
    ],
  },
  {
    title: '🧠 IQUIZ — Quizzes Interativos',
    description: 'Crie e responda quizzes sobre livros (até 10 perguntas)',
    icon: 'quiz',
    color: '#b58900',
    details: [
      '1. Vá para a aba "IQUIZ"',
      '2. Admin cria quizzes: título, até 10 perguntas',
      '3. Cada pergunta tem opções e uma resposta correta (0-based)',
      '4. Visitantes e usuários podem jogar e responder',
      '5. Resultado é mostrado ao final',
    ],
  },
  {
    title: '📋 Gerenciar Livros (Admin)',
    description: 'Apenas administradores',
    icon: 'folder-edit',
    color: '#8b5cf6',
    details: [
      '1. Vá para aba "GERENCIAR"',
      '2. Adicione novos livros',
      '3. Edite livros existentes',
      '4. Delete livros',
      '⚠️ Apenas usuários ADMIN',
    ],
  },
  {
    title: '🔒 Segurança OWASP',
    description: 'Seu app segue padrões internacionais',
    icon: 'shield-check',
    color: '#ef4444',
    details: [
      '✅ Proteção contra Injection (XSS)',
      '✅ Validação de senhas forte',
      '✅ Isolamento de dados por usuário',
      '✅ Limite de empréstimos (Access Control)',
      '✅ Testes automatizados com Playwright',
    ],
  },
  {
    title: '🧪 Testes Playwright',
    description: 'Seu app passa 10+ testes de segurança',
    icon: 'beaker-outline',
    color: '#06b6d4',
    details: [
      '✅ Teste 01: Injection (XSS)',
      '✅ Teste 02: Access Control',
      '✅ Teste 04: Weak Password',
      '✅ Teste 06: Brute Force',
      '✅ ...e 6+ mais testes',
    ],
  },
  {
    title: '📊 SDD Completo',
    description: 'Documentação profissional do projeto',
    icon: 'file-document-outline',
    color: '#6b7280',
    details: [
      '✅ Fase 1: Planejamento',
      '✅ Fase 2: Análise',
      '✅ Fase 3: Design',
      '✅ Fase 4: Implementação',
      '✅ Fase 5: Validação',
    ],
  },
  {
    title: 'Pronto para Começar!',
    description: 'Clique em "Fechar" para voltar',
    icon: 'check-circle',
    color: '#10b981',
    details: [
      '🎉 Você aprendeu o básico',
      '📚 Explore o app',
      '❓ Dúvidas?',
      '📖 Leia GUIA-ENTREGA-FINAL.md',
      '🚀 Divirta-se!',
    ],
  },
];

interface TutorialProps {
  visible: boolean;
  onClose: () => void;
}

export function Tutorial({ visible, onClose }: TutorialProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = SLIDES[currentSlide];

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleClose = () => {
    setCurrentSlide(0);
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
      transparent={false}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        {/* Header */}
        <View
          style={{
            paddingTop: 40,
            paddingBottom: 20,
            paddingHorizontal: 20,
            backgroundColor: slide.color,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 4,
              }}
            >
              TUTORIAL
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              {currentSlide + 1} de {SLIDES.length}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Slide Content */}
        <ScrollView
          style={{ flex: 1, padding: 20 }}
          contentContainerStyle={{ justifyContent: 'center', minHeight: '100%' }}
        >
          {/* Icon */}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 30,
            }}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: slide.color,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0.1,
              }}
            />
            <View
              style={{
                position: 'absolute',
              }}
            >
              <MaterialCommunityIcons
                name={slide.icon}
                size={60}
                color={slide.color}
              />
            </View>
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            {slide.title}
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 16,
              color: '#64748b',
              marginBottom: 30,
              textAlign: 'center',
              lineHeight: 24,
            }}
          >
            {slide.description}
          </Text>

          {/* Details */}
          {slide.details && (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 20,
                marginBottom: 30,
                borderLeftWidth: 4,
                borderLeftColor: slide.color,
              }}
            >
              {slide.details.map((detail, index) => (
                <Text
                  key={index}
                  style={{
                    fontSize: 14,
                    color: '#334155',
                    marginVertical: 8,
                    lineHeight: 22,
                  }}
                >
                  {detail}
                </Text>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Footer - Navigation */}
        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: 20,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Previous Button */}
          <TouchableOpacity
            onPress={handlePrev}
            disabled={currentSlide === 0}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: currentSlide === 0 ? '#e2e8f0' : '#f1f5f9',
              minWidth: 100,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: currentSlide === 0 ? '#cbd5e1' : '#475569',
                fontWeight: '600',
                fontSize: 14,
              }}
            >
              ← Anterior
            </Text>
          </TouchableOpacity>

          {/* Dots Indicator */}
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {SLIDES.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentSlide(index)}
                style={{
                  width: index === currentSlide ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    index === currentSlide ? slide.color : '#cbd5e1',
                }}
              />
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={handleNext}
            disabled={currentSlide === SLIDES.length - 1}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor:
                currentSlide === SLIDES.length - 1 ? '#e2e8f0' : slide.color,
              minWidth: 100,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color:
                  currentSlide === SLIDES.length - 1 ? '#cbd5e1' : 'white',
                fontWeight: '600',
                fontSize: 14,
              }}
            >
              Próximo →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Alternative close at bottom */}
        {currentSlide === SLIDES.length - 1 && (
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <TouchableOpacity
              onPress={handleClose}
              style={{
                paddingVertical: 14,
                borderRadius: 8,
                backgroundColor: '#10b981',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 16,
                }}
              >
                ✅ Começar a Usar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}
