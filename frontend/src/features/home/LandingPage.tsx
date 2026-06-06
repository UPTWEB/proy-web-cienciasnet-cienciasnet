import { ArrowRight, Camera, ChartLineUp, ShieldCheck } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Gestión educativa conectada</span>
        <h1>La jornada escolar, clara para todos.</h1>
        <p>CienciasNET reúne asistencia, información académica y comunicación en una experiencia simple y segura.</p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/portal">Explorar portal <ArrowRight aria-hidden /></Link>
          <Link className="button button-secondary" to="/estacion">Ver estación</Link>
        </div>
      </div>
      <div className="feature-grid" aria-label="Capacidades principales">
        <article><Camera size={30} weight="duotone" /><h2>Asistencia ágil</h2><p>Registro desde estaciones web autorizadas.</p></article>
        <article><ChartLineUp size={30} weight="duotone" /><h2>Información útil</h2><p>Estados y resultados comprensibles.</p></article>
        <article><ShieldCheck size={30} weight="duotone" /><h2>Acceso protegido</h2><p>Permisos y contextos separados.</p></article>
      </div>
    </section>
  )
}
