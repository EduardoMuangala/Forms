import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function UserForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    morada: '',
    telefone: '',
    motivoContato: '',
    profissao: '',
    fotoPerfil: null
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        fotoPerfil: file
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      let fotoUrl = null
      if (formData.fotoPerfil) {
        const fileExt = formData.fotoPerfil.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('avatar')
          .upload(`${user.id}/${fileName}`, formData.fotoPerfil)

        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage
          .from('avatar')
          .getPublicUrl(`${user.id}/${fileName}`)
        fotoUrl = publicUrl
      }

      const { error: insertError } = await supabase
        .from('formularios')
        .insert([
          {
            user_id: user.id,
            nome: formData.nome,
            data_nascimento: formData.dataNascimento,
            morada: formData.morada,
            telefone: formData.telefone,
            motivo_contato: formData.motivoContato,
            profissao: formData.profissao,
            foto_perfil_url: fotoUrl
          }
        ])

      if (insertError) throw insertError
      navigate('/perfil')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-extrabold text-yellow-400 text-center mb-8">
          Formulário de Cadastro
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 bg-blue-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-yellow-400/30">
          <div>
            <label className="block text-sm font-medium text-yellow-400">Foto de Perfil</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-yellow-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-xl file:border file:border-yellow-400/30
                file:text-sm file:font-semibold
                file:bg-blue-800/30 file:text-yellow-400
                hover:file:bg-blue-800/50 file:transition-colors file:duration-200"
            />
          </div>

          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-yellow-400">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-yellow-400/30 bg-blue-800/30 text-yellow-400 placeholder-yellow-400/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="dataNascimento" className="block text-sm font-medium text-yellow-400">Data de Nascimento</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              required
              value={formData.dataNascimento}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-yellow-400/30 bg-blue-800/30 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="morada" className="block text-sm font-medium text-yellow-400">Morada</label>
            <input
              type="text"
              id="morada"
              name="morada"
              required
              value={formData.morada}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-yellow-400/30 bg-blue-800/30 text-yellow-400 placeholder-yellow-400/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-yellow-400">Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              required
              value={formData.telefone}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-yellow-400/30 bg-blue-800/30 text-yellow-400 placeholder-yellow-400/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="profissao" className="block text-sm font-medium text-yellow-400">Profissão</label>
            <input
              type="text"
              id="profissao"
              name="profissao"
              required
              value={formData.profissao}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-yellow-400/30 bg-blue-800/30 text-yellow-400 placeholder-yellow-400/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="motivoContato" className="block text-sm font-medium text-yellow-400">Motivo do Contato</label>
            <textarea
              id="motivoContato"
              name="motivoContato"
              required
              value={formData.motivoContato}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-4 py-3 rounded-xl border border-yellow-400/30 bg-blue-800/30 text-yellow-400 placeholder-yellow-400/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent sm:text-sm"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center items-center py-3 px-6 rounded-xl text-sm font-medium text-blue-900 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 shadow-lg hover:shadow-yellow-400/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/perfil')}
              className="flex-1 flex justify-center items-center py-3 px-6 border border-white/10 rounded-xl text-sm font-medium text-yellow-400 bg-white/5 hover:bg-white/10 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 backdrop-blur-sm shadow-lg hover:shadow-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}