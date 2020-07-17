const fs = require('fs')
const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
const joinArtists = ([...array]) => {
    let display = null
    for (let i = 0; i < array.length; i++) {
        if(display) display = `${display},${array[i].name}`
        if(!display) display = array[i].name
    }
    return display;
}
exports.handler = function (event, context, callback) {
    const params = event.queryStringParameters
    const file = Object.keys(params)[0]
    if(file.match(/[^a-z]/gi)) return
    const json = getJson(file)
    const shuffled = shuffle(json)
    const track = shuffled[0].track
    const artwork = track.album.images[0].url
    let title = track.name
    if(title.length > 16) title = title.substr(0, getHowLongTitle(title)) + '...'
    let album = track.album.name
    if(album.length > 16) album = album.substr(0, getHowLong(album)) + '...'
    let artist = joinArtists(track.artists)
    if(artist.length > 16) artist = artist.substr(0, getHowLong(artist)) + '...'
    const svg = `
<svg width="100%" height="100%" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect 
      data-testid="card-border"
      x="0.5"
      y="0.5"
      width="300"
      height="99%"
      rx="4.5"
      fill="#FFFEFF"
      stroke="#E4E2E3"
    /> 
    <image xlink:href="${artwork}" x="3" y="3" height="94" width="94" />
    <text x="105" y="20" font-size="15">
        ${title}
    </text>
    <text x="105" y="40" font-size="10">
        ${album}
    </text>
    <text x="105" y="60" font-size="10">
        ${artist}
    </text>
</svg>
`
    callback(null, {
        headers: {
            'Content-Type': 'image/svg+xml'
        },
        statusCode: 200,
        body: svg
    });
}
function getJson(file) {
    return JSON.parse(fs.readFileSync(`/${file}.json`, 'utf8'))
}
function getHowLong(str) {
    let long = 0
    let i = 0
    for(i = 0; i < str.length; i++) {
        if(str[i].match(/[^a-z]/gi)) {
            long = long + 13
        } else {
            long = long + 7
        }
        if(long > 195) {
            break;
        }
    }
    return i + 1
}
function getHowLongTitle(str) {
    let long = 0
    let i = 0
    for(i = 0; i < str.length; i++) {
        if(str[i].match(/[^a-z]/gi)) {
            long = long + 17
        } else {
            long = long + 10
        }
        if(long > 195) {
            break;
        }
    }
    return i + 1
}