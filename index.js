const express = require('express');
const request = require('request');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:3000';
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin: [FRONTEND_URI],
    methods:['GET','POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
}));

app.get('/accessToken', function(req, res) {
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          grant_type: 'client_credentials',
        },
        headers: {
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
        json: true,
    };

    request.post(authOptions, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            const access_token = body.access_token;
            return res.status(200).json({access_token});
        } else {
            console.log("error")
        }
    });
});

// serve static files from the react client app
app.use(express.static(path.join(__dirname, '/client/build')));

// Anything that doesn't match the above, send back index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '../client/build/index.html'))
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});