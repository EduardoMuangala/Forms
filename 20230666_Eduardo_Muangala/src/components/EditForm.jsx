import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditForm() {
  const { id } = useParams()
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

  useEffect(() => {
    fetchFormData()
  }, [id])

  const fetchFormData = async () => {
    try {
      const { data, error } = await supabase
        .from('formularios')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setFormData({
        nome: data.nome,
        dataNascimento: data.data_nascimento,
        morada: data.morada,
        telefone: data.telefone,
        motivoContato: data.motivo_contato,
        profissao: data.profissao,
        fotoPerfil: null
      })
    } catch (error) {
      console.error('Erro ao buscar dados do formulário:', error)
      setError(`Erro ao carregar os dados do formulário: ${error.message}`)
    }
  }

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

      const updateData = {
        nome: formData.nome,
        data_nascimento: formData.dataNascimento,
        morada: formData.morada,
        telefone: formData.telefone,
        motivo_contato: formData.motivoContato,
        profissao: formData.profissao
      }

      if (fotoUrl) {
        updateData.foto_perfil_url = fotoUrl
      }

      const { error: updateError } = await supabase
        .from('formularios')
        .update(updateData)
        .eq('id', id)

      if (updateError) throw updateError
      navigate(`/formulario/${id}`)
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
          Editar Formulário
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 bg-blue-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-yellow-400/30">
          <div>
            <label className="block text-sm font-medium text-yellow-400 mb-1">Foto de Perfil</label>
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
            <label htmlFor="nome" className="block text-sm font-medium text-yellow-400 mb-1">Nome</label>
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
            <label htmlFor="dataNascimento" className="block text-sm font-medium text-yellow-400 mb-1">Data de Nascimento</label>
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
            <label htmlFor="morada" className="block text-sm font-medium text-yellow-400 mb-1">Morada</label>
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
            <label htmlFor="telefone" className="block text-sm font-medium text-yellow-400 mb-1">Telefone</label>
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
            <label htmlFor="profissao" className="block text-sm font-medium text-yellow-400 mb-1">Profissão</label>
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
            <label htmlFor="motivoContato" className="block text-sm font-medium text-yellow-400 mb-1">Motivo do Contato</label>
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
              className="flex-1 flex justify-center py-3 px-4 border border-yellow-400 rounded-xl text-sm font-medium text-blue-900 bg-yellow-400 hover:bg-yellow-300 transform transition duration-200 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/formulario/${id}`)}
              className="flex-1 flex justify-center py-3 px-4 border border-yellow-400/30 rounded-xl text-sm font-medium text-yellow-400 bg-blue-800/30 hover:bg-blue-800/50 transform transition duration-200 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
