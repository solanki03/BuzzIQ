import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import GradientBtn from '@/components/GradientBtn';
import { PieChartComponent } from '@/components/PieChart';
import { Download, House } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import toast, { Toaster } from 'react-hot-toast';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef(null);
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const saveAttempts = useRef(0);
  const maxAttempts = 3;
  const retryDelay = 5000;
  const toastId = useRef(null);

  // Safely extract quiz results with proper defaults
  const quizData = location.state || {};
  const {
    topic = null,
    totalQuestions = 0,
    results = [],
    timeTaken = 0,
  } = quizData;

  // Calculate metrics
  const correctAnswers = results.filter(q => q.isCorrect).length;
  const attemptedQuestions = results.filter(q => q.userAnswer !== undefined && q.userAnswer !== null).length;
  const wrongAnswers = results.filter(q => q.userAnswer && !q.isCorrect).length;
  const notAttempted = totalQuestions - attemptedQuestions;

  // Format time taken
  const formatTimeTaken = (seconds) => {
    if (typeof seconds !== 'number' || seconds < 0) return '0 min 0 sec';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  // Format topic name
  const formatTopicName = (str) => {
    if (!str) return 'Quiz Results';
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formattedTopic = formatTopicName(topic);

  // Result info display
  const resultInfo = [
    { label: 'Topic', value: formattedTopic },
    { label: 'Total Questions', value: totalQuestions },
    { label: 'Attempted Questions', value: attemptedQuestions },
    { label: 'Correct Answers', value: correctAnswers },
    { label: 'Wrong Answers', value: wrongAnswers },
    { label: 'Not Attempted', value: notAttempted },
    { label: 'Time Taken', value: formatTimeTaken(timeTaken) },
  ];

  // Wrong answers list
  const wrongAnswersList = results.filter(question => 
    question.userAnswer && question.userAnswer !== question.answer
  );

  // Save results with retry logic
  const saveResults = useCallback(async () => {
    if (!user || !topic || hasSaved || isSaving || saveAttempts.current >= maxAttempts) return;

    setIsSaving(true);
    setSaveError(null);
    const currentAttempt = saveAttempts.current + 1;

    // Clear any existing toasts
    toast.dismiss(toastId.current);

    try {
      const payload = {
        userId: user.id,
        username: user.username || user.fullName || user.primaryEmailAddress?.emailAddress,
        topic: formattedTopic,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        notAttempted,
        timeTaken
      };

      toastId.current = toast.loading(`Saving results (attempt ${currentAttempt} of ${maxAttempts})...`);
      
      const response = await axios.post('http://localhost:5000/v1/results', payload);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to save results');
      }

      toast.dismiss(toastId.current);
      toast.success('Results saved successfully!');
      setHasSaved(true);
    } catch (err) {
      saveAttempts.current += 1;
      const errorMessage = err.response?.data?.error || err.message;
      setSaveError(errorMessage);
      
      toast.dismiss(toastId.current);

      if (saveAttempts.current < maxAttempts) {
        toastId.current = toast.error(
          `Failed to save (attempt ${saveAttempts.current} of ${maxAttempts}). Retrying...`,
          { duration: retryDelay }
        );
        
        const retryTimer = setTimeout(() => {
          saveResults();
        }, retryDelay);
        
        return () => clearTimeout(retryTimer);
      } else {
        toast.error('Failed to save results after multiple attempts. Please try again later.');
      }
    } finally {
      setIsSaving(false);
    }
  }, [user, topic, totalQuestions, correctAnswers, results, timeTaken, formattedTopic, isSaving, hasSaved]);

  // Auto-save on mount
  useEffect(() => {
    if (!hasSaved && !isSaving) {
      saveResults();
    }
  }, [hasSaved, isSaving, saveResults]);

  // Prevent going back to QuizPage
  useEffect(() => {
    const handleBackNavigation = (e) => {
      e.preventDefault();
      navigate('/quiz-dashboard', { replace: true });
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackNavigation);

    return () => {
      window.removeEventListener('popstate', handleBackNavigation);
      toast.dismiss(toastId.current);
    };
  }, [navigate]);

  // Capture full-screen image
  const onButtonClick = useCallback(() => {
    if (!ref.current) return;

    toast.promise(
      toPng(ref.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'quiz-results.png';
          link.href = dataUrl;
          link.click();
        }),
      {
        loading: 'Preparing download...',
        success: 'Download started!',
        error: 'Failed to capture image',
      }
    );
  }, []);

  // Redirect if no state
  useEffect(() => {
    if (!location.state) {
      navigate('/quiz-dashboard', { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <div className="w-full text-white mb-10">
      <Navbar className="sticky! z-[80] bg-black/80 backdrop-blur-sm transition-all duration-300 ease-in-out" />
      
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #7e22ce',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
          },
          success: {
            iconTheme: {
              primary: '#a855f7',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#a855f7',
              secondary: '#fff',
            },
          },
        }}
      />

      <div ref={ref} className='flex flex-col gap-7 items-center justify-center px-5 bg-black'>
        <h1 className='font-semibold text-2xl sm:text-4xl text-center block border-b-2 px-10 pb-4 border-slate-700'>
          <span className='text-slate-300'>Review Your Results & Learn More</span>
        </h1>

        <div className="flex flex-col w-full max-w-5xl rounded-xl bg-slate-900/50 ring-1 ring-fuchsia-300 px-4 py-6 sm:px-8">

          <div className='flex justify-between items-center'>
            <button
              className="text-fuchsia-400 hover:text-fuchsia-300 transition-all duration-200 ease-in-out w-11 h-11 rounded-full bg-slate-800/50 flex items-center justify-center shadow-md ring-1 ring-fuchsia-300 hover:ring-fuchsia-400 active:ring-fuchsia-500"
              onClick={() => navigate('/')}
            >
              <House />
            </button>
            <button
              className="text-fuchsia-400 hover:text-fuchsia-300 transition-all duration-200 ease-in-out w-11 h-11 rounded-full bg-slate-800/50 flex items-center justify-center shadow-md ring-1 ring-fuchsia-300 hover:ring-fuchsia-400 active:ring-fuchsia-500"
              onClick={onButtonClick}
            >
              <Download />
            </button>
          </div>

          <div className='flex flex-col md:flex-row justify-between gap-6 w-full'>
            <div className="flex flex-col gap-4 max-md:min-w-[300px] md:w-1/2">
              <h2 className="text-2xl font-semibold text-center">Quiz Results</h2>
              <div className="space-y-2 bg-slate-700/30 px-5 md:px-7 py-3 rounded-lg">
                {resultInfo.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm sm:text-lg pb-1.5">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-gray-100 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-3 text-center">Incorrect Answers</h3>
                {wrongAnswersList.length > 0 ? (
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {wrongAnswersList.map((question, index) => (
                      <div key={index} className="bg-slate-800/30 p-3 rounded-lg">
                        <p className="font-medium text-fuchsia-300">Q{question.id || index + 1}: {question.question}</p>
                        <p className="mt-1 text-sm text-red-400">
                          Your answer: {question.userAnswer}
                        </p>
                        <p className="text-sm text-green-400">Correct answer: {question.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-4">All answers were correct! Great job!</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:w-1/2">
              <h2 className='text-2xl font-semibold text-center'>Performance Overview</h2>
              <PieChartComponent 
                correctAnswers={correctAnswers} 
                wrongAnswers={wrongAnswers}
                notAttempted={notAttempted}
              />
            </div>
          </div>

          <div className='flex flex-row items-center justify-between mt-6'>
            <GradientBtn name="Dashboard" onClick={() => navigate('/quiz-dashboard')} />
            <GradientBtn 
              name="Retake Quiz" 
              onClick={() => navigate(`/quiz/${topic || 'computer_fundamentals'}`)} 
            />
          </div>
        </div>

        <div className="w-full flex justify-center text-center">
          <div className="">
            <p className="text-sm text-gray-400">
              <span className="font-Warnes! font-medium!">BuzzIQ{" "}</span>
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;