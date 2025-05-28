import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import UserForm from './components/UserForm'
import Profile from './components/Profile'
import FormDetails from './components/FormDetails'
import EditForm from './components/EditForm'


export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !session ? (
              <Auth />
            ) : (
              <Navigate to="/perfil" replace />
            )
          }
        />
        <Route
          path="/perfil"
          element={
            session ? (
              <Profile />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/novo-formulario"
          element={
            session ? (
              <UserForm />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/formulario/:id"
          element={
            session ? (
              <FormDetails />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/editar-formulario/:id"
          element={
            session ? (
              <EditForm />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

