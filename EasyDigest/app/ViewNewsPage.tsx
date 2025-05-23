import React, { useState } from 'react';
import { View, Pressable, Alert, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import DefaultText from '@/components/DefaultText';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ViewNewsPage() {
  const { url } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLearn = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('로그인 필요', '로그인 정보가 없습니다.');
        return;
      }

      const response = await fetch('http://172.20.10.13:8000/api/articles/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('서버 응답 오류:',errText);
        throw new Error('크롤링 실패');
      }
      const data = await response.json();
      router.push({
        pathname: '/DisplayNewsPage',
        params: {
          content: data.content,
          article_id: data.id.toString(),
        },
      });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('에러', '기사 크롤링에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url as string }} style={{ flex: 1 }} />

      <TouchableOpacity activeOpacity={0.6} style={styles.learnButton} onPress={handleLearn} disabled={loading}>
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
