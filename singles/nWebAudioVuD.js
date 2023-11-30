

	// Konfiguration
	// =============
	nWebAudio['vud'] = [];

	nWebAudio['vud']['canvas']                 = 'nWebAudioCanvasVuD';	// ID des <canvas>-Elements
	nWebAudio['vud']['delay']                  = 50;			// Programmgeschwindigkeit

	// Größeneinstellungen
	// -------------------
	nWebAudio['vud']['config']                 = new Array();
	nWebAudio['vud']['config']['width']        = 170;
	nWebAudio['vud']['config']['height']       = 60;
	nWebAudio['vud']['config']['randLinks']    = 15;
	nWebAudio['vud']['config']['randRechts']   = 5;
	nWebAudio['vud']['config']['randOben']     = 14;
	nWebAudio['vud']['config']['randUnten']    = 14;
	nWebAudio['vud']['config']['abstandMitte'] = 22;
	nWebAudio['vud']['config']['balkenWidth']  = 7;
	nWebAudio['vud']['config']['balkenHeight'] = 5;
	nWebAudio['vud']['config']['balkenSpace']  = 2;

	nWebAudio['vud']['timer'];


	function nWebAudio_vudRun()
	{
		if( nWebAudio['routing']['audioElement'].paused == false )
		{
			// Audiodaten ins Daten-Array laden
			// ================================
			 nWebAudio['routing']['analyser_left'].getByteTimeDomainData(nWebAudio['routing']['vuDataArrLeft']);
			nWebAudio['routing']['analyser_right'].getByteTimeDomainData(nWebAudio['routing']['vuDataArrRight']);

			// Linker Kanal
			// ============
			    avg  = Math.avg( nWebAudio['routing']['vuDataArrLeft'] );
			if( avg >= 128 )
			{
				freqPeak    = Math.max.apply(null, nWebAudio['routing']['vuDataArrLeft']);
				valuePeak   = freqPeak - 128;
				nVuAvgLeft  = ( valuePeak > 0 ) ? ( valuePeak / 128 * 100 ) : 0;
			} else
			  {
				freqPeak    = Math.min.apply(null, nWebAudio['routing']['vuDataArrLeft']);
				valuePeak   = 128 - freqPeak;
				nVuAvgLeft  = ( valuePeak > 0 ) ? ( valuePeak / 128 * 100 ) : 0;
			  }

			// Rechter Kanal
			// =============
			    avg  = Math.avg( nWebAudio['routing']['vuDataArrRight'] );
			if( avg >= 128 )
			{
				freqPeak    = Math.max.apply(null, nWebAudio['routing']['vuDataArrRight']);
				valuePeak   = freqPeak - 128;
				nVuAvgRight = ( valuePeak > 0 ) ? ( valuePeak / 128 * 100 ) : 0;
			} else
			  {
				freqPeak    = Math.min.apply(null, nWebAudio['routing']['vuDataArrRight']);
				valuePeak   = 128 - freqPeak;
				nVuAvgRight = ( valuePeak > 0 ) ? ( valuePeak / 128 * 100 ) : 0;
			  }

			// Summierter Kanal als Mittelwert
			// ===============================
			nVuAvgCommon = Math.round( ( nVuAvgLeft + nVuAvgRight ) / 2 );
		} else
		  {
			nVuAvgLeft   = 0;
			nVuAvgRight  = 0;
			nVuAvgCommon = 0;
		  }

		// Canvas zeichnen
		// ===============
		var nCVFreq = document.getElementById(nWebAudio['vud']['canvas']);
		if( nCVFreq.getContext )
		{
			nCVFreq           = nCVFreq.getContext('2d');

			// Hintergrund
			// ===========
			nCVFreq.fillStyle = '#000000';
			nCVFreq.clearRect(0, 0, nWebAudio['vud']['config']['width'], nWebAudio['vud']['config']['height']);
			nCVFreq.fillRect( 0, 0, nWebAudio['vud']['config']['width'], nWebAudio['vud']['config']['height']);

			// Beschriftungen
			// ==============
			nCVFreq.font      = 'normal 10px Arial,sans-serif';
			nCVFreq.fillStyle = '#00FFFF';
			nCVFreq.fillText('L', 4, 20);
			nCVFreq.fillText('R', 4, 48);

			nCVFreq.font      = 'normal 9px Arial,sans-serif';
			nCVFreq.fillText('-20', 14, 34);
			nCVFreq.fillText('-10', 30, 34);
			nCVFreq.fillText('-7',  48, 34);
			nCVFreq.fillText('-5',  62, 34);
			nCVFreq.fillText('-3',  76, 34);
			nCVFreq.fillText('-2',  90, 34);
			nCVFreq.fillText('-1', 104, 34);
			nCVFreq.fillText('0',  120, 34);
			nCVFreq.fillText('1',  132, 34);
			nCVFreq.fillText('2',  142, 34);
			nCVFreq.fillText('3',  152, 34);

			for( h = 0; h < 16; h++ )
			{
				myValue = 6.25 * h;	// Alle 16 LED's
				myValue = 7.50 * h;	// Nur bis zur ersten roten LED

				// Linker Kanal
				// ============
				if( nVuAvgLeft > myValue )
				{
					if( nVuAvgLeft > ( 6.25 * 13 ) && h > 12 )
					{
						nCVFreq.fillStyle = '#FF0000';
					} else
					if( nVuAvgLeft > ( 6.25 * 10 ) && h > 9 )
					{
						nCVFreq.fillStyle = '#FFFF00';
					} else
					  {
						nCVFreq.fillStyle = '#00FF00';
					  }
				} else
				  {
					nCVFreq.fillStyle = '#303030';
				  }
				nCVFreq.fillRect( nWebAudio['vud']['config']['randLinks'] + ( h * ( nWebAudio['vud']['config']['balkenWidth'] + nWebAudio['vud']['config']['balkenSpace'] ) ), nWebAudio['vud']['config']['randOben'], nWebAudio['vud']['config']['balkenWidth'], nWebAudio['vud']['config']['balkenHeight']);

				// Rechter Kanal
				// =============
				if( nVuAvgRight > myValue )
				{
					if( nVuAvgRight > ( 6.25 * 13 ) && h > 12 )
					{
						nCVFreq.fillStyle = '#FF0000';
					} else
					if( nVuAvgRight > ( 6.25 * 10 ) && h > 9 )
					{
						nCVFreq.fillStyle = '#FFFF00';
					} else
					  {
						nCVFreq.fillStyle = '#00FF00';
					  }
				} else
				  {
					nCVFreq.fillStyle = '#303030';
				  }
				nCVFreq.fillRect( nWebAudio['vud']['config']['randLinks'] + ( h * ( nWebAudio['vud']['config']['balkenWidth'] + nWebAudio['vud']['config']['balkenSpace'] ) ), ( nWebAudio['vud']['config']['randOben']+nWebAudio['vud']['config']['balkenWidth']+nWebAudio['vud']['config']['abstandMitte'] ), nWebAudio['vud']['config']['balkenWidth'], nWebAudio['vud']['config']['balkenHeight']);
			}
		}

		nWebAudio['frequenz']['timer'] = window.setTimeout("nWebAudio_vudRun()", nWebAudio['vud']['delay']);
	}


	document.onload = window.setTimeout("nWebAudio_vudRun()", 250);

