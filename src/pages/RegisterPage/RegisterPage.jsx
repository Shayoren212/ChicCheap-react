import { useNavigate } from 'react-router-dom'
import AuthCard from '../../components/AuthCard/AuthCard'

function RegisterPage() {
  const navigate = useNavigate()

  return (
    <AuthCard
      mode="register"
      onNavigate={(mode) => navigate(`/${mode}`)}
      onLogin={() => navigate('/home')}
    />
  )
}

export default RegisterPage
