import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function SectionPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push('/')}>
        <Image source={require('../assets/images/back.png')} style={styles.topLeftIcon} />
      </Pressable>

      <Text style={styles.title}>EasyDigest</Text>

      {/* 카드 1 */}
      <Pressable
        onPress={() => router.push('/InputNews')}
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
            <Text
              style={[
                styles.cardText,
                { color: pressed ? 'white' : '#1976d2' },
              ]}
            >
              학습하러 가기
            </Text>
          </>
        )}
      </Pressable>

      {/* 카드 2 */}
      <Pressable
        onPress={() => router.push('/LoginPage')}
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
            <Text
              style={[
                styles.cardText,
                { color: pressed ? 'white' : '#1976d2' },
              ]}
            >
              My Page
            </Text>
          </>
        )}
      </Pressable>

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
  
  topLeftIcon: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    position: 'absolute',
    top: screenHeight * 0.06,
    right: screenWidth * 0.37,
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
  footer: {
    position: 'absolute',
    bottom: screenHeight * 0.06,
    fontSize: screenWidth * 0.03,
    color: '#BCBCBC',
    fontFamily: 'Ubuntu-Regular',
  },
});
