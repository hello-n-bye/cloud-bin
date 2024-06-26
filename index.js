const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

app.use(express.static('public'));
app.use(bodyParser.text());

// Custom page for Starry! 💫
app.get('/starry', (req, res) => {
  const content = fs.readFileSync(path.join(__dirname, 'starry.lua'), 'utf8');
  res.send(content);
})

app.post('/raw', (req, res) => {
  const codeContent = req.body;

  if (codeContent.trim() !== "") {
    const fileName = generateRandomFileName();
    const filePath = path.join(__dirname, 'public', 'raw', `${fileName}.txt`);

    fs.writeFile(filePath, codeContent, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        return res.send(`${fileName}.txt`);
      }
    });
  } else {
    res.status(400).send('Bad Request: Please provide code content.');
  }
});

function generateRandomFileName() {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
