import React from 'react'
import Navbar from '@/components/Navbar';
import { HoverEffect } from '../components/ui/card-hover-effect'

export const quizList = [
    {
        title: "Computer Fundamentals",
        description: "Networking, Software Engineering, Internet Technology",
        image: "",
    },
{
        title: "Computer Science & Technology",
        description: "DSA, DBMS, OS, Cloud Computing, OOP Concepts",
        image: "",
    },
{
        title: "C Programming",
        description: "Fundamental Concepts of C Pregramming",
        image: "",
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
        image: "",
    },
{
        title: "Verbal Ability",
        description: "Concept of Verbal and Grammatical Knowledge",
        image: "",
    },
{
        title: "Logical Reasoning",
        description: "Distance & Direction, Blood Relation, Puzzles, Clock & Calendar, etc.",
        image: "",
    },
{
        title: "Quantitative Aptitude",
        description: "Ratio, Percentage, Time-Speed-Distance, Work & Time, etc.",
        image: "",
    },
{
        title: "Medical Science",
        description: "Concepts of Medical Science & Fields",
        image: "",
    },
{
        title: "Biotechnology",
        description: "Human & Animal Health, Agriculture, Environment, etc.",
        image: "",
    },
{
        title: "Soft Skills",
        description: "Concept of Soft Skills in Professional & Daily Life",
        image: "",
    },
];

const QuizDashboard = () => {

    return (
        <div className="w-full text-white">
            <div className='sticky! w-full z-20 top-0'>
            <Navbar />
            </div>

            <div className='pt-24 flex flex-col gap-5 items-center justify-center'>
                <h1 className='font-semibold text-3xl sm:text-4xl text-center block border-b-2 px-10 pb-4 border-slate-700'>
                    <span>Quiz Dashboard:{" "}</span>
                    <span className='text-slate-300'>Explore Your Knowledge</span>
                </h1>
                <div className='max-w-6xl mx-auto px-8'>
                    <HoverEffect items={quizList} />
                </div>
            </div>
        </div>
    )
}

export default QuizDashboard