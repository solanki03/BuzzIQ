import { Star, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import RateUsButton from "./RateUsButton";
import { toast } from "react-hot-toast"
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


export function FeedbackDialog() {
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    if (feedbacks.length === 0) {
      setOpen(true); // Auto open if not submitted before
    } else {
      setHasSubmitted(true);
    }
  }, []);

  const handleStarClick = (star) => {
    // Set the rating based on the star clicked
    setRating(star);
  }

  const handleSubmit = () => {
    if (rating === 0) {
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
    localStorage.setItem("feedbacks", JSON.stringify(existingFeedback));

    toast.success("Thank you for your feedback!");
    setRating(0); // Reset rating after submission
    setOpen(false); 
    setHasSubmitted(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Optional manual trigger if not already submitted */}
      {!hasSubmitted && (
        <DialogTrigger asChild>
          <div className="w-full flex justify-center-safe lg:justify-end mt-5 lg:my-0 lg:mr-5">
            <RateUsButton name="Rate us"/>
          </div>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white rounded-2xl p-6 shadow-2xl">
        <DialogClose asChild>
          <button className="absolute top-4 right-4 text-purple-500 hover:text-purple-300">
            <X className="w-5 h-5" />
          </button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-semibold text-center mt-1">
            Rate Your Experience
          </DialogTitle>
          <DialogDescription className="text-base md:text-lg text-center text-slate-300 mt-2.5">
            Your feedback helps us to improve BuzzIQ. How would you rate your experience?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              className={`text-4xl transition-transform hover:scale-125 ${star <= rating ? "text-yellow-400" : "text-gray-400"}`}
            >
              <Star fill={star <= rating ? "#facc15" : "none"} />
            </button>
          ))}
        </div>

        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button
              onClick={handleSubmit}
              type="button"
              className="mt-4 px-6 py-2 bg-[#6a0dad] hover:bg-[#8e2de2] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Submit Feedback
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

}