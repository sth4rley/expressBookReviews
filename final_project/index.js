const express = require('express');
const jwt = require('jsonwebtoken'); 
const session = require('express-session')

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

// midleware express-session (rota /customer)
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// verifica se o user está autenticado com base no token de acesso
app.use("/customer/auth/*", async function auth(req, res, next) {
    try {
        if (req.session.authorization) {
            const token = req.session.authorization.accessToken;
            const user = await verifyToken(token);
            req.user = user; // armazena as informacoes do user para uso posterior
            next(); // prox middleware da cadeia
        }
        else {
            return res.status(403).json({ message: "User not logged in" });
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(403).json({ message: "User not authenticated" });
    }
});
  
async function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, "access", (err, user) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(user);
            }
        });
    });
}
   
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}...`);
});
