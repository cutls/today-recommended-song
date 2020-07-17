# today-recommended-song
日替わりではない

## Demo

<img src="https://trs-cutls.netlify.app/.netlify/functions/song?songs" width="200">

## 使い方

* songs.jsonをいじる
* Netlifyと連携
* 環境変数にHOST=xxxと設定。xxxは、xxx.netlify.appのxxx。
* xxx.netlify.app/.netlify/functions/song?songにアクセスしたらOK
* ?の後にsongsを設定すればsongs.jsonとなる

## songs.jsonの形式

このレポジトリのsongs.jsonを参照。
SpotifyのAPIの形式(items以下)と一緒です。

ソースコードがまともなじゃないので使用には注意