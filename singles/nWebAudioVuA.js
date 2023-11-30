

	// Konfiguration
	// =============
	nWebAudio['vua'] = [];

	nWebAudio['vua']['canvas']                 = 'nWebAudioCanvasVuA';	// ID des <canvas>-Elements
	nWebAudio['vua']['delay']                  = 50;			// Programmgeschwindigkeit

	nWebAudio['vua']['config']                 = new Array();
	nWebAudio['vua']['config']['channel']      = 's';			// Angezeiigter Kanal: l = links, r = rechts, s = summiert

	nWebAudio['vua']['rpX']                    = 0;
	nWebAudio['vua']['rpY']                    = 0;
	nWebAudio['vua']['letzterWinkel']          = 225;

	nWebAudio['vua']['vuAnaCtx'];
	nWebAudio['vua']['timer'];


	function nWebAudio_vuaRun()
	{
		if( nWebAudio['routing']['audioElement'].paused == false )
		{
			if( typeof(nWebAudio['vud']) === 'undefined' )
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
			}
		} else
		  {
			nVuAvgLeft   = 0;
			nVuAvgRight  = 0;
			nVuAvgCommon = 0;
		  }

		// Canvas zeichnen
		// ===============
		var vuAnaCtx = document.getElementById(nWebAudio['vua']['canvas']);
		if( vuAnaCtx.getContext )
		{
			// Kanalauswahl
			// ============
			if( nWebAudio['vua']['config']['channel'] == 'l' )
			{
				useInput = nVuAvgLeft;
			} else
			if( nWebAudio['vua']['config']['channel'] == 'r' )
			{
				useInput = nVuAvgRight;
			} else
			  {
				useInput = nVuAvgCommon;
			  }

			nWebAudio['vua']['rpX'] = 125 / 2;
			nWebAudio['vua']['rpY'] =  80 + 8;

			vuAnaCtx      = vuAnaCtx.getContext('2d');

			// Hintergrund
			// ===========
			vuAnaCtx.font = '7px Verdana';
			vuAnaCtx.clearRect(0, 0, 125, 80);
			vuAnaCtx.fillStyle = '#F5F5DC';
			vuAnaCtx.fillRect( 0, 0, 125, 80);

			// Beleuchtung
			// ===========
			var grd = vuAnaCtx.createRadialGradient(62, 80, 35, 62, 80, 38);
			grd.addColorStop(0, 'khaki');
			grd.addColorStop(1, '#F5F5DC');
			vuAnaCtx.fillStyle   = grd;
			vuAnaCtx.strokeStyle = '#F5F5DC';
			vuAnaCtx.arc(62, 80, 70, 0, 2*Math.PI, false);
			vuAnaCtx.stroke();
			vuAnaCtx.fill();

			vuAnaCtx.fillStyle = '#505050';
			vuAnaCtx.fillRect( 0, 80-15, 125, 15);

			// Abdeckung
			// =========
			vuAnaCtx.beginPath();
			vuAnaCtx.lineWidth   = 1;
			vuAnaCtx.fillStyle   = '#808080';
			vuAnaCtx.strokeStyle = '#808080';
			vuAnaCtx.arc(nWebAudio['vua']['rpX'], nWebAudio['vua']['rpY'], 32, nGradToRadial(225), nGradToRadial(315), false);
			vuAnaCtx.stroke();
			vuAnaCtx.closePath();
			vuAnaCtx.fill();

			// Untere Skala
			// ============
			vuAnaCtx.beginPath();
			vuAnaCtx.lineWidth   = 1;
			vuAnaCtx.strokeStyle = '#000000';
			vuAnaCtx.arc(nWebAudio['vua']['rpX'], nWebAudio['vua']['rpY'], 60, nGradToRadial(225), nGradToRadial(290), false);
			vuAnaCtx.stroke();

			// Obere Skala
			// ===========
			vuAnaCtx.beginPath();
			vuAnaCtx.lineWidth   = 1;
			vuAnaCtx.strokeStyle = '#000000';
			vuAnaCtx.arc(nWebAudio['vua']['rpX'], nWebAudio['vua']['rpY'], 64, nGradToRadial(225), nGradToRadial(290), false);
			vuAnaCtx.stroke();

			// Rote Skala
			// ==========
			vuAnaCtx.beginPath();
			vuAnaCtx.lineWidth   = 5;
			vuAnaCtx.strokeStyle = '#FF0000';
			vuAnaCtx.arc(nWebAudio['vua']['rpX'], nWebAudio['vua']['rpY'], 62, nGradToRadial(290), nGradToRadial(315), false);
			vuAnaCtx.stroke();
			vuAnaCtx.closePath();

			// Skalenstriche mit Beschriftungen
			// ================================
			strokeSkaleLine(vuAnaCtx, 225, 64, 68, 1, '#000000', 1, '');
			strokeSkaleLine(vuAnaCtx, 228, 64, 72, 1, '#000000', 1, '-20');
			strokeSkaleLine(vuAnaCtx, 238, 64, 72, 1, '#000000', 1, '-10');
			strokeSkaleLine(vuAnaCtx, 248, 64, 72, 1, '#000000', 1, '-7');
			strokeSkaleLine(vuAnaCtx, 258, 64, 72, 1, '#000000', 1, '-5');
			strokeSkaleLine(vuAnaCtx, 268, 64, 72, 1, '#000000', 1, '-3');
			strokeSkaleLine(vuAnaCtx, 275, 64, 72, 1, '#000000', 1, '-2');
			strokeSkaleLine(vuAnaCtx, 283, 64, 72, 1, '#000000', 1, '-1');
			strokeSkaleLine(vuAnaCtx, 290, 64, 72, 1, '#FF0000', 1, '0');
			strokeSkaleLine(vuAnaCtx, 297, 64, 72, 1, '#FF0000', 1, '+1');
			strokeSkaleLine(vuAnaCtx, 305, 64, 72, 1, '#FF0000', 1, '+2');
			strokeSkaleLine(vuAnaCtx, 315, 64, 72, 1, '#FF0000', 1, '+3');

			strokeSkaleLine(vuAnaCtx, 225, 56, 60, 1, '#000000', 0,   '%');
			strokeSkaleLine(vuAnaCtx, 238, 56, 60, 1, '#000000', 0,  '20');
			strokeSkaleLine(vuAnaCtx, 251, 56, 60, 1, '#000000', 0,  '40');
			strokeSkaleLine(vuAnaCtx, 264, 56, 60, 1, '#000000', 0,  '60');
			strokeSkaleLine(vuAnaCtx, 277, 56, 60, 1, '#000000', 0,  '80');
			strokeSkaleLine(vuAnaCtx, 290, 56, 60, 1, '#000000', 0, '100');

			vuAnaCtx.font      = '10px Verdana';
			vuAnaCtx.fillText('dB',   3, 60);
			vuAnaCtx.fillText('VU', 107, 60);

			myText        = 'LEFT / RIGHT';
			vuAnaCtx.fillStyle = '#F5F5DC';
			vuAnaCtx.font      = '10px Verdana';
			vuAnaCtx.fillText(myText, nWebAudio['vua']['rpX'] - ( vuAnaCtx.measureText(myText).width / 2 ), 76);

			// Nadel mit künstlicher Trägheit (max. Gradänderung pro Funktionsaufruf)
			// ======================================================================
			maxGrad = 2;

			if( useInput == -1 )
			{
				useInput = 0;
				alpha    = 225 + ( ( 290 - 225 ) * ( useInput / 100 ) );
			} else
			  {
				alpha    = 225 + ( ( 290 - 225 ) * ( useInput / 100 ) );
				if( alpha >   ( nWebAudio['vua']['letzterWinkel'] + maxGrad ) )
				{
					alpha = nWebAudio['vua']['letzterWinkel'] + maxGrad;
				} else
				if( alpha <   ( nWebAudio['vua']['letzterWinkel'] - maxGrad ) )
				{
					alpha = nWebAudio['vua']['letzterWinkel'] - maxGrad;
				}
			  }

			nWebAudio['vua']['letzterWinkel'] = alpha;
			strokeSkaleLine(vuAnaCtx, alpha, 32, 75, 1, '#000000', 1, '');
		}

		nWebAudio['frequenz']['timer'] = window.setTimeout("nWebAudio_vuaRun()", nWebAudio['vua']['delay']);
	}


	// Einen Skalenstrich mit ev. zugehörigem Text zeichnen
	// ****************************************************
	function strokeSkaleLine(vuAnaCtx, angle, radius_start, radius_end, width, color, textPos, text)
	{
		vuAnaCtx.beginPath();
		vuAnaCtx.lineWidth   = width;
		vuAnaCtx.strokeStyle = color;
		vuAnaCtx.fillStyle   = color;

		// Start- und Zielpunkte abhängig vom Ausschlagswinkel ermitteln
		// =============================================================
		StartPunktX          = nRadPxToCosinus(nGradToRadial(angle), radius_start);
		StartPunktY          = nRadPxToSinus(  nGradToRadial(angle), radius_start);

		EndPunktX            = nRadPxToCosinus(nGradToRadial(angle), radius_end);
		EndPunktY            = nRadPxToSinus(  nGradToRadial(angle), radius_end);

		vuAnaCtx.moveTo(nWebAudio['vua']['rpX'] + StartPunktX, nWebAudio['vua']['rpY'] + StartPunktY );
		vuAnaCtx.lineTo(nWebAudio['vua']['rpX'] + EndPunktX,   nWebAudio['vua']['rpY'] + EndPunktY );

		vuAnaCtx.stroke();
		vuAnaCtx.closePath();

		// GGf. Textposition ermitteln
		// ===========================
		if( text != '' )
		{
			if( textPos == 0 )
			{
				textX = nRadPxToCosinus(nGradToRadial(angle), radius_start-7);
				textY = nRadPxToSinus(  nGradToRadial(angle), radius_start-7);
			} else
			  {
				textX = nRadPxToCosinus(nGradToRadial(angle), radius_end+7);
				textY = nRadPxToSinus(  nGradToRadial(angle), radius_end+7);
			  }

			tl    = vuAnaCtx.measureText(text).width;
			vuAnaCtx.fillText(text, (nWebAudio['vua']['rpX']+(textX-(0.5*tl))), (nWebAudio['vua']['rpY']+textY+3));
		}
	}


	// Diverse Hilfsfunktionen zur Umrechnnug zwischen Grad und Bogenmaß
	// *****************************************************************

	function nGradToRadial(grad)
	{
		bogen = grad * 2 * Math.PI / 360;
		return bogen;
	}


	function nRadPxToSinus(radial, radius)
	{
		return ( Math.sin(radial) * radius );
	}


	function nRadPxToCosinus(radial, radius)
	{
		return ( Math.cos(radial) * radius );
	}


	document.onload = window.setTimeout("nWebAudio_vuaRun()", 250);

