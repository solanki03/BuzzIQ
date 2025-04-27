import {Star, X } from "lucide-react";
import  { useState } from "react";

import  {Button} from "@/components/ui/button"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {toast} from "react-hot-toast"


export function FeedbackDialog(){
    const [rating, setRating] = useState(0);

    const handleStarClick = (star) => {
        setRating(star);
        //sending rating to server
        console.log(`User rated ${star} star`);
    }

    const handleSubmit = ()=>{
        if(rating === 0){
            toast.error("Please select a rating before submitting.");
            return;
        }
        const existingFeedback = JSON.parse(localStorage.getItem("feedbacks")) || [];

        const newFeedback = {
            rating: rating,
            timestamp: new Date().toISOString()
    };      

        existingFeedback.push(newFeedback);
       // Save the updated feedback array to localStorage
        console.log(existingFeedback);
        localStorage.setItem("feedbacks", JSON.stringify(existingFeedback));

       // console.log(`User rated ${rating} star`);
        toast.success("Thank you for your feedback!");
        setRating(0); // Reset rating after submission
    }

return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300">Give Feedback</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white rounded-2xl p-6 shadow-2xl">
      {/* cross button */}
      <DialogClose asChild>
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center" >Rate Your Experience</DialogTitle>
          <DialogDescription className=" text-lg mt-2">
            Your feedback helps us to improve BuzzIQ. How would you rate your experience?
          </DialogDescription>
        </DialogHeader>

        {/* Star Rating Section */}
        <div className="flex justify-center gap-2 my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              className={`text-4xl transition-transform hover:scale-125 ${
                star <= rating ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              <Star fill={star <= rating ? "#facc15" : "none"} />
            </button>
          ))}
        </div>

        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button onClick={handleSubmit} type="button" className="bg-purple-500 hover:bg-purple-700 text-white rounded-full px-6 py-2 text-lg font-semibold transition-transform hover:scale-105">
              Submit Feedback
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
)

}