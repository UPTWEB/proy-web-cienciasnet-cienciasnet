import { Route, Routes } from 'react-router-dom'
import { PublicLayout } from '@/app/layouts/PublicLayout'
import { PortalLayout } from '@/app/layouts/PortalLayout'
import { StationLayout } from '@/app/layouts/StationLayout'
import { LandingPage } from '@/features/home/LandingPage'
import { FoundationsPage } from '@/features/home/FoundationsPage'

export function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
      </Route>
      <Route path="/portal" element={<PortalLayout />}>
        <Route index element={<FoundationsPage context="Portal humano" />} />
      </Route>
      <Route path="/estacion" element={<StationLayout />}>
        <Route index element={<FoundationsPage context="Estación de asistencia" />} />
      </Route>
    </Routes>
  )
}
