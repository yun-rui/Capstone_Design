import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import DefaultText from '@/components/DefaultText';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function LoginPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <DefaultText style={styles.title}>EasyDigest</DefaultText>

      <TextInput placeholder="ID를 입력하세요" style={styles.input} />
      <TextInput placeholder="비밀번호를 입력하세요" secureTextEntry style={styles.input} />

      <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/SectionPage')}>
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
    padding: screenWidth * 0.07, // 가로 길이의 5% padding
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
