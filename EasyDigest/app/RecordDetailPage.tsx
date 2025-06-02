import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefaultText from '@/components/DefaultText';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type WordItem = {
  id: number;
  word: string;
  description: string;
};

export default function RecordDetailPage() {
  const router = useRouter();
  const { article_id, summary } = useLocalSearchParams();
  const articleID = Number(article_id);

  const [wordList, setWordList] = useState<WordItem[]>([]);
  const [content, setContent] = useState<string>('');
  const [highlightedContent, setHighlightedContent] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!article_id || isNaN(articleID)) {
      Alert.alert('잘못된 접근', 'article_id가 존재하지 않습니다.');
      return;
    } else if (!summary) {
      Alert.alert('잘못된 접근', 'summary가 존재하지 않습니다.');
      return;
    }

    fetchWords();
    fetchContent();
  }, []);

  const fetchWords = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const url = `http://172.20.10.2:8000/api/words/article/${articleID}/`;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const res = await fetch(url, { method: 'GET', headers });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ 서버 응답 오류:', errorText);
        Alert.alert('단어 로딩 실패', `서버 오류: ${res.status}`);
        return;
      }

      const data = await res.json();
      setWordList(data);
    } catch (err) {
      console.error('❌ 요청 실패:', err);
      Alert.alert('에러', '단어 요청 중 문제가 발생했습니다.');
    }
  };

  const fetchContent = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await fetch('http://172.20.10.2:8000/api/articles/my/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const match = data.find((item: any) => item.article.id === articleID);
      if (match) {
        setContent(match.article.content);
      } else {
        Alert.alert('기사 본문을 찾을 수 없습니다.');
      }
    } catch (err) {
      Alert.alert('본문 로딩 실패', '서버 요청 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (content && wordList.length > 0) {
      const highlighted = highlightContentParts();
      setHighlightedContent(highlighted);
    }
  }, [content, wordList]);

  const highlightContentParts = (): React.ReactNode[] => {
    const wordColorMap: Record<string, string> = {};
    const wordIndexMap: Record<string, number> = {};

    // ✅ 단어 리스트 순서 그대로 사용
    wordList.forEach((item, idx) => {
      wordColorMap[item.word] = idx % 2 === 0 ? 'yellow' : 'red';
      wordIndexMap[item.word] = idx + 1;
    });

    let result: (string | JSX.Element)[] = [content];

    wordList.forEach((item) => {
      const colorStyle = wordColorMap[item.word] === 'yellow' ? styles.highlightYellow : styles.highlightRed;
      const wordLabel = `<${wordIndexMap[item.word]}>`;
      const newResult: (string | JSX.Element)[] = [];

      result.forEach((part) => {
        if (typeof part === 'string') {
          const splitParts = part.split(item.word);
          splitParts.forEach((sub, i) => {
            newResult.push(sub);
            if (i < splitParts.length - 1) {
              const key = `${item.word}-${wordIndexMap[item.word]}-${i}-${Math.random().toString(36).substr(2, 5)}`;
              newResult.push(
                <Text key={key} style={colorStyle}>
                  {item.word}
                  <Text style={styles.labelSmall}> {wordLabel}</Text>
                </Text>
              );
            }
          });
        } else {
          newResult.push(part);
        }
      });

      result = newResult;
    });

    return result;
  };


  const handleComplete = () => {
    router.push('/StudyRecord');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* 기사 원문 */}
        <View style={styles.contentBox}>
          <DefaultText style={styles.sectionLabel}>기사 원문</DefaultText>
          <View style={styles.labelDivider} />
          <Text style={styles.contentText}>
            {highlightedContent.length > 0 ? highlightedContent : '로딩 중...'}
          </Text>
        </View>
        <View style={styles.mainDivider} />
        

        {/* 학습한 단어 */}
        <View style={styles.termBox}>
          <DefaultText style={styles.sectionLabel}>학습한 단어</DefaultText>
          <View style={styles.labelDivider} />
          {wordList.map((word, idx) => (
            <View style={styles.termItem} key={idx}>
              <View style={styles.row}>
                <Image
                  source={require('../assets/images/check.png')}
                  style={styles.checkIcon}
                />
                <Text
                  style={[
                    styles.termTitle,
                    { color: idx % 2 === 0 ? '#FFAC33' : '#FF0000' },
                  ]}
                >
                  {word.word}
                </Text>
                <Text
                  style={[
                    styles.termNumberSmall,
                    { color: idx % 2 === 0 ? '#FFAC33' : '#FF0000' },
                  ]}
                >
                  {`  <${idx + 1}>`}
                </Text>
              </View>
              <DefaultText style={styles.termDesc}>{word.description}</DefaultText>
            </View>
          ))}
        </View>
        <View style={styles.mainDivider} />

        {/* 기사 요약 */}
        <View style={styles.summaryBox}>
          <DefaultText style={styles.sectionLabel}>기사 요약</DefaultText>
          <View style={styles.labelDivider} />
          <DefaultText style={styles.contentText}>{summary}</DefaultText>
        </View>
      </ScrollView>

      {/* 완료 버튼 */}
      <Pressable style={styles.button} onPress={handleComplete}>
        <Text style={styles.buttonText}>학습 완료</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: screenWidth * 0.07,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  scrollArea: {
    width: '100%',
    marginTop: screenHeight * 0.06,
  },
  contentBox: {
    marginTop: screenHeight * 0.02,
    marginBottom: screenHeight * 0.02,
  },
  sectionLabel: {
    fontSize: screenWidth * 0.06,
    fontFamily: 'Ubuntu-Bold',
  },
  labelDivider: {
    height: screenHeight * 0.002,
    backgroundColor: '#1976d2',
    width: screenWidth*0.25,
    alignItems: 'flex-start',
    marginBottom: screenHeight * 0.03,
  },
  contentText: {
    fontSize: screenWidth * 0.04,
    fontFamily: 'Ubuntu-Regular',
    color: '#3D3D3D',
    lineHeight: 22,
    flexWrap: 'wrap',
  },
  highlightYellow: {
    color: '#FFAC33',
    fontFamily: 'Ubuntu-Bold',
  },
  highlightRed: {
    color: '#FF0000',
    fontFamily: 'Ubuntu-Bold',
  },
  labelSmall: {
    fontSize: screenWidth * 0.032,
    fontFamily: 'Ubuntu-Bold',
  },
  mainDivider: {
    height: screenHeight * 0.002,
    backgroundColor: '#eee',
    width: '100%',
    marginBottom: screenHeight * 0.04,
  },

  termBox: {
    width: '100%',
    marginBottom: screenHeight * 0.02,
  },
  termItem: {
    marginBottom: screenHeight * 0.025,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: screenWidth * 0.05,
    height: screenWidth * 0.05,
    marginRight: screenWidth * 0.03,
  },
  termTitle: {
    fontSize: screenWidth * 0.05,
    fontFamily: 'Ubuntu-Bold',
  },
  termNumberSmall: {
    fontSize: screenWidth * 0.032,
    fontFamily: 'Ubuntu-Regular',
    marginLeft: screenWidth * 0.015,
  },
  termDesc: {
    fontSize: screenWidth * 0.037,
    padding: screenWidth * 0.03,
    fontFamily: 'Ubuntu-Light',
  },


  summaryBox: {
    marginBottom: screenHeight * 0.15,
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
