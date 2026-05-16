"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value); // Debug log
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Form Data before validation:", formData); // Debug log

    // Validation - check if fields are empty or just whitespace
    if (!formData.fullName?.trim()) {
      setError("Full name is required");
      return;
    }
    
    if (!formData.email?.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };
      
      console.log("Sending payload to server:", payload); // Debug log

      const response = await fetch("https://peblo-ai-notes.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Server response:", data); // Debug log

      if (response.ok) {
        // Store token if returned
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        // Redirect to login page
        router.push("/login");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please check if the backend server is running on port 5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#111827] to-[#0f1222] flex items-center justify-center px-4 py-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 bg-[#1e293b]/80 backdrop-blur-xl w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 hover:shadow-purple-500/10">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-linear-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm">
          Start your AI productivity journey
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="group">
            <label className="block text-gray-400 text-sm mb-2 ml-1">Full Name</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-[#0f172a]/80 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-[#0f172a] placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-gray-400 text-sm mb-2 ml-1">Email address</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-[#0f172a]/80 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-[#0f172a] placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-gray-400 text-sm mb-2 ml-1">Password</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#0f172a]/80 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-[#0f172a] placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-gray-400 text-sm mb-2 ml-1">Confirm Password</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#0f172a]/80 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-[#0f172a] placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <label className="flex items-center gap-3 mt-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#0f172a] text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer" />
            <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
              I agree to the{" "}
              <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors hover:underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors hover:underline">
                Privacy Policy
              </button>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="relative group mt-2 overflow-hidden bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">
              {loading ? "Creating Account..." : "Create Account"}
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 bg-linear-to-r from-cyan-400 to-purple-500"></div>
          </button>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#1e293b] px-3 text-gray-500">or sign up with</span>
            </div>
          </div>      

          {/* Login option */}
          <div className="text-center mt-2">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline"
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}