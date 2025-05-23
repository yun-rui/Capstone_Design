import React, { useEffect, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Dimensions, Alert, Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefaultText from '@/components/DefaultText';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function SummaryPage() {
    const router = useRouter();
    const { article_id, summary } = useLocalSearchParams();
    const articleID = Number(article_id);

    type WordItem = {
        id: number;
        word: string;
        description: string;
    };

    const [wordList, setWordList] = useState<WordItem[]>([]);

    useEffect(() => {
        if (!article_id || isNaN(articleID)) {
        Alert.alert('잘못된 접근', 'article_id가 존재하지 않습니다.');
        return;
        } else if (!summary) {
        Alert.alert('잘못된 접근', 'summary가 존재하지 않습니다.');
        return;
        }
        fetchWords();
    }, []);

    const fetchWords = async () => {
        try {
        const token = await AsyncStorage.getItem('access_token');
        const res = await fetch(`http://172.20.10.2:8000/api/words/article/${articleID}`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('❌ 서버 응답 오류:', errorText);
            Alert.alert('단어 로딩 실패', '서버와의 인증에 실패했을 수 있습니다.');
            return;
        }

        const data = await res.json();
        setWordList(data);
        } catch (err) {
        console.error('❌ 요청 실패:', err);
        Alert.alert('에러', '단어 요청 중 문제가 발생했습니다.');
        }
    };

    const handleComplete = () => {
        router.push('/SectionPage');
    };

    return (
        <View style={styles.container}>
        <ScrollView style={styles.articleBox}>
            <Text style={styles.articleText}>
            {summary}
            </Text>
        </ScrollView>

        <View style={styles.mainDivider} />

        <View style={styles.termBox}>
            <ScrollView style={{ maxHeight: screenHeight * 0.3 }}>
            {wordList.map((word, idx) => (
                <View style={styles.termItem} key={idx}>
                <View style={styles.row}>
                    <Image source={require('../assets/images/check.png')} style={styles.checkIcon} />
                    <Text
                    style={[
                        styles.termTitle,
                        { color: idx % 2 === 0 ? '#FFAC33' : '#FF0000' }
                    ]}
                    >
                    {word.word}
                    </Text>
                </View>
                <DefaultText style={styles.termDesc}>{word.description}</DefaultText>
                </View>
            ))}
            </ScrollView>
        </View>

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
    articleBox: {
        borderRadius: 12,
        maxHeight: screenHeight * 0.3,
        marginTop: screenHeight * 0.12,
        width: '100%',
    },
    articleText: {
        fontSize: screenWidth * 0.042,
        fontFamily: 'Ubuntu-Regular',
        color: '#000',
    },
    mainDivider: {
        height: screenHeight * 0.002,
        backgroundColor: '#1976d2',
        width: '100%',
        top: screenHeight * 0.45,
        position: 'absolute',
    },
    termBox: {
        width: '100%',
        marginTop: screenHeight * 0.05,
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
        marginRight: screenWidth * 0.04,
    },
    termTitle: {
        fontSize: screenWidth * 0.05,
        fontFamily: 'Ubuntu-Bold',
    },
    termDesc: {
        fontSize: screenWidth * 0.037,
        padding: screenWidth * 0.03,
        fontFamily: 'Ubuntu-Light',
    },
    button: {
        bottom: screenWidth * 0.2,
        position: 'absolute',
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
