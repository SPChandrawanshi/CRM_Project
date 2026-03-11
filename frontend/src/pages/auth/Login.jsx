import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaLock, FaEnvelope, FaUserShield, FaUsers, FaUserInjured } from 'react-icons/fa'
import api from '../../services/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.success) {
        // Store user info and token in localStorage
        // Store the raw backend role (e.g. SUPER_ADMIN) so ROLE_MAP works correctly
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({ 
          email: response.data.email, 
          role: response.data.role,   // Keep original backend enum e.g. SUPER_ADMIN
          name: response.data.name 
        }));

        // Redirect to role-specific dashboard based on backend role
        const roleRedirectMap = {
          'SUPER_ADMIN': '/super-admin',
          'ADMIN': '/admin',
          'MANAGER': '/manager',
          'TEAM_LEADER': '/team-leader',
          'COUNSELOR': '/counselor',
          'SUPPORT': '/support',
        };
        const redirectPath = roleRedirectMap[response.data.role] || '/dashboard';
        navigate(redirectPath);
      } else {
        setError(response.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login Error:', err);
      const errorMessage = typeof err === 'string' ? err : (err.response?.data?.message || err.message || 'Server connection failed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(8,145,178,0.15)] p-8 w-full max-w-md border border-cyan-100 mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
            <FaUserShield className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
            POVA Care System
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="#"
              className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-4 py-3 rounded-lg shadow-[0_4px_12px_rgba(8,145,178,0.3)] hover:shadow-[0_6px_16px_rgba(8,145,178,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg border border-cyan-100">
          <p className="text-xs font-semibold text-gray-700 mb-3">Demo Credentials:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs bg-white p-2 rounded border border-cyan-100">
              <FaUserShield className="text-cyan-600" />
              <div>
                <strong className="text-cyan-700">Super Admin:</strong>
                <span className="text-gray-600 ml-1">super.admin@crm.com / password123</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white p-2 rounded border border-teal-100">
              <FaUsers className="text-teal-600" />
              <div>
                <strong className="text-teal-700">Admin:</strong>
                <span className="text-gray-600 ml-1">admin@edu-corp.com / password123</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white p-2 rounded border border-blue-100">
              <FaUserInjured className="text-blue-600" />
              <div>
                <strong className="text-blue-700">Counselor:</strong>
                <span className="text-gray-600 ml-1">counselor@sales.crm / password123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login




