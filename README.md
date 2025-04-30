# BuzzIQ 

**BuzzIQ** is a smart and secure online quiz platform designed to offer a fair, engaging, and performance-driven assessment experience. It ensures real-time monitoring, auto-certification, and a dedicated user dashboard, all while prioritizing user privacy and data security.

## Screenshot
<img src="client/public/BuzzIQ_UI.png" alt="BuzzIQ Website's UI" />


&nbsp;

## 🚀 Features
- Online proctored quizzes
- Live monitoring during assessments
- Smart scoring system
- Auto-generated certificates (for scores >= 65%)
- Subject-wise quiz topics 
- Performance tracking via user dashboard
- Chatbot for app-related assistance 
- Result-based certificate download
- Local storage–based user rating system 

## 🛠️ Technology Used

### Frontend
- Vite + React.js
- Tailwind CSS
- Clerk  

### Backend
- Express.js
- MongoDB

## 🧾 How to Run the Project
1. Clone the repository
2. Run `npm install` in both frontend and backend directories
3. Set up environment variables (see below)
4. Run the development server using `npm run dev` or respective command for frontend/backend

## 🔐 Environment Variables
- `VITE_CLERK_PUBLISHABLE_KEY`
- `MONGODB_URI`

These should be placed in a `.env` file in both frontend and backend as needed.

## 🧭 Pages Overview
- **Home Page** – Introduction to BuzzIQ and chatbot access
- **Quiz Dashboard** – Displays available topics and quiz navigation
- **Quiz Page** – Main quiz interface with live monitoring
- **Result Page** – Displays score, download certificate (if eligible), and a rating system

## License

This project is licensed under the **[MIT License](https://choosealicense.com/licenses/mit/)**. See the LICENSE file for more details.
