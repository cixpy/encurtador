const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Carrega as variáveis do arquivo .env
dotenv.config();

// Inicializa o app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

// Conecta ao banco de dados
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado!'))
    .catch(err => console.error(err));

// Configura o shortid para gerar códigos de 5 caracteres sem caracteres especiais
// const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
// shortid.characters(alphabet);

// Define o modelo do link
const urlSchema = new mongoose.Schema({
    fullUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, default: () => shortid.generate().substring(0, 5) },
    createdAt: { type: Date, default: Date.now, expires: 7200 } // 7200 segundos = 2 horas
});


const Url = mongoose.model('Url', urlSchema);

// Middleware para processar requisições JSON
app.use(express.json());

// Habilita CORS para permitir requisições do frontend
app.use(cors());

// Rota para encurtar um link
app.post('/api/shorten', async (req, res) => {
    const { fullUrl } = req.body;
    const normalizedUrl = typeof fullUrl === 'string' ? fullUrl.trim() : '';

    const getBaseUrl = (request) => {
        const forwardedProto = request.headers['x-forwarded-proto'];
        const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || request.protocol;
        return `${protocol}://${request.get('host')}`;
    };

    if (!normalizedUrl) {
        return res.status(400).json({ error: 'URL completa é necessária.' });
    }

    try {
        const parsedUrl = new URL(normalizedUrl);

        if (parsedUrl.protocol !== 'https:') {
            return res.status(400).json({ error: 'Apenas URLs que começam com https:// são permitidas.' });
        }
    } catch (error) {
        return res.status(400).json({ error: 'Digite uma URL válida começando com https://.' });
    }

    try {
        const newUrl = new Url({ fullUrl: normalizedUrl });
        await newUrl.save();
        res.json({
            shortUrl: newUrl.shortUrl,
            shortLink: `${getBaseUrl(req)}/${newUrl.shortUrl}`
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao encurtar o link.' });
    }
});

// Rota para redirecionar
app.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });

        if (url) {
            return res.redirect(url.fullUrl);
        } else {
            return res.status(404).send('Link não encontrado ou expirado.');
        }
    } catch (error) {
        res.status(500).send('Erro no servidor.');
    }
});

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
