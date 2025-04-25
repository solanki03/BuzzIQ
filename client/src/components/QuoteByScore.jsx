import React from 'react'

const QuoteByScore = ({ percentage }) => {
    let title = "", message = "", emoji = "";

    if (percentage >= 85) {
        title = "🌟 Excellent Work!";
        message = "You nailed it! Keep up the great momentum. 🚀";
    } else if (percentage >= 50) {
        title = "💪 Good Effort!";
        message = "You're halfway there. Keep practicing and you'll ace it next time!";
    } else {
        title = "📘 Keep Practicing!";
        message = "Don't worry about the score. Learning is a journey — every attempt counts!";
    }

    return (
        <div className="flex flex-col justify-center-safe bg-slate-700/30 p-5 rounded-lg h-full">
            <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
            <p className="text-center text-sm md:text-base text-gray-400">{message}</p>
        </div>
    )
}

export default QuoteByScore