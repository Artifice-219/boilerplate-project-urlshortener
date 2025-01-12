require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});


function randomString() {
  return Math.random().toString(36).substring(2, 8);
}


const urls = [];

function save(longUrl, shortUrl) {
  urls.push({ shortUrl, originalUrl: longUrl });
}

// Retrieve the original URL from a short URL
function toLong(shortUrl) {
  const find = urls.find(item => item.shortUrl === shortUrl);
  return find ? find.originalUrl : null;
}

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validate input URL
  if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
    return res.json({ error: 'Invalid URL' });
  }

  const shortUrl = randomString();
  save(originalUrl, shortUrl);

  res.json({ original_url: originalUrl, short_url: shortUrl });
});


app.get('/api/shorturl/:shorturl', (req, res) => {
  const shortUrl = req.params.shorturl;
  const originalUrl = toLong(shortUrl);

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
