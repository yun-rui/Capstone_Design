import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type Article = {
  id: number;
  content: string;
  summary: string;
  created_at: string;
};

export default function StudyRecord() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [monthOptions, setMonthOptions] = useState<{ label: string; value: string }[]>([]);

  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('로그인이 필요합니다.');
        return;
      }

      try {
        const res = await fetch('http://172.20.10.2:8000/api/articles/my/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rawData: { article: Article }[] = await res.json();
        const articles = rawData.map((item) => item.article);
        setAllArticles(articles);

        const months = Array.from(
          new Set(articles.map((a) => a.created_at.slice(0, 7).replace('-', '.')))
        ).sort((a, b) => b.localeCompare(a));

        setMonthOptions(months.map((m) => ({ label: m, value: m })));
        if (months.length > 0) setSelectedMonth(months[0]);

      } catch (err) {
        Alert.alert('기사 로딩 실패');
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const filtered = allArticles.filter((a) =>
        a.created_at.startsWith(selectedMonth.replace('.', '-'))
      );
      setFilteredArticles(filtered);
    }
  }, [selectedMonth, allArticles]);

  const renderArticle = ({ item }: { item: Article }) => (
    <TouchableOpacity
      style={styles.folderWrapper}
      onPress={() =>
        router.push({
          pathname: '/RecordDetailPage',
          params: {
            article_id: item.id.toString(),
            summary: item.summary,
          },
        })
      }
    >
      <Image source={require('../assets/images/folder.png')} style={styles.folderIcon} />
      <View style={styles.textBox}>
        <Text style={styles.previewText} numberOfLines={1}>
          {item.content.slice(0, 30)}...
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/MyPage')}>
        <Image source={require('../assets/images/back.png')} style={styles.topLeftIcon} />
      </TouchableOpacity>

      <Text style={styles.title}>월별 학습 기록</Text>

      <DropDownPicker
        open={open}
        value={selectedMonth}
        items={monthOptions}
        setOpen={setOpen}
        setValue={setSelectedMonth}
        setItems={setMonthOptions}
        placeholder="월 선택"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownList}
        zIndex={1000}
      />

      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArticle}
        contentContainerStyle={{ paddingBottom: screenHeight * 0.08 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topLeftIcon: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    position: 'absolute',
    top: screenHeight * 0.1,
    left: screenWidth * 0.06,
  },
  title: {
    fontSize: screenWidth * 0.07,
    fontFamily: 'Ubuntu-Bold',
    textAlign: 'center',
    marginTop: screenHeight * 0.12,
    marginBottom: screenHeight * 0.03,
  },
  dropdownContainer: {
    alignSelf: 'center',
    zIndex: 1000,
    marginBottom: screenHeight * 0.02,
  },
  dropdown: {
    width: screenWidth * 0.85,
    alignSelf: 'center',
  },
  dropdownList: {
    width: screenWidth * 0.85,
    alignSelf: 'center',
  },
  folderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.08,
    paddingVertical: screenHeight * 0.025,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  folderIcon: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    marginRight: screenWidth * 0.05,
  },
  textBox: {
    flexShrink: 1,
  },
  previewText: {
    fontSize: screenWidth * 0.035,
    color: '#777',
  },
});
