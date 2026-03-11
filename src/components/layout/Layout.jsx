import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'
import TourFAB from '../tour/TourFAB'

export default function Layout() {
  return (
    <div
      className="min-h-screen bg-bg-primary flex flex-col md:flex-row"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        <main
          className="flex-1 overflow-y-auto scroll-smooth"
          style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 8px)' }}
        >
          <Outlet />
        </main>
        <BottomNav />
      </div>
      <TourFAB />
    </div>
  )
}
