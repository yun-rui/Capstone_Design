import React, { useState } from 'react';
import { Platform, View, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DefaultText from '@/components/DefaultText';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function SignUpPage() {
  const router = useRouter();

  // ✅ 입력값 상태 정의
  const [idInput, setIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (passwordInput !== confirmPasswordInput) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.35.109:8000/api/users/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: idInput,
          password: passwordInput,
          nickname: nameInput,
          email: emailInput,
          interest: interestInput,
        }),
      });
      const contentType = response.headers.get('content-type');
  
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('서버 응답이 JSON이 아님:', text); // HTML 오류일 경우 여기에 찍힘
        Alert.alert('서버 오류', 'JSON이 아닌 응답이 도착했습니다.');
        return;
      }
  
      const result = await response.json();

      if (response.ok) {
        Alert.alert('회원가입 완료!');
        router.push('/LoginPage');
      } else {
        Alert.alert('회원가입 실패', result.error || '내용을 입력해주세요');
      }
  
    } catch (error) {
      Alert.alert('서버 연결 실패', '서버가 켜져 있는지 확인하세요.');
      console.error('Fetch 에러:', error);
    }
  };
  const handleCheckDuplicate = async () => {
    if (!idInput) {
      Alert.alert('아이디를 입력하세요.');
      return;
    }
  
    try {
      const response = await fetch(`http://192.168.35.109:8000/api/users/check-username/?username=${idInput}`, {
        method: 'GET',
      });
  
      const result = await response.json();
  
      if (result.exists) {
        Alert.alert('❌ 이미 존재하는 ID입니다.', '다른 ID를 입력해주세요.');
      } else {
        Alert.alert('✅ 사용 가능한 ID입니다.');
      }
    } catch (error) {
      console.error('중복확인 오류:', error);
      Alert.alert('서버 오류', '서버에 연결할 수 없습니다.');
    }
  };  
  
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => router.push('/')}>
        <Image source={require('../assets/images/back.png')} style={styles.topLeftIcon} />
      </TouchableOpacity>

      <DefaultText style={styles.title}>회원가입</DefaultText>
      <Image source={require('../assets/images/icon.png')} style={styles.icon} />

      <DefaultText style={styles.label}>아이디</DefaultText>
      <View style={styles.inputRow}>
        <TextInput style={styles.input_short} value={idInput} onChangeText={setIdInput} />
        <TouchableOpacity style={styles.subButton} onPress={handleCheckDuplicate}>
          <DefaultText style={styles.subButtonText}>중복확인</DefaultText>
        </TouchableOpacity>
      </View>

      <DefaultText style={styles.label}>비밀번호</DefaultText>
      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputFlex}
          secureTextEntry={!showPassword}
          value={passwordInput}
          onChangeText={setPasswordInput}
          textContentType="newPassword"
          autoComplete="password-new"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={
              showPassword
                ? require('../assets/images/password.png')
                : require('../assets/images/closepassword.png')
            }
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>

      <DefaultText style={styles.label}>비밀번호 확인</DefaultText>
      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputFlex}
          secureTextEntry={!showConfirmPassword}
          value={confirmPasswordInput}
          onChangeText={setConfirmPasswordInput}
          textContentType="newPassword"
          autoComplete="password-new"
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Image
            source={
              showConfirmPassword
                ? require('../assets/images/password.png')
                : require('../assets/images/closepassword.png')
            }
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>

      <DefaultText style={styles.label}>이름</DefaultText>
      <TextInput style={styles.input} value={nameInput} onChangeText={setNameInput} />

      <DefaultText style={styles.label}>이메일</DefaultText>
      <View style={styles.inputRow}>
        <TextInput style={styles.input_short} value={emailInput} onChangeText={setEmailInput} />
        <TouchableOpacity style={styles.subButton}>
          <DefaultText style={styles.subButtonText}>인증하기</DefaultText>
        </TouchableOpacity>
      </View>

      <DefaultText style={styles.label}>관심분야 설정</DefaultText>
      <TextInput
        style={styles.selectedInput}
        value={interestInput}
        onChangeText={setInterestInput}
      />

      <View style={styles.interestsContainer}>
        {['정치', '경제', '문화', '과학', '연예/스포츠'].map((item) => (
          <TouchableOpacity key={item} style={styles.interestButton} onPress={() => setInterestInput(item)}>
            <DefaultText style={styles.interestText}>{item}</DefaultText>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSignUp}>
        <DefaultText style={styles.submitButtonText}>회원가입하기</DefaultText>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: screenWidth * 0.07, 
    backgroundColor: 'white',
  },
  topLeftIcon: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    position: 'absolute',
    top: screenHeight * 0.06,
    right: screenWidth * 0.37,
  },
  title: {
    fontSize: screenWidth * 0.07,
    fontFamily: 'Ubuntu-Bold',
    marginTop: screenHeight * 0.1,
    marginBottom: screenHeight * 0.02,
  },
  icon: {
    width: screenWidth * 0.115,
    height: screenWidth * 0.115,
    marginBottom: screenHeight * 0.02,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: screenWidth * 0.03,
    marginTop: screenHeight * 0.015,
    marginBottom: screenHeight * 0.002,
    fontFamily: 'Ubuntu-Bold',
    fontSize: screenWidth * 0.038,
  },
  input_short: {
    width: screenWidth * 0.65,
    height: screenHeight * 0.04,
    paddingHorizontal: screenWidth * 0.02,
    fontSize: screenWidth * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontFamily: 'Ubuntu-Light',
  },
  input: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.04,
    paddingHorizontal: screenWidth * 0.02,
    fontSize: screenWidth * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontFamily: 'Ubuntu-Light',
  },
  inputRow: {
    flexDirection: 'row',
    width: screenWidth * 0.85,
    gap: screenWidth * 0.03,
    alignItems: 'center',
  },
  subButton: {
    width: screenWidth * 0.2,
    height: screenHeight * 0.04,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subButtonText: {
    fontSize: screenWidth * 0.035,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: screenWidth * 0.85,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputFlex: {
    flex: 1,
    height: screenHeight * 0.04,
    paddingHorizontal: screenWidth * 0.02,
    fontSize: screenWidth * 0.04,
    fontFamily: 'Ubuntu-Light',
  },
  iconRight: {
    width: screenWidth * 0.05,
    height: screenWidth * 0.05,
    marginLeft: screenWidth * 0.02,
  },
  selectedInput: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.04,
    paddingHorizontal: screenWidth * 0.02,
    fontSize: screenWidth * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontFamily: 'Ubuntu-Light',
    marginBottom: screenHeight * 0.02,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: screenWidth * 0.85,
    gap: screenWidth * 0.02,
  },
  interestButton: {
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.012,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  interestText: {
    fontSize: screenWidth * 0.035,
  },
  submitButton: {
    backgroundColor: '#1976d2',
    borderRadius: 15,
    marginTop: screenHeight * 0.03,
    width: screenWidth * 0.85,
    height: screenHeight * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: screenWidth * 0.05,
    fontFamily: 'Ubuntu-Bold',
  },
});
