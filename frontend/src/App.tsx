import React, { useEffect, useState } from 'react';
import type { IGPSData } from './types/gps'    // sadece tip import ediyorsak "import type" seklinde kullaniriz !!
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function MapFollower({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

export default function ObsidianDashboard() {
  const [data, setData] = useState<IGPSData | null>(null);
  const [history, setHistory] = useState<IGPSData[]>([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    socket.onmessage = (event) => {
      const incoming = JSON.parse(event.data);
      setData(incoming);
      setHistory(prev => [incoming, ...prev].slice(0, 5));
    };
    return () => socket.close();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1326] text-[#dae2fd] font-['Inter']">

      {/* Sidebar - Tasarımdaki gibi sabit */}
      <aside className="w-64 border-r border-[#131b2e] bg-[#0b1326] flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-900/50 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-cyan-400">local_shipping</span>
          </div>
          <div>
            <h3 className="text-lg font-black font-['Space_Grotesk'] leading-tight">Fleet Alpha</h3>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">12 Active Units</p>
          </div>
        </div>
        <nav className="space-y-2">
          <NavItem icon="dashboard" label="Dashboard" active />
          <NavItem icon="map" label="Live Map" />
          <NavItem icon="history" label="Historical" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 border-b border-[#131b2e] px-8 flex items-center justify-between sticky top-0 bg-[#0b1326]/80 backdrop-blur-md z-50">
          <h1 className="text-xl font-bold tracking-tighter text-cyan-500 font-['Space_Grotesk']">OBSIDIAN VELOCITY</h1>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            System: Nominal
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 space-y-8">
          <header>
            <h2 className="text-4xl font-['Space_Grotesk'] font-bold tracking-tight">Vehicle Dashboard</h2>
            <p className="text-slate-400">Real-time telemetry for <span className="text-cyan-400 font-bold">Alpha-Unit-71</span></p>
          </header>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-6">

            {/* Speed Gauge (Canlı Veriye Bağlı) */}
            <div className="col-span-12 lg:col-span-4 bg-[#131b2e] p-8 rounded-2xl relative overflow-hidden group border border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Speedometer</p>
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="#06b6d4" strokeWidth="8"
                      strokeDasharray="440" strokeDashoffset={440 - (440 * (data?.speed || 0)) / 120}
                      style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
                  </svg>
                  <div className="text-center">
                    <span className="text-5xl font-black">{data?.speed || 0}</span>
                    <p className="text-[10px] font-bold text-cyan-500 uppercase">km/h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Map - Leaflet */}
            <div className="col-span-12 lg:col-span-8 bg-[#131b2e] rounded-2xl overflow-hidden relative border border-white/5 min-h-[300px]">
              <div className="absolute top-4 left-4 z-[1000] bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10">
                <p className="text-[10px] text-cyan-400 font-mono tracking-tighter">
                  LAT: {data?.lat.toFixed(5)} | LNG: {data?.long.toFixed(5)}
                </p>
              </div>
              <MapContainer
                center={[39.6484, 27.8826]}
                zoom={15}
                style={{ height: '400px', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {data && (
                  <>
                    <Marker position={[data.lat, data.long]} />
                    <MapFollower lat={data.lat} lng={data.long} />
                  </>
                )}
              </MapContainer>
            </div>

            {/* Diğer Kartlar */}
            <StatCard icon="terrain" label="Altitude" value={`${data?.altitude || 0}m`} color="text-orange-400" />
            <StatCard icon="explore" label="Heading" value={`${data?.direction || 0}°`} color="text-cyan-400" rotate={data?.direction} />
            <StatCard icon="sensors" label="Status" value={data?.speed ? "Moving" : "Idle"} color="text-emerald-400" />
          </div>

          {/* Log Stream Table */}
          <section className="bg-[#131b2e] rounded-2xl overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5 flex justify-between">
              <h3 className="font-bold uppercase tracking-widest text-xs">Telemetry Log Stream</h3>
              <span className="text-[10px] text-slate-500">Live Updates via WebSocket</span>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-slate-500 uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Velocity</th>
                  <th className="px-6 py-4">Position</th>
                </tr>
              </thead>
              <tbody>
                {history.map((log, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      GPS Data Received
                    </td>
                    <td className="px-6 py-4 font-mono">{log.speed} km/h</td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-mono">{log.lat.toFixed(4)}, {log.long.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}

// Alt Bileşenler (Kodu Temiz Tutmak İçin)
function NavItem({ icon, label, active = false }: { icon: string, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${active ? 'bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-slate-400 hover:bg-white/5'}`}>
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-['Space_Grotesk'] text-sm uppercase tracking-widest">{label}</span>
    </div>
  );
}

function StatCard({ icon, label, value, color, rotate = 0 }: any) {
  return (
    <div className="col-span-12 md:col-span-4 bg-[#131b2e] p-6 rounded-2xl border border-white/5 group hover:border-cyan-500/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
        <span className={`material-symbols-outlined ${color}`} style={{ transform: `rotate(${rotate}deg)`, transition: 'transform 0.5s' }}>{icon}</span>
      </div>
      <h3 className="text-4xl font-black font-['Space_Grotesk'] tracking-tight">{value}</h3>
    </div>
  );
}