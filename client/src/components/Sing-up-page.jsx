import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
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

export function SignUpPage({ afterSignUpUrl = "/" }) {
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    otp: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpPage, setShowOtpPage] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isSignUpLoaded) return;

    // Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
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
    if (!isSignUpLoaded) return;

    if (!formData.otp) {
      setError("Please enter the OTP.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: formData.otp,
      });

      if (result.status === "complete") {
        window.location.href = afterSignUpUrl;
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.errors?.[0]?.message || "OTP verification failed. Please try again.");
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
      <Card className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black px-1.5 md:px-6 py-8 text-white">
        <CardHeader className="text-center">
          <CardTitle>Sign Up</CardTitle>
          <DialogDescription className="opacity-60">Create a new BuzzIQ account</DialogDescription>
        </CardHeader>

        <CardContent className="w-full">
          {!showOtpPage ? (
            <form onSubmit={handleSignUp}>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <CardFooter className="w-full mt-4 flex justify-center">
                <Button
                  type="submit"
                  className="w-1/2 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Signing Up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleOtpVerification}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <CardFooter className="w-full mt-4 flex justify-center">
                <Button
                  type="submit"
                  className="w-1/2 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}