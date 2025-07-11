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
  // 레벨 구현을 위한 정답 횟수 
  const [level, setLevel] = useState<number>(0);
  const [totalCorrectCount, setTotalCorrectCount] = useState<number>(0);

  useEffect(() => {
    const loadUserData = async() => {
      const token = await AsyncStorage.getItem('access_token');
      console.log('token:',token);
      if (!token){
        Alert.alert('로그인이 필요합니다.', '', [
          { text: '확인', onPress: () => router.replace('/LoginPage') },
        ]);
        return;
      }
      
      try{
        const res = await fetch('http://172.20.10.2:8000/api/users/me/',{
          headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        console.log('API response:',data);
        setNickname(data.nickname || '');
        console.log('nickname from API:',data.nickname);
        setTotalCorrectCount(data.total_correct_count || 0);
        setLevel(data.level || 0);
      } catch (err){
        console.error('유저 정보 로딩 실패', err);
      }
    };
    
    loadUserData();
  }, []);

  const getLevelImage = (level: number) => {
    switch (level) {
      case 1: return require('../assets/images/seed.png');
      case 2: return require('../assets/images/sprout.png');
      case 3: return require('../assets/images/pot.png');
      case 4: return require('../assets/images/flower.png');
      default: return require('../assets/images/tree.png');
    }
  };

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

      {/* 프로필 영역 (레벨 이미지 출력으로 변경) */}
      <TouchableOpacity style={styles.profileContainer} onPress={() => router.push('/ChangeProfile')}>
        <Image source={getLevelImage(level)} style={styles.profileIcon} />
        
        <View style={styles.nameWrapper}>
          <DefaultText style={styles.nickname}>{nickname || '닉네임 없음'}</DefaultText>
        </View>

        <Image source={require('../assets/images/front.png')} style={styles.arrowIcon} />
      </TouchableOpacity>



      {/* 일반 구분선 */}
      <View style={styles.divider} />

      {/* MY 학습 기록 */}
      <TouchableOpacity style={styles.recordContainer} onPress={() => router.push('/StudyRecord')}>
        <Image source={require('../assets/images/file.png')} style={styles.folderIcon} />
        
        <View style={styles.recordWrapper}>
          <DefaultText style={styles.recordText}>MY 학습</DefaultText>
        </View>

        <Image source={require('../assets/images/front.png')} style={styles.arrowIcon2} />
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
    height: screenHeight * 0.004,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.1,
    paddingVertical: screenHeight * 0.05,
  },
  recordWrapper: {
    flex: 1,
  },
  recordText: {
    fontSize: screenWidth * 0.07,
    fontFamily: 'Ubuntu-Bold',
  },
  folderIcon: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.13,
    marginRight: screenWidth * 0.1,
  },
  arrowIcon2: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    position: 'absolute',
    right: screenWidth * 0.1,
  },

  footer: {
    position: 'absolute',
    bottom: screenHeight * 0.06,
    fontSize: screenWidth * 0.03,
    color: '#BCBCBC',
    fontFamily: 'Ubuntu-Regular',
    right: screenWidth*0.24,
  },
  nameWrapper: {
  flex: 1,
  },
});
