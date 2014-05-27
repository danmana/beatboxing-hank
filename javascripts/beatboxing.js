(function () {
	var phonemes = {
		t :  { start : 155.75, duration : 200 },
		ch : { start : 156.20, duration : 300 },
		s :  { start : 172.25, duration : 200 },
		sh : { start : 156.83, duration : 300 },
		f :  { start : 157.20, duration : 300 },
		p :  { start : 172.80, duration : 200 },
		a :  { start : 155.25, duration : 300 },
		ai : { start : 215.70, duration : 350 },
		e :  { start : 173.45, duration : 280 },
		o :  { start : 216.25, duration : 300 },
		u :  { start : 216.75, duration : 300 }
	}, player, beatbox = '', timeoutId;

	function init() {
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		
		var btn = document.getElementById('beatbox-button');
		btn.addEventListener('click', function(event) {
			if (btn.className == 'play') {
				btn.className = 'pause';
				//TODO: start playing
			} else {
				btn.className = 'play';
				//TODO: stop playing
			}
		
		}, false);
		
		
		
	}

	window.onYouTubeIframeAPIReady = function () {
		player = new YT.Player('player', {
				height : '390',
				width : '640',
				videoId : 's9shPouRWCs',
				events : {
					'onReady' : onPlayerReady,
					'onStateChange' : onPlayerStateChange
				}
			});

	};

	function onPlayerReady(event) {
		player.playVideo();
		player.seekTo(phonemes.a.start, true);
		player.pauseVideo();
	}

	function onPlayerStateChange(event) {
		if (event.data == YT.PlayerState.PLAYING && !playing && beatbox.length) {
			playing = true;
			nextBeat();
		}
	}

	function splitByPhonemes(str) {
		var i,
		ph = [],
		ch;
		for (i = 0; i < str.length; i++) {
			ch = str[i];
			if (ch == 'a') {
				if (i + 1 < str.length && str[i + 1] == 'i') {
					ph.push(phonemes['ai']);
					i++;
				} else {
					ph.push(phonemes['a']);
				}
			} else if (ch == 's') {
				if (i + 1 < str.length && str[i + 1] == 's') {
					ph.push(phonemes['sh']);
					i++;
				} else {
					ph.push(phonemes['s']);
				}
			} else if (phonemes.hasOwnProperty(ch)) {
				ph.push(phonemes[ch]);
			}

		}
		return ph;

	}

	function nextBeat() {

		if (!beatbox.length) {
			player.pauseVideo();
			playing = false;
			return;
		}
		var beat = beatbox.shift(),
		ph = phonemes[beat];
		player.seekTo(ph.start, true);
		timeoutId = setTimeout(nextBeat, ph.duration);
	}

	init();
}());
