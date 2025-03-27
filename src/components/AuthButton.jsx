import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SignInPage } from "./Sing-in-page";
import { SignUpPage } from "./Sing-up-page"; // Import the SignUp component
import { DialogTitle } from "@radix-ui/react-dialog";

const AuthButton = () => {
  const [isSignIn, setIsSignIn] = useState(true); // State to toggle between Sign In and Sign Up

  return (
    <Dialog>
      <DialogTrigger>
        <span className="relative inline-flex overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-zinc-950 opacity-95 px-5 py-2 text-sm font-medium text-white backdrop-blur-3xl">
            <DialogTitle>Login</DialogTitle>
          </span>
        </span>
      </DialogTrigger>
      <DialogContent className="bg-transparent p-10">
        {isSignIn ? <SignInPage /> : <SignUpPage />} {/* Toggle between Sign In and Sign Up */}
        <div className="text-center">
          <span className="text-sm text-gray-400">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-blue-500 hover:underline"
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </button>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthButton;