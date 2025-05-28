import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { FcGoogle } from 'react-icons/fc'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState(null)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-blue-800/50 p-8 rounded-2xl backdrop-blur-sm border border-yellow-400/30">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-yellow-400">
            {isRegistering ? 'Criar nova conta' : 'Entrar na sua conta'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 placeholder-yellow-400/50 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent sm:text-sm backdrop-blur-sm transform transition-all duration-200 hover:bg-white/10"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-white/10 rounded-xl bg-white/5 placeholder-yellow-400/50 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent sm:text-sm backdrop-blur-sm transform transition-all duration-200 hover:bg-white/10"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-yellow-400 text-sm font-medium rounded-xl text-blue-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
            >
              {loading ? 'Carregando...' : (isRegistering ? 'Registrar' : 'Entrar')}
            </button>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={async () => {
                try {
                  setLoading(true)
                  setError(null)
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                  })
                  if (error) throw error
                } catch (error) {
                  setError(error.message)
                } finally {
                  setLoading(false)
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-yellow-400/30 rounded-xl text-sm font-medium text-yellow-400 bg-blue-800/30 hover:bg-blue-800/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
            >
              <FcGoogle className="h-5 w-5" />
              {loading ? 'Carregando...' : 'Continuar com Google'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? 'Já tem uma conta? Entre aqui'
                : 'Não tem uma conta? Registre-se'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}