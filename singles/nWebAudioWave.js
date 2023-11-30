

	nWebAudio['wave'] = [];

	nWebAudio['wave']['canvas']                 = 'nWebAudioCanvasWave';

	nWebAudio['wave']['config']                 = new Array();
	nWebAudio['wave']['config']['width']        = 550;
	nWebAudio['wave']['config']['height']       =  50;


	document.addEventListener("click", nWebAudio_waveJump, true);


	function nWebAudio_waveJump(myEvent)
	{
		if( myEvent.target.id == nWebAudio['wave']['canvas'] )
		{
			if( nWebAudio['routing']['audioElement'].paused == false )
			{
				nWebAudio['routing']['audioElement'].currentTime = nWebAudio['routing']['audioElement'].duration * ( myEvent.offsetX / document.getElementById(nWebAudio['wave']['canvas']).offsetWidth );
			}
		}
	}


	function nWebAudio_waveDraw(waveFormBuffer)
	{
		nWaveLength       = waveFormBuffer.length;
		nWaveDuration     = waveFormBuffer.duration;
		nWaveSampleRate   = waveFormBuffer.sampleRate;
		nWaveChannelNr    = waveFormBuffer.numberOfChannels;

		nWaveChannel      = waveFormBuffer.getChannelData(0);
		var nCVwvRendLen  = nWaveChannel.length / 1000;

		var nCVwv         = document.getElementById(nWebAudio['wave']['canvas']);
		nCVwv             = nCVwv.getContext('2d');
		nCVwv.strokeStyle = '#00FFFF';
		nCVwv.fillStyle   = '#000000';
		nCVwv.fillRect(0, 0, nWebAudio['wave']['config']['width'], nWebAudio['wave']['config']['height']);
		nCVwv.translate(0,nWebAudio['wave']['config']['height'] / 2);

		for( i = 0; i < nCVwvRendLen; i++ )
		{
			var x = Math.floor( nWebAudio['wave']['config']['width'] * i / nCVwvRendLen );
			var y = nWaveChannel[(i*1000)] * nWebAudio['wave']['config']['height'] / 2;

			nCVwv.beginPath();
			nCVwv.moveTo(x  , 0);
			nCVwv.lineTo(x+1, y);
			nCVwv.stroke();
			nCVwv.closePath();
		}

		nCVwv.translate(0,-(nWebAudio['wave']['config']['height'] / 2));

		numberOfSF = Math.round( nWaveLength / 100000 ) / 10;
	}


	function nWebAudio_waveLoad()
	{
		try
		{
			audioCtxFile = new AudioContext();

			var request              = new XMLHttpRequest();
			    request.open('GET', nWebAudio['routing']['audioElement'].src, true);
			    request.responseType = 'arraybuffer';
			    request.onload       = function()
			    {
				audioCtxFile.decodeAudioData(request.response, function(buffer)
				{
					nWaveFormBuffer = buffer;
					nWebAudio_waveDraw(nWaveFormBuffer);
				}, onDecodeError);
			    }
			    request.send();
		} catch(e)
		  {
			console.log(e);
		  }
	}
	function onDecodeError() { alert('Kann Datei nicht lesen.'); }


	document.onload = window.setTimeout("nWebAudio_waveLoad()", 250);

