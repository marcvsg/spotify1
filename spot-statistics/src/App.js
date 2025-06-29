import "./App.css";

// spot-statistics/src/App.js

import React from "react";

function App() {
  const handleLogin = () => {
    // Redireciona para o backend, que inicia o login do Spotify
    window.location.href = "http://localhost:5000/login";
  };

  return (
    <div>
      <div className="header">
        <img className="logo" src="./img/logo.png" alt="Logo" />
      </div>
      <div className="conteudo">
        <p className="frase-conteudo">
          Confira aqui seu top 10 Artistas favoritos do Spotify
        </p>
        <button className="spotify-button" onClick={handleLogin}>
          <img className="spotify-icon" src="./img/spotify.png" alt="Spotify" />
          <span className="button-text">Conectar com Spotify</span>
        </button>
      </div>
    </div>
  );
}

export default App;
