import React from "react";
import { Link, useLocation } from "react-router-dom";
import AuthButton from "./AuthButton";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"; 
import UserProfile from "./user-profile";

const Navbar = ({ className }) => {
  const { user } = useUser();
  const location = useLocation(); // get current URL path

  // Check if current path is "/" or "/dashboard"
  const showSheet = location.pathname === "/" || location.pathname === "/quiz-dashboard";

  return (
    <nav className={`w-full flex justify-between items-center px-6 sm:px-10 py-6 absolute top-0 z-40! ${className}`}>
      <Link to="/">
        <h1 className="text-white text-2xl md:text-3xl font-Warnes! cursor-pointer">
          BuzzIQ
        </h1>
      </Link>

      <div>
        <SignedOut>
          <AuthButton />
        </SignedOut>
        <SignedIn>
          {showSheet ? (
            <UserProfile user={user} />
          ) : (
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-black text-white">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
