import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import DefaultText from '@/components/DefaultText';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function MyPage() {
  const router = useRouter();
  const nickname = '홍길동'; // 추후 서버 연동 예정

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
    paddingHorizontal: screenWidth * 0.09,
    paddingVertical: screenHeight * 0.05,
  },
  profileIcon: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    marginRight: screenWidth * 0.04,
  },
  nickname: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Ubuntu-Bold',
    flex: 1,
  },
  arrowIcon: {
    width: screenWidth * 0.04,
    height: screenWidth * 0.04,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
  },
  recordContainer: {
    paddingHorizontal: screenWidth * 0.09,
    paddingVertical: screenHeight * 0.03,
  },
  recordText: {
    fontSize: screenWidth * 0.045,
    fontFamily: 'Ubuntu-Bold',
    textAlign: 'center',
  },
});
