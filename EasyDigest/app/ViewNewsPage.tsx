import React, { useRef, useState } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import DefaultText from '@/components/DefaultText';
// 상단바 가림 방지 
import { SafeAreaView } from 'react-native-safe-area-context';

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

      const articleRes = await fetch('http://172.20.10.2:8000/api/articles/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ url: currentUrl }),
      });

      if (!articleRes.ok) {
        const errText = await articleRes.text();
        throw new Error(errText);
      }

      const articleData = await articleRes.json();
      const articleID = articleData.id;

      const summaryRes = await fetch(`http://172.20.10.2:8000/api/articles/${articleID}/generate-summary/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          },
      });
      const summaryData = await summaryRes.json();
      console.log("✅ 요약 생성 결과:", summaryData.summary); // 👈 로그 출력


      router.push({
        pathname: '/DisplayNewsPage',
        params: {
          url: currentUrl,
          article_id: articleID.toString(),
          summary: summaryData.summary, 
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
    <SafeAreaView style={styles.container}>
      {/* 상단 Back 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() =>router.push('/SectionPage')}>
          <Image
            source={require('@/assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerCenterWrapper}>
          <Text style={styles.headerText}>뉴스 탐색</Text>
        </View>
      </View>
      {/*Webview 영역 */}
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://news.naver.com/' }}
        style={styles.webview}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#f8f8f8',
    position:'relative',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 12,
  },
  headerCenterWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize:22,
    fontWeight: '600',
    color: '#333', 
    fontFamily: 'Ubuntu-Bold',
  },
  webview: {
    height: screenHeight* 0.76,
    width: '100%',
  },
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
