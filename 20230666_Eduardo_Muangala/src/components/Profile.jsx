import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [forms, setForms] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/')
        return
      }

      const { data, error } = await supabase
        .from('formularios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setForms(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (formId) => {
    try {
      const { error } = await supabase
        .from('formularios')
        .delete()
        .eq('id', formId)

      if (error) throw error
      setForms(forms.filter(form => form.id !== formId))
    } catch (error) {
      setError(error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Meus Formulários
            </h2>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/novo-formulario')}
              className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl text-blue-900 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Formulário
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-6 py-3 border border-white/10 text-sm font-medium rounded-xl text-yellow-400 bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm shadow-lg hover:shadow-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm text-center">{error}</div>
        )}

        {forms.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-yellow-400/70 text-lg">Você ainda não tem nenhum formulário cadastrado.</p>
              <button
                onClick={() => navigate('/novo-formulario')}
                className="mt-4 inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl text-blue-900 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Criar Primeiro Formulário
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div key={form.id} className="bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    {form.foto_perfil_url ? (
                      <img
                        src={form.foto_perfil_url}
                        alt="Foto de perfil"
                        className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/10"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-yellow-300/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-yellow-400">{form.nome}</h3>
                      <p className="text-sm text-yellow-400/70">{form.profissao}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between items-center border-t border-white/10">
                    <button
                      onClick={() => navigate(`/formulario/${form.id}`)}
                      className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center space-x-1 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Ver detalhes</span>
                    </button>
                    <button
                      onClick={() => handleDelete(form.id)}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}