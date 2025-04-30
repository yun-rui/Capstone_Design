import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import DefaultText from '@/components/DefaultText';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function LoginPage() {
  const router = useRouter();
  const [idInput, setIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleLogin = async () => {
    if (!idInput || !passwordInput) {
      Alert.alert('입력 오류', 'ID와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://192.168.35.109:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: idInput,
          password: passwordInput,
        }),
        credentials: 'include', 
      });

      const result = await response.json();

      if (response.ok) {
        const { message, nickname, access, refresh } = result;

        await AsyncStorage.setItem('access_token', access); // ✅ 이제 안전하게 저장됨
        await AsyncStorage.setItem('nickname', nickname); // 저장
        Alert.alert('✅ 로그인 성공', '환영합니다!');
        router.push('/SectionPage');
      } else {
        if (result.message === 'User not found') {
          Alert.alert('❌ 로그인 실패', '존재하지 않는 ID입니다.');
        } else if (result.message === 'Incorrect password') {
          Alert.alert('❌ 로그인 실패', '비밀번호를 다시 확인해주세요.');
        } else {
          Alert.alert('❌ 로그인 실패', '알 수 없는 오류가 발생했습니다.');
        }
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      Alert.alert('서버 오류', '서버에 연결할 수 없습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <DefaultText style={styles.title}>EasyDigest</DefaultText>

      <TextInput
        placeholder="ID를 입력하세요"
        style={styles.input}
        value={idInput}
        onChangeText={setIdInput}
      />
      <TextInput
        placeholder="비밀번호를 입력하세요"
        secureTextEntry
        style={styles.input}
        value={passwordInput}
        onChangeText={setPasswordInput}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <DefaultText style={styles.loginButtonText}>로그인하기</DefaultText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/SignUpPage')}>
        <DefaultText style={styles.signupText}>
          아직 계정이 없다면? <DefaultText style={styles.signupLink}>회원가입하기</DefaultText>
        </DefaultText>
      </TouchableOpacity>

      <View style={styles.socialLogin}>
        <TouchableOpacity style={[styles.socialButton, styles.kakaoButton]}>
          <Image source={require('../assets/images/kakao_logo.png')} style={styles.socialIcon} />
          <DefaultText style={styles.kakaoText}>카카오 로그인</DefaultText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, styles.naverButton]}>
          <Image source={require('../assets/images/naver_logo.png')} style={styles.socialIcon} />
          <DefaultText style={styles.naverText}>네이버 로그인</DefaultText>
        </TouchableOpacity>
      </View>

      <DefaultText style={styles.footer}>© Copyright. 2025 EasyDigest Co., Ltd.</DefaultText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: screenWidth * 0.07,
    backgroundColor: 'white',
  },
  title: {
    marginTop: screenHeight * 0.2,
    fontSize: screenWidth * 0.12,
    fontFamily: 'KaiseiTokumin-Bold',
    marginBottom: screenHeight * 0.05,
  },
  input: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.07,
    paddingHorizontal: screenWidth * 0.045,
    marginVertical: screenHeight * 0.01,
    borderRadius: 16,
    backgroundColor: '#eeebeb',
    borderWidth: 0,
    fontSize: screenWidth * 0.045,
  },
  loginButton: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.07,
    marginVertical: screenHeight * 0.01,
    backgroundColor: '#1976d2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: screenWidth * 0.05,
    fontWeight: 'bold',
    fontFamily: 'Ubuntu-Bold',
  },
  signupText: {
    marginTop: screenHeight * 0.01,
    fontSize: screenWidth * 0.037,
    marginBottom: screenHeight * 0.04,
  },
  signupLink: {
    fontFamily: 'Ubuntu-Bold',
    textDecorationLine: 'underline',
    color: '#1976d2',
  },
  socialLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: screenHeight * 0.04,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.02,
    marginHorizontal: screenWidth * 0.015,
    height: screenHeight * 0.04,
    width: screenWidth * 0.3,
  },
  kakaoButton: {
    backgroundColor: '#fee500',
  },
  naverButton: {
    backgroundColor: '#03c75a',
  },
  kakaoText: {
    fontSize: screenWidth * 0.03,
    color: '#000000',
    fontFamily: 'Ubuntu-Bold',
  },
  naverText: {
    fontSize: screenWidth * 0.03,
    color: '#ffffff',
    fontFamily: 'Ubuntu-Bold',
  },
  socialIcon: {
    width: screenWidth * 0.05,
    height: screenWidth * 0.05,
    marginRight: screenWidth * 0.015,
  },
  footer: {
    position: 'absolute',
    bottom: screenHeight * 0.06,
    fontSize: screenWidth * 0.03,
    color: '#BCBCBC',
    fontFamily: 'Ubuntu-Regular',
  },
});
