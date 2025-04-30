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
    const {content} = useLocalSearchParams(); // InputNews에서 넘겨받은 기사 내용 
    const article = content as string;

    const [selectedWord, setSelectedWord] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selection, setSelection] = useState({start:0, end:0});

    const handleSelectionChange = (event: any)=>{
        const {start, end} = event.nativeEvent.selection;
        setSelection({start, end});

        if (start !== end) {
            const word = article.slice(start, end);
            setSelectedWord(word);
        }
    };

    const handleLookup = () =>{
        if (selectedWord.trim()){
            setModalVisible(true);
        }
    };
    const handleComplete = () => {
        // 다음 단계로 넘어가는 로직
        router.push('/SectionPage');
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
                            <Text style={styles.modalDescription}>이 단어에 대한 설명을 적을 예정</Text>
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