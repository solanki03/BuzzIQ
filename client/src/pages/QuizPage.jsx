import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import GradientBtn from "@/components/GradientBtn";
import stopwatch from "@/assets/images/stopwatch.png";
import notificationTone from "@/assets/audio/notification_tone.mp3";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { stopCamera } from "@/utils/stopCamera";

const QuizPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0 });
  const [timeUp, setTimeUp] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [sendingData, setSendingData] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null); // Track when quiz actually starts
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize audio only once
  useEffect(() => {
    audioRef.current = new Audio(notificationTone);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Stop camera when component unmounts
  useEffect(() => {
    if(timeUp){
      stopCamera();
    }
  }, [timeUp]);

  // Fetch questions from backend
  useEffect(() => {
    let timeoutId;
  
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/v1/questions/${topic}`);
        const shuffled = [...response.data];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setQuestions(shuffled);
        setQuizStartTime(new Date());
  
        timeoutId = setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to load questions");
      }
    };
  
    fetchQuestions();
  
    return () => clearTimeout(timeoutId); // Cleanup on unmount or topic change
  }, [topic]);
  

  // Calculate time taken when quiz ends
  const calculateTimeTaken = () => {
    if (!quizStartTime) return 0;
    const endTime = new Date();
    return Math.floor((endTime - quizStartTime) / 1000); // Return time in seconds
  };


  const playAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => console.error("Error playing sound:", error));
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (!quizStartTime) return; // Don't start timer until questions are loaded

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
        setTimeUp(true);
        return { minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [playAudio, quizStartTime]);

  // Handle option selection
  const handleOptionSelect = (option) => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionId]: option
    }));
  };

  // Fullscreen logic
  useEffect(() => {
    const enterFullScreen = () => {
      const doc = document.documentElement;
      if (doc.requestFullscreen) doc.requestFullscreen();
      else if (doc.mozRequestFullScreen) doc.mozRequestFullScreen();
      else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
      else if (doc.msRequestFullscreen) doc.msRequestFullscreen();
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        toast.error("Fullscreen exited! Submitting quiz...", { icon: "🚫" });
        setTimeUp(true);
      }
    };

    enterFullScreen();
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Exit fullscreen when time's up
  useEffect(() => {
    if (timeUp && document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
    }
  }, [timeUp]);

  // Security restrictions
  useEffect(() => {
    const handleRestrictedKeys = (event) => {
      if (event.ctrlKey || event.shiftKey || event.altKey || event.key === "F5" || event.keyCode === 123) {
        event.preventDefault();
        toast.error("Restricted keys are disabled!", { icon: "🚫" });
      }
    };

    const handleBack = (event) => {
      event.preventDefault();
      toast.error("You cannot go back during the quiz!", { icon: "🚫" });
    };

    window.history.pushState(null, null, window.location.href);
    document.addEventListener("keydown", handleRestrictedKeys);
    window.addEventListener("popstate", handleBack);
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    return () => {
      document.removeEventListener("keydown", handleRestrictedKeys);
      window.removeEventListener("popstate", handleBack);
      document.removeEventListener("contextmenu", (event) => event.preventDefault());
    };
  }, []);

  // Tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error("Tab switch detected! Submitting quiz...", { icon: "🚫" });
        setTimeUp(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Navigation handlers
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setTimeUp(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculate results and navigate when timeUp changes
  useEffect(() => {
    if (timeUp) {
      const calculateAndSendResults = async () => {
        setSendingData(true);
        
        const results = questions.map(question => {
          const userAnswer = userAnswers[question.id];
          return {
            ...question,
            userAnswer,
            isCorrect: userAnswer === question.answer
          };
        });

        const correctAnswers = results.filter(r => r.isCorrect).length;
        const timeTaken = calculateTimeTaken(); // Calculate time taken in seconds

        const quizData = {
          topic,
          totalQuestions: questions.length,
          correctAnswers,
          results,
          timeTaken,
        };

        // Here you can add code to send data to backend if needed
        // await axios.post('/api/save-results', quizData);
        // console.log("Quiz Data:", quizData);
        navigate('/quiz-results', { state: quizData });
      };

      calculateAndSendResults();
    }
  }, [timeUp, questions, userAnswers, topic, navigate]);

  const formatTopic = (str) => {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) return <div className="text-center py-20">{QuizSkeleton()}</div>;
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
                <GradientBtn name="Prev" onClick={handlePrev} disabled={currentQuestionIndex === 0} />
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
                  {timeUp ? "Quiz Submitted!" : "Time's Up!"}
                </p>
                <p className="text-2xl text-center text-fuchsia-200 font-medium">
                  {sendingData ? "Processing your results..." : "Redirecting to results..."}
                </p>
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;


function QuizSkeleton() {
  return (
    <div className="flex flex-col gap-9 items-center justify-center py-10">
      {/* Title Skeleton */}
      <Skeleton className="h-10 w-2/3 sm:w-1/2 rounded-md opacity-60" />

      <Card className="bg-slate-700/20 shadow-md rounded-lg overflow-hidden py-9 w-full max-w-5/6 lg:max-w-4/6">
        <CardContent className="px-6 py-9 flex flex-col space-y-9 relative">
          {/* Timer & Stats */}
          <div className="absolute right-8 top-5 flex items-center justify-end gap-2 text-sm opacity-60">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-lg" />
            <Skeleton className="h-6 w-20 ml-4 rounded-lg" />
          </div>

          {/* Question Block */}
          <div className="flex flex-col gap-8 mt-5">
            <Skeleton className="h-8 w-1/2 md:w-1/3 rounded-md opacity-60" />

            {/* Options Skeletons */}
            <div className="flex flex-col gap-1">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 md:text-lg px-3 py-2 rounded-lg bg-slate-800"
                >
                  <Skeleton className="h-4 w-4 rounded-full opacity-60" />
                  <Skeleton className="h-4 w-5/6 rounded-lg opacity-60" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-10 w-24 rounded-full opacity-60" />
            <Skeleton className="h-10 w-24 rounded-full opacity-60" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}