import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SectionPage() {
  const router = useRouter();

  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('nickname');

      Alert.alert('로그아웃', '로그아웃 되었습니다.');
      router.replace('/LoginPage');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EasyDigest</Text>

      {/* 학습하러 가기 */}
      <Pressable
        onPress={() => router.push('/ViewNewsPage')}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: pressed ? '#1976d2' : 'white',
            borderColor: '#1976d2',
            borderWidth: 2,
          },
        ]}
      >
        {({ pressed }) => (
          <>
            <Image source={require('../assets/images/study.png')} style={styles.icon} />
            <Text style={[styles.cardText, { color: pressed ? 'white' : '#1976d2' }]}>
              학습하러 가기
            </Text>
          </>
        )}
      </Pressable>

      {/* My Page */}
      <Pressable
        onPress={() => router.push('/MyPage')}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: pressed ? '#1976d2' : 'white',
            borderColor: '#1976d2',
            borderWidth: 2,
          },
        ]}
      >
        {({ pressed }) => (
          <>
            <Image source={require('../assets/images/icon.png')} style={styles.icon} />
            <Text style={[styles.cardText, { color: pressed ? 'white' : '#1976d2' }]}>
              My Page
            </Text>
          </>
        )}
      </Pressable>

      {/* 🔽 Logout 버튼 */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>© Copyright. 2025 EasyDigest Co., Ltd.</Text>
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
    marginBottom: screenHeight * 0.10,
  },
  card: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.1,
    marginVertical: screenHeight * 0.025,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: screenWidth * 0.025,
  },
  cardText: {
    fontSize: screenWidth * 0.06,
    fontFamily: 'Ubuntu-Bold',
  },
  icon: {
    width: screenWidth * 0.09,
    height: screenWidth * 0.09,
    resizeMode: 'contain',
  },
  logoutButton: {
    marginTop: screenHeight*0.05,
  },
  logoutText: {
    fontSize: screenWidth * 0.06,
    color: '#1976d2',
    textDecorationLine: 'underline',
    fontFamily: 'Ubuntu-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: screenHeight * 0.06,
    fontSize: screenWidth * 0.03,
    color: '#BCBCBC',
    fontFamily: 'Ubuntu-Regular',
  },
});
