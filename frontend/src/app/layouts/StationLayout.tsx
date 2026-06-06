import { Camera, LockKey } from '@phosphor-icons/react'
import { Outlet } from 'react-router-dom'

export function StationLayout() {
  return (
    <main className="station-layout">
      <header className="station-header">
        <span className="brand"><Camera size={30} weight="duotone" /> Estación CienciasNET</span>
        <span className="status-chip"><LockKey aria-hidden /> Sesión técnica limitada</span>
      </header>
      <Outlet />
    </main>
  )
}
