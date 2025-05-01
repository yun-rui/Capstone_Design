import React,{ useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import DefaultText from '@/components/DefaultText';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function MyPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const loadNickname = async () => {
      const saved = await AsyncStorage.getItem('nickname');
      if (saved) {
        setNickname(saved);
      } else {
        Alert.alert('로그인이 필요합니다.', '', [
          { text: '확인', onPress: () => router.replace('/LoginPage') },
        ]);
      }
    };
    loadNickname();
  }, []);
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/SectionPage')}>
          <Image source={require('../assets/images/back.png')} style={styles.topLeftIcon} />
      </TouchableOpacity>
      {/* 상단 타이틀 */}
      <View style={styles.header}>
        <DefaultText style={styles.title}>My Page</DefaultText>
      </View>

      {/* 메인 구분선 */}
      <View style={styles.mainDivider} />

      {/* 프로필 영역 */}
      <TouchableOpacity style={styles.profileContainer}>
        <Image source={require('../assets/images/icon.png')} style={styles.profileIcon} />
        <DefaultText style={styles.nickname}>{nickname}</DefaultText>
        <Image source={require('../assets/images/front.png')} style={styles.arrowIcon} />
      </TouchableOpacity>


      {/* 일반 구분선 */}
      <View style={styles.divider} />

      {/* 학습 기록 */}
      <TouchableOpacity style={styles.recordContainer}>
        <DefaultText style={styles.recordText}>MY 학습 기록</DefaultText>
      </TouchableOpacity>

      <View style={styles.divider} />
      <DefaultText style={styles.footer}>© Copyright. 2025 EasyDigest Co., Ltd.</DefaultText>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topLeftIcon: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    position: 'absolute',
    top: screenHeight * 0.1,
    left: screenWidth * 0.06,
  },
  header: {
    paddingTop: screenHeight * 0.12,
    paddingBottom: screenHeight * 0.05,
    alignItems: 'center',
  },
  title: {
    fontSize: screenWidth * 0.09,
    fontFamily: 'Ubuntu-Bold',
  },
  mainDivider: {
    height: screenHeight * 0.006,
    backgroundColor: '#1976d2',
    width: '100%',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.1,
    paddingVertical: screenHeight * 0.05,
  },
  profileIcon: {
    width: screenWidth * 0.16,
    height: screenWidth * 0.16,
    marginRight: screenWidth * 0.1,
  },
  arrowIcon: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    position: 'absolute',
    right: screenWidth * 0.1,   
  },
  nickname: {
    fontSize: screenWidth * 0.07,
    fontFamily: 'Ubuntu-Bold',
  }, 
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
  },
  recordContainer: {
    paddingHorizontal: screenWidth * 0.09,
    paddingVertical: screenHeight * 0.05,
  },
  recordText: {
    fontSize: screenWidth * 0.07,
    fontFamily: 'Ubuntu-Bold',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: screenHeight * 0.06,
    fontSize: screenWidth * 0.03,
    color: '#BCBCBC',
    fontFamily: 'Ubuntu-Regular',
    right: screenWidth*0.24,
  },
});
