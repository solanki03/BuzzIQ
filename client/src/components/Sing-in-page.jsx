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

export function SignInPage({afterSignInUrl}) {
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useClerk();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const otpInputRefs = useRef([]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{8,}$/;
  const otpRegex = /^\d{6}$/;

  useEffect(() => {
    if (!isLoaded) return;
    setError("");
  }, [isLoaded]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Ensure only one digit
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const validateForm = () => {
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isLoaded || !signIn || !validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        window.location.href = afterSignInUrl ? afterSignInUrl : "/"; // Redirect to home page
      } 
    } catch (err) {
      setError(err.errors?.[0]?.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!isLoaded || !signIn || !emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signOut();
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Failed to send reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (!otpRegex.test(otpCode)) {
      setError("Enter a valid 6-digit OTP.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: otpCode,
        password,
      });

      if (result.status === "complete") {
        window.location.href = afterSignInUrl ? afterSignInUrl : "/"; // Redirect to home page
      } 
    } catch (err) {
      setError(err.errors?.[0]?.message || "Failed to reset password.");
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
        redirectUrlComplete: afterSignInUrl ? afterSignInUrl : "/", // Change this to your desired destination after login
      });
    } catch (err) {
      setError(err.errors?.[0]?.message || "OAuth sign-in failed.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative p-[1.5px] overflow-hidden rounded-xl">
      <span className="absolute inset-0 bg-gradient-to-r from-[#A07CFE] via-[#FE8FB5] to-[#FFBE7B] animate-spin-border" />
      <Card className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black px-1.5 md:px-6 py-8 text-white">
        <CardHeader className="text-center">
          <CardTitle>Sign In</CardTitle>
          <DialogDescription>Sign in to BuzzIQ</DialogDescription>
        </CardHeader>

        <CardContent className="w-full">
          {!successfulCreation ? (
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <CardFooter className="mt-4 justify-center">
                <Button type="submit" className="w-1/2" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="animate-spin" /> Logging In...</> : "Sign In"}
                </Button>
              </CardFooter>
              <div className="text-center mt-4">
                <button onClick={handleForgotPassword} className="text-blue-500 hover:underline text-sm">
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Reset Code</Label>
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
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <CardFooter className="mt-4 justify-center">
                <Button type="submit" className="w-1/2" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="animate-spin" /> Resetting...</> : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          )}

          {!successfulCreation && (
            <>
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute bg-black px-4">or</div>
                <hr className="w-full border-gray-600" />
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleOAuthSignIn("google")}
                  className="bg-red-500 hover:bg-red-600 text-white"
                  disabled={isLoading}
                >
                  Sign in with Google
                </Button>
                <Button
                  onClick={() => handleOAuthSignIn("facebook")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
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
