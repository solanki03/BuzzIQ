import { useState, useEffect, useRef } from "react";
import { useSignIn, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export function SignInPage() {
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useClerk(); // Use useClerk to access signOut
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Cooldown timer in seconds
  const [otpSent, setOtpSent] = useState(false); // Track if OTP has been sent
  const otpInputRefs = useRef([]); // Refs for OTP input boxes

  // Regex for email and password validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{8,}$/; // Minimum 8 characters required
  const otpRegex = /^\d{6}$/;

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  // Handle email and password login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    // Validate email format
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password format
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Attempt to sign in with email and password
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        console.log("Signed in:", result);
        window.location.href = "/"; // Redirect to home page
      } else {
        console.log("Further verification required:", result);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.errors?.[0]?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Send the password reset code to the user's email
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    // Validate email format
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Force sign out the user before starting the password reset process
      await signOut(); // Ensure the user is signed out
      console.log("User signed out successfully.");

      // Send the password reset code to the user's email
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setSuccessfulCreation(true);
      setError("");
    } catch (err) {
      console.error("Error sending reset code:", err);
      setError(err.errors?.[0]?.message || "Failed to send reset code. Please check your email and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the user's password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    // Combine OTP digits into a single string
    const otpCode = otp.join("");

    // Validate OTP format
    if (!otpRegex.test(otpCode)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    // Validate new password format
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Attempt to reset the password
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: otpCode,
        password,
      });

      if (result.status === "complete") {
        console.log("Password reset successfully!");
        window.location.href = "/"; // Redirect to home page
      } else {
        console.log("Further verification required:", result);
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.errors?.[0]?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    if (!isLoaded || !signIn) return;
  
    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard", // Change this to your desired destination after login
      });
    } catch (err) {
      console.error("OAuth Sign-In Error:", err.errors?.[0]?.message || "Something went wrong.");
    }
  };
  

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative p-[1.5px] overflow-hidden rounded-xl">
      <span className="absolute inset-0 bg-gradient-to-r from-[#A07CFE] via-[#FE8FB5] to-[#FFBE7B] animate-spin-border" />
      <Card className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black px-6 py-8 text-white">
        <CardHeader className="text-center">
          <CardTitle>Sign In</CardTitle>
          <DialogDescription>Sign in to BuzzIQ</DialogDescription>
        </CardHeader>

        <CardContent className="w-full">
          {!successfulCreation ? (
            // Email and Password Login Form
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    autoCapitalize="none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <CardFooter className="w-full mt-4 flex justify-center">
                <Button type="submit" className="w-1/2 cursor-pointer" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="animate-spin" /> Logging In...</> : "Sign In"}
                </Button>
              </CardFooter>
              <div className="text-center mt-4">
                <button
                  onClick={handleForgotPassword}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            // Password Reset Form
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="otp">Reset Code</Label>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center text-lg"
                        required
                      />
                    ))}
                  </div>
                </div>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <CardFooter className="w-full mt-4 flex justify-center">
                <Button type="submit" className="w-1/2 cursor-pointer" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="animate-spin" /> Resetting Password...</> : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          )}

          {/* Show OAuth buttons only on the initial login page */}
          {!successfulCreation && (
            <>
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute bg-black px-4">or</div>
                <hr className="w-full border-gray-600" />
              </div>

              <div className="flex flex-col gap-3 w-full">
                <Button onClick={() => handleOAuthSignIn("google")} className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={isLoading}>
                  Sign in with Google
                </Button>
                <Button onClick={() => handleOAuthSignIn("facebook")} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                  Sign in with Facebook
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}