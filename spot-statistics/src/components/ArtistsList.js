import React, { useState, useEffect } from "react";
import "./ArtistsList.css";

function ArtistsList({ accessToken }) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchTopArtists();
    }
  }, [accessToken]);

  const fetchTopArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/top-artists?access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar artistas");
      }

      const data = await response.json();
      setArtists(data.items || []);
    } catch (err) {
      setError("Erro ao carregar artistas: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando seus artistas favoritos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchTopArtists} className="retry-button">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="artists-container">
      <h2 className="artists-title">Seus 30 Artistas Mais Ouvidos</h2>
      <p className="artists-subtitle">Baseado nos últimos 28 dias</p>

      <div className="artists-grid">
        {artists.map((artist, index) => (
          <div key={artist.id} className="artist-card">
            <div className="artist-rank">#{index + 1}</div>
            <div className="artist-image-container">
              <img
                src={artist.images[0]?.url || "/default-artist.png"}
                alt={artist.name}
                className="artist-image"
                onError={(e) => {
                  e.target.src = "/default-artist.png";
                }}
              />
            </div>
            <div className="artist-info">
              <h3 className="artist-name">{artist.name}</h3>
              <p className="artist-genres">
                {artist.genres.slice(0, 3).join(", ")}
              </p>
              <div className="artist-popularity">
                <div className="popularity-bar">
                  <div
                    className="popularity-fill"
                    style={{ width: `${artist.popularity}%` }}
                  ></div>
                </div>
                <span className="popularity-text">{artist.popularity}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {artists.length === 0 && (
        <div className="no-artists">
          <p>Nenhum artista encontrado. Tente novamente mais tarde.</p>
        </div>
      )}
    </div>
  );
}

export default ArtistsList;
