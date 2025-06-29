import "./App.css";

// spot-statistics/src/App.js

import React from "react";

function App() {
  const handleLogin = () => {
    // Redireciona para o backend, que inicia o login do Spotify
    window.location.href = "http://localhost:5000/login";
  };

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
