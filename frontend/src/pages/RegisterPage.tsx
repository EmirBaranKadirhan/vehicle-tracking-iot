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

    const handleSubmit = async (event) => {

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
                        Obsidian Velocity
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        className="material-symbols-outlined text-slate-400 hover:bg-white/5 transition-all duration-300 p-2 rounded-full"
                    >
                        help
                    </button>
                    <button
                        type="button"
                        className="material-symbols-outlined text-slate-400 hover:bg-white/5 transition-all duration-300 p-2 rounded-full"
                    >
                        settings
                    </button>
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
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOGvmOeur1bUahgZCsMrOmXuD9IvQd4IF9VBO7H657ak7lcYOSw6k-Ixi36QyTmFzPgV4X_xMidUUYba6L37wnhil_DLb5kDedU8hTzxEyXzQ-G8K4hPMc-KQqTIzS7hVke-h2N9YCUXNGwhIbVyt1IR02ZQUVg-1LdJPwf-6vXnc3LEU6I5WCX4bxShy-WiIltfq2T_LXF2LeVOmNgsBL68B9DIhmFi4fVt3DOv0dc8l7H9eU-zkixJEvAtEYol3EDNhMIfPYp5kL"
                                alt="Obsidian Velocity emblem"
                                className="w-24 h-24 object-contain mb-4"
                            />

                            <h1 className="text-5xl font-bold leading-tight tracking-tight">
                                Hızın ve Verinin <span className="text-cyan-400">Kinetik</span>{" "}
                                Uyumu
                            </h1>

                            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                                Araç telemetrisinde yeni nesil zeka. Obsidian Velocity ile
                                filonuzu gerçek zamanlı havacılık hassasiyetiyle yönetin.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#131b2e] p-5 rounded-xl border border-white/5">
                                <span className="material-symbols-outlined text-lime-400 mb-3">
                                    speed
                                </span>
                                <h3 className="font-semibold">Canlı Telemetri</h3>
                                <p className="text-sm text-slate-400">
                                    Anlık hız ve motor verileri.
                                </p>
                            </div>

                            <div className="bg-[#131b2e] p-5 rounded-xl border border-white/5">
                                <span className="material-symbols-outlined text-cyan-400 mb-3">
                                    location_on
                                </span>
                                <h3 className="font-semibold">Hassas Takip</h3>
                                <p className="text-sm text-slate-400">
                                    Sıfır gecikmeli GPS izleme.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sağ Taraf - Kayıt Kartı */}
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
                                Kayıt Ol
                            </h2>
                            <p className="text-slate-400 uppercase text-[10px] tracking-widest font-bold">
                                Velocity Akıllı Sistemine Katıl
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Kullanıcı Adı */}
                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold ml-1">
                                    Kullanıcı Adı
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                                        person
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Kullanıcı adınızı girin"
                                        className="w-full bg-[#2d3449]/50 border border-slate-700 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold ml-1">
                                    E-posta Adresi
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                                        alternate_email
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="example@obsidian.com"
                                        className="w-full bg-[#2d3449]/50 border border-slate-700 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Şifre */}
                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold ml-1">
                                    Şifre
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

                            {/* Submit */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-cyan-500 text-[#003640] font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                                >
                                    Kayıt Ol
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                            {errorMessage && (
                                <p className="text-red-400 text-xs text-center mt-2">{errorMessage}</p>
                            )}

                            {/* Alt Link */}
                            <div className="pt-6 text-center">
                                <p className="text-sm text-slate-400">
                                    Zaten hesabınız var mı?

                                    <Link to="/login" className="text-cyan-400 font-bold hover:underline underline-offset-4 ml-1">
                                        Giriş Yap
                                    </Link>
                                </p>
                            </div>
                        </form>

                        {/* Alt Bilgi */}
                        <div className="mt-12 flex items-center justify-between border-t border-slate-700/30 pt-6 opacity-60">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-lime-400"></span>
                                <span className="text-[10px] uppercase font-bold tracking-tighter">
                                    Sistem Durumu: Aktif
                                </span>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-tighter">
                                Veri Şifreleme: AES-256
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 w-full flex justify-between items-center px-10 py-6 bg-[#060e20] border-t border-white/5 text-[11px] uppercase tracking-[0.05em] text-slate-500">
                <div className="flex items-center gap-6">
                    <span className="text-cyan-500 opacity-80">
                        © 2024 Obsidian Velocity. Kinetic Intelligence Systems.
                    </span>
                </div>

                <div className="flex gap-8">
                    <a href="#" className="hover:text-cyan-400 transition-colors">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-cyan-400 transition-colors">
                        Terms of Service
                    </a>
                    <a href="#" className="hover:text-cyan-400 transition-colors">
                        System Status
                    </a>
                </div>
            </footer>
        </div>
    );
}