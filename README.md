# today-recommended-song
日替わりではない

## Demo

<img src="https://trs-cutls.netlify.app/.netlify/functions/song?songs" width="400">

## 使い方

* assets内にjsonを入れる
* Netlifyと連携
* 環境変数を設定
* xxx.netlify.app/.netlify/functions/song?songsにアクセスしたらOK
* ?の後にsongsを設定すればsongs.jsonとなる

### 環境変数

開発時は.envに指定しても動きます。

Spotify連携を使わないときは不要です。

* `SPOTIFY_CLIENTID`: SpotifyのクライアントID
* `SPOTIFY_CLIENTSECRET`: Spotifyのクライアントシークレット
* `SPOTIFY_PLAYLISTS`: カンマ区切りのSpotifyプレイリストID

IDの後にカッコで名前を入れると、jsonの名前がそのカッコ内のものになります(つまり、/.netlify/functions/song?<名前>になります)  
例  
`SPOTIFY_PLAYLISTS: aaa(spotify1),bbb(spotify2)`  
これで、/.netlify/functions/song?spotify1にアクセスするとプレイリストaaaの方が、spotify2にアクセスするとbbbのものが見れます。

## assets内のjsonの形式

このレポジトリのassets/songs.jsonを参照。
SpotifyのAPIの形式(items以下)と一緒です。