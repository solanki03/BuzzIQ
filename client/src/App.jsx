import React from "react";
import Aurora from "./components/Aurora";
import "@fortawesome/fontawesome-free/css/all.min.css";
import StartSessionButton from "./components/StartSessionButton";
import Navbar from "./components/Navbar";
import ChatBot from "./components/Chatbot";

const App = () => {
  const devs = [
    {
      name: "Sourav Pal",
      linkedin: "https://www.linkedin.com/in/sourav-pal-659631266",
    },
    {
      name: "Solanki Singha",
      linkedin: "https://www.linkedin.com/in/solankisingha",
    },
    {
      name: "Sk Nasim Ali",
      linkedin: "https://www.linkedin.com/in/sk-nasim-ali/",
    },
    {
      name: "Trishagni Mondal",
      linkedin: "https://www.linkedin.com/in/trishagni-mondal-480a5b29a/",
    },
  ];

  const topics = [
    "Comp. Fundamentals",
    "Comp. Science & Tech",
    "C Programming",
    "Java Programming",
    "Python Programming",
    "General Knowledge",
    "Verbal Ability",
    "Logical Reasoning",
    "Quantitative Aptitude",
    "Medical Science",
    "Biotechnology",
    "Soft Skills",
  ];

  return (
      <main className="w-full font-Poppins relative">
          <Aurora
            colorStops={["#6F8ED8", "#812FAD", "#53E0F3"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.6}
          />

          <div className="h-dvh w-full flex flex-col items-center justify-center">
            {/* Navigation */}
            <Navbar className="bg-transparent" />

            {/* Hero Section */}
            <div className="flex flex-col items-center text-center text-white px-6 sm:px-10 mt-36 sm:mt-20">
              <h2 className="text-4xl sm:text-5xl xl:text-7xl font-semibold">
                Are you a Trivia Titan? <br /> Prove it with{" "}
                <span className="font-Warnes! font-normal!">BuzzIQ</span>
              </h2>
              <p className="mt-8 text-sm text-gray-400 sm:text-base md:w-1/2">
                Dive into a world of diverse quizzes, from tech to trivia.
                Challenge your mind, discover your strengths, and see how you
                rank. Your brain’s test adventure starts from here 🚀
              </p>

              <div className="mt-6 flex items-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="User1"
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://plus.unsplash.com/premium_photo-1689551671548-79ff30459d2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D"
                  alt="User2"
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover -ml-3"
                />
                <img
                  src="https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="User3"
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover -ml-3"
                />
                <span className="ml-2 md:ml-4 text-[12px] sm:text-sm">
                  Join with 100+ users and start a new experience
                </span>
              </div>
              <div className="mt-12 mb-20">
                <StartSessionButton name="Let's get started" />
              </div>
            </div>
          </div>
   
       <ChatBot />
          

          {/* Footer */}

          <footer className="w-full flex flex-col justify-center items-center px-8 sm:px-15 text-white">
            <div className="container flex flex-wrap max-sm:justify-between justify-around items-center border-t border-gray-700 py-8">
              {/* Left Section - Branding */}
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-Warnes! text-white">
                  BuzzIQ
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  Get Smart. Get Buzzed.
                </p>
                {/* Social Media Icons */}
                <div className="mt-3 flex gap-4 text-lg md:text-xl text-gray-400">
                  <a
                    href="https://github.com/solanki03"
                    target="_blank"
                    className="hover:text-white transition-colors"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sourav-pal-659631266

"
                    className="hover:text-white transition-colors"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    <i className="fab fa-x-twitter"></i>
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>

              {/* Middle Section - Developers */}
              <div className="mb-6 md:mb-0">
                <h3 className="text-base font-semibold text-white mb-2">
                  Developed by
                </h3>
                <ul className="text-gray-400 text-[12px] md:text-sm space-y-1">
                  {devs.map((dev, index) => (
                    <li key={index}>
                      <a
                        href={dev.linkedin}
                        target="_blank"
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        {dev.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Section - Topics */}
              <div className="text-gray-400">
                <h3 className="text-base font-semibold text-white mb-2">
                  Topics
                </h3>
                <div className="grid grid-cols-3 gap-6 text-[12px] md:text-sm">
                  {[0, 4, 8].map((startIndex) => (
                    <div key={startIndex} className="space-y-1">
                      {topics
                        .slice(startIndex, startIndex + 4)
                        .map((topic, index) => (
                          <p key={index}>{topic}</p>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Copyright Section */}
            <div className="w-full flex justify-center text-center mt-6">
              <div className="border-t border-gray-700 w-86 mb-5 pt-2">
                <p className="text-sm text-gray-400">
                  <span className="font-Warnes! font-medium!">BuzzIQ{" "}</span>
                  &copy; {new Date().getFullYear()} All Rights Reserved
                </p>
              </div>
            </div>
          </footer>


        </main>
  );
};

export default App;
