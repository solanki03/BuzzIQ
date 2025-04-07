import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import GradientBtn from "@/components/GradientBtn";
import stopwatch from "@/assets/images/stopwatch.png";
import notificationTone from "@/assets/audio/notification_tone.mp3";

const QuizPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0 });
  const [timeUp, setTimeUp] = useState(false);
  const audioRef = useRef(new Audio(notificationTone));
  const timerRef = useRef(null);

  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((error) => console.error("Error playing sound:", error));
    }
  }, []);

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
        setTimeUp(true);
        toast("Time's up! Submitting quiz...", { icon: "⏳" });
        return { minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [playAudio]);

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

    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

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

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "You cannot refresh during the quiz!";
      toast.error("Page refresh is disabled during the quiz!", { icon: "🚫" });
    };

    window.history.pushState(null, null, window.location.href);
    document.addEventListener("keydown", handleRestrictedKeys);
    window.addEventListener("popstate", handleBack);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    return () => {
      document.removeEventListener("keydown", handleRestrictedKeys);
      window.removeEventListener("popstate", handleBack);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("contextmenu", (event) => event.preventDefault());
    };
  }, []);

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
          <span>Computer Fundamentals</span>
        </h1>

        <div className="relative bg-slate-900/50 grid w-full max-w-5/6 lg:max-w-4/6 gap-4 rounded-xl ring-1 ring-fuchsia-300 py-9 px-6 shadow-lg duration-200">
          {!timeUp ? (
            <>
              <div className="absolute right-8 top-5 flex items-center justify-end gap-2 text-sm text-pink-200">
                <img src={stopwatch} alt="Stopwatch" className="h-6" />
                {`${timeLeft.minutes}:${timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}`}
              </div>

              <div className="flex flex-col gap-8 mt-5">
                <div className="text-lg md:text-xl font-semibold text-fuchsia-400 px-3">
                  <p>1. Who is the father of Computers?</p>
                </div>

                <div className="flex flex-col gap-1">
                  {[
                    { id: "option1", value: "James Gosling" },
                    { id: "option2", value: "Charles Babbage" },
                    { id: "option3", value: "Dennis Ritchie" },
                    { id: "option4", value: "Bjarne Stroustrup" },
                  ].map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center gap-3 md:text-lg px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        selectedOption === option.value ? "bg-fuchsia-800" : "hover:bg-fuchsia-900"
                      }`}
                      onClick={() => setSelectedOption(option.value)}
                    >
                      <input
                        type="radio"
                        id={option.id}
                        name="option"
                        value={option.value}
                        checked={selectedOption === option.value}
                        onChange={() => setSelectedOption(option.value)}
                        className="cursor-pointer"
                      />
                      <label htmlFor={option.id} className="cursor-pointer">
                        {option.value}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <GradientBtn name="Prev" />
                <GradientBtn name="Next" disabled={!selectedOption} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-16 my-8">
              <h2>
                <p className="text-3xl text-center text-fuchsia-400 font-semibold mb-2.5">Time's Up!</p>
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
