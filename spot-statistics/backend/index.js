const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const querystring = require("querystring");

dotenv.config();
console.log("SPOTIFY_CLIENT_ID:", process.env.SPOTIFY_CLIENT_ID);
console.log("SPOTIFY_CLIENT_SECRET:", process.env.SPOTIFY_CLIENT_SECRET);

const app = express();
app.use(cors());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:5000/callback";

// Logs para debug
console.log("=== CONFIGURAÇÕES SPOTIFY ===");
console.log("Client ID:", client_id ? "Configurado" : "NÃO CONFIGURADO");
console.log(
  "Client Secret:",
  client_secret ? "Configurado" : "NÃO CONFIGURADO"
);
console.log("Redirect URI:", redirect_uri);
console.log("============================");

app.get("/login", (req, res) => {
  console.log("🔐 Tentativa de login iniciada");

  if (!client_id || !client_secret) {
    console.log("Erro: Client ID ou Client Secret não configurados");
    return res
      .status(500)
      .send("Erro: Credenciais do Spotify não configuradas");
  }

  const scope = "user-top-read";
  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id,
      scope,
      redirect_uri,
    });

  console.log("🔗 URL de autorização:", authUrl);
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  console.log("Callback recebido");
  const code = req.query.code || null;

  if (!code) {
    console.log("Erro: Código de autorização não recebido");
    return res.status(400).send("Erro: Código de autorização não recebido");
  }

  try {
    console.log("🔄 Trocando código por token...");
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        code,
        redirect_uri,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("✅ Token obtido com sucesso");
    // Redireciona para o frontend com o token
    res.redirect(
      "http://localhost:3000/?access_token=" + response.data.access_token
    );
  } catch (error) {
    console.log("Erro ao obter token:", error.response?.data || error.message);
    res
      .status(500)
      .send(
        "Erro ao autenticar com o Spotify: " +
          (error.response?.data?.error_description || error.message)
      );
  }
});

app.get("/top-artists", async (req, res) => {
  const access_token = req.query.access_token;

  if (!access_token) {
    console.log("Erro: Access token não fornecido");
    return res.status(400).json({ error: "Access token não fornecido" });
  }

  try {
    console.log("🎵 Buscando artistas mais ouvidos...");
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=30",
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );

    console.log("✅ Artistas obtidos:", response.data.items?.length || 0);
    res.json(response.data);
  } catch (error) {
    console.log(
      "Erro ao buscar artistas:",
      error.response?.data || error.message
    );
    res.status(400).json({
      error:
        "Erro ao buscar artistas: " +
        (error.response?.data?.error?.message || error.message),
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Backend rodando na porta 5000");
  console.log("📱 Acesse: http://localhost:5000/login");
});
