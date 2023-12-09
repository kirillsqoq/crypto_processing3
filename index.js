const express = require('express');
const crypto = require('crypto');
const secretKey = 'O-WI_EZeXz6IfkPbThcQ6IHEllvh-8ZvVcKbYgyaOIdcjH1Z1p9IQdaoChRJU_gX';

const app = express();
const port = 3000;

// Используем middleware express.json() для автоматического разбора JSON данных
app.use(express.json());

app.post('/callback', (req, res) => {
  const data = req.body;
  console.log(data)

  if (data && validateRequest(data)) {
    res.status(200).json({ message: 'This is a correct JSON callback' });
  } else {
    res.status(422).json({ error: 'Incorrect data' });
  }
});

function validateRequest(data) {
  console.log(data)
  
  if (typeof data === 'object' && data.verify_hash && secretKey) {
    const ordered = { ...data };
    delete ordered.verify_hash;
    const string = JSON.stringify(ordered);

    const hmac = crypto.createHmac('sha1', secretKey);
    hmac.update(string);
    const hash = hmac.digest('hex');

    return hash === data.verify_hash;
  }
  return false;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
