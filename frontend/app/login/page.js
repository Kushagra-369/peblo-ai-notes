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