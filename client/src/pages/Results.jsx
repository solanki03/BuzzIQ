import React, { useEffect, useCallback, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Navbar from "@/components/Navbar";
import GradientBtn from "@/components/GradientBtn";
import { PieChartComponent } from "@/components/PieChart";
import { House, Logs } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";
import { FeedbackDialog } from "@/components/Feedback";
import DownloadBtn from "@/components/DownloadBtn";
import Certificate from "@/components/Certificate";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const saveAttempts = useRef(0);
  const maxAttempts = 3;
  const retryDelay = 5000;
  const toastId = useRef(null);
  const printRef = useRef(null);

  // Safely extract quiz results with proper defaults
  const quizData = location.state || {};
  const {
    topic = null,
    totalQuestions = 0,
    results = [],
    timeTaken = 0,
  } = quizData;

  // Calculate metrics
  const correctAnswers = results.filter((q) => q.isCorrect).length;
  const attemptedQuestions = results.filter(
    (q) => q.userAnswer !== undefined && q.userAnswer !== null
  ).length;
  const wrongAnswers = results.filter(
    (q) => q.userAnswer && !q.isCorrect
  ).length;
  const notAttempted = totalQuestions - attemptedQuestions;
  const percentage =
    totalQuestions > 0
      ? ((correctAnswers / totalQuestions) * 100).toFixed(2)
      : 0;
  // Calculate username
  const username =
    user?.username ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    "Guest";

  // Format time taken
  const formatTimeTaken = (seconds) => {
    if (typeof seconds !== "number" || seconds < 0) return "0 min 0 sec";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  // Format topic name
  const formatTopicName = (str) => {
    if (!str) return "Quiz Results";
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedTopic = formatTopicName(topic);

  // Result info display
  const resultInfo = [
    { label: "Username", value: username },
    { label: "Topic", value: formattedTopic },
    { label: "Total Questions", value: totalQuestions },
    { label: "Attempted Questions", value: attemptedQuestions },
    { label: "Correct Answers", value: correctAnswers },
    { label: "Wrong Answers", value: wrongAnswers },
    { label: "Not Attempted", value: notAttempted },
    { label: "Total Score(%)", value: `${percentage}%` },
    { label: "Time Taken", value: formatTimeTaken(timeTaken) },
  ];

  const saveResults = useCallback(async () => {
    if (
      !user ||
      !topic ||
      hasSaved ||
      isSaving ||
      saveAttempts.current >= maxAttempts
    )
      return;
    setIsSaving(true);
    toast.dismiss(toastId.current);
    const attempt = saveAttempts.current + 1;
    toastId.current = toast.loading(
      `Saving results (attempt ${attempt}/${maxAttempts})...`
    );

    try {
      const payload = {
        userId: user.id,
        username,
        topic: formattedTopic,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        notAttempted,
        timeTaken,
      };
      const { data } = await axios.post(
        "http://localhost:5000/v1/results",
        payload
      );
      if (!data.success)
        throw new Error(data.error || "Failed to save results");
      toast.dismiss(toastId.current);
      toast.success("Results saved successfully!");
      setHasSaved(true);
    } catch (err) {
      saveAttempts.current += 1;
      const msg = err.response?.data?.error || err.message;
      toast.dismiss(toastId.current);
      toast.error(`Error saving results: ${msg}`);
      if (saveAttempts.current < maxAttempts) {
        setTimeout(saveResults, retryDelay);
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    user,
    topic,
    hasSaved,
    isSaving,
    formattedTopic,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    notAttempted,
    timeTaken,
  ]);

  // Trigger save once on mount; retries handled inside
  useEffect(() => {
    saveResults();
  }, []);

  //prevent browser reload and loss of data(ask for confirmation)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // This is required for Chrome
      return ""; // This is required for Firefox
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


  // Prevent going back to QuizPage
  useEffect(() => {
    const handleBackNavigation = (e) => {
      e.preventDefault();
      navigate("/quiz-dashboard", { replace: true });
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackNavigation);

    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
      toast.dismiss(toastId.current);
    };
  }, [navigate]);

  // Redirect if no state
  useEffect(() => {
    if (!location.state) {
      navigate("/quiz-dashboard", { replace: true });
    }
  }, [location.state, navigate]);

  // Download Certificate
  const downloadCertificate = async () => {
    const certificateRef = printRef.current;
    if (!certificateRef) {
      console.error('Certificate element not found');
      return;
    }

    try {
      // Small delay to ensure the DOM is fully painted
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(certificateRef, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: true,
        width: 1122, // Force width to A4 landscape
        height: 793  // Force height to A4 landscape
      });

      if (canvas.width === 0 || canvas.height === 0) {
        console.error("Captured blank canvas! Cannot generate certificate.");
        return;
      }

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",  // Use 'pt' (1/72 inch) for real-world sizing
        format: "a4",
        putOnlyUsedFonts: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 20; // Margin for the PDF

      pdf.addImage(imgData, "PNG", margin, margin, pdfWidth - 2 * margin, pdfHeight - 2 * margin);
      pdf.save(`BuzzIQ_Certificate_${username}.pdf`);
      toast.success("Certificate downloaded successfully!");

    } catch (error) {
      console.error("Error generating certificate PDF:", error);
      toast.error("Failed to download certificate.");
    }
  };

  return (
    <div className="w-full text-white mb-10">
      <Navbar className="sticky! z-[80] bg-black/80 backdrop-blur-sm transition-all duration-300 ease-in-out" />

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #7e22ce",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
          },
          success: {
            iconTheme: {
              primary: "#a855f7",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
          loading: {
            iconTheme: {
              primary: "#a855f7",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="flex flex-col gap-7 items-center justify-center px-5 bg-black">
        <h1 className="font-semibold text-2xl sm:text-4xl text-center block border-b-2 px-10 pb-4 border-slate-700">
          <span className="text-slate-300">
            Review Your Results & Learn More
          </span>
        </h1>

        <div className="flex flex-col w-full max-w-5xl rounded-xl bg-slate-900/50 ring-1 ring-fuchsia-300 px-4 py-6 sm:px-8">
          {/* Side navigation button - Home and Dashboard */}
          <div className="flex justify-between items-center">
            <button
              title="Go to Home Page"
              className="text-fuchsia-400 hover:text-fuchsia-300 transition-all duration-200 ease-in-out w-11 h-11 rounded-full bg-slate-800/50 flex items-center justify-center shadow-md ring-1 ring-fuchsia-300 hover:ring-fuchsia-400 active:ring-fuchsia-500"
              onClick={() => navigate("/")}
            >
              <House />
            </button>
            <button
              title="Go to Dashboard"
              className="text-fuchsia-400 hover:text-fuchsia-300 transition-all duration-200 ease-in-out w-11 h-11 rounded-full bg-slate-800/50 flex items-center justify-center shadow-md ring-1 ring-fuchsia-300 hover:ring-fuchsia-400 active:ring-fuchsia-500"
              onClick={() => navigate("/quiz-dashboard")}
            >
              <Logs />
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-6 w-full">
            {/* Quiz results section */}
            <div className="flex flex-col gap-4 max-md:min-w-[300px] md:w-1/2">
              <h2 className="text-2xl font-semibold text-center">
                Quiz Results
              </h2>
              <div className="space-y-2 bg-slate-700/30 px-5 md:px-7 py-3 rounded-lg">
                {resultInfo.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm sm:text-lg pb-1"
                  >
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-gray-100 font-medium text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie chart section */}
            <div className="flex flex-col md:w-1/2">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Performance Overview
              </h2>
              <PieChartComponent
                {...{ correctAnswers, wrongAnswers, notAttempted }}
              />
            </div>
          </div>

          {/* Bottom Navigation - Download certificate and Retake Quiz button  */}
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 mt-6">
            {/* Certification div - hidden from the users */}
            <div className="absolute opacity-0 pointer-events-none -top-[9999px] -left-[9999px]">
              <Certificate
                connectRef={printRef}
                username={username}
                subject={formattedTopic}
                percentage={percentage}
                date={new Date().toLocaleDateString('en-GB')}
              />
            </div>

            {/* Download certificate button */}
            {percentage >= 65 ? (
              <DownloadBtn name="Claim Your Certificate" onClick={downloadCertificate} />
            ) : (
              <p className="text-xs text-gray-300 text-center bg-slate-800 rounded-full px-4 py-2 mt-2">
                Note: Earn your certificate by scoring 65% or higher!
              </p>
            )}

            {/* Retake quiz button */}
            <GradientBtn
              name="Retake Quiz"
              onClick={() => navigate(`/quiz/${topic || "computer_fundamentals"}`)}
            />
          </div>
        </div>

        {/* Feedback dialog */}
        <div className="w-full flex justify-center-safe lg:justify-end mt-5 lg:my-0 lg:mr-5">
          <FeedbackDialog />
        </div>
      </div>

      {/* Copyright section */}
      <div className="w-full flex justify-center text-center mt-5 lg:m-0">
        <p className="text-sm text-gray-400">
          <span className="font-Warnes! font-medium!">BuzzIQ </span>
          &copy; {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Results;
