const express = require('express'); // Expressフレームワークを読み込む
const app = express();               // Expressアプリを作成
const port = 3000;                   // サーバが待ち受けるポート番号

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, '0.0.0.0' , () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
