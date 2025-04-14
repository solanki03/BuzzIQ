import React from 'react'
import Navbar from '@/components/Navbar';
import { HoverEffect } from '../components/ui/card-hover-effect'

const QuizDashboard = () => {
    const quizList = [
        {
          id: 1,
          title: "Computer Fundamentals",
          description: "Basic fundamental concepts, Internet Technology",
          image: "src/assets/images/comp_fm.png",
        },
        {
          id: 2,
          title: "Computer Science and Technology",
          description: "DSA, DBMS, OS, Cloud Computing, OOP Concepts",
          image: "src/assets/images/comp_tech.png",
        },
        {
          id: 3,
          title: "C Programming",
          description: "Fundamental Concepts of C Programming",
          image: "src/assets/images/c_prog.png",
        },
        {
          id: 4,
          title: "Java Programming",
          description: "Fundamental Concepts of Java",
          image: "src/assets/images/java.png",
        },
        {
          id: 5,
          title: "Python Programming",
          description: "Fundamental Concepts of Python",
          image: "src/assets/images/python.png",
        },
        {
          id: 6,
          title: "General Knowledge",
          description: "History, Geography, Science, Sports, Economics, Current Affairs, etc.",
          image: "src/assets/images/gk.png",
        },
        {
          id: 7,
          title: "Verbal Ability",
          description: "Concept of Verbal and Grammatical Knowledge",
          image: "src/assets/images/verbal.png",
        },
        {
          id: 8,
          title: "Logical Reasoning",
          description: "Distance & Direction, Blood Relation, Puzzles, Clock & Calendar, etc.",
          image: "src/assets/images/reasoning.png",
        },
        {
          id: 9,
          title: "Quantitative Aptitude",
          description: "Ratio, Percentage, Time-Speed-Distance, Work & Time, etc.",
          image: "src/assets/images/quantitative.png",
        },
        {
          id: 10,
          title: "Medical Science",
          description: "Concepts of Medical Science & Fields",
          image: "src/assets/images/medical.png",
        },
        {
          id: 11,
          title: "Biotechnology",
          description: "Human & Animal Health, Agriculture, Environment, etc.",
          image: "src/assets/images/biotech.png",
        },
        {
          id: 12,
          title: "Soft Skill",
          description: "Concept of Soft Skills in Professional & Daily Life",
          image: "src/assets/images/soft_skills.png",
        },
      ];
      

    return (
        <div className="w-full text-white">
            <Navbar className="sticky! z-[80] bg-black/80 backdrop-blur-sm transition-all duration-300 ease-in-out" />

            <div className='flex flex-col gap-5 items-center justify-center px-5'>
                <h1 className='font-semibold text-2xl sm:text-4xl text-center block border-b-2 px-10 pb-4 border-slate-700'>
                    <span className='text-slate-300'>Unleash Your Potential & Take the Challenge!</span>
                </h1>
                <div className='max-w-6xl mx-auto px-8'>
                    <HoverEffect items={quizList} />
                </div>
            </div>

            {/* Bottom Copyright Section */}
            <div className="w-full flex justify-center text-center mb-5">
                <p className="text-sm text-gray-400">
                    <span className="font-Warnes! font-medium!">BuzzIQ{" "}</span>
                    &copy; {new Date().getFullYear()} All Rights Reserved
                </p>
            </div>
        </div>
    )
}

export default QuizDashboard