import React from "react";
import { Analytics } from "@vercel/analytics/react";
import Aurora from "./components/Aurora";
import "@fortawesome/fontawesome-free/css/all.min.css";
import StartSessionButton from "./components/StartSessionButton";
import Navbar from "./components/Navbar";
import ChatBot from "./components/Chatbot";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { devs, aboutUsContent, termsOfService, privacyPolicy, services } from "./utils/info.js";
import Celebratebtn from "./components/Celebratebtn";

const App = () => {

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
        {/*Celebration button added*/} 
      <Celebratebtn />

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center text-white px-6 sm:px-10 mt-36 sm:mt-20">
          <h2 className="text-2xl sm:text-5xl xl:text-7xl font-semibold">
            Are you a Trivia Titan? <br /> Prove it with{" "}
            <span className="font-Warnes! font-normal!">BuzzIQ</span>
          </h2>
          <p className="mt-8 text-xs text-gray-400 sm:text-base md:w-1/2">
            Dive into a world of diverse quizzes, from tech to trivia.
            Challenge your mind, discover your strengths, and see how you
            rank. Your brain&apos;s test adventure starts from here 🚀
          </p>

          <div className="mt-6 flex items-center justify-center">
            <img
              src="https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User1"
              className="w-4.5 h-4.5 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://plus.unsplash.com/premium_photo-1689551671548-79ff30459d2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D"
              alt="User2"
              className="w-4.5 h-4.5 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover -ml-3"
            />
            <img
              src="https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User3"
              className="w-4.5 h-4.5 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover -ml-3"
            />
            <span className="ml-1.5 md:ml-4 text-[10px] sm:text-sm">
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
      <footer className="w-full flex flex-col justify-center items-center-safe px-5 sm:px-15 text-white">
        {/* Top Section */}
        <div className="container flex flex-row md:gap-8 flex-wrap justify-around max-sm:items-center-safe border-t border-gray-700 py-4 md:py-8">

          {/* Branding */}
          <div className="flex flex-col items-start mb-6 md:mb-0">
            <h2 className="text-xl md:text-3xl font-Warnes! text-white">BuzzIQ</h2>
            <p className="text-gray-400 text-xs sm:text-base">Get Smart. Get Buzzed.</p>
            {/* Social Media Icons */}
            <div className="mt-1 md:mt-3 flex gap-4 text-lg md:text-xl text-gray-400">
              <a
                href="https://github.com/solanki03"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/sourav-pal-659631266"
                target="_blank"
                className="hover:text-white transition-colors"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a href=" https://x.com/souravpal01629?t=fXghrArAJhay6YytgmjAmQ&s=08 " className="hover:text-white transition-colors">
                <i className="fab fa-x-twitter"></i>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* About & Legal Section */}
          <div className="flex flex-col max-sm:items-center-safe items-start gap-1 md:gap-2 text-[12px] md:text-sm mt-2 mb-6 md:mb-0">

            {/* About us */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm md:text-base font-semibold text-white mb-1">About Us</button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900/80 border-0 ring-1 ring-purple-400 py-9 px-8 max-h-3/5 overflow-y-scroll scrollbar-black">
                <DialogClose className="absolute top-4 right-5">
                  <i className="fa-solid fa-xmark text-fuchsia-300"></i>
                </DialogClose>
                <DialogHeader>
                  <DialogTitle className="text-fuchsia-400 text-center text-xl mb-2">About Us</DialogTitle>
                  <DialogDescription className="text-gray-300 px-2 font-medium text-left space-y-3">
                    {aboutUsContent.map((item, index) => (
                      <div key={index}>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p>{item.description}</p>
                      </div>
                    ))}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {/* Terms of Service */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm md:text-base font-semibold text-white mb-1">Terms of Service</button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900/80 border-0! ring-1 ring-purple-400 py-9 px-4 md:px-8 max-h-3/4 overflow-y-scroll scrollbar-black">
                <DialogClose className="absolute top-4 right-5">
                  <i className="fa-solid fa-xmark text-fuchsia-300"></i>
                </DialogClose>
                <DialogHeader>
                  <DialogTitle className="text-fuchsia-400 text-center text-xl mb-2">Terms of Service</DialogTitle>
                  <DialogDescription className="text-gray-300 text-left px-2 font-medium">
                    <p><strong>Effective Date: </strong>{termsOfService.effectiveDate}</p>
                    <p className="my-3 text-sm md:text-base">{termsOfService.intro}</p>
                    <ul className="text-xs md:text-sm space-y-2 list-disc list-inside">
                      {termsOfService.points.map((item, index) => (
                        <li key={index}>
                          <strong className="text-purple-400">{item.title}:</strong> {item.description}
                        </li>
                      ))}
                    </ul>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {/* Privacy Policy */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm md:text-base font-semibold text-white mb-1">Privacy Policy</button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900/80 border-0! ring-1 ring-purple-400 py-9 px-4 md:px-8 max-h-3/4 overflow-y-scroll scrollbar-black">
                <DialogClose className="absolute top-4 right-5">
                  <i className="fa-solid fa-xmark text-fuchsia-300"></i>
                </DialogClose>
                <DialogHeader>
                  <DialogTitle className="text-fuchsia-400 text-center text-xl mb-2">Privacy Policy</DialogTitle>
                  <DialogDescription className="text-gray-300 text-left px-2 font-medium">
                    <p><strong>Effective Date: </strong>{privacyPolicy.effectiveDate}</p>
                    <p className="my-3 text-sm md:text-base">{privacyPolicy.intro}</p>
                    <div className="space-y-4 text-xs md:text-sm">
                      {privacyPolicy.sections.map((section, index) => (
                        <div key={index}>
                          <strong className="text-purple-400">{section.title}:</strong>
                          {section.points ? (
                            <ul className="list-disc list-inside mt-1 ml-2 space-y-1">
                              {section.points.map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-1 ml-2">{section.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          {/* Services */}
          <div className="text-gray-400 mb-6 md:mb-0">
            <h3 className="text-sm md:text-base max-sm:text-center font-semibold text-white mb-1">Services</h3>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-1 text-[12px] md:text-sm mb-4 list-none">
              {services.map((service, index) => (
                <li
                  key={index}
                  className="before:content-['•'] before:mr-1 before:text-purple-400"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Developers info */}
          <div className="max-sm:text-center text-gray-400">
            <h3 className="text-sm md:text-base font-semibold text-white mb-1">Developed by</h3>
            <ul className="text-xs md:text-sm space-y-1">
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

        </div>

        {/* Bottom Copyright Section */}
        <div className="w-full flex justify-center text-center mt-6">
          <div className="border-t border-gray-700 w-86 mb-5 pt-2">
            <p className="text-xs md:text-sm text-gray-400">
              <span className="font-Warnes! font-medium!">BuzzIQ{" "}</span>
              &copy; {new Date().getFullYear()} All Rights Are Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Vercel Analytics Component */}
      <Analytics />
    </main>
  );
};

export default App;
