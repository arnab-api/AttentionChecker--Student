// https://www.section.io/engineering-education/rendering-html-pages-as-a-http-server-response-using-node-js/
// https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/

const express = require("express");
const fs = require('fs');
const app = express();
app.use(express.static(__dirname));
const port = 3001

const https = require('https');

const options = {
  key: fs.readFileSync('https/localhost+2-key.pem', 'utf8'),
  cert: fs.readFileSync('https/localhost+2.pem', 'utf8'),
  passphrase: '12345'
};
const server = https.createServer(options, app);

server.listen(port, '0.0.0.0', () => {
  console.log("serving https port ==> ", port);
  console.log(__dirname)
});

// app.listen(port, () => {
//   console.log("Application started and Listening on port ==> ", port);
//   console.log(__dirname)
// });



app.get("/", (req, res) => {
  // return res.end('<p>This server serves up static files.</p>');
  res.sendFile(__dirname + "/index.html");
});
