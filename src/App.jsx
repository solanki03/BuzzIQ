import React from "react";
import Aurora from "./components/Aurora";
import "@fortawesome/fontawesome-free/css/all.min.css";
import StartSessionButton from "./components/Button";
import AuthButton from "./components/AuthButton";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SSOCallback from "./pages/SSOCallback.jsx";
import { Loader2 } from "lucide-react";

const App = () => {
  return (
    <>
      <ClerkLoading>
        <main className="h-dvh w-full flex items-center justify-center flex-col">
          <h1 className="text-[1.5vw] skeleton-text">
            Initializing the Application
          </h1>
          <p className="text-[1vw] skeleton-text pb-5 pt-1">Please wait...</p>
          <Loader2 className="animate-spin" />
        </main>
      </ClerkLoading>
      <ClerkLoaded>
        <main className="h-dvh w-full font-Poppins relative">
          <Aurora
            colorStops={["#6F8ED8", "#812FAD", "#53E0F3"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.6}
          />

          {/* Navigation */}
          <nav className="flex justify-between items-center px-10 py-6">
            <h1 className="text-white text-3xl font-bold font-Warnes">
              BuzzIQ
            </h1>
            <div className="">
              
              
              <SignedOut><AuthButton /></SignedOut>
              <SignedIn><UserButton /></SignedIn>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="flex flex-col items-center text-center text-white px-10 mt-16">
            <h2 className="text-5xl font-bold">
              Are you a Trivia Titan? <br /> Prove it with{" "}
              <span style={{ fontFamily: "Warnes, cursive" }}>BuzzIQ</span>
            </h2>
            <p className="mt-8 text-base w-1/2 ">
              Dive into a world of diverse quizzes, from tech to trivia.
              Challenge your mind, discover your strengths, and see how you
              rank. Your brain’s test adventure starts from here 🚀
            </p>

            <div className="mt-6 flex items-center">
              <img
                src="https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="User1"
                className="w-10 h-10 rounded-full border-2 border-white "
              />
              <img
                src="https://plus.unsplash.com/premium_photo-1689551671548-79ff30459d2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D"
                alt="User2"
                className="w-10 h-10 rounded-full border-2 border-white -ml-3"
              />
              <img
                src="https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="User3"
                className="rounded-full w-10 h-10 border-2 border-white -ml-3"
              />
              <span className="ml-4">
                Join with 500+ users and start a new experience
              </span>
            </div>
            <div className="mt-10 mb-20">
              <StartSessionButton />
            </div>
          </div>

          {/* Footer */}

          <footer className="w-full pt-12 py-10 text-white border-t border-gray-700">
            <div className="container mx-auto px-15 flex flex-col md:flex-row justify-between">
              {/* Left Section - Branding */}
              <div className="mb-6 md:mb-0">
                <h2
                  className="text-3xl font-bold"
                  style={{ fontFamily: "Warnes, cursive" }}
                >
                  BuzzIQ
                </h2>
                <p className="mt-2 text-gray-400">Get Smart. Get Buzzed.</p>
                {/* Social Media Icons */}
                <div className="mt-3 flex gap-4 text-3xl">
                  <a href="#">
                    <i className="fab fa-linkedin text-lg"></i>
                  </a>
                  <a href="https://github.com/solanki03">
                    <i className="fab fa-github text-lg"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-instagram text-lg"></i>
                  </a>
                </div>
                <p className="text-base  text-gray-400 pt-1">
                  ©️ All rights are reserved
                </p>
              </div>

              {/* Middle Section - Developers */}
              <div className="mb-6 md:mb-0">
                <h3 className="text-base font-semibold text-white mb-2">
                  Developed by
                </h3>
                <ul className="text-gray-400 space-y-1">
                  <li>
                    <a
                      href="https://www.linkedin.com/in/sourav-pal-659631266"
                      className="hover:text-white"
                    >
                      Sourav Pal
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/solankisingha"
                      className="hover:text-white"
                    >
                      Solanki Singha
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/sk-nasim-ali/"
                      className="hover:text-white"
                    >
                      Sk Nasim Ali
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/trishagni-mondal-480a5b29a/"
                      className="hover:text-white"
                    >
                      Trishagni Mondal
                    </a>
                  </li>
                </ul>
              </div>

              {/* Right Section - Topics */}
              <div className="grid grid-cols-2 gap-6 text-gray-400 text-sm">
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Topics
                  </h3>
                  <p>Comp. Fundamentals</p>
                  <p>Comp. Science & Tech</p>
                  <p>C Programming</p>
                  <p>Java Programming</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    More Topics
                  </h3>
                  <p>Python Programming</p>
                  <p>General Knowledge</p>
                  <p>Verbal Ability</p>
                  <p>Logical Reasoning</p>
                  <p>Quantitative Aptitude</p>
                  <p>Medical Science</p>
                  <p>Biotechnology</p>
                  <p>Soft Skills</p>
                </div>
              </div>
            </div>
          </footer>
        </main>

        <Router>
          <Routes>
            <Route path="/sso-callback" element={<SSOCallback />} />
          </Routes>
        </Router>
      </ClerkLoaded>
    </>
  );
};

export default App;
