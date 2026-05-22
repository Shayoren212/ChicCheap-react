import Navbar from '../Navbar/Navbar.jsx';

export default function Layout({ currentPage, onNavigate, onLogout, children }) {
  return (
    <div className="app-shell">
      <Navbar
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="app-main">
        {children}
      </main>
    </div>
  );
}