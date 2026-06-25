import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { TransitionProvider, usePageTransition } from './context/TransitionContext'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import DevLogin from './pages/DevLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import TutorDashboard from './pages/TutorDashboard'
import LessonDetail from './pages/LessonDetail'
import StudentDashboard from './pages/StudentDashboard'
import StudentLessonView from './pages/StudentLessonView'
import ProfilePage from './pages/ProfilePage'
import LandingPage from './pages/LandingPage'
import AboutUs from './pages/AboutUs'
import HowItWorksPage from './pages/HowItWorksPage'
import TermsOfUse from './pages/TermsOfUse'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ContactUs from './pages/ContactUs'
import Instructors from './pages/Instructors'
import Students from './pages/Students'
import FAQ from './pages/FAQ'
import StudentSurvey from './pages/StudentSurvey'
import TutorSurvey from './pages/TutorSurvey'
import CurriculumPage from './pages/CurriculumPage'
import WordBackground from './components/WordBackground'
import PageArrows from './components/PageArrows'

function LangSync() {
  const { user } = useAuth()
  const { setLang } = useLanguage()
  useEffect(() => {
    if (user?.language) setLang(user.language)
  }, [user?.language])
  return null
}

function RequireAuth({ role, children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function SurveyGuard({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
  if (user?.role === 'student' && !user.survey_completed) return <Navigate to="/survey" replace />
  return children
}

function TutorSurveyGuard({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>
  if (user?.role === 'tutor' && !user.survey_completed) return <Navigate to="/tutor-survey" replace />
  return children
}

function AnimatedRoutes() {
  const location = useLocation()
  const { direction, setDirection } = usePageTransition()

  useEffect(() => {
    if (document.getElementById('vp-arrows-css')) return
    const s = document.createElement('style')
    s.id = 'vp-arrows-css'
    s.textContent = `
      @keyframes vp-from-right{from{opacity:0;transform:translateX(52px)}to{opacity:1;transform:translateX(0)}}
      @keyframes vp-from-left{from{opacity:0;transform:translateX(-52px)}to{opacity:1;transform:translateX(0)}}
    `
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    if (!direction) return
    const t = setTimeout(() => setDirection(null), 400)
    return () => clearTimeout(t)
  }, [location.key])

  const anim = direction === 'forward' ? 'vp-from-right 0.35s ease'
             : direction === 'back'    ? 'vp-from-left 0.35s ease'
             : 'none'

  return (
    <>
      <PageArrows />
      <div key={location.key} style={{ position: 'relative', zIndex: 1, animation: anim }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/staff" element={<AdminLogin />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/students" element={<Students />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/survey" element={<RequireAuth role="student"><StudentSurvey /></RequireAuth>} />
          <Route path="/tutor-survey" element={<RequireAuth role="tutor"><TutorSurvey /></RequireAuth>} />
          <Route path="/dev" element={import.meta.env.DEV ? <DevLogin /> : <Navigate to="/" replace />} />

          <Route path="/dashboard/admin" element={
            <RequireAuth role="admin"><AdminDashboard /></RequireAuth>
          } />
          <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />

          <Route path="/dashboard/tutor" element={
            <TutorSurveyGuard><RequireAuth role="tutor"><TutorDashboard /></RequireAuth></TutorSurveyGuard>
          } />
          <Route path="/tutor" element={<Navigate to="/dashboard/tutor" replace />} />
          <Route path="/dashboard/tutor/lesson/:id" element={
            <RequireAuth role="tutor"><LessonDetail /></RequireAuth>
          } />

          <Route path="/dashboard/student" element={
            <SurveyGuard><RequireAuth role="student"><StudentDashboard /></RequireAuth></SurveyGuard>
          } />
          <Route path="/student" element={<Navigate to="/dashboard/student" replace />} />
          <Route path="/dashboard/student/lesson/:id" element={
            <RequireAuth role="student"><StudentLessonView /></RequireAuth>
          } />

          <Route path="/dashboard/profile" element={
            <RequireAuth><ProfilePage /></RequireAuth>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <LangSync />
        <WordBackground />
        <TransitionProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AnimatedRoutes />
          </BrowserRouter>
        </TransitionProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}
