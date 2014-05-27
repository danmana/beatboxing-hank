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
				text.disabled=true;
				beats = splitIntoBeats(text.value);
				console.log(beats);
				nextBeat();
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
	}

	function onPlayerStateChange(event) {
	}

	function splitIntoBeats(str) {
		var i,
		result = [],
		ch;
		for (i = 0; i < str.length; i++) {
			ch = str[i];
			if (ch == 'a') {
				if (i + 1 < str.length && str[i + 1] == 'i') {
					result.push(beat('ai', i, ++i));
				} else {
					result.push(beat('a', i, i));
				}
			} else if (ch == 's') {
				if (i + 1 < str.length && str[i + 1] == 'h') {
					result.push(beat('sh', i, ++i));
				} else {
					result.push(beat('s', i, i));
				}
			} else if (ch == 'c') {
				if (i + 1 < str.length && str[i + 1] == 'h') {
					result.push(beat('ch', i, ++i));
				}
			}else if (phonemes.hasOwnProperty(ch)) {
				result.push(beat(ch, i, i));
			}

		}
		return result;

	}
	
	function beat(ch, iStart, iEnd) {
		return {
			iStart: iStart,
			iEnd: iEnd + 1,
			ch: ch
		};
	}
	
	function endBeats(){
		btn.className = 'play';
		beats = [];
		player.pauseVideo();
		playing = false;
		text.disabled=false;
		text.setSelectionRange(0,0);
		clearTimeout(timeoutId);
	}

	function nextBeat() {
		if (!beats.length) {
			endBeats();
			return;
		}
		var beat = beats.shift(), ph = phonemes[beat.ch];
		text.setSelectionRange(beat.iStart,beat.iEnd);
		if (ph.start == -1) {
			player.pauseVideo();
			timeoutId = setTimeout(function(){
				if (beats.length) {
					nextBeat();
				} else {
					endBeats();
				}
			}, ph.duration);
		} else {
			player.seekTo(ph.start, true);
			player.playVideo();
			timeoutId = setTimeout(nextBeat, ph.duration);
		}
	}

	init();
}());
