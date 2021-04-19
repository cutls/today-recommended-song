import axios from 'axios'
import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda'
import { Song, ArtistObjectSimplified } from '../interface/interface'
import * as fs from 'fs';

const shuffle = (array: Song[]) => {
	for (let i = array.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}
const joinArtists = (array: ArtistObjectSimplified[]) => {
	let display: String = null
	for (let i = 0; i < array.length; i++) {
		if (display) display = `${display},${array[i].name}`
		if (!display) display = array[i].name
	}
	return display
}

export const handler: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
	callback(null, {
		headers: {
			'Content-Type': 'text/plain',
		},
		statusCode: 200,
		body: fs.readdirSync('./').join(','),
	})
	return
	const params = event.queryStringParameters
	const file = Object.keys(params)[0]
	if (file.match(/[^a-z]/gi)) return
	const json: Song[] = await getJson(file)
	if (!json) return false
	const shuffled = shuffle(json)
	const track = shuffled[0].track
	const artwork = track.album.images[0].url
	let content = null
	try {
		content = await axios.get(artwork, { responseType: 'arraybuffer' })
	} catch {
		content = { statusText: '', data: '' }
	}
	let base64_data = ''
	if (content.statusText == 'OK') base64_data = 'data:image/jpeg;base64,' + new Buffer(content.data).toString('base64')
	let title = track.name
	if (title.length > getHowLongTitle(title)) title = title.substr(0, getHowLongTitle(title)) + '...'
	let album = track.album.name
	if (album.length > getHowLong(album)) album = album.substr(0, getHowLong(album)) + '...'
	let artist = joinArtists(track.artists)
	if (artist.length > getHowLong(artist)) artist = artist.substr(0, getHowLong(artist)) + '...'
	const svg = `
<svg width="300" height="100" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect 
      data-testid="card-border"
      x="0.5"
      y="0.5"
      width="299"
      height="99%"
      rx="4.5"
      fill="#fff"
      stroke="#E4E2E3"
    /> 
    <image xlink:href="${base64_data}" x="3" y="3" height="94" width="94" />
    <text x="102" y="20" font-size="15" style="font-family: sans-serif">
        ${title}
    </text>
    <text x="102" y="40" font-size="10" style="font-family: sans-serif">
        ${album}
    </text>
    <text x="102" y="60" font-size="10" style="font-family: sans-serif">
        ${artist}
    </text>
    <text x="230" y="95" font-size="5" style="font-family: sans-serif">
        today-recommended-song
    </text>
</svg>
`
	callback(null, {
		headers: {
			'Content-Type': 'image/svg+xml',
		},
		statusCode: 200,
		body: svg,
	})
}
async function getJson(file: String) {
	const isHome = fs.readdirSync('./').includes('.babelrc')
	const prefix = isHome ? 'api/' : ''
	const json = fs.readFileSync(`${prefix}${file}.json`).toString()
	return JSON.parse(json)
}
function getHowLong(str: String) {
	let long = 0
	let i = 0
	for (i = 0; i < str.length; i++) {
		if (!str[i].match(/[a-z/.@+-_*`'"!#$%&'()0-9~|]|\s/gi)) {
			long = long + 9.5
		} else {
			long = long + 6.5
		}
		if (long > 195) {
			break
		}
	}
	return i
}
function getHowLongTitle(str: String) {
	let long = 0
	let i = 0
	for (i = 0; i < str.length; i++) {
		if (!str[i].match(/[a-z/.@+-_*`'"!#$%&'()0-9~|]|\s/gi)) {
			long = long + 16
		} else {
			long = long + 8.5
		}
		if (long > 195) {
			break
		}
	}
	return i
}
