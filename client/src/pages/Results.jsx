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

  const attemptId = location.state?.attemptId;
  const {
    topic = null,
    totalQuestions = 0,
    results = [],
    timeTaken = 0,
  } = location.state || {};

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

  const username =
    user?.username ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    "Guest";

  const formatTimeTaken = (seconds) => {
    if (typeof seconds !== "number" || seconds < 0) return "0 min 0 sec";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  const formatTopicName = (str) => {
    if (!str) return "Quiz Results";
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedTopic = formatTopicName(topic);

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
      // First check if attemptId exists
      const checkRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/v2/results/cheak/${user.id}`
      );

      // If attemptId exists, skip saving and show a message
      if (checkRes.data.attemptIds.includes(attemptId)) {
        toast.dismiss(toastId.current);
        toast.success("Results already saved! ⚠️");
        setHasSaved(true);
        return;
      }

      // Proceed with saving new results
      const payload = {
        userId: user.id,
        username,
        topic: formattedTopic,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        notAttempted,
        timeTaken,
        attemptId,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/results`,
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
      toast.error(`Error: ${msg}`);

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
    saveAttempts,
    maxAttempts,
    retryDelay,
    attemptId,
  ]);

  useEffect(() => {
    saveResults();
  }, []);

  useEffect(() => {
    if (!location.state) {
      navigate("/quiz-dashboard", { replace: true });
    }
  }, [location.state, navigate]);

  const downloadCertificate = async () => {
    const certificateRef = printRef.current;
    if (!certificateRef) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const canvas = await html2canvas(certificateRef, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: 1122,
        height: 793,
      });

      if (!canvas.width || !canvas.height) return;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
        putOnlyUsedFonts: true,
      });

      const margin = 20;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        margin,
        pdfWidth - 2 * margin,
        pdfHeight - 2 * margin
      );
      pdf.save(`BuzzIQ_Certificate_${username}.pdf`);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
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
        <h1 className="font-semibold text-xl sm:text-4xl text-center block border-b-2 px-10 pb-4 border-slate-700">
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
            <div className="flex flex-col gap-4 max-md:min-w-[290px] md:w-1/2">
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
            {/* Certification div - hidden from the users */}
            <div className="absolute opacity-0 pointer-events-none -top-[9999px] -left-[9999px]">
              <Certificate
                connectRef={printRef}
                username={username}
                subject={formattedTopic}
                percentage={percentage}
                date={new Date().toLocaleDateString("en-GB")}
              />
            </div>

            {/* Download certificate button */}
            {percentage >= 65 ? (
              <DownloadBtn
                name="Claim Your Certificate"
                onClick={downloadCertificate}
              />
            ) : (
              <p className="text-sm text-gray-300 text-center bg-slate-800 rounded-sm px-4 py-2">
                <b>Note:</b> Earn your certificate by scoring 65% or higher!
              </p>
            )}

            {/* Retake quiz button */}
            <GradientBtn
              name="Retake Quiz"
              onClick={() =>
                navigate(`/quiz/${topic || "computer_fundamentals"}`)
              }
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
        <p className="text-xs md:text-sm text-gray-400">
          <span className="font-Warnes! font-medium!">BuzzIQ </span>
          &copy; {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Results;
