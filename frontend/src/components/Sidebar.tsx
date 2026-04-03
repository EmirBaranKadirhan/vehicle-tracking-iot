import React from 'react'
import { useNavigate, useLocation } from 'react-router'
import type { IGPSData } from '../types/gps'
import { useVehicles } from '../hooks/useVehicles'

interface SidebarProps {
    vehicles?: Record<string, IGPSData>
}

function NavItem({ icon, label, active = false, onClick }: {
    icon: string
    label: string
    active?: boolean
    onClick?: () => void
}) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${active
                ? 'bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-500'
                : 'text-slate-400 hover:bg-white/5'
                }`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="font-['Space_Grotesk'] text-sm uppercase tracking-widest">{label}</span>
        </div>
    )
}

export default function Sidebar({ vehicles = {} }: SidebarProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const vehicleList = useVehicles()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <aside className="w-64 border-r border-[#131b2e] bg-[#0b1326] flex flex-col p-6 space-y-8 fixed left-0 top-0 h-full z-40">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-900/50 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-cyan-400">local_shipping</span>
                </div>
                <div>
                    <h3 className="text-lg font-black font-['Space_Grotesk'] leading-tight">Fleet Alpha</h3>
                    <p className="text-[10px] text-slate-400 tracking-widest uppercase">{Object.keys(vehicles).length} Active Units</p>
                </div>
            </div>

            {/* Vehicles — sadece vehicles prop'u doluysa göster */}
            {Object.keys(vehicles).length > 0 && (
                <div className="space-y-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-2">Vehicles</p>
                    {Object.entries(vehicles).map(([id, vehicle]) => {
                        const colorInfo = vehicleList.find(v => v.vehicleId === id)
                        return (
                            <div key={id} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorInfo?.color }} />
                                <div>
                                    <p className="text-sm font-bold font-['Space_Grotesk']">{colorInfo?.vehicleName}</p>
                                    <p className="text-[10px] text-slate-500">{vehicle.speed} km/h</p>
                                </div>
                                <span className="ml-auto text-[10px] text-emerald-400 font-bold">LIVE</span>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Nav */}
            <nav className="space-y-2">
                <NavItem icon="dashboard" label="Dashboard" active={location.pathname === '/'} onClick={() => navigate('/')} />
                <NavItem icon="history" label="Historical" active={location.pathname === '/historical'} onClick={() => navigate('/historical')} />
                <NavItem icon="warning" label="Alerts" active={location.pathname === '/alerts'} onClick={() => navigate('/alerts')} />
                <NavItem icon="analytics" label="Analytics" active={location.pathname === '/analytics'} onClick={() => navigate('/analytics')} />
            </nav>

            {/* Logout */}
            <div className="mt-auto">
                <NavItem icon="logout" label="Logout" onClick={handleLogout} />
            </div>
        </aside>
    )
}