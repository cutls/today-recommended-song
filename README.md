# today-recommended-song
日替わりではない

## Demo

<img src="https://trs-cutls.netlify.app/.netlify/functions/song?songs" width="400">

## 使い方

* songs.jsonをいじる
* Netlifyと連携
* 環境変数にHOST=xxxと設定。xxxは、xxx.netlify.appのxxx。NODE_VERSION=12も指定。
ソースコード変えたら他のJSONも参照できるけど、Netlify Functions弱者なので内部を直接参照できる方法がわからないので外部に公開してそのJSONを読んでください。
* xxx.netlify.app/.netlify/functions/song?songにアクセスしたらOK
* ?の後にsongsを設定すればsongs.jsonとなる

## songs.jsonの形式

このレポジトリのsongs.jsonを参照。
SpotifyのAPIの形式(items以下)と一緒です。

`node index.js xxx.json`にSpotifyのプレイリストのJSONをitems以外も全部含めて突っ込むと、必要な分だけ取り出したやつを別名(xxx.json-compressed.json)で保存します。(クソコード)

ソースコードがまともなじゃないので使用には注意