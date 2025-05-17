import AsyncStorage from '@react-native-async-storage/async-storage'; // 상단에 추가

// React 17 이상부터는 import할 필요 없음 
import React, {useState} from 'react'; 
import {
    View,
    ScrollView, 
    Text,
    StyleSheet,
    Pressable, 
    Dimensions,
    Modal,
    TextInput, // 단어 설명을 위한 팝업창 
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
    const {content, article_id} = useLocalSearchParams(); // InputNews에서 넘겨받은 기사 내용 
    const article = content as string;
    const articleID = Number(article_id);

    const [selectedWord, setSelectedWord] = useState('');
    const [wordDefinition, setWordDefinition] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selection, setSelection] = useState({start:0, end:0});
    const [askCount, setAskCount] = useState<number | null>(null);
    
    const handleSelectionChange = (event: any)=>{
        const {start, end} = event.nativeEvent.selection;
        const word = article.slice(start, end);
        setSelection({start, end});
        setSelectedWord(word);
        console.log("선택된 단어:", word);
    };

    const handleLookup = async () =>{
        console.log('🟡 handleLookup 진입');
        if (!selectedWord || !articleID) return;

        try{
            const token = await AsyncStorage.getItem('access_token');
            const response = await fetch('http://172.20.10.2:8000/api/words/learn/',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // ✅ 토큰 포함
                },
                body: JSON.stringify({
                    word_text: selectedWord,
                    article_id: articleID,
                }),
            });    

    if (response.ok){
        const data = await response.json();
        console.log('백엔드 응답답:',data);
        setWordDefinition(data.description || '설명을 찾을 수 없습니다.');
        setAskCount(data.ask_count); // 횟수 저장 
    } else {
        setWordDefinition('해당 단어에 대한 설명을 가져오지 못했습니다.');
      }
    } catch (err) {
      console.error('Error:', err);
      setWordDefinition('오류가 발생했습니다.');
    }

    setModalVisible(true);
    };

    const handleComplete = () => {
        // 다음 단계로 넘어가는 로직
        router.push({
        pathname: '/QuizPage',
        params: { article_id: articleID.toString() }, 
});

    };
        
    return(
        <View style={styles.container}>
            {/*상단 고정 버튼*/}
            <View style={styles.topBar}>
                <Pressable style={styles.searchButton} onPress={handleLookup}>
                    <Text style={styles.searchButtonText}>🔍검색</Text>
                </Pressable>
            </View>
            {/*기사 텍스트 입력창*/}
                <TextInput
                    style={styles.textInput}
                    multiline
                    editable={false}
                    value = {article}
                    onSelectionChange={handleSelectionChange}
                    selection={selection}
                    textAlignVertical = "top"
                />

            <Text style={styles.tipText}>
                모르는 단어를 드래그해 오른쪽 위 '🔍검색'을 눌러보세요 ! 
            </Text>
            <View style={styles.underline}/>

            <Pressable style={styles.button} onPress={handleComplete}>
                <DefaultText style={styles.buttonText}>완료</DefaultText>
            </Pressable>

            {/*단어 설명 팝업*/}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={()=>setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>{selectedWord}</Text>
                            {/* ✅ wordDefinition을 스크롤 가능하게 */}
                            <ScrollView style={styles.definitionScroll} contentContainerStyle={{ paddingBottom: 10 }}>
                                <Text style={styles.modalDescription}>{wordDefinition}</Text>
                            </ScrollView>
                            {askCount !== null && askCount >= 2 && (
                                <Text style={styles.askCountText}>
                                    지금까지 {askCount}번 확인했어요!{'\n'}슬슬 익숙해지셨죠?
                                </Text>
                            )}

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
        padding: screenwidth*0.05,
        backgroundColor: 'white',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: screenHeight*0.06,
        marginBottom: screenHeight*0.015,
    },
    searchButton:{
        backgroundColor: '#1976d2',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    searchButtonText:{
        color: 'white',
        fontSize: screenwidth*0.035,
        fontFamily: 'Ubuntu-Bold',
    },
    textInput: {
        flex:1,
        minHeight: screenHeight*0.35,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: screenwidth*0.04,
        fontSize: screenwidth*0.04,
        fontFamily: 'Ubuntu-Light',
        color: '#333',
    },
    underline:{
        height:2,
        width: '90%',
        backgroundColor: '#1976d2',
        alignSelf: 'center',
        marginBottom: screenHeight*0.025,
    },
    tipText:{
        fontSize: screenwidth*0.035,
        color: '#666',
        marginTop: screenHeight*0.02,
        marginBottom: 0,
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
        height: screenHeight * 0.5,
        justifyContent: 'flex-start',
    },
    
    modalTitle: {
        fontSize: screenwidth*0.05,
        fontFamily: 'Ubuntu-Bold',
        marginBottom: 10,
    },

    definitionScroll: {
    maxHeight: screenHeight * 0.4, // ✅ 설명만 스크롤
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
    askCountText: {
        fontSize: screenwidth*0.035,
        fontFamily: 'Ubuntu-Regular',
        color: '#444',
        textAlign: 'center',
        marginTop: 10,
    },
});