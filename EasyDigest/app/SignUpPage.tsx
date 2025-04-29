import React, { useState } from 'react';
import { Platform, View, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DefaultText from '@/components/DefaultText';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function SignUpPage() {
  const router = useRouter();
  const [interestInput, setInterestInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <TextInput style={styles.input_short} />
        <TouchableOpacity style={styles.subButton}>
          <DefaultText style={styles.subButtonText}>중복확인</DefaultText>
        </TouchableOpacity>
      </View>

      <DefaultText style={styles.label}>비밀번호</DefaultText>
      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputFlex}
          secureTextEntry={!showPassword}
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
          secureTextEntry={!showPassword}
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
      <TextInput style={styles.input} />

      <DefaultText style={styles.label}>이메일</DefaultText>
      <View style={styles.inputRow}>
        <TextInput style={styles.input_short} />
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

      <TouchableOpacity style={styles.submitButton} onPress={() => router.push('/SectionPage')}>
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
