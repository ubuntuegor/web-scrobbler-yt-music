export {};

/**
 * Quick links to debug and test the connector:
 *
 * https://music.youtube.com/playlist?list=OLAK5uy_kDEvxPASaVnoSjOZViKEn4S3iVaueN0UI
 * Multiple artists
 *
 * https://music.youtube.com/playlist?list=OLAK5uy_k-OR_rCdS5UNV22eIhAOWLMZbbxa20muQ
 * Auto-generated YouTube video (and generic track on YouTube Music)
 *
 * https://music.youtube.com/watch?v=Ap1fDjCXQrU
 * Regular YouTube video which contains artist and track names in video title
 *
 * https://music.youtube.com/watch?v=hHrvuQ4DwJ8
 * Regular YouTube video which contains track name in video title and
 * artist name as a channel name
 *
 * https://music.youtube.com/library/uploaded_songs
 * Uploaded songs have different artist and track selectors
 */

Connector.playerSelector = 'ytmusic-player-bar';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(
		'.ytmusic-player-bar.image',
	);
	if (trackArtUrl) {
		return trackArtUrl.substring(0, trackArtUrl.lastIndexOf('='));
	}
	return null;
};

Connector.isTrackArtDefault = (url) => {
	// Self-uploaded tracks could not have cover arts
	return Boolean(url?.includes('cover_track_default'));
};

Connector.trackSelector =
	'.content-info-wrapper.ytmusic-player-bar .title.ytmusic-player-bar';

Connector.getArtist = () => getAlbumAndArtist().artist;

Connector.getAlbum = () => getAlbumAndArtist().album;

function getAlbumAndArtist() {
	const byline = Util.getAttrFromSelectors(
		'.content-info-wrapper.ytmusic-player-bar .byline.ytmusic-player-bar',
		'title',
	);

	if (!byline) {
		return { album: null, artist: null };
	}

	const parts = byline.split(' • ');

	const artist = parts[0];
	const album =
		parts.length > 1 && !isRegularVideoPlaying() ? parts[1] : null;

	return { album, artist };
}

function isRegularVideoPlaying() {
	return !document.querySelector(
		'.content-info-wrapper.ytmusic-player-bar .byline.ytmusic-player-bar a[href*="browse/"]',
	);
}

Connector.timeInfoSelector = '.ytmusic-player-bar.time-info';

Connector.isPlaying = () => navigator.mediaSession.playbackState === 'playing';

Connector.loveButtonSelector =
	'ytmusic-like-button-renderer #button-shape-like button[aria-pressed="false"]';

Connector.unloveButtonSelector =
	'ytmusic-like-button-renderer #button-shape-like button[aria-pressed="true"]';

Connector.getUniqueID = () => {
	const uniqueId = new URLSearchParams(window.location.search).get('v');

	if (uniqueId) {
		return uniqueId;
	}

	const videoUrl = Util.getAttrFromSelectors('.yt-uix-sessionlink', 'href');
	return Util.getYtVideoIdFromUrl(videoUrl);
};

Connector.scrobblingDisallowedReason = () =>
	document.querySelector('.ytmusic-player-bar.advertisement') ? 'IsAd' : null;
