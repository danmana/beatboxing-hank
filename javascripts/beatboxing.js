(function () {
	var phonemes = {
		t :  { start : 155.75, duration : 200 },
		c :  { start : 156.20, duration : 300 },
		s :  { start : 172.25, duration : 200 },
		sh : { start : 156.83, duration : 300 },
		f :  { start : 157.20, duration : 300 },
		p :  { start : 172.80, duration : 200 },
		a :  { start : 155.25, duration : 300 },
		ai : { start : 215.70, duration : 350 },
		e :  { start : 173.45, duration : 280 },
		o :  { start : 216.25, duration : 300 },
		u :  { start : 216.75, duration : 300 },
		' ' :  { start : -1, duration : 200 }
	}, player, beatbox = '', timeoutId, btn, text, beats = [], playing;
	
	btn = document.getElementById('beatbox-button');
	text = document.getElementById('beatbox-text');
	
	function init() {
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		
		btn.addEventListener('click', function(event) {
			event.preventDefault();
			if (btn.className == 'play') {
				btn.className = 'pause';
				beats = splitIntoPhonemes(text.value);
				console.log(beats);
				player.playVideo();
			} else {
				endBeats();
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
		player.seekTo(phonemes.a.start, true);
		//player.playVideo();
	}

	function onPlayerStateChange(event) {
		console.log(event.data);
		if (event.data == YT.PlayerState.PLAYING && !playing && beats.length) {
				playing = true;
				nextBeat();
		}
	}

	function splitIntoPhonemes(str) {
		var i,
		ph = [],
		ch;
		for (i = 0; i < str.length; i++) {
			ch = str[i];
			if (ch == 'a') {
				if (i + 1 < str.length && str[i + 1] == 'i') {
					ph.push('ai');
					i++;
				} else {
					ph.push('a');
				}
			} else if (ch == 's') {
				if (i + 1 < str.length && str[i + 1] == 'h') {
					ph.push('sh');
					i++;
				} else {
					ph.push('s');
				}
			} else if (phonemes.hasOwnProperty(ch)) {
				ph.push(ch);
			}

		}
		return ph;

	}
	
	function endBeats(){
		btn.className = 'play';
		beats = [];
		player.pauseVideo();
		playing = false;
		clearTimeout(timeoutId);
	}

	function nextBeat() {
		if (!beats.length) {
			endBeats();
			return;
		}
		var beat = phonemes[beats.shift()];
		if (beat.start == -1) {
			player.pauseVideo();
			timeoutId = setTimeout(function(){
				if (beats.length) {
					player.playVideo();
				} else {
					endBeats();
				}
			}, beat.duration);
		} else {
			player.seekTo(beat.start, true);
			timeoutId = setTimeout(nextBeat, beat.duration);
		}
	}

	init();
}());
