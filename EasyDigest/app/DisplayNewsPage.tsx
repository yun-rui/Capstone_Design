// React 17 이상부터는 import할 필요 없음 
import React, {useState} from 'react'; 
import {
    View,
    ScrollView, 
    Text,
    StyleSheet,
    Pressable, 
    Dimensions,
    Modal, // 단어 설명을 위한 팝업창 
} from 'react-native';
import {
    useRouter,
    useLocalSearchParams
} from 'expo-router';
import DefaultText from '@/components/DefaultText';

const screenHeight = Dimensions.get('window').height;
const screenwidth = Dimensions.get('window').width;

export default function DisplayNewsPage(){
    const router = useRouter();
    const {content} = useLocalSearchParams(); // InputNews에서 넘겨받은 기사 내용 

    const [selectedWord, setSelectedWord] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleWordPress = (word: string) => {
        setSelectedWord(word);
        setModalVisible(true);
    };

    const handleComplete = () => {
        // 다음 단계로 넘어가는 로직
        router.push('/SectionPage');
    };
    
    // 기사 내용을 공백 포함 분할 (단어 단위로)
    const words = (content as string)?.split(/(\s+)/);
    
    return(
        <View style={styles.container}>
            <ScrollView style={styles.scrollBox}>
                <Text style={styles.newsText}>
                    {words.map((word, index) => {
                        //공백은 그대로 출력
                        if (word.trim() === '') return word;
                        return (
                            <Text
                            key = {index}
                            style = {styles.word}
                            onPress={()=> handleWordPress(word)}
                            >
                                {word}
                            </Text>
                        );
                    })}
                </Text>
            </ScrollView>
            
            <Text style={styles.tipText}>
                모르는 단어를 클릭해 쉬운 설명을 확인해보세요 ! 
            </Text>

            <Pressable style={styles.button} onPress={handleComplete}>
                <DefaultText style={styles.buttonText}>완료</DefaultText>
            </Pressable>

            {/*단어 설명 팝업*/}
            <Modal
                visible={modalVisible}
                transparent
                antimationType="fade"
                onRequestClose={()=>setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>{selectedWord}</Text>
                            <Text style={styles.modalDescription}>이 단어에 대한 설명을 적울 예정</Text>
                            <Pressable onPress={()=> setModalVisible(false)} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>닫기</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
        </View>
    );
}

const styles= StyleSheet.create({
    container: {
        flex:1, 
        padding: screenwidth*0.07,
        backgroundColor: 'white',
    },
    scrollBox: {
        flex:1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: screenwidth*0.04,
        marginBottom: screenHeight*0.03,
    },
    newsText: {
        fontSize: screenwidth*0.04,
        fontFamily: 'Ubuntu-Light',
        color: '#333',
    },
    word:{
        color: '#333',
    },
    tipText:{
        fontSize: screenwidth*0.035,
        color: '#666',
        marginBottom: screenHeight*0.015,
        textAlign:'center',
    },
    button:{
        backgroundColor: '#1976d2',
        paddingVertical: screenHeight*0.018,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: screenwidth*0.045,
        fontFamily: 'Ubuntu-Bold',
    },
    modalOverlay:{
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox:{
        backgroundColor: 'white',
        padding: screenwidth*0.06,
        borderRadius: 12,
        width: screenwidth*0.8,
    },
    modalTitle: {
        fontSize: screenwidth*0.05,
        fontFamily: 'Ubuntu-Bold',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: screenwidth*0.04,
        fontFamily: 'Ubuntu-Regular',
        marginBottom: 20,
    },
    modalButton: {
        alignSelf: 'flex-end',
    },
    modalButtonText: {
        color: '#1976d2',
        fontSize: screenwidth*0.04,
        fontFamily: 'Ubuntu-Bold',
    },
});