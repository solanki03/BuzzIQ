import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
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
import AuthButton from './AuthButton';
import { useUser } from '@clerk/clerk-react';

const QuizButton = ({ name, topic }) => {
    const [isChecked, setIsChecked] = useState(false)
    const { isSignedIn } = useUser();

    const navigate = useNavigate();
    let videoStream;


    // Convert topic to URL-friendly format
    const getQuizPath = () => {
        return topic
            ? `/quiz/${topic.toLowerCase().replace(/\s+/g, '_')}`
            : "#";
    };

    //acess camera permission
    const handleStartQuiz = async () => {
        if (!isChecked) {
            alert("Please read all instructions and tick the checkbox below to begin the quiz.")
            return;
        };
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            window.videoStream = stream; //save it in a variable to stop it later
            navigate(getQuizPath());

        } catch (error) {
            alert("Please allow camera access to start the quiz.");
            console.error("Error accessing camera:", error);
        }
    }

    return (
        <Dialog>
            <div className="flex items-center justify-center">
                <DialogTrigger>
                    <div className="relative group">
                        <div className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-40 transition-opacity duration-500 group-hover:opacity-100"></span>
                            <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                                <div className="relative z-10 flex items-center space-x-2">
                                    <span className="text-sm md:text-base transition-all duration-500">{name}</span>
                                </div>
                            </span>
                        </div>
                    </div>
                </DialogTrigger>
            </div>

            {/* Instructions for the quizes */}
            <DialogContent className={'bg-slate-900/80 border-0! ring-1 ring-purple-400 max-h-3/5 max-sm:overflow-y-scroll scrollbar-black py-9 px-8'}>
                <DialogClose className={'absolute top-4 right-5'}>
                    <i className="fa-solid fa-xmark text-fuchsia-300"></i>
                </DialogClose>

                {isSignedIn ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className={'text-fuchsia-400 text-center text-xl'}>Instructions</DialogTitle>
                        </DialogHeader>

                        <DialogDescription className={'text-gray-300 md:px-2 font-medium'}>
                            <span className='inline-block'>1. This quiz contains 15 questions.</span>
                            <span className='inline-block'>2. You have 10 minutes to complete the quiz.</span>
                            <span className='inline-block'>3. The quiz cannot be paused once started.</span>
                            <span className='inline-block'>4. You must complete the quiz in one session.</span>
                            <span className='inline-block'>5. Do not resize your browser window during the quiz.</span>
                            <span className='inline-block'>6. Switching browser tabs will result in automatic submission.</span>
                            <span className='inline-block'>7. The quiz will auto-submit if you press esc button.</span>
                            <span className='inline-block'>8. The quiz will auto-submit when the time expires.</span>
                            <span className='inline-block'>9. You must need to allow camera access to start the quiz.</span>
                        </DialogDescription>

                        <DialogFooter className={'flex-col! items-center'}>
                            <div className='text-sm! text-fuchsia-300 flex items-center gap-2 justify-center mb-5'>
                                <input
                                    type="checkbox"
                                    id="confirm"
                                    name="confirm"
                                    className='accent-fuchsia-200 cursor-pointer'
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                />
                                <label htmlFor="confirm">I've read and understood the instructions. Let's begin!</label>
                            </div>
                            <GradientBtn
                                onClick={handleStartQuiz}
                                disabled={!isChecked}
                                name={"Start Quiz"}
                            />
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className={'text-fuchsia-400 text-xl text-center mb-2'}>Log In to Start Test</DialogTitle>
                        </DialogHeader>
                        <DialogFooter className={'flex-col! items-center mt-4'}>
                            <AuthButton afterSignInUrl="/quiz-dashboard" afterSignUpUrl="/quiz-dashboard" />
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default QuizButton