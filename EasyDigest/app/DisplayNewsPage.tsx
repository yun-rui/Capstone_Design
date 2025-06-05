import React, { useState } from 'react';
import {
  View, Text, Alert, Modal, StyleSheet,
  Dimensions, TouchableOpacity, ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import DefaultText from '@/components/DefaultText';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function WebLearnPage() {
  const router = useRouter();
  const { url, article_id, summary } = useLocalSearchParams();
  const articleID = Number(article_id);

  const [selectedWord, setSelectedWord] = useState('');
  const [wordDefinition, setWordDefinition] = useState('');
  const [askCount, setAskCount] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const injectedJS = `
    document.addEventListener('selectionchange', () => {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText.length > 0 && selectedText.length <= 30) {
        window.ReactNativeWebView.postMessage(selectedText);
      }
    });
    true;
  `;

  const handleMessage = (event: any) => {
    const raw = event.nativeEvent.data;
    const word = raw.replace(/[.,?!()\[\]{}<>‘’“”'"~`·\s]/g, '').trim();
    if (!word) return;
    setSelectedWord(word);
  };

  const handleLookup = async () => {
    if (!selectedWord || !articleID) {
      Alert.alert('알림', '먼저 단어를 선택해주세요.');
      return;
    }

    setIsLookingUp(true); // 검색 중 시작

    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch('http://172.20.10.13:8000/api/words/learn/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          word_text: selectedWord,
          article_id: articleID,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWordDefinition(data.description || '설명이 없습니다.');
        setAskCount(data.ask_count);
      } else {
        setWordDefinition('단어 설명을 불러오지 못했습니다.');
      }
    } catch (err) {
      setWordDefinition('오류가 발생했습니다.');
    }

    setIsLookingUp(false); // 검색 완료
    setModalVisible(true); // 단어 모달 표시
  };

  const handleGoToQuiz = () => {
    router.push({
      pathname: '/QuizPage',
      params: { 
        article_id: articleID.toString(),
        summary: summary,
       },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/*상단 헤더 텍스트 추가 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>뉴스 학습 중...</Text>
      </View>

      <WebView
        source={{ uri: url as string }}
        style={{ flex: 1 }}
        injectedJavaScript={injectedJS}
        onMessage={handleMessage}
      />

      {/* 하단 병렬 버튼 영역 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity onPress={handleLookup} style={styles.lookupButton}>
          <Text style={styles.buttonText}>
            {isLookingUp ? '검색중...': '🔍검색'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGoToQuiz} style={styles.quizButton}>
          <Text style={styles.buttonText}>학습 완료</Text>
        </TouchableOpacity>
      </View>

      {/* 단어 설명 모달 */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedWord}</Text>
            <ScrollView style={styles.definitionScroll}>
              <Text style={styles.modalText}>{wordDefinition}</Text>
            </ScrollView>
            {askCount !== null && askCount >= 2 && (
              <Text style={styles.askCount}>
                지금까지 {askCount}번 확인했어요!{'\n'}슬슬 익숙해지셨죠?
              </Text>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:{
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText:{
    fontSize: 22,
    fontWeight: '300',
    color: '#333',
    fontFamily: 'Ubuntu-Bold',
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingVertical: screenHeight * 0.02,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  lookupButton: {
    width: '50%',
    backgroundColor: '#555',
    justifyContent: 'center',
    paddingVertical: 12,
    alignItems: 'center',
  },
  quizButton: {
    width: '50%',
    backgroundColor: '#1976d2',
    justifyContent:'center',
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: screenWidth * 0.045,
    fontFamily: 'Ubuntu-Bold',
  },
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalBox: {
    backgroundColor: 'white',
    width: screenWidth * 0.8,
    borderRadius: 12,
    padding: 16,
    maxHeight: screenHeight * 0.5,
  },
  modalTitle: {
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign : 'center',
  },
  definitionScroll: {
    maxHeight: screenHeight * 0.3,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
  },
  askCount: {
    fontSize: 14, color: '#555', textAlign: 'center',
    marginTop: 5,
  },
  closeBtn: {
    alignSelf: 'flex-end',
  },
  closeText: {
    color: '#1976d2', fontWeight: 'bold',
  },
});