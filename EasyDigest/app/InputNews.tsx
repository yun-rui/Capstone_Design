import React, { useRef, useState } from 'react';
import {
    View,
    TextInput,
    ScrollView,
    StyleSheet,
    Pressable,
    Dimensions,
    Image,
    Platform,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback, 
    Alert,
  } from 'react-native';
  
import { useRouter } from 'expo-router';
import DefaultText from '@/components/DefaultText';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 상단에 추가

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function InputNewsPage() {
  const router = useRouter();
  const [newsText, setNewsText] = useState('');

  // ScrollView에 대한 ref
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSubmit = async () => {
    console.log("🟡 handleSubmit 진입");

    // post 요청 
    try {
      const token = await AsyncStorage.getItem('access_token'); // 토큰 불러오기
      
      if (!token){
        Alert.alert('로그인 필요','로그인 정보가 없습니다.');
        return;
      }

      const response = await fetch('http://192.168.35.109:8000/api/articles/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ✅ 토큰 포함
          // 로그인 기능과 연동했다면 아래 Authorization도 포함
          // 'Authorization': 'Bearer ${your_access_token}',
        },
        body: JSON.stringify({
          url: newsText,
        }),
        credentials: 'include', 
      });
      
      if (!response.ok) {
        throw new Error ('Failed to save article');
      }

      const data = await response.json();
      console.log('Article saved:',data);

      // DisplayNewsText.tsx로 전달
      router.push({
      pathname: '/DisplayNewsPage',
      params: {
        content: data.content,
        article_id:data.id.toString(),
      },
      });
      }catch(error){
        console.error('Error saving article:',error);
    }
  };

  const handleContentSizeChange = () => {
    // 입력 중 텍스트가 늘어날 때 아래로 스크롤
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
        <View style={styles.container}>
            {/* 뒤로가기 버튼 */}
            <Pressable onPress={() => router.push('/SectionPage')}>
            <Image
                source={require('../assets/images/back.png')}
                style={styles.topLeftIcon}
            />
            </Pressable>

            {/* 타이틀 */}
            <DefaultText style={styles.title}>
            네이버 뉴스 링크를 입력하세요
            </DefaultText>

            {/*뉴스 링크 입력 칸*/}
            <TextInput
              style={styles.inputBox}
              placeholder="https://n.news.naver.com/..."
              placeholderTextColor="#aaa"
              value={newsText}
              onChangeText={setNewsText}
              autoCapitalize="none"
            />

            {/* 제출 버튼 */}
            <Pressable onPress={handleSubmit} style={styles.button}>
            <DefaultText style={styles.buttonText}>입력하기</DefaultText>
            </Pressable>
        </View>
        </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: screenWidth * 0.07,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  topLeftIcon: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    position: 'absolute',
    top: screenHeight * 0.06,
    right: screenWidth * 0.37,
  },
  title: {
    fontSize: screenWidth * 0.063,
    fontFamily: 'Ubuntu-Bold',
    marginTop: screenHeight * 0.12,
    marginBottom: screenHeight * 0.03,
    textAlign: 'center',
  },
  inputWrapper: {
    width: '100%',
    height: screenHeight * 0.6, 
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: screenHeight * 0.05,
    overflow: 'hidden',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
  inputBox: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Ubuntu-Light',
    minHeight: 200, // 여유 공간
  },
  button: {
    width: '100%',
    paddingVertical: screenHeight * 0.018,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#1976d2',
  },
  buttonText: {
    color: 'white',
    fontSize: screenWidth * 0.045,
    fontFamily: 'Ubuntu-Bold',
  },
});
