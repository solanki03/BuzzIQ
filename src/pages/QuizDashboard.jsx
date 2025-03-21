import React from 'react'
import Navbar from '@/components/Navbar';
import { HoverEffect } from '../components/ui/card-hover-effect'

const QuizDashboard = () => {
    const quizList = [
        {
            title: "Computer Fundamentals",
            description: "Basic fundamental concepts, Internet Technology",
            image: "src/assets/comp_fm.png",
        },
    {
            title: "Computer Science & Technology",
            description: "DSA, DBMS, OS, Cloud Computing, OOP Concepts",
            image: "src/assets/comp_tech.png",
        },
    {
            title: "C Programming",
            description: "Fundamental Concepts of C Pregramming",
            image: "src/assets/c_prog.png",
        },
    {
            title: "Java Programming",
            description: "Fundamental Concepts of Java",
            image: "src/assets/java.png",
        },
    {
            title: "Python Programming",
            description: "Fundamental Concepts of Python",
            image: "src/assets/python.png",
        },
    {
            title: "General Knowledge",
            description: "History, Geography, Science, Sports, Economics, Current Affairs, etc.",
            image: "src/assets/gk.png",
        },
    {
            title: "Verbal Ability",
            description: "Concept of Verbal and Grammatical Knowledge",
            image: "src/assets/verbal.png",
        },
    {
            title: "Logical Reasoning",
            description: "Distance & Direction, Blood Relation, Puzzles, Clock & Calendar, etc.",
            image: "src/assets/reasoning.png",
        },
    {
            title: "Quantitative Aptitude",
            description: "Ratio, Percentage, Time-Speed-Distance, Work & Time, etc.",
            image: "src/assets/quantitative.png",
        },
    {
            title: "Medical Science",
            description: "Concepts of Medical Science & Fields",
            image: "src/assets/medical.png",
        },
    {
            title: "Biotechnology",
            description: "Human & Animal Health, Agriculture, Environment, etc.",
            image: "src/assets/biotech.png",
        },
    {
            title: "Soft Skills",
            description: "Concept of Soft Skills in Professional & Daily Life",
            image: "src/assets/soft_skills.png",
        },
    ];

    return (
        <div className="w-full text-white">
            <div className='sticky! w-full z-20 top-0'>
            <Navbar />
            </div>

            <div className='pt-24 flex flex-col gap-5 items-center justify-center'>
                <h1 className='font-semibold text-3xl sm:text-4xl text-center block border-b-2 px-10 pb-4 border-slate-700'>
                    <span> Welcome to Quiz Dashboard{" "}</span>
                    <br />
                    <span className='text-slate-300'>Unleash Your Potential & Take the Challenge!</span>
                </h1>
                <div className='max-w-6xl mx-auto px-8'>
                    <HoverEffect items={quizList} />
                </div>
            </div>
        </div>
    )
}

export default QuizDashboard