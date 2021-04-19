const fs = require('fs')
const json = JSON.parse(fs.readFileSync(`${process.argv[process.argv.length - 1]}`))
const songs = json.tracks.items
let output = []
for (let i = 0; i < songs.length; i++) {
    let target = songs[i]
    const artists = target.track.artists
    let artistArr = []
    for (let j = 0; artists.length > j; j++) {
        artistArr.push({ name: artists[j].name })
    }
    let song = {
        "track": {
            "album": {
                "name": target.track.album.name,
                "images": [
                    {
                        "url": target.track.album.images[0].url
                    }
                ]
            },
            "artists": artistArr,
            "name": target.track.name
        }
    }
    output.push(song)
}
fs.writeFileSync(`${process.argv[process.argv.length - 1]}-compressed.json`, JSON.stringify(output))