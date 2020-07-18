export interface Song {
	track: TrackObjectSimplified
}

interface TrackObjectSimplified {
	album: AlbumObjectSimplified
	external_ids?: ExternalIdObject
	popularity?: number
	artists: ArtistObjectSimplified[]
	available_markets?: string[]
	disc_number?: number
	duration_ms?: number
	explicit?: boolean
	external_urls?: {
		spotify: string
	}
	href?: string
	id?: string
	is_playable?: boolean
	linked_from?: TrackLinkObject
	name: string
	preview_url?: string
	track_number?: number
	type?: 'track'
	uri?: string
}
export interface ArtistObjectSimplified {
	external_urls?: {
		spotify: string
	}
	href?: string
	id?: string
	name: string
	type?: 'artist'
	uri?: string
}
interface TrackLinkObject {
	external_urls: {
		spotify: string
	}
	href: string
	id: string
	type: 'track'
	uri: string
}
interface AlbumObjectSimplified {
	album_type?: string
	available_markets?: string[]
	external_urls?: {
		spotify: string
	}
	href?: string
	id?: string
	images?: ImageObject[]
	name: string
	type?: 'album'
	uri?: string
}
interface ImageObject {
	height?: number
	url: string
	width?: number
}
interface ExternalIdObject {
	isrc?: string
	ean?: string
	upc?: string
}