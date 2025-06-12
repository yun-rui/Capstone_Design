import React, { useEffect, useState } from 'react';
import {
  View, Platform, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import DefaultText from '@/components/DefaultText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function ChangeProfile() {
    const router = useRouter();
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [originalEmail, setOriginalEmail] = useState(''); 
    const [interest, setInterest] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // 레벨 구현
    const [level, setLevel] = useState(0);
    const [totalCorrectCount, setTotalCorrectCount] = useState(0);
  
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = await AsyncStorage.getItem('access_token');
        const res = await fetch('http://172.20.10.2:8000/api/users/me/', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
            const data = await res.json();
            setNickname(data.nickname);
            setEmail(data.email);
            setOriginalEmail(data.email); //
            setInterest(data.interest);
            setLevel(data.level || 0);
            setTotalCorrectCount(data.total_correct_count || 0);
        } else {
            Alert.alert('회원 정보 불러오기 실패');
        }
    };

    const progressPercent = Math.min((totalCorrectCount % 10) * 10, 100);

    const handleCheckDuplicateEmail = async () => {
      if (email === originalEmail) {
        Alert.alert('E-mail을 변경하지 않았습니다.');
        return;
      }

      if (!email) {
        Alert.alert('E-mail을 입력하세요.');
        return;
      }

      try {
        const response = await fetch(`http://172.20.10.2:8000/api/users/check-email/?email=${encodeURIComponent(email)}`, {
          method: 'GET',
        });

        const result = await response.json();

        if (result.exists) {
          Alert.alert('❌ 이미 사용 중인 E-mail입니다.', '다른 E-mail을 입력해주세요.');
        } else {
          Alert.alert('✅ 사용 가능한 E-mail입니다.');
        }
      } catch (error) {
        console.error('이메일 중복확인 오류:', error);
        Alert.alert('서버 오류', '서버에 연결할 수 없습니다.');
      }
    };


    const handleSubmit = async () => {
        const token = await AsyncStorage.getItem('access_token');

        try {
            // 1. 비밀번호 변경 조건 검사 먼저!
            const trimmedCurrent = currentPassword.trim();
            const trimmedNew = newPassword.trim();

            if (trimmedCurrent || trimmedNew) {
            if (!trimmedCurrent || !trimmedNew) {
                Alert.alert('비밀번호 변경 실패', '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
                return;
            }

            const passRes = await fetch('http://172.20.10.2:8000/api/users/change-password/', {
                method: 'PATCH',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                current_password: trimmedCurrent,
                new_password: trimmedNew,
                }),
            });

            if (!passRes.ok) {
                const err = await passRes.json();
                Alert.alert('비밀번호 변경 실패', err.message || '현재 비밀번호를 확인하세요.');
                return;
            }
            }

            // 2. 회원정보 수정
            const profileRes = await fetch('http://172.20.10.2:8000/api/users/me/update/', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nickname, email, interest })
            });

            if (!profileRes.ok) {
            const err = await profileRes.json();
            Alert.alert('회원정보 수정 실패', err.message || '입력을 확인해주세요.');
            return;
            }

            // 성공 후 알림
            Alert.alert('수정 완료', '회원정보가 성공적으로 업데이트되었습니다.', [
            { text: '확인', onPress: () => router.push('/LoginPage') }
            ]);
            setCurrentPassword('');
            setNewPassword('');

        } catch (err) {
            Alert.alert('에러 발생', '서버 요청 중 문제가 발생했습니다.');
        }
        };

    const getLevelImage = (level: number) => {
      switch (level) {
        case 1: return require('../assets/images/seed.png');
        case 2: return require('../assets/images/sprout.png');
        case 3: return require('../assets/images/pot.png');
        case 4: return require('../assets/images/flower.png');
        default: return require('../assets/images/tree.png');
      }
    };
    const getLevelName = (level: number) => {
      switch (level) {
        case 1: return '씨앗';
        case 2: return '새싹';
        case 3: return '화분';
        case 4: return '꽃';
        default: return '나무';
      }
    };

    return (
        <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
        keyboardShouldPersistTaps="handled"
        >
        <TouchableOpacity onPress={() => router.push('/MyPage')}>
            <Image source={require('../assets/images/back.png')} style={styles.topLeftIcon} />
        </TouchableOpacity>

        <DefaultText style={styles.title}>회원정보 수정</DefaultText>
        {/*레벨 구현*/}
        <View style={styles.profileSection}>
          <Image source={getLevelImage(level)} style={styles.levelImage} />
          <View style={styles.levelInfo}>
            <DefaultText style={styles.levelText}>{getLevelName(level)}</DefaultText>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
            <DefaultText style={styles.progressLabel}>
              레벨 진행도: {progressPercent}% ({totalCorrectCount % 10} / 10)
            </DefaultText>
          </View>
        </View>


        <DefaultText style={styles.label}>이름</DefaultText>
        <TextInput style={styles.input} value={nickname} onChangeText={setNickname} />

        <DefaultText style={styles.label}>이메일</DefaultText>
        <View style={styles.inputRow}>
            <TextInput style={styles.input_short} value={email} onChangeText={setEmail} />
            <TouchableOpacity style={styles.subButton} onPress={handleCheckDuplicateEmail}>
              <DefaultText style={styles.subButtonText}>중복확인</DefaultText>
            </TouchableOpacity>
        </View>

        <DefaultText style={styles.label}>관심분야</DefaultText>
        <TextInput
            style={styles.selectedInput}
            value={interest}
            onChangeText={setInterest}
        />

        <View style={styles.interestsContainer}>
            {['정치', '경제', '사회', '생활/문화', 'IT/기술'].map((item) => (
            <TouchableOpacity key={item} style={styles.interestButton} onPress={() => setInterest(item)}>
                <DefaultText style={styles.interestText}>{item}</DefaultText>
            </TouchableOpacity>
            ))}
        </View>

        <DefaultText style={styles.label}>현재 비밀번호</DefaultText>
        <View style={styles.inputWithIcon}>
            <TextInput
            style={styles.inputFlex}
            secureTextEntry={!showPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            textContentType="newPassword"
            autoComplete="password-new"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
                source={
                showPassword
                    ? require('../assets/images/password.png')
                    : require('../assets/images/closepassword.png')
                }
                style={styles.iconRight}
            />
            </TouchableOpacity>
        </View>

        <DefaultText style={styles.label}>새로운 비밀번호</DefaultText>
        <View style={styles.inputWithIcon}>
            <TextInput
            style={styles.inputFlex}
            secureTextEntry={!showConfirmPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            textContentType="newPassword"
            autoComplete="password-new"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Image
                source={
                showConfirmPassword
                    ? require('../assets/images/password.png')
                    : require('../assets/images/closepassword.png')
                }
                style={styles.iconRight}
            />
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <DefaultText style={styles.submitButtonText}>회원정보 수정</DefaultText>
        </TouchableOpacity>
        </KeyboardAwareScrollView>
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
      fontSize: screenWidth * 0.07,
      fontFamily: 'Ubuntu-Bold',
      marginTop: screenHeight * 0.1,
      marginBottom: screenHeight * 0.02,
    },
    icon: {
      width: screenWidth * 0.115,
      height: screenWidth * 0.115,
      marginBottom: screenHeight * 0.03,
    },
    label: {
      alignSelf: 'flex-start',
      marginLeft: screenWidth * 0.03,
      marginTop: screenHeight * 0.02,
      marginBottom: screenHeight * 0.002,
      fontFamily: 'Ubuntu-Bold',
      fontSize: screenWidth * 0.038,
    },
    input_short: {
      width: screenWidth * 0.65,
      height: screenHeight * 0.04,
      paddingHorizontal: screenWidth * 0.02,
      fontSize: screenWidth * 0.04,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      fontFamily: 'Ubuntu-Light',
    },
    input: {
      width: screenWidth * 0.85,
      height: screenHeight * 0.04,
      paddingHorizontal: screenWidth * 0.02,
      fontSize: screenWidth * 0.04,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      fontFamily: 'Ubuntu-Light',
    },
    inputRow: {
      flexDirection: 'row',
      width: screenWidth * 0.85,
      gap: screenWidth * 0.03,
      alignItems: 'center',
    },
    subButton: {
      width: screenWidth * 0.2,
      height: screenHeight * 0.04,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
    },
    subButtonText: {
      fontSize: screenWidth * 0.035,
    },
    inputWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      width: screenWidth * 0.85,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    inputFlex: {
      flex: 1,
      height: screenHeight * 0.04,
      paddingHorizontal: screenWidth * 0.02,
      fontSize: screenWidth * 0.04,
      fontFamily: 'Ubuntu-Light',
    },
    iconRight: {
      width: screenWidth * 0.05,
      height: screenWidth * 0.05,
      marginLeft: screenWidth * 0.02,
    },
    selectedInput: {
      width: screenWidth * 0.85,
      height: screenHeight * 0.04,
      paddingHorizontal: screenWidth * 0.02,
      fontSize: screenWidth * 0.04,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      fontFamily: 'Ubuntu-Light',
      marginBottom: screenHeight * 0.02,
    },
    interestsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      width: screenWidth * 0.85,
      gap: screenWidth * 0.02,
    },
    interestButton: {
      paddingHorizontal: screenWidth * 0.04,
      paddingVertical: screenHeight * 0.012,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    interestText: {
      fontSize: screenWidth * 0.035,
    },
    submitButton: {
      backgroundColor: '#1976d2',
      borderRadius: 15,
      width: screenWidth * 0.85,
      height: screenHeight * 0.06,
      alignItems: 'center',
      justifyContent: 'center',
      top: screenHeight*0.87,
      position: 'absolute',
    },
    submitButtonText: {
      color: 'white',
      fontSize: screenWidth * 0.05,
      fontFamily: 'Ubuntu-Bold',
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: screenHeight * 0.03,
      gap: screenWidth * 0.06,
    },
    levelImage: {
      width: screenWidth * 0.18,
      height: screenWidth * 0.18,
    },
    levelInfo: {
      flex: 1,
    },
    levelText: {
      fontSize: screenWidth * 0.05,
      fontFamily: 'Ubuntu-Bold',
      marginBottom: 6,
    },
    progressBar: {
      width: '100%',
      height: 10,
      backgroundColor: '#eee',
      borderRadius: 5,
      overflow: 'hidden',
      marginBottom: 6,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#1976d2',
    },
    progressLabel: {
      fontSize: screenWidth * 0.035,
      color: '#555',
    },
  });
  