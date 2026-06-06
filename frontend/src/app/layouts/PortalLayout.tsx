import { House, SignOut, UserCircle } from '@phosphor-icons/react'
import { Link, Outlet } from 'react-router-dom'

export function PortalLayout() {
  return (
    <div className="workspace">
      <aside className="sidebar">
        <Link className="brand brand-light" to="/portal"><UserCircle size={30} weight="duotone" /> Portal</Link>
        <nav aria-label="Navegación principal">
          <Link className="nav-link nav-link-active" to="/portal"><House aria-hidden /> Inicio</Link>
        </nav>
        <Link className="nav-link" to="/"><SignOut aria-hidden /> Salir</Link>
      </aside>
      <main className="workspace-content"><Outlet /></main>
    </div>
  )
}
