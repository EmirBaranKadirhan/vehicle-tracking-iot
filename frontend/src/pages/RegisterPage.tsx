import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { register } from '../api/auth'
import axios from 'axios'

export default function RegisterPage() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    let navigate = useNavigate();

    const handleSubmit = async (event: any) => {

        try {
            event.preventDefault();
            const responseRegister = await register(username, email, password)
            console.log(responseRegister)
            localStorage.setItem("token", responseRegister["token"]);

            navigate("/")

        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message)
                console.log(error.response)
            }

        }

    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0b1326] text-[#dae2fd] font-body overflow-x-hidden">
            {/* TopBar */}
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-[#0b1326] border-b border-white/5 shadow-2xl shadow-cyan-900/10">
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold tracking-tighter text-cyan-400 uppercase">
                        TrackFlow
                    </span>
                </div>

            </header>

            <main className="flex-grow relative flex items-center justify-center pt-20 pb-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-400/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-lime-400/10 blur-[120px] rounded-full"></div>
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB84RpGqaWcEzXfLiWixNA_UkVaxY5DToMQqlTm9OLjainqXtjmmMl_9uqyGYohjEVmOiLN_WqFBDUlWU2Mq8aGNU1IbuAn-rCHpX-bqwDCTDRknQbaax12UPigV4ddBO1d8xAH8M-pdvn_iBV0ZCJDHeH07VYEB0l9wwxTV_L0cKwR-iKr63ESFbh9LUGxc6b2_nb_WWnUfvRJnjyQbci9J3EsEtEHI8M0OiUfLiiKE7Cu7w3ACDw-XEdgK39SAzrncM7qoQU8Orei')",
                        }}
                    />
                </div>

                <div className="relative z-10 w-full max-w-5xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Sol Taraf */}
                    <div className="hidden lg:flex flex-col space-y-8">
                        <div className="space-y-4">
                            <img
                                src="/TrackFlowLogo.png"
                                alt="Obsidian Velocity emblem"
                                className="w-48 h-48 object-contain mb-4"
                            />

                            <h1 className="text-5xl font-bold leading-tight tracking-tight">
                                <span className="text-cyan-400">The Kinetic</span>{" "}
                                Harmony of Speed and Data
                            </h1>

                            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                                Next-generation intelligence for vehicle tracking.
                                Monitor your fleet in real-time with IoT-powered precision — speed, location, and alerts,
                                all in one place.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#131b2e] p-5 rounded-xl border border-white/5">
                                <span className="material-symbols-outlined text-lime-400 mb-3">
                                    speed
                                </span>
                                <h3 className="font-semibold">Live Telemetry</h3>
                                <p className="text-sm text-slate-400">
                                    Real-time speed and engine data.
                                </p>
                            </div>

                            <div className="bg-[#131b2e] p-5 rounded-xl border border-white/5">
                                <span className="material-symbols-outlined text-cyan-400 mb-3">
                                    location_on
                                </span>
                                <h3 className="font-semibold">Precise Tracking</h3>
                                <p className="text-sm text-slate-400">
                                    Zero-latency GPS tracking.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="p-10 lg:p-12 rounded-2xl shadow-2xl"
                        style={{
                            background: "rgba(23, 31, 51, 0.7)",
                            backdropFilter: "blur(12px)",
                            borderTop: "1px solid rgba(76, 215, 246, 0.2)",
                            borderLeft: "1px solid rgba(76, 215, 246, 0.1)",
                        }}
                    >
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl font-bold mb-2 tracking-tight">
                                Register
                            </h2>
                            <p className="text-slate-400 uppercase text-[10px] tracking-widest font-bold">
                                Join the TrackFlow Platform
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold ml-1">
                                    Username
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                                        person
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Enter your username"
                                        className="w-full bg-[#2d3449]/50 border border-slate-700 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>


                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                                        alternate_email
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="user@trackflow.com"
                                        className="w-full bg-[#2d3449]/50 border border-slate-700 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>


                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                                        lock
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-[#2d3449]/50 border border-slate-700 rounded-lg py-4 pl-12 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-cyan-500 text-[#003640] font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                                >
                                    Register
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                            {errorMessage && (
                                <p className="text-red-400 text-xs text-center mt-2">{errorMessage}</p>
                            )}

                            <div className="pt-6 text-center">
                                <p className="text-sm text-slate-400">
                                    Already have an account?

                                    <Link to="/login" className="text-cyan-400 font-bold hover:underline underline-offset-4 ml-1">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </form>

                        <div className="mt-12 flex items-center justify-between border-t border-slate-700/30 pt-6 opacity-60">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-lime-400"></span>
                                <span className="text-[10px] uppercase font-bold tracking-tighter">
                                    System Status: Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}