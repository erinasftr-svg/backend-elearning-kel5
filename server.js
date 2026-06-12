require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { CognitoIdentityProviderClient, InitiateAuthCommand } = require("@aws-sdk/client-cognito-identity-provider");

const app = express();
const port = 80;
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// INI KUNCI AGAR STYLE CSS KAMU KEMBALI MUNCUL!
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'rahasia-kelompok-5',
    resave: false,
    saveUninitialized: true
}));

// --- SATPAM CERDAS ---
const requireAuth = (req, res, next) => {
    if (req.headers['user-agent'] && req.headers['user-agent'].includes('ELB-HealthChecker')) {
        return res.status(200).send('OK'); 
    }

    if (req.session.token) {
        next(); 
    } else {
        res.redirect('/login'); 
    }
};

// Rute Login
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters: { USERNAME: email, PASSWORD: password },
        });
        const response = await cognitoClient.send(command);
        req.session.token = response.AuthenticationResult.IdToken;
        res.redirect('/');
    } catch (error) {
        res.send(`<h1>Login Gagal</h1><p>Alasan AWS: <b>${error.message}</b></p><a href='/login'>Coba Lagi</a>`);
    }
});

// Fitur Logout untuk mereset Cognito
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

const materiRoutes = require('./routes/materiRoutes');
app.use('/', requireAuth, materiRoutes);

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Sistem Terkunci & Berjalan di port ${port}`);
});
