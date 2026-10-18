import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastProvider } from '@/components/ui/Toast'
import { useSettings } from '@/repos/settings'
import Admin from '@/pages/Admin'
import EventDetail from '@/pages/EventDetail'
import Give from '@/pages/Give'
import GivingHistory from '@/pages/GivingHistory'
import Home from '@/pages/Home'
import Join from '@/pages/Join'
import Me from '@/pages/Me'
import Placeholder from '@/pages/Placeholder'
import ScrollToTop from '@/components/layout/ScrollToTop'

function App() {
  const { theme, largeText } = useSettings()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111112' : '#f4f4f5')
  }, [theme])

  return (
    <ToastProvider>
      {/* Large-text mode scales the whole app for older members */}
      <div style={largeText ? { zoom: 1.18 } : undefined}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/give" element={<Give />} />
          <Route path="/give/history" element={<GivingHistory />} />
          <Route path="/join" element={<Join />} />
          <Route path="/me" element={<Me />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/teachings"
            element={
              <Placeholder
                eyebrow="SERMON LIBRARY"
                title="Teachings"
                body="Sermons by series, speaker and topic arrive in the next phase of the demo."
              />
            }
          />
          <Route
            path="/services"
            element={
              <Placeholder
                eyebrow="PAST SUNDAYS"
                title="Service history"
                body="The timeline of past services, with order of service and attendance, arrives in the next phase of the demo."
              />
            }
          />
          <Route
            path="*"
            element={<Placeholder eyebrow="NOT FOUND" title="Page not found" body="That page doesn't exist in this demo." />}
          />
        </Routes>
      </div>
    </ToastProvider>
  )
}

export default App
