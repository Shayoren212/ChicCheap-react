import { useNavigate } from 'react-router-dom'
import AuthCard from '../../components/AuthCard/AuthCard'

function LoginPage() {
  const navigate = useNavigate()
  return (
    <AuthCard
      mode="login"
      onNavigate={(mode) => navigate(`/${mode}`)}
    />
  )
}

export default LoginPage
