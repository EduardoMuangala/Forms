import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function FormDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFormDetails()
  }, [id])

  const fetchFormDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('formularios')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setForm(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">
          Erro ao carregar os detalhes do formulário.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/5 shadow-2xl overflow-hidden rounded-3xl border border-white/10 backdrop-blur-md transform hover:scale-[1.01] transition-all duration-300">
          <div className="px-6 py-6 sm:px-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Detalhes do Formulário
              </h3>
            </div>
          </div>

          <div className="border-t border-white/10 px-6 py-6 sm:px-8 space-y-8">
            {form.foto_perfil_url && (
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  <img
                    src={form.foto_perfil_url}
                    alt="Foto de perfil"
                    className="relative h-40 w-40 rounded-full object-cover ring-2 ring-white/20 transform group-hover:scale-105 transition duration-300"
                  />
                </div>
              </div>
            )}

            <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-yellow-400/90 flex items-center space-x-2">Nome</dt>
                <dd className="mt-2 text-base text-yellow-400 bg-white/5 p-3 rounded-xl backdrop-blur-sm">{form.nome}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-yellow-400/90 flex items-center space-x-2">Data de Nascimento</dt>
                <dd className="mt-2 text-base text-yellow-400 bg-white/5 p-3 rounded-xl backdrop-blur-sm">
                  {new Date(form.data_nascimento).toLocaleDateString()}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-yellow-400/90 flex items-center space-x-2">Telefone</dt>
                <dd className="mt-2 text-base text-yellow-400 bg-white/5 p-3 rounded-xl backdrop-blur-sm">{form.telefone}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-yellow-400/90 flex items-center space-x-2">Profissão</dt>
                <dd className="mt-2 text-base text-yellow-400 bg-white/5 p-3 rounded-xl backdrop-blur-sm">{form.profissao}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-yellow-400/90 flex items-center space-x-2">Morada</dt>
                <dd className="mt-2 text-base text-yellow-400 bg-white/5 p-3 rounded-xl backdrop-blur-sm">{form.morada}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-yellow-400/90 flex items-center space-x-2">Motivo do Contato</dt>
                <dd className="mt-2 text-base text-yellow-400 bg-white/5 p-3 rounded-xl backdrop-blur-sm">{form.motivo_contato}</dd>
              </div>
            </dl>

            <div className="mt-12 flex justify-end space-x-4">
              <button
                onClick={() => navigate(`/editar-formulario/${id}`)}
                className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl text-blue-900 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                onClick={() => navigate('/perfil')}
                className="inline-flex items-center px-6 py-3 border border-white/10 text-sm font-medium rounded-xl text-yellow-400 bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm shadow-lg hover:shadow-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}