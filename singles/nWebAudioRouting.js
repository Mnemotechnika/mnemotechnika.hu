

    // Konfiguration
    // =============
    var nWebAudio = [];

	nWebAudio['routing']          = [];

	nWebAudio['routing']['audio'] = 'audio1';			// ID des <audio>-Elements

	// Regenbogenfarben bei Farbauswahl '#000000'
	// ------------------------------------------
	nWebAudio['rainbow']          = new Array(24);
	nWebAudio['rainbow'][0]       = new Array(255,  0,  0);
	nWebAudio['rainbow'][1]       = new Array(255, 63,  0);
	nWebAudio['rainbow'][2]       = new Array(255,127,  0);
	nWebAudio['rainbow'][3]       = new Array(255,191,  0);
	nWebAudio['rainbow'][4]       = new Array(255,255,  0);
	nWebAudio['rainbow'][5]       = new Array(191,255,  0);
	nWebAudio['rainbow'][6]       = new Array(127,255,  0);
	nWebAudio['rainbow'][7]       = new Array( 63,255,  0);
	nWebAudio['rainbow'][8]       = new Array(  0,255,  0);
	nWebAudio['rainbow'][9]       = new Array(  0,255, 63);
	nWebAudio['rainbow'][10]      = new Array(  0,255,127);
	nWebAudio['rainbow'][11]      = new Array(  0,255,191);
	nWebAudio['rainbow'][12]      = new Array(  0,255,255);
	nWebAudio['rainbow'][13]      = new Array(  0,191,255);
	nWebAudio['rainbow'][14]      = new Array(  0,127,255);
	nWebAudio['rainbow'][15]      = new Array(  0, 63,255);
	nWebAudio['rainbow'][16]      = new Array(  0,  0,255);
	nWebAudio['rainbow'][17]      = new Array( 63,  0,255);
	nWebAudio['rainbow'][18]      = new Array(127,  0,255);
	nWebAudio['rainbow'][19]      = new Array(191,  0,255);
	nWebAudio['rainbow'][20]      = new Array(255,  0,255);
	nWebAudio['rainbow'][21]      = new Array(255,  0,191);
	nWebAudio['rainbow'][22]      = new Array(255,  0,127);
	nWebAudio['rainbow'][23]      = new Array(255,  0, 63);


	// Routing des Audiosignals zusammenstellen
	// ****************************************
	function nWebAudio_init()
	{
		try
		{
			nWebAudio['routing']['ok']             = 1;

			// Audio-Context erzeugen
			// ======================
			audioCtx                               = new( window.AudioContext || window.webkitAudioContext )();

			// Audio-Knoten erstellen
			// ======================
			nWebAudio['routing']['audioElement']   = document.getElementById(nWebAudio['routing']['audio']);			// <audio>-Element zum schnellen Zugriff
			nWebAudio['routing']['source']         = audioCtx.createMediaElementSource(nWebAudio['routing']['audioElement']);	// Signalquelle aus dem <audio>-Element erzeugen
			nWebAudio['routing']['analyser_freq']  = audioCtx.createAnalyser();							// Analyser für Frequenzspektrum

			nWebAudio['routing']['analyser_left']  = audioCtx.createAnalyser();							// Analyser für linken  Kanal
			nWebAudio['routing']['analyser_right'] = audioCtx.createAnalyser();							// Analyser für rechten Kanal

			nWebAudio['routing']['splitter']       = audioCtx.createChannelSplitter(2);						// Signal splitten für linken und rechten Kanal
			nWebAudio['routing']['merger']         = audioCtx.createChannelMerger(2);						// Signale wieder zusammenführen

			// Audio-Knoten verbinden
			// ======================
			        nWebAudio['routing']['source'].connect(nWebAudio['routing']['analyser_freq']);
			 nWebAudio['routing']['analyser_freq'].connect(nWebAudio['routing']['splitter']);

			      nWebAudio['routing']['splitter'].connect(nWebAudio['routing']['analyser_left'],  0);
			      nWebAudio['routing']['splitter'].connect(nWebAudio['routing']['analyser_right'], 1);

			 nWebAudio['routing']['analyser_left'].connect(nWebAudio['routing']['merger'],         0, 0);
			nWebAudio['routing']['analyser_right'].connect(nWebAudio['routing']['merger'],         0, 1);

			        nWebAudio['routing']['merger'].connect(audioCtx.destination);

			// Audio-Knoten parametrieren
			// ==========================
			nWebAudio['routing']['analyser_freq'].fftSize  = 2048;									// Gemeinsame Nutzung für Oszilloskop & Frequenzspektrum
			nWebAudio['routing']['bufferLength']           = nWebAudio['routing']['analyser_freq'].frequencyBinCount;
			nWebAudio['routing']['oszArraySize']           = nWebAudio['routing']['bufferLength'];
			nWebAudio['routing']['oszDataArray']           = new Uint8Array(nWebAudio['routing']['bufferLength']);			// Daten-Array für Oszilloskop
			nWebAudio['routing']['freqDataArray']          = new Uint8Array(nWebAudio['routing']['bufferLength']);			// Daten-Array für Frequenzspektrum

			nWebAudio['routing']['analyser_left'].fftSize  = 32;
			nWebAudio['routing']['analyser_right'].fftSize = 32;

			nWebAudio['routing']['vuBufferLenLeft']        = nWebAudio['routing']['analyser_left'].frequencyBinCount;
			nWebAudio['routing']['vuBufferLenRight']       = nWebAudio['routing']['analyser_right'].frequencyBinCount;

			nWebAudio['routing']['vuDataArrLeft']          = new Uint8Array(nWebAudio['routing']['vuBufferLenLeft']);		// Daten-Array für VU linker  Kanal
			nWebAudio['routing']['vuDataArrRight']         = new Uint8Array(nWebAudio['routing']['vuBufferLenRight']);		// Daten-Array für VU rechter Kanal

		} catch(e)
		  {
			nWebAudio['routing']['ok'] = 0;
			console.log('Fehler: '+e);
		  }
	}


	document.onload = window.setTimeout("nWebAudio_init()", 100);

