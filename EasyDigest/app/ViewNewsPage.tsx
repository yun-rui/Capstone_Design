import React, { useRef, useState } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import DefaultText from '@/components/DefaultText';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ViewNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://news.naver.com/');

  const webviewRef = useRef(null);

  const handleLearn = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('로그인 필요', '로그인 정보가 없습니다.');
        return;
      }

      const response = await fetch('http://172.30.1.73:8000/api/articles/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ url: currentUrl }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      const data = await response.json();
      router.push({
        pathname: '/DisplayNewsPage',
        params: {
          url: currentUrl,
          article_id: data.id.toString(),
        },
      });
    } catch (error) {
      console.error('기사 크롤링 실패:', error);
      Alert.alert('에러', '기사 크롤링에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://news.naver.com/' }}
        style={{ flex: 1 }}
        onNavigationStateChange={(navState) => setCurrentUrl(navState.url)}
      />

      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.learnButton}
        onPress={handleLearn}
        disabled={loading}
      >
        <DefaultText style={styles.learnButtonText}>
          {loading ? '처리 중...' : '이 기사 학습하기'}
        </DefaultText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  learnButton: {
    backgroundColor: '#1976d2',
    paddingVertical: screenHeight * 0.02,
    alignItems: 'center',
  },
  learnButtonText: {
    color: 'white',
    fontSize: screenWidth * 0.045,
    fontFamily: 'Ubuntu-Bold',
  },
});
