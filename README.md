# 📘 EasyDigest_Front

**EasyDigest** is an integrated learning platform that guides users from article selection to vocabulary learning, summarization, and quizzes — all in one seamless flow.  
This repository contains the **frontend implementation** built with **React-Naive** and **Expo**.

---

## 🛠 Tech Stack

- ⚙️ **Frontend Framework**: React Native, Expo
- ⚙️ **Frontend Language**: TypeScript
  
---

## 🚀 Getting Started
1. **Download Expo go in your phone**
   
2. **Clone the repository**
   ```bash
   git clone https://github.com/yun-rui/Capstone_Design.git
   ```

3. **Navigate to the project folder**
   ```bash
   cd EasyDigest
   ```

4. **Run the Expo**
   ```bash
   npx expo start
   ```

5. **Scan the QR generated by expo with your phone camera**

---

## 🗂 Project Structure

```
EasyDigest/
├── app/                 
│   ├── ChangeProfile.tsx         # Page for changing profile and viewing user level
│   ├── CorrectAnswer.tsx         # Page that shows a correct quiz response
│   ├── DisplayNewsPage.tsx       # Page for selecting words and requesting explanations
│   ├── LoginPage.tsx             # Page for logging in
│   ├── MyPage.tsx                # Page for navigating to profile settings or study records
│   ├── QuizPage.tsx              # Page that displays a quiz based on studied words
│   ├── RecordDetailPage.tsx      # Page showing studied article, selected words, and summary
│   ├── SectionPage.tsx           # Page for selecting either study mode or my page
│   ├── SignUpPage.tsx            # Page for user registration
│   ├── StudyRecord.tsx           # Page listing previously studied articles by month
│   ├── SummaryPage.tsx           # Page that displays the summary of a studied article
│   ├── ViewNewsPage.tsx          # Page for selecting an article from Naver News
│   └── WrongAnswer.tsx           # Page that shows a wrong answer and the correct one
├── assets/                       # Fonts and images
└── components/                   # Default text styles
```
---

> 🧠 **EasyDigest** helps users improve their reading comprehension and vocabulary through context-aware learning powered by AI.
