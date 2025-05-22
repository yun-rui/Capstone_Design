import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import { useRouter, useLocalSearchParams  } from 'expo-router';
import DefaultText from '@/components/DefaultText';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function CorrectAnswer() {
    const router = useRouter();
    const { article_id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
        <Image source={require('../assets/images/congratulation.png')} style={styles.icon} />
        <DefaultText style={styles.correctText}>정답입니다!</DefaultText>
        <DefaultText style={styles.subText}>지금처럼 열심히 공부해주세요!</DefaultText>
        <Pressable style={styles.button}
            onPress={() => router.replace({
            pathname: '/SummaryPage',
            params: { article_id: article_id }, 
            })}
        >            
        <Text style={styles.buttonText}>학습 완료</Text>
        </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: screenWidth * 0.1,
    },
    icon: {
        width: screenWidth * 0.25,
        height: screenWidth * 0.25,
        position: 'absolute',
        top: screenHeight*0.35,
    },
    correctText: {
        fontSize: screenWidth * 0.1,
        fontFamily: 'Ubuntu-Bold',
        marginTop: screenHeight*0.14,
        position:'absolute',
        top: screenHeight*0.35,
    },
    subText: {
        fontSize: screenWidth * 0.04,
        fontFamily: 'Ubuntu-Regular',
        color: '#444',
        marginTop: screenHeight*0.6,
    },
    button: {
        bottom: screenWidth*0.2,
        position:'absolute',
        backgroundColor: '#1976d2',
        paddingVertical: screenHeight * 0.015,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%'
    },
    buttonText: {
        color: 'white',
        fontSize: screenWidth * 0.07,
        fontFamily: 'Ubuntu-Bold',
        textAlign:'center',
    },
});
