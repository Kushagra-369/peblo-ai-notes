"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("https://peblo-ai-notes.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                // Store user info if needed
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }
                // Redirect to dashboard or home page
                router.push("/dashboard");
            } else {
                setError(data.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#111827] to-[#0f1222] flex items-center justify-center px-4 py-8">
            {/* Animated background effect */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 bg-[#1e293b]/80 backdrop-blur-xl w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 hover:shadow-cyan-500/10">
                {/* Logo/Brand */}
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-linear-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center mb-2 bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    Welcome Back
                </h1>

                <p className="text-gray-400 text-center mb-8 text-sm">
                    Login to continue to Peblo AI Workspace
                </p>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="group">
                        <label className="block text-gray-400 text-sm mb-2 ml-1">Email address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full bg-[#0f172a]/80 border border-gray-700 rounded-xl px-5 py-3.5 text-white outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-[#0f172a] placeholder:text-gray-600"
                        />
                    </div>

                    <div className="group">
                        <div className="flex justify-between mb-2 ml-1">
                            <label className="text-gray-400 text-sm">Password</label>
                            <button
                                type="button"
                                className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                                onClick={() => router.push("/forgot-password")}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full bg-[#0f172a]/80 border border-gray-700 rounded-xl px-5 py-3.5 text-white outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-[#0f172a] placeholder:text-gray-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="relative group mt-2 overflow-hidden bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10">
                            {loading ? "Logging in..." : "Login"}
                        </span>
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 bg-linear-to-r from-cyan-400 to-blue-500"></div>
                    </button>

                    {/* Divider */}
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-[#1e293b] px-3 text-gray-500">or continue with</span>
                        </div>
                    </div>

                    {/* Social login buttons */}
                    <div className="flex gap-3">
                        <button type="button" className="flex-1 flex items-center justify-center gap-2 bg-[#0f172a]/60 border border-gray-700 rounded-xl py-3 hover:bg-[#0f172a] hover:border-gray-600 transition-all duration-200">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-white text-sm">Google</span>
                        </button>
                        <button type="button" className="flex-1 flex items-center justify-center gap-2 bg-[#0f172a]/60 border border-gray-700 rounded-xl py-3 hover:bg-[#0f172a] hover:border-gray-600 transition-all duration-200">
                            <svg className="w-5 h-5" fill="#ffffff" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                            </svg>
                            <span className="text-white text-sm">GitHub</span>
                        </button>
                    </div>

                    {/* Sign up option */}
                    <div className="text-center mt-2">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{" "}
                            <a
                                href="/signup"
                                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline"
                            >
                                Sign up
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
}