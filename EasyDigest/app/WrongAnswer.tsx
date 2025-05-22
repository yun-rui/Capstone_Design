import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DefaultText from '@/components/DefaultText';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function WrongAnswer() {
  const router = useRouter();
  const {
    correctWord,
    correctMeaning,
    correctIndex,
    wrongWord,
    wrongMeaning,
    article_id,
  } = useLocalSearchParams();

  return (
    <View style={styles.container}>
        {/* 상단 틀렸습니다 안내 */}
        <View style={styles.noticeRow}>
            <Image source={require('../assets/images/wrong.png')} style={styles.icon} />
            <View style={styles.textColumn}>
                <DefaultText style={styles.headerText}>틀렸습니다</DefaultText>
                <DefaultText style={styles.subText}>정답을 확인하고 공부해주세요!</DefaultText>
            </View>
        </View>

        <View style={styles.mainDivider} />

        {/* 정답 단어 박스 */}
        <View style={styles.answerBox}>
            <View style={styles.row}>
            <View style={styles.circle}>
                <Text style={styles.circleText}>{correctIndex}</Text>
            </View>
            <Text style={styles.correctText}>{correctWord}</Text>
            </View>
        </View>

        {/* 정답 설명 */}
        <ScrollView style={styles.scrollBox} contentContainerStyle={{ padding: screenWidth * 0.04 }}>
            <Text style={styles.correctExplanation}>{correctMeaning}</Text>
        </ScrollView>

        <View style={styles.mainDivider} />

        {/* 오답 단어 및 설명 */}
        <Text style={styles.selectText}>[고른 단어]</Text>
        <Text style={styles.selectWord}>{wrongWord}</Text>
        <ScrollView style={styles.scrollBox}>
            <Text style={styles.selectExplanation}>{wrongMeaning}</Text>
        </ScrollView>

        {/* 완료 버튼 */}
        <Pressable
          style={styles.button}
          onPress={() =>
            router.replace({
              pathname: '/SummaryPage',
              params: { article_id: article_id },
            })
          }
        >            
          <Text style={styles.buttonText}>학습 완료</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: screenWidth * 0.08,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: screenHeight * 0.08,
    gap: screenWidth * 0.05,
  },
  icon: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    resizeMode: 'contain',
  },
  textColumn: {
    flexDirection: 'column',
  },
  headerText: {
    fontSize: screenWidth * 0.07,
    fontFamily: 'Ubuntu-Bold',
    color: '#FF4C4C',
  },
  subText: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Ubuntu-Regular',
    color: '#666',
  },
  mainDivider: {
    height: screenHeight * 0.002,
    backgroundColor: '#1976d2',
    width: '100%',
    marginTop: screenHeight * 0.03,
  },
  answerBox: {
    marginTop: screenHeight * 0.04,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.02,
  },
  circle: {
    width: screenWidth * 0.14,
    height: screenWidth * 0.14,
    borderRadius: screenWidth * 0.1,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: screenWidth * 0.05,
  },
  circleText: {
    color: 'white',
    fontSize: screenWidth * 0.045,
    fontFamily: 'Ubuntu-Bold',
  },
  correctText: {
    fontSize: screenWidth * 0.07,
    fontFamily: 'Ubuntu-Bold',
  },
  scrollBox: {
    maxHeight: screenHeight * 0.15,
    marginBottom: screenHeight * 0.01,
    //borderWidth: 1,
    //borderColor: '#ccc',
    borderRadius: 8,
    //padding: screenWidth * 0.04,
    width: '100%',
  },
  correctExplanation: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Ubuntu-Regular',
  },

  selectText: {
    fontSize: screenWidth * 0.06,
    fontFamily: 'Ubuntu-Bold',
    marginBottom: screenHeight * 0.005,
    alignSelf: 'flex-start',
    marginTop: screenHeight * 0.04,
  },
  selectWord: {
    alignSelf: 'flex-start',
    fontSize: screenWidth * 0.06,
    fontFamily: 'Ubuntu-Bold',
    marginTop: screenHeight * 0.03,
    marginBottom: screenHeight * 0.02,
    color: '#FFAC33',
  },
  selectExplanation: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Ubuntu-Regular',
  },
  button: {
    position: 'absolute',
    bottom: screenHeight * 0.05,
    backgroundColor: '#1976d2',
    paddingVertical: screenHeight * 0.015,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: screenWidth * 0.07,
    fontFamily: 'Ubuntu-Bold',
    textAlign: 'center',
  },
});
