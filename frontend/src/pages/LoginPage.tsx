import React, { useState } from "react";
import { login } from '../api/auth'
import { useNavigate, Link } from "react-router";
import axios from 'axios'


export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    let navigate = useNavigate();

    const handleSubmit = async (event: any) => {

        try {
            event.preventDefault()
            const responseLogin = await login(email, password)
            console.log(responseLogin)
            localStorage.setItem("token", responseLogin["token"]);

            navigate("/")

        } catch (error) {

            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message)
                console.log(error.response)
            }
        }
    };

    return (
        <div className="bg-[#0b1326] text-[#dae2fd] font-['Inter'] min-h-screen flex flex-col overflow-x-hidden">
            <header className="bg-[#0b1326] flex justify-between items-center w-full px-8 py-4 fixed top-0 z-50">
                <div className="text-xl font-bold tracking-tighter text-cyan-500 font-['Space_Grotesk']">
                    TrackFlow
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center relative pt-20 pb-24 px-4"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(76, 215, 246, 0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-lime-400/5 rounded-full blur-[100px]"></div>
                </div>

                <div className="w-full max-w-md p-10 rounded-xl relative z-10 shadow-2xl"
                    style={{
                        background: "rgba(34, 42, 61, 0.7)",
                        backdropFilter: "blur(12px)",
                        borderTop: "1px solid rgba(76, 215, 246, 0.3)",
                        borderLeft: "1px solid rgba(76, 215, 246, 0.1)",
                    }}>
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-[#2d3449] mb-4 border border-slate-700/20">
                            <span className="material-symbols-outlined text-cyan-400 text-4xl">satellite_alt</span>
                        </div>
                        <h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight">Sign In</h1>
                        <p className="text-xs uppercase tracking-widest text-slate-400 mt-2 opacity-70">Kinetic Observer Terminal v4.0</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-500 text-lg group-focus-within:text-cyan-400 transition-colors">alternate_email</span>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#131b2e] border-0 border-b border-slate-700 focus:ring-0 focus:border-cyan-400 focus:bg-[#2d3449] transition-all pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none"
                                    placeholder="user@trackflow.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Password</label>
                                <a className="text-[10px] uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors" href="#">Forgot Password?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-500 text-lg group-focus-within:text-cyan-400 transition-colors">lock</span>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#131b2e] border-0 border-b border-slate-700 focus:ring-0 focus:border-cyan-400 focus:bg-[#2d3449] transition-all pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-cyan-500 text-[#003640] font-['Space_Grotesk'] font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] rounded"
                        >
                            Sign In
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                        </button>
                        {errorMessage && (
                            <p className="text-red-400 text-xs text-center mt-2">{errorMessage}</p>
                        )}
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-sm text-slate-400">
                            Don't have an account?
                            <Link to="/register" className="text-cyan-400 font-semibold hover:underline underline-offset-4 ml-1">Register</Link>
                        </p>
                    </div>
                </div>
            </main>

        </div>
    );
}