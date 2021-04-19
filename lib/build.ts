import * as fs from 'fs'
import SpotifyWebApi from 'spotify-web-api-node'
import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()
async function main() {
    const jsons = fs.readdirSync('assets')
    for (const json of jsons) {
        if (!json.match(/.+\.json$/)) continue
        fs.copyFileSync(`assets/${json}`, `api/${json}`)
        if (!fs.existsSync('dist')) fs.mkdirSync('dist')
        if (!fs.existsSync('dist/api')) fs.mkdirSync('dist/api')
        fs.copyFileSync(`assets/${json}`, `dist/api/${json}`)
    }

    if (!process.env.SPOTIFY_CLIENTID) return
    // Spotify mode
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENTID,
        clientSecret: process.env.SPOTIFY_CLIENTSECRET
    })
    const data = await spotifyApi.clientCredentialsGrant()
    if (!data.body['access_token']) return console.log('cannot auth')
    const at = data.body['access_token']
    spotifyApi.setAccessToken(at)
    const playlists = process.env.SPOTIFY_PLAYLISTS.split(',')

    for (const playlist of playlists) {
        let songs = [] as SpotifyApi.PlaylistTrackObject[]
        const d = playlist.match(/(.+)\((.+)\)/)
        let playlistId = playlist
        let playlistName = playlist
        if (d) {
            playlistId = d[1]
            playlistName = d[2]
        }
        let playlistApiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=0&limit=100`
        while (1) {
            const playlistDataRaw = await axios.get(playlistApiUrl, { headers: { Authorization: `Bearer ${at}` } })
            const playlistData = playlistDataRaw.data
            const songs1Req = playlistData.items as SpotifyApi.PlaylistTrackObject[]
            songs = songs.concat(songs1Req)
            if (playlistData.next) playlistApiUrl = playlistData.next
            else break
        }
        if (!songs) continue
        let output = []
        for (let i = 0; i < songs.length; i++) {
            let target = songs[i]
            const artists = target.track.artists
            let artistArr = []
            for (let j = 0; artists.length > j; j++) {
                artistArr.push({ name: artists[j].name })
            }
            const song = {
                track: {
                    album: {
                        name: target.track.album.name,
                        images: [
                            {
                                url: target.track.album.images[0].url
                            }
                        ]
                    },
                    artists: artistArr,
                    name: target.track.name
                }
            }
            output.push(song)
        }
        fs.writeFileSync(`api/${playlistName}.json`, JSON.stringify(output))
        fs.writeFileSync(`dist/api/${playlistName}.json`, JSON.stringify(output))
    }

}
main()