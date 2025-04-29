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
  } from 'react-native';
  
import { useRouter } from 'expo-router';
import DefaultText from '@/components/DefaultText';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function InputNewsPage() {
  const router = useRouter();
  const [newsText, setNewsText] = useState('');

  // ScrollView에 대한 ref
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSubmit = () => {
    console.log(newsText);
    router.push('/SectionPage');
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
            <Pressable onPress={() => router.push('/')}>
            <Image
                source={require('../assets/images/back.png')}
                style={styles.topLeftIcon}
            />
            </Pressable>

            {/* 타이틀 */}
            <DefaultText style={styles.title}>
            학습할 기사의 원문을 입력하세요
            </DefaultText>

            {/* 입력창 (스크롤 가능, 자동 스크롤 포함) */}
            <View style={styles.inputWrapper}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollArea}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
            >
                <TextInput
                style={styles.inputBox}
                placeholder="여기에 기사를 입력하세요"
                placeholderTextColor="#aaa"
                multiline
                value={newsText}
                onChangeText={setNewsText}
                onContentSizeChange={handleContentSizeChange}
                textAlignVertical="top"
                scrollEnabled={false} // 스크롤은 ScrollView가 담당
                />
            </ScrollView>
            </View>

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
