import React from 'react'
import { Link } from 'react-router-dom'
import AuthButton from './AuthButton'
import {
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/clerk-react'

const Navbar = ({ className }) => {
    return (
        <nav className={`w-full flex justify-between items-center px-6 sm:px-10 py-6 absolute top-0 z-10 ${className}`}>
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
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    )
}

export default Navbar
