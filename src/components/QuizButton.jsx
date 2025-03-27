import React, {useState} from 'react';
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import GradientBtn from "@/components/GradientBtn"


const QuizButton = ({ name }) => {
    const [isChecked, setIsChecked] = useState(false)

    return (
        <Dialog>
            <div className="flex items-center justify-center">
                <DialogTrigger>
                    <div className="relative group">
                        <div className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-40 transition-opacity duration-500 group-hover:opacity-100"></span>
                            <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                                <div className="relative z-10 flex items-center space-x-2">
                                    <span className="transition-all duration-500">{name}</span>
                                </div>
                            </span>
                        </div>
                    </div>
                </DialogTrigger>
            </div>

            {/* Instructions for the quizes */}
            <DialogContent className={'bg-slate-900/80 border-0! ring-1 ring-purple-400 py-9 px-8'}>
                <DialogClose className={'absolute top-4 right-5'}>
                    <i className="fa-solid fa-xmark text-fuchsia-300"></i>
                </DialogClose>

                <DialogHeader>
                    <DialogTitle className={'text-fuchsia-400 text-center text-xl mb-2'}>Instructions</DialogTitle>
                </DialogHeader>

                <DialogDescription className={'text-gray-300 px-2 font-medium'}>
                    <p>1. The quiz consists of 15 questions.</p>
                    <p>2. You have 15 minutes to complete this quiz.</p>
                    <p>3. Once you start the quiz, you can't pause it.</p>
                    <p>4. You can't skip any question.</p>
                    <p>5. Once you start the quiz, you have to complete it.</p>
                    <p>6. You can't resize your browser during the quiz.</p>
                    <p>7. You can't switch tabs during the quiz.</p>
                    <p>8. The quiz will automatically submit upon expiration of the time limit.</p>
                </DialogDescription>

                <DialogFooter className={'flex-col! items-center mt-4'}>
                    <div className='text-sm! text-fuchsia-300 flex items-center gap-2 justify-center mb-5'>
                        <input 
                            type="checkbox" 
                            id="confirm" 
                            name="confirm" 
                            className='accent-fuchsia-200'
                            onChange={(e) => setIsChecked(e.target.checked)} 
                        />
                        <label for="confirm">I've read and understood the instructions. Let's begin!</label>
                    </div>
                    <Link to={isChecked ? "/quiz-page" : "#"}>
                        <GradientBtn name="Start Quiz" />
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default QuizButton