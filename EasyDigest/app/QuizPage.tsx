import React, { useEffect, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, Alert, Dimensions, ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefaultText from '@/components/DefaultText';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function QuizPage() {
    const router = useRouter();
    const { article_id } = useLocalSearchParams();
    console.log("🧪 전달된 article_id:", article_id); 

    const [question, setQuestion] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [correctId, setCorrectId] = useState<number | null>(null);
    interface Choice {
        id: number;
        word: string;
        description: string;
    }

    const [choices, setChoices] = useState<Choice[]>([]);
    const [correctChoice, setCorrectChoice] = useState<Choice | null>(null);
    
    useEffect(() => {
        fetchQuiz();
    }, []);

    const fetchQuiz = async () => {
        const token = await AsyncStorage.getItem('access_token');
        const res = await fetch('http://172.20.10.2:8000/api/words/generate-quiz/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ article_id: article_id }),
        });

        const data = await res.json();

        if (res.ok && data.choices) {
        setChoices(data.choices);
        const correct = data.choices.find((c: any) => c.word === data.question_word);
        if (correct) {
            setCorrectId(correct.id);
            setQuestion(correct.description);
            setCorrectChoice(correct);
        }
        } else {
        Alert.alert('⚠️ 퀴즈 생성 실패', data.message || '퀴즈가 없습니다.');
        router.replace('/SectionPage');
        }
    };

    const handleSubmit = async () => {
        if (selectedId === null) {
        Alert.alert('선택 필요', '하나의 단어를 골라주세요.');
        return;
        }

        if (correctId === null) return;

        const selected = choices.find((c: any) => c.id === selectedId);
        if (!selected) {
        Alert.alert('에러', '선택한 단어 정보를 찾을 수 없습니다.');
        return;
        }

        const token = await AsyncStorage.getItem('access_token');
        const res = await fetch('http://172.20.10.2:8000/api/words/quiz/submit/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            question_word_id: correctId,
            is_correct: selectedId === correctId,
        }),
        });

        const data = await res.json();

        if (!res.ok) {
        Alert.alert('제출 실패', data.message || '서버 오류가 발생했습니다.');
        return;
        }

        const correctIndex = choices.findIndex((c: any) => c.id === correctId);

        if (selectedId === correctId) {
        router.replace('/CorrectAnswer');
        } else {
        router.replace({
            pathname: '/WrongAnswer',
            params: {
            correctWord: correctChoice?.word,
            correctMeaning: correctChoice?.description,
            correctIndex: correctIndex + 1,
            wrongWord: selected.word,
            wrongMeaning: selected.description,
            },
        });
        }
  };

  return (
    <View style={styles.container}>
        <DefaultText style={styles.title}>설명을 보고 단어를 맞추세요.</DefaultText>
        <View style={styles.mainDivider} />
        <ScrollView style={styles.descriptionBox}>
            <Text style={styles.question}>{question}</Text>
        </ScrollView>

        {choices.map((choice: any, idx: number) => (
            <Pressable
            key={choice.id}
            style={styles.optionContainer}
            onPress={() => setSelectedId(choice.id)}
            >
            <View style={[styles.circle, selectedId === choice.id && styles.selectedCircle]}>
                <Text style={[styles.circleText, selectedId === choice.id && styles.selectedCircleText]}>
                {idx + 1}
                </Text>
            </View>
            <Text style={[styles.optionText, selectedId === choice.id && styles.selectedText]}>
                {choice.word}
            </Text>
            </Pressable>
        ))}

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>선택</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: screenWidth * 0.07,
        backgroundColor: 'white',
    },
    title: {
        fontSize: screenWidth * 0.05,
        textAlign: 'center',
        fontFamily: 'Ubuntu-Bold',
        marginTop: screenHeight * 0.08,
    },
    mainDivider: {
        height: screenHeight * 0.002,
        marginTop: screenHeight * 0.04,
        backgroundColor: '#1976d2',
        width: '100%',
    },
    descriptionBox: {
        maxHeight: screenHeight * 0.2,
        paddingHorizontal: screenWidth * 0.04,
        paddingVertical: screenHeight * 0.015,
        borderWidth: 1,
        borderColor: '#1976d2',
        borderRadius: 10,
        marginVertical: screenHeight * 0.05,
    },
    question: {
        fontSize: screenWidth * 0.04,
        fontFamily: 'Ubuntu-Regular',
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: screenHeight * 0.025,
    },
    circle: {
        width: screenWidth * 0.14,
        height: screenWidth * 0.14,
        borderRadius: screenWidth * 0.1,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: screenWidth * 0.04,
    },
    circleText: {
        color: 'white',
        fontSize: screenWidth * 0.04,
        fontFamily: 'Ubuntu-Bold',
    },
    optionText: {
        fontSize: screenWidth * 0.045,
        fontFamily: 'Ubuntu-Regular',
        color: '#000',
    },
    selectedCircle: {
        backgroundColor: '#1976d2',
    },
    selectedCircleText: {
        color: 'white',
    },
    selectedText: {
        fontFamily: 'Ubuntu-Bold',
        color: '#1976d2',
        fontSize: screenWidth * 0.05,
    },
    submitButton: {
        marginTop: screenHeight * 0.04,
        backgroundColor: '#1976d2',
        paddingVertical: screenHeight * 0.02,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontSize: screenWidth * 0.045,
        fontFamily: 'Ubuntu-Bold',
    },
});
