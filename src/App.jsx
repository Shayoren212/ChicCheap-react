import { useState } from 'react';
import Layout from './components/Layout/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

export default function App() {
  const [page, setPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = nextPage => {
    if (!isLoggedIn && nextPage !== 'login' && nextPage !== 'register') {
      setPage('login');
      return;
    }

    setPage(nextPage);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setPage('landing');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedProduct(null);
    setPage('login');
  };

  const selectProduct = product => {
    setSelectedProduct(product);
    setPage('product');
  };

  if (!isLoggedIn && page === 'login') {
    return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;
  }

  if (!isLoggedIn && page === 'register') {
    return <RegisterPage onNavigate={navigate} onLogin={handleLogin} />;
  }

  const pages = {
    landing: <LandingPage onNavigate={navigate} onSelectProduct={selectProduct} />,
    about: <AboutPage />,
    product: <ProductPage product={selectedProduct} onNavigate={navigate} />,
    notifications: <NotificationsPage onNavigate={navigate} />,
    profile: <ProfilePage onNavigate={navigate} onLogout={handleLogout} />
  };

  return (
    <Layout currentPage={page} onNavigate={navigate} onLogout={handleLogout}>
      {pages[page] || pages.landing}
    </Layout>
  );
}