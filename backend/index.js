const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const querystring = require("querystring");

dotenv.config();

const app = express();
app.use(cors());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:5000/callback";

app.get("/login", (req, res) => {
  const scope = "user-top-read";
  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id,
      scope,
      redirect_uri,
    });
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  try {
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
    // Redireciona para o frontend com o token
    res.redirect(
      "http://localhost:3000/?access_token=" + response.data.access_token
    );
  } catch (error) {
    res.send("Erro ao autenticar com o Spotify");
  }
});

app.get("/top-artists", async (req, res) => {
  const access_token = req.query.access_token;
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=30",
      {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: "Erro ao buscar artistas" });
  }
});

app.listen(5000, () => {
  console.log("Backend rodando na porta 5000");
});
