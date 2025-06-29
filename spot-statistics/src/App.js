import "./App.css";
import React, { useState, useEffect } from "react";
import ArtistsList from "./components/ArtistsList";

// spot-statistics/src/App.js

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há token na URL (após login)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");

    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
      // Limpar a URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogin = () => {
    // Redireciona para o backend, que inicia o login do Spotify
    window.location.href = "http://localhost:5000/login";
  };

  const handleLogout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  // Se está autenticado, mostrar a lista de artistas
  if (isAuthenticated && accessToken) {
    return (
      <div className="app-container">
        <div className="app-content">
          <div className="header-section">
            <h1 className="app-title">Spot Statistics</h1>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
          <ArtistsList accessToken={accessToken} />
        </div>
      </div>
    );
  }

  // Página inicial de login
  return (
    <div className="app-container">
      <div className="app-content">
        <div className="logo-container">
          <div className="logo">🎵</div>
        </div>

        <h1 className="app-title">Spot Statistics</h1>
        <p className="app-subtitle">Descubra seus artistas favoritos</p>

        <button className="login-button" onClick={handleLogin}>
          <span className="spotify-icon">🎧</span>
          Conectar com Spotify
        </button>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Estatísticas detalhadas</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎵</span>
            <span>Artistas mais ouvidos</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📱</span>
            <span>Totalmente responsivo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
