

	// Konfiguration
	// =============
	nWebAudio['frequenz'] = [];

	nWebAudio['frequenz']['canvas']                 = 'nWebAudioCanvasFreq';
	nWebAudio['frequenz']['delay']                  = 50;

	// Größeneinstellungen
	// -------------------
	nWebAudio['frequenz']['config']                 = new Array();
	nWebAudio['frequenz']['config']['width']        = 250;
	nWebAudio['frequenz']['config']['height']       = 100;
	nWebAudio['frequenz']['config']['randLinks']    = 7;
	nWebAudio['frequenz']['config']['randRechts']   = 5;
	nWebAudio['frequenz']['config']['randOben']     = 5;
	nWebAudio['frequenz']['config']['randUnten']    = 5;
	nWebAudio['frequenz']['config']['balkenWidth']  = 7;
	nWebAudio['frequenz']['config']['balkenHeight'] = 90;
	nWebAudio['frequenz']['config']['balkenSpace']  = 3;

	// Anzeigemodus Startwert - Der Index (0) kann geändert werden
	// -----------------------------------------------------------
	nWebAudio['frequenz']['anzeigen']               = new Array('normal', 'peak', 'points', 'upside', 'rain', 'mirror', 'gap', 'horizont', 'bright');
	nWebAudio['frequenz']['anzeige']                = nWebAudio['frequenz']['anzeigen'][0];

	// Farbe Startwert - Der Index (0) kann geändert werden
	// ----------------------------------------------------
	nWebAudio['frequenz']['colors']                 = new Array('#00FFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#FFFFFF', '#000000');
	nWebAudio['frequenz']['color']                  = nWebAudio['frequenz']['colors'][0];

	nWebAudio['frequenz']['data']                   = new Array(24);
	nWebAudio['frequenz']['proz']                   = new Array(24);

	nWebAudio['frequenz']['preHold']                = new Array(24);
	nWebAudio['frequenz']['preHold'].fill(0);

	nWebAudio['frequenz']['preData']                = new Array(24);
	nWebAudio['frequenz']['preData'].fill(0);

	nWebAudio['frequenz']['prePause']               = 8;
	nWebAudio['frequenz']['preWait']                = 2;
	nWebAudio['frequenz']['preLoops']               = 0;

	nWebAudio['frequenz']['timer'];


	// Anzeigemodi durchschalten
	// *************************
	function nWebAudio_freqViewMode()
	{
		viewPos                          = nWebAudio['frequenz']['anzeigen'].indexOf(nWebAudio['frequenz']['anzeige']);
		nWebAudio['frequenz']['anzeige'] = ( viewPos < ( nWebAudio['frequenz']['anzeigen'].length -1 ) ) ? nWebAudio['frequenz']['anzeigen'][(viewPos+1)] : nWebAudio['frequenz']['anzeigen'][0];

		document.getElementById(nWebAudio['frequenz']['canvas']).title = 'Anzeigemodus: '+nWebAudio['frequenz']['anzeige'].substring(0, 1).toUpperCase() + nWebAudio['frequenz']['anzeige'].substring(1);
	}


	// Farben durchschalten
	// ********************
	function nWebAudio_freqColorMode()
	{
		viewPos                        = nWebAudio['frequenz']['colors'].indexOf(nWebAudio['frequenz']['color']);
		nWebAudio['frequenz']['color'] = ( viewPos < ( nWebAudio['frequenz']['colors'].length -1 ) ) ? nWebAudio['frequenz']['colors'][(viewPos+1)] : nWebAudio['frequenz']['color'][0];
	}


	function nWebAudio_freqRun()
	{
		if( nWebAudio['routing']['audioElement'].paused == false )
		{
			// Audiodaten ins Daten-Array laden
			// ================================
			nWebAudio['routing']['analyser_freq'].getByteFrequencyData(nWebAudio['routing']['freqDataArray']);

			// Balkenwerte aus dem Frequenzband auslesen
			// =========================================
			nWebAudio['frequenz']['proz'][0]  = nWebAudio['routing']['freqDataArray'][2]    / 255 * 100;
			nWebAudio['frequenz']['proz'][1]  = nWebAudio['routing']['freqDataArray'][4]    / 255 * 100;
			nWebAudio['frequenz']['proz'][2]  = nWebAudio['routing']['freqDataArray'][6]    / 255 * 100;
			nWebAudio['frequenz']['proz'][3]  = nWebAudio['routing']['freqDataArray'][8]    / 255 * 100;
			nWebAudio['frequenz']['proz'][4]  = nWebAudio['routing']['freqDataArray'][10]   / 255 * 100;
			nWebAudio['frequenz']['proz'][5]  = nWebAudio['routing']['freqDataArray'][20]   / 255 * 100;
			nWebAudio['frequenz']['proz'][6]  = nWebAudio['routing']['freqDataArray'][40]   / 255 * 100;
			nWebAudio['frequenz']['proz'][7]  = nWebAudio['routing']['freqDataArray'][60]   / 255 * 100;
			nWebAudio['frequenz']['proz'][8]  = nWebAudio['routing']['freqDataArray'][80]   / 255 * 100;
			nWebAudio['frequenz']['proz'][9]  = nWebAudio['routing']['freqDataArray'][100]  / 255 * 100;
			nWebAudio['frequenz']['proz'][10] = nWebAudio['routing']['freqDataArray'][120]  / 255 * 100;
			nWebAudio['frequenz']['proz'][11] = nWebAudio['routing']['freqDataArray'][140]  / 255 * 100;
			nWebAudio['frequenz']['proz'][12] = nWebAudio['routing']['freqDataArray'][160]  / 255 * 100;
			nWebAudio['frequenz']['proz'][13] = nWebAudio['routing']['freqDataArray'][180]  / 255 * 100;
			nWebAudio['frequenz']['proz'][14] = nWebAudio['routing']['freqDataArray'][200]  / 255 * 100;
			nWebAudio['frequenz']['proz'][15] = nWebAudio['routing']['freqDataArray'][240]  / 255 * 100;
			nWebAudio['frequenz']['proz'][16] = nWebAudio['routing']['freqDataArray'][320]  / 255 * 100;
			nWebAudio['frequenz']['proz'][17] = nWebAudio['routing']['freqDataArray'][400]  / 255 * 100;
			nWebAudio['frequenz']['proz'][18] = nWebAudio['routing']['freqDataArray'][480]  / 255 * 100;
			nWebAudio['frequenz']['proz'][19] = nWebAudio['routing']['freqDataArray'][560]  / 255 * 100;
			nWebAudio['frequenz']['proz'][20] = nWebAudio['routing']['freqDataArray'][640]  / 255 * 100;
			nWebAudio['frequenz']['proz'][21] = nWebAudio['routing']['freqDataArray'][720]  / 255 * 100;
			nWebAudio['frequenz']['proz'][22] = nWebAudio['routing']['freqDataArray'][780]  / 255 * 100;
			nWebAudio['frequenz']['proz'][23] = nWebAudio['routing']['freqDataArray'][840]  / 255 * 100;
		} else
		  {
			nWebAudio['frequenz']['proz'].fill(0);
		  }

		// Canvas zeichnen
		// ===============
		var nCVFreq = document.getElementById(nWebAudio['frequenz']['canvas']);
		if( nCVFreq.getContext )
		{
			nCVFreq           = nCVFreq.getContext('2d');

			nCVFreqData       = new Array(24);

			nCVFreq.fillStyle = '#000000';
			nCVFreq.clearRect(0, 0, nWebAudio['frequenz']['config']['width'], nWebAudio['frequenz']['config']['height']);
			nCVFreq.fillRect( 0, 0, nWebAudio['frequenz']['config']['width'], nWebAudio['frequenz']['config']['height']);

			// Linear-Gradient bei Farbauswahl '#FFFFFF'
			// =========================================
			var grd = nCVFreq.createLinearGradient(0,0,0,nWebAudio['frequenz']['config']['balkenHeight']);
			    grd.addColorStop(0,     'rgb('+nWebAudio['rainbow'][0][0] +','+nWebAudio['rainbow'][0][1] +','+nWebAudio['rainbow'][0][2]+')');
			    grd.addColorStop(0.042, 'rgb('+nWebAudio['rainbow'][1][0] +','+nWebAudio['rainbow'][1][1] +','+nWebAudio['rainbow'][1][2]+')');
			    grd.addColorStop(0.084, 'rgb('+nWebAudio['rainbow'][2][0] +','+nWebAudio['rainbow'][2][1] +','+nWebAudio['rainbow'][2][2]+')');
			    grd.addColorStop(0.126, 'rgb('+nWebAudio['rainbow'][3][0] +','+nWebAudio['rainbow'][3][1] +','+nWebAudio['rainbow'][3][2]+')');
			    grd.addColorStop(0.168, 'rgb('+nWebAudio['rainbow'][4][0] +','+nWebAudio['rainbow'][4][1] +','+nWebAudio['rainbow'][4][2]+')');
			    grd.addColorStop(0.210, 'rgb('+nWebAudio['rainbow'][5][0] +','+nWebAudio['rainbow'][5][1] +','+nWebAudio['rainbow'][5][2]+')');
			    grd.addColorStop(0.252, 'rgb('+nWebAudio['rainbow'][6][0] +','+nWebAudio['rainbow'][6][1] +','+nWebAudio['rainbow'][6][2]+')');
			    grd.addColorStop(0.294, 'rgb('+nWebAudio['rainbow'][7][0] +','+nWebAudio['rainbow'][7][1] +','+nWebAudio['rainbow'][7][2]+')');
			    grd.addColorStop(0.336, 'rgb('+nWebAudio['rainbow'][8][0] +','+nWebAudio['rainbow'][8][1] +','+nWebAudio['rainbow'][8][2]+')');
			    grd.addColorStop(0.378, 'rgb('+nWebAudio['rainbow'][9][0] +','+nWebAudio['rainbow'][9][1] +','+nWebAudio['rainbow'][9][2]+')');
			    grd.addColorStop(0.420, 'rgb('+nWebAudio['rainbow'][10][0]+','+nWebAudio['rainbow'][10][1]+','+nWebAudio['rainbow'][10][2]+')');
			    grd.addColorStop(0.462, 'rgb('+nWebAudio['rainbow'][11][0]+','+nWebAudio['rainbow'][11][1]+','+nWebAudio['rainbow'][11][2]+')');
			    grd.addColorStop(0.504, 'rgb('+nWebAudio['rainbow'][12][0]+','+nWebAudio['rainbow'][12][1]+','+nWebAudio['rainbow'][12][2]+')');
			    grd.addColorStop(0.546, 'rgb('+nWebAudio['rainbow'][13][0]+','+nWebAudio['rainbow'][13][1]+','+nWebAudio['rainbow'][13][2]+')');
			    grd.addColorStop(0.588, 'rgb('+nWebAudio['rainbow'][14][0]+','+nWebAudio['rainbow'][14][1]+','+nWebAudio['rainbow'][14][2]+')');
			    grd.addColorStop(0.630, 'rgb('+nWebAudio['rainbow'][15][0]+','+nWebAudio['rainbow'][15][1]+','+nWebAudio['rainbow'][15][2]+')');
			    grd.addColorStop(0.672, 'rgb('+nWebAudio['rainbow'][16][0]+','+nWebAudio['rainbow'][16][1]+','+nWebAudio['rainbow'][16][2]+')');
			    grd.addColorStop(0.714, 'rgb('+nWebAudio['rainbow'][17][0]+','+nWebAudio['rainbow'][17][1]+','+nWebAudio['rainbow'][17][2]+')');
			    grd.addColorStop(0.756, 'rgb('+nWebAudio['rainbow'][18][0]+','+nWebAudio['rainbow'][18][1]+','+nWebAudio['rainbow'][18][2]+')');
			    grd.addColorStop(0.798, 'rgb('+nWebAudio['rainbow'][19][0]+','+nWebAudio['rainbow'][19][1]+','+nWebAudio['rainbow'][19][2]+')');
			    grd.addColorStop(0.840, 'rgb('+nWebAudio['rainbow'][20][0]+','+nWebAudio['rainbow'][20][1]+','+nWebAudio['rainbow'][20][2]+')');
			    grd.addColorStop(0.882, 'rgb('+nWebAudio['rainbow'][21][0]+','+nWebAudio['rainbow'][21][1]+','+nWebAudio['rainbow'][21][2]+')');
			    grd.addColorStop(0.924, 'rgb('+nWebAudio['rainbow'][22][0]+','+nWebAudio['rainbow'][22][1]+','+nWebAudio['rainbow'][22][2]+')');
			    grd.addColorStop(1,     'rgb('+nWebAudio['rainbow'][23][0]+','+nWebAudio['rainbow'][23][1]+','+nWebAudio['rainbow'][23][2]+')');

			for( h = 0; h < 24; h++ )
			{
				nCVFreq.fillStyle = '#303030';
				nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ), nWebAudio['frequenz']['config']['randOben'], nWebAudio['frequenz']['config']['balkenWidth'], nWebAudio['frequenz']['config']['balkenHeight']);

				// Farbauswahl
				// ===========
				if( nWebAudio['frequenz']['color'] == '#FFFFFF' )
				{
					nCVFreq.fillStyle = 'rgb('+nWebAudio['rainbow'][h][0]+','+nWebAudio['rainbow'][h][1]+','+nWebAudio['rainbow'][h][2]+')';
				} else
				if( nWebAudio['frequenz']['color'] == '#000000' )
				{
					nCVFreq.fillStyle = grd;
				} else
				  {
					nCVFreq.fillStyle = nWebAudio['frequenz']['color'];
				  }

				// Balkenhöhe in %
				// ===============
				cvProz            = nWebAudio['frequenz']['proz'][h];
				cvProz            = ( cvProz <   0 ) ?   0 : cvProz;
				cvProz            = ( cvProz > 100 ) ? 100 : cvProz;
				nCVFreqData[h]    = nWebAudio['frequenz']['config']['balkenHeight'] * cvProz / 100;

				// Peaks vorbereiten
				// =================
				if( nCVFreqData[h] >= nWebAudio['frequenz']['preData'][h] )
				{
					// Aktualwert größer als letzter => kein sichtbarer Peak (hochschieben)
					// --------------------------------------------------------------------
					nWebAudio['frequenz']['preData'][h] = nCVFreqData[h];

					// Haltepunkt aktivieren
					// ---------------------
					nWebAudio['frequenz']['preHold'][h] = nWebAudio['frequenz']['prePause'];
				} else
				  {
					// Aktualwert kleiner als letzter => sichtbarer Peak
					// -------------------------------------------------
					if( nWebAudio['frequenz']['preLoops'] == 0 )
					{
						if( nWebAudio['frequenz']['preHold'][h] == 0 )
						{
							// Alle x Loops ein Etage absenken, wenn Haltezeit abgelaufen ist
							// --------------------------------------------------------------
							nWebAudio['frequenz']['preData'][h] = ( nWebAudio['frequenz']['anzeige'] == 'rain' ) ? nWebAudio['frequenz']['preData'][h] + 3 : nWebAudio['frequenz']['preData'][h] - 3;
							nWebAudio['frequenz']['preData'][h] = ( nWebAudio['frequenz']['preData'][h] < 3 ) ? 0 : nWebAudio['frequenz']['preData'][h];
						}

						// Haltezeiten ablaufen lassen
						// ---------------------------
						nWebAudio['frequenz']['preHold'][h] -= 1;
						nWebAudio['frequenz']['preHold'][h]  = ( nWebAudio['frequenz']['preHold'][h] < 0 ) ? 0 : nWebAudio['frequenz']['preHold'][h];
					}
				  }

				// Peaks steigend anzeigen
				// =======================
				if( nWebAudio['frequenz']['anzeige'] == 'peak' && nWebAudio['frequenz']['preData'][h] > 3 )
				{
					nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ), nWebAudio['frequenz']['config']['randOben'] + ( nWebAudio['frequenz']['config']['balkenHeight'] - nWebAudio['frequenz']['preData'][h] ), nWebAudio['frequenz']['config']['balkenWidth'], 3);
				}

				// Peaks fallend anzeigen
				// ======================
				if( nWebAudio['frequenz']['anzeige'] == 'rain' )
				{
					nWebAudio['frequenz']['preData'][h] = ( nWebAudio['frequenz']['preData'][h] > ( nWebAudio['frequenz']['config']['balkenHeight'] - 3 ) ) ? 0 : nWebAudio['frequenz']['preData'][h];
					if( nWebAudio['frequenz']['preData'][h] > 3 )
					{
						nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ), nWebAudio['frequenz']['config']['randOben'] + nWebAudio['frequenz']['preData'][h], nWebAudio['frequenz']['config']['balkenWidth'], 3);
					}
				}

				// Peaks alleine anzeigen
				// ======================
				if( nWebAudio['frequenz']['anzeige'] == 'points' && nCVFreqData[h] > 3 )
				{
					nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ), nWebAudio['frequenz']['config']['randOben'] + ( nWebAudio['frequenz']['config']['balkenHeight'] - nCVFreqData[h]  ), nWebAudio['frequenz']['config']['balkenWidth'], 3);
				}

				// Balken anzeigen
				// ===============
				if( nWebAudio['frequenz']['anzeige'] == 'peak'   || nWebAudio['frequenz']['anzeige'] == 'normal' )
				{
					nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ), nWebAudio['frequenz']['config']['randOben'] + ( nWebAudio['frequenz']['config']['balkenHeight'] - nCVFreqData[h]  ), nWebAudio['frequenz']['config']['balkenWidth'], nCVFreqData[h]);
				}

				// Balken von oben
				// ===============
				if( nWebAudio['frequenz']['anzeige'] == 'upside' || nWebAudio['frequenz']['anzeige'] == 'rain' )
				{
					nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ), nWebAudio['frequenz']['config']['randOben'], nWebAudio['frequenz']['config']['balkenWidth'], nCVFreqData[h]);
				}

				// Balken von der Mitte
				// ====================
				if( nWebAudio['frequenz']['anzeige'] == 'mirror' )
				{
					nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ),   nWebAudio['frequenz']['config']['randOben'] + ( ( nWebAudio['frequenz']['config']['balkenHeight'] / 2 ) - ( nCVFreqData[h] / 2 )  ), nWebAudio['frequenz']['config']['balkenWidth'], nCVFreqData[h] / 2);
					nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ), ( nWebAudio['frequenz']['config']['randOben'] + (   nWebAudio['frequenz']['config']['balkenHeight'] / 2 ) ),                           nWebAudio['frequenz']['config']['balkenWidth'], nCVFreqData[h] / 2);
				}

				// Balken Zur Mitte
				// ================
				if( nWebAudio['frequenz']['anzeige'] == 'gap' )
				{
					nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ), nWebAudio['frequenz']['config']['randOben']   + (   nWebAudio['frequenz']['config']['balkenHeight'] -       ( nCVFreqData[h] / 2 )  ), nWebAudio['frequenz']['config']['balkenWidth'], nCVFreqData[h] / 2);
					nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ), nWebAudio['frequenz']['config']['randOben'],                                                                         nWebAudio['frequenz']['config']['balkenWidth'], nCVFreqData[h] / 2);
				}

				// Balken waagerecht
				// =================
				if( nWebAudio['frequenz']['anzeige'] == 'horizont' )
				{
					nCVFreqData[h]    = nWebAudio['frequenz']['config']['balkenWidth'] * cvProz / 100;
					nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ), nWebAudio['frequenz']['config']['randOben'], ( nWebAudio['frequenz']['config']['balkenWidth'] * cvProz / 100 ), nWebAudio['frequenz']['config']['balkenHeight']);
				}

				// Balken per Helligkeit
				// =====================
				if( nWebAudio['frequenz']['anzeige'] == 'bright' )
				{
					if( nWebAudio['frequenz']['color'] == '#FFFFFF' || nWebAudio['frequenz']['color'] == '#000000' )
					{
						inRGB_r   = 48 + ( cvProz * 2 );
						inRGB_g   = 48 + ( cvProz * 2 );
						inRGB_b   = 48 + ( cvProz * 2 );
					} else
					  {
						inRGB_r   = ( nWebAudio['frequenz']['color'].substr(1,2) == 'FF' ) ? ( 48 + ( cvProz * 2 ) ) : 0;
						inRGB_g   = ( nWebAudio['frequenz']['color'].substr(3,2) == 'FF' ) ? ( 48 + ( cvProz * 2 ) ) : 0;
						inRGB_b   = ( nWebAudio['frequenz']['color'].substr(5,2) == 'FF' ) ? ( 48 + ( cvProz * 2 ) ) : 0;
					  }
					nCVFreq.fillStyle = 'rgb('+inRGB_r+','+inRGB_g+','+inRGB_b+')';
					nCVFreq.fillRect(nWebAudio['frequenz']['config']['randLinks'] + ( h * ( nWebAudio['frequenz']['config']['balkenWidth'] + nWebAudio['frequenz']['config']['balkenSpace'] ) ), nWebAudio['frequenz']['config']['randOben'], nWebAudio['frequenz']['config']['balkenWidth'], nWebAudio['frequenz']['config']['balkenHeight']);
				}
			}

			// Peaks nachbereiten
			// ==================
			if( nWebAudio['frequenz']['preLoops'] >= ( nWebAudio['frequenz']['preWait'] - 1 ) )
			{
				nWebAudio['frequenz']['preLoops'] = 0;
			} else
			  {
				nWebAudio['frequenz']['preLoops']++;
			  }
		}

		nWebAudio['frequenz']['timer'] = window.setTimeout("nWebAudio_freqRun()", nWebAudio['frequenz']['delay']);
	}


	document.onload = window.setTimeout("nWebAudio_freqRun()", 250);

