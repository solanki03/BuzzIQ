import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import GradientBtn from "@/components/GradientBtn";
import stopwatch from "@/assets/images/stopwatch.png";
import notificationTone from "@/assets/audio/notification_tone.mp3";

const QuizPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0 });
  const [timeUp, setTimeUp] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const audioRef = useRef(new Audio(notificationTone));
  const timerRef = useRef(null);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/v1/questions/${topic}`
        );
        setQuestions(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to load questions");
      }
    };

    fetchQuestions();
  }, [topic]);

  // Update selected option when question changes
  useEffect(() => {
    const currentQuestionId = questions[currentQuestionIndex]?.id;
    setSelectedOption(userAnswers[currentQuestionId] || null);
  }, [currentQuestionIndex, questions, userAnswers]);

  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((error) => console.error("Error playing sound:", error));
    }
  }, []);

  // Timer logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        }
        if (prevTime.minutes > 0) {
          if (prevTime.minutes === 1 && prevTime.seconds === 0) {
            toast("Last 1 min left!", { icon: "⚠️" });
            playAudio();
          }
          return { minutes: prevTime.minutes - 1, seconds: 59 };
        }

        clearInterval(timerRef.current);
        handleSubmitQuiz();
        return { minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [playAudio]);

  // Handle option selection
  const handleOptionSelect = (option) => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    setSelectedOption(option);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionId]: option
    }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz and calculate results
  const handleSubmitQuiz = () => {
    setTimeUp(true);
    clearInterval(timerRef.current);
    setQuizSubmitted(true);

    // Calculate results
    const results = questions.map(question => {
      const userAnswer = userAnswers[question.id];
      const isCorrect = userAnswer === question.answer;
      
      return {
        ...question,
        userAnswer,
        isCorrect
      };
    });

    const correctAnswers = results.filter(r => r.isCorrect).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    // Prepare data for results page
    const quizData = {
      topic,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      results,
      timestamp: new Date().toISOString()
    };

    // Navigate to results page with data
    navigate('/quiz-results', { state: quizData });
  };

  // Format topic for display
  const formatTopic = (str) => {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) return <div className="text-center py-20">Loading questions...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  if (questions.length === 0) return <div className="text-center py-20">No questions found</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestion.id];

  return (
    <div className="w-full text-white">
      <Navbar className="sticky! z-[80] bg-black/80 backdrop-blur-sm transition-all duration-300 ease-in-out" />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            border: "1px solid #f0abfc",
            background: "#111827",
            color: "#fff",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "8px 16px",
          },
        }}
      />

      <div className="flex flex-col gap-9 items-center justify-center">
        <h1 className="font-semibold text-2xl sm:text-4xl text-center text-slate-300 block border-b-2 px-10 pb-4 border-slate-700">
          <span>{formatTopic(topic)}</span>
        </h1>

        <div className="relative bg-slate-900/50 grid w-full max-w-5/6 lg:max-w-4/6 gap-4 rounded-xl ring-1 ring-fuchsia-300 py-9 px-6 shadow-lg duration-200">
          {!timeUp ? (
            <>
              <div className="absolute right-8 top-5 flex items-center justify-end gap-2 text-sm text-pink-200">
                <img src={stopwatch} alt="Stopwatch" className="h-6" />
                {`${timeLeft.minutes}:${timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}`}
                <span className="ml-4">
                  Answered: {Object.keys(userAnswers).length}/{questions.length}
                </span>
              </div>

              <div className="flex flex-col gap-8 mt-5">
                <div className="text-lg md:text-xl font-semibold text-fuchsia-400 px-3">
                  <p>{currentQuestionIndex + 1}. {currentQuestion.question}</p>
                </div>

                <div className="flex flex-col gap-1">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={`option-${index}`}
                      className={`flex items-center gap-3 md:text-lg px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        currentAnswer === option ? "bg-fuchsia-800" : "hover:bg-fuchsia-900"
                      }`}
                      onClick={() => handleOptionSelect(option)}
                    >
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name="option"
                        value={option}
                        checked={currentAnswer === option}
                        onChange={() => handleOptionSelect(option)}
                        className="cursor-pointer"
                      />
                      <label htmlFor={`option-${index}`} className="cursor-pointer">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <GradientBtn 
                  name="Prev" 
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                />
                <GradientBtn 
                  name={currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"} 
                  onClick={handleNext}
                  disabled={!currentAnswer && currentAnswer !== ''}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-16 my-8">
              <h2>
                <p className="text-3xl text-center text-fuchsia-400 font-semibold mb-2.5">
                  {quizSubmitted ? "Quiz Submitted!" : "Time's Up!"}
                </p>
                <p className="text-2xl text-center text-fuchsia-200 font-medium">
                  You've completed the quiz. Let's see your results!
                </p>
              </h2>
              <Link to="/quiz-results">
                <GradientBtn name="View Results" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;