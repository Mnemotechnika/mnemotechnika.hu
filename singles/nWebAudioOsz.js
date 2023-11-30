

	// Konfiguration
	// =============
	nWebAudio['osz'] = [];

	nWebAudio['osz']['canvas']                 = 'nWebAudioCanvasOsz';
	nWebAudio['osz']['delay']                  = 50;

	nWebAudio['osz']['config']                 = new Array();
	nWebAudio['osz']['config']['width']        = 250;
	nWebAudio['osz']['config']['height']       = 100;
	nWebAudio['osz']['config']['color']        = '#00FFFF';
	nWebAudio['osz']['config']['randLinks']    = 7;
	nWebAudio['osz']['config']['randRechts']   = 5;
	nWebAudio['osz']['config']['randOben']     = 5;
	nWebAudio['osz']['config']['randUnten']    = 5;
	nWebAudio['osz']['config']['balkenWidth']  = 7;
	nWebAudio['osz']['config']['balkenHeight'] = 90;
	nWebAudio['osz']['config']['balkenSpace']  = 3;

	nWebAudio['osz']['timer'];


	function nWebAudio_oszRun()
	{
		if( nWebAudio['routing']['audioElement'].paused == false )
		{
			// Frequenzdaten ins Daten-Array laden
			// ===================================
			nWebAudio['routing']['analyser_freq'].getByteTimeDomainData(nWebAudio['routing']['oszDataArray']);
		} else
		  {
			nWebAudio['routing']['oszDataArray'].fill(128);
		  }

		// Canvas zeichnen
		// ===============
		var nCVFreq = document.getElementById(nWebAudio['osz']['canvas']);
		if( nCVFreq.getContext )
		{
			nCVFreq             = nCVFreq.getContext('2d');

			nCVFreq.fillStyle   = '#000000';
			nCVFreq.clearRect(0, 0, nWebAudio['osz']['config']['width'], nWebAudio['osz']['config']['height']);
			nCVFreq.fillRect( 0, 0, nWebAudio['osz']['config']['width'], nWebAudio['osz']['config']['height']);

			// Rastergitter
			// ============
			nCVFreq.strokeStyle = '#505050';
			nCVFreq.beginPath();

			nCVFreq.moveTo(0,                                   16);
			nCVFreq.lineTo(nWebAudio['osz']['config']['width'], 16);
			nCVFreq.moveTo(0,                                   33);
			nCVFreq.lineTo(nWebAudio['osz']['config']['width'], 33);
			nCVFreq.moveTo(0,                                   50);
			nCVFreq.lineTo(nWebAudio['osz']['config']['width'], 50);
			nCVFreq.moveTo(0,                                   67);
			nCVFreq.lineTo(nWebAudio['osz']['config']['width'], 67);
			nCVFreq.moveTo(0,                                   84);
			nCVFreq.lineTo(nWebAudio['osz']['config']['width'], 84);

			for( vl = 1; vl < 16; vl ++)
			{
				nextX = ( 16 * vl ) - 3;
				nCVFreq.moveTo(nextX, 0);
				nCVFreq.lineTo(nextX, nWebAudio['osz']['config']['height']);
			}
			nCVFreq.stroke();
			nCVFreq.closePath();

			nCVFreq.strokeStyle = nWebAudio['osz']['config']['color'];

			var sliceWidth = nWebAudio['osz']['config']['width'] * 1.0 / nWebAudio['routing']['oszArraySize'];
			var x = 0;

			nCVFreq.beginPath();

			// Alle Datenpunkte zu einer Linie verbinden
			// =========================================
			for( var i = 0; i < nWebAudio['routing']['oszArraySize']; i++)
			{
				var v = nWebAudio['routing']['oszDataArray'][i] / 128.0;
				var y = v * nWebAudio['osz']['config']['height'] / 2;

				if( i === 0 )
				{
					nCVFreq.moveTo(x, y);
				} else
				  {
					nCVFreq.lineTo(x, y);
				  }

				x += sliceWidth;
			}

			nCVFreq.stroke();
			nCVFreq.closePath();
		}

		nWebAudio['frequenz']['timer'] = window.setTimeout("nWebAudio_oszRun()", nWebAudio['osz']['delay']);
	}


	document.onload = window.setTimeout("nWebAudio_oszRun()", 250);

