import { useState } from "react";
import { useSignUp, useSignIn } from "@clerk/clerk-react";
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

export function SingUpPage() {
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpPage, setShowOtpPage] = useState(false); // Show OTP page for verification
  const [otp, setOtp] = useState(""); // OTP for email verification
  const [showProfileForm, setShowProfileForm] = useState(false); // Show profile form after OTP verification
  const [name, setName] = useState(""); // User's name
  const [profession, setProfession] = useState(""); // User's profession
  const [interestedField, setInterestedField] = useState(""); // User's interested field

  // Regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isSignUpLoaded || !signUp) return;

    // Validate email format
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Basic form validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Attempt to sign up with email and password
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Send OTP to the user's email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Show OTP input for verification
      setShowOtpPage(true);
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err.errors?.[0]?.message || "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (!isSignUpLoaded || !signUp) return;

    // Basic form validation
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Verify the OTP
      const result = await signUp.attemptEmailAddressVerification({
        code: otp,
      });

      if (result.status === "complete") {
        console.log("Email verified successfully!");
        // Show the profile form after OTP verification
        setShowProfileForm(true);
      } else {
        console.log("Further verification required:", result);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.errors?.[0]?.message || "OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!name || !profession || !interestedField) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Save user profile data (you can send this data to your backend)
      console.log("User Profile Data:", { name, profession, interestedField });

      // Redirect to the home page or dashboard
      window.location.href = "/";
    } catch (err) {
      console.error("Profile submission error:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignUpLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative p-[1.5px] overflow-hidden rounded-xl">
      <span className="absolute inset-0 bg-gradient-to-r from-[#A07CFE] via-[#FE8FB5] to-[#FFBE7B] animate-spin-border" />
      <Card className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black px-6 py-8 text-white">
        <CardHeader className="text-center">
          <CardTitle>Sign Up</CardTitle>
          <DialogDescription className="opacity-60">Create a new BuzzIQ account</DialogDescription>
        </CardHeader>

        <CardContent className="w-full">
          {!showOtpPage && !showProfileForm ? (
            // Sign-Up Form
            <form onSubmit={handleSignUp}>
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
                  {isLoading ? <><Loader2 className="animate-spin" /> Signing Up...</> : "Sign Up"}
                </Button>
              </CardFooter>
            </form>
          ) : showOtpPage && !showProfileForm ? (
            // OTP Verification Form
            <form onSubmit={handleOtpVerification}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <CardFooter className="w-full mt-4 flex justify-center">
                <Button type="submit" className="w-1/2 cursor-pointer" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="animate-spin" /> Verifying...</> : "Verify OTP"}
                </Button>
              </CardFooter>
            </form>
          ) : (
            // Profile Form (after OTP verification)
            <form onSubmit={handleProfileSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    type="text"
                    placeholder="Software Engineer"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="interestedField">Interested Field</Label>
                  <Input
                    id="interestedField"
                    type="text"
                    placeholder="e.g., Technology, Science, Arts"
                    value={interestedField}
                    onChange={(e) => setInterestedField(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <CardFooter className="w-full mt-4 flex justify-center">
                <Button type="submit" className="w-1/2 cursor-pointer" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="animate-spin" /> Saving...</> : "Save Profile"}
                </Button>
              </CardFooter>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}