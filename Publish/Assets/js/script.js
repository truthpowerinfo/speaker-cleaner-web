// Object-model syntax
var audioPlayer = {
	audio:null,
	audioReady:false,
	canPlay:false,
	checkLoaded:null,
	config:{
		volumeKnob:{
			angleArc:360,
			displayInput:true,
			displayPrevious:false,
			width:"600",
			height:"600",
			thickness:.15,
			fgColor:"rgb(0,0,175)",
			bgColor:"black"
		}
	},
	currentTrack:-1,
	isChrome:false,
	isPlaying:false,
	maxTracks:undefined,
	playlist:[
		{
			localFile:"",
			hostedFile:"https://dl.dropboxusercontent.com/s/bt7voo8e8so2fyj/RISE_%28ft._The_Glitch_Mob_Mako_and_The_Word_Alive%29_Worlds_2018___League_of_Legends.mp3"
		},
		{
			localFile:"",
			hostedFile:"https://dl.dropboxusercontent.com/s/v13cyysbews3n4r/TheFatRat___No_No_No.mp3"
		},
		{
			localFile:"",
			hostedFile:"https://dl.dropboxusercontent.com/s/q2f6dmeypxcxejq/Aviators___Impossible_%28Zootopia_Song_Pop_Rock%29.mp3"
		},
		{
			localFile:"",
			hostedFile:"https://dl.dropboxusercontent.com/s/mzhq0mye2ldkwb2/FADED___Alan_Walker.mp3"
		},
		{
			localFile:"wake_me_up_choir.mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/7qse22qrjqhcbyj/wake_me_up_choir.mp3"
		},
		{
			localFile:"_EnV_ - Heaven.mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/9pamibo40ycabe1/_env___heaven.mp3"
		},
		{
			localFile:"starcadian_interspace.mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/go1iz3g4hap1xuv/starcadian__interspace.mp3"
		},
		{
			localFile:"Getting Stronger - Michelle Creber Black Gryph0n Baasik.mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/mw28fr4lt64mhzt/getting_stronger__michelle_creber_black_gryph0n_baasik.mp3"
		},
		{
			localFile:"jackle_app__fortune_cookie.mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/roy5ilvpiaoqav3/jackle_app__fortune_cookie.mp3"
		},
		{
			localFile:"project_yi_(vicetone_remix).mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/w9xs464amubfrkg/project_yi_%28vicetone_remix%29.mp3"
		},
		{
			localFile:"edge_of_infinity_(minnesota_remix).mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/agya40507f4s3g5/edge_of_infinity_%28minnesota_remix%29.mp3"
		},
		{
			localFile:"flash_funk_(marshmello_remix).mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/4h8sxxsu7u2rd0d/flash_funk_%28marshmello_remix%29.mp3"
		},
		{
			localFile:"let_the_games_begin_(hyper_potions_remix).mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/iw058ae68kfoa3a/let_the_games_begin_%28hyper_potions_remix%29.mp3"
		},
		{
			localFile:"lucidity_(dan_negovan_remix).mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/6q80d9o0hbrmozf/lucidity_%28dan_negovan_remix%29.mp3"
		},
		{
			localFile:"silver_scrapes_(protoshredanoid_remix).mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/e4na3iu3qcdvn1k/silver_scrapes_%28protoshredanoid_remix%29.mp3"
		},
		{
			localFile:"the_glory_(james_egbert_remix).mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/f9c43zdc0g3a9ok/the_glory_%28james_egbert_remix%29.mp3"
		},
		{
			localFile:"welcome_to_planet_urf_(jauz_remix).mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/mbh524zux40yxyk/welcome_to_planet_urf_%28jauz_remix%29.mp3"
		},
		{
			localFile:"worlds_collide_(arty_remix).mp3",
			hostedFile:"https://dl.dropboxusercontent.com/s/uw4rwd4iqpgdst4/worlds_collide_%28arty_remix%29.mp3"
		}
	],
	repeat:"none",
	tickTen:null,
	volume:1,
	visualizer:{
		analyser:null,
		audio:null,
		audioReady:false,
		audioSrc:null,
		barWidth:4,		// Cap at 5 width and 96 count
		barCount:80,	// Higher values cause performance issues
		barRotation:1.88,
		bars:[],
		barColor:1,
		ctx:null,
		frequencyData:null,
		maxHeight:255,
		updateTick:null,
		createVisualizer:function(){
			for(var i = 0; i < audioPlayer.visualizer.barCount; i++){
				var newBar = $("<div>", {
					"width":audioPlayer.visualizer.barWidth + "px"
				}).appendTo("#audioVisualizer").css("left",(audioPlayer.visualizer.barWidth * i)+ "px");


				// Future code relating to circular positioning
				// var centerX = parseInt($("#audioVisualizer").css("width")) / 2;
				// var centerY = parseInt($("#audioVisualizer").css("height")) / 2;

				// $(newBar).css("transform","rotate("+(90 + audioPlayer.visualizer.barRotation * i)+"deg)");
				// $(newBar).css("left",(centerX + Math.round((150 * Math.cos(i * (2 * Math.PI / audioPlayer.visualizer.barCount))))) + "px");
				// $(newBar).css("top",(centerY + Math.round((150 * Math.sin(i * (2 * Math.PI / audioPlayer.visualizer.barCount))))) + "px");

				audioPlayer.visualizer.bars.push(newBar);

				audioPlayer.visualizer.barColor = Math.floor(1 + (Math.random() * 3));
			}

			$("#audioKnobs").css("left","-250px");
			$("#audioVisualizer").show(500);
		},
		loadAudio:function(){
			audioPlayer.visualizer.ctx = new AudioContext();
			audioPlayer.visualizer.audioSrc = audioPlayer.visualizer.ctx.createMediaElementSource(audioPlayer.visualizer.audio);
			audioPlayer.visualizer.analyser = audioPlayer.visualizer.ctx.createAnalyser();

			audioPlayer.visualizer.audioSrc.connect(audioPlayer.visualizer.analyser);

			audioPlayer.visualizer.frequencyData = new Uint8Array(audioPlayer.visualizer.analyser.frequencyBinCount);
		},
		renderFrame:function(){
			audioPlayer.visualizer.updateTick = requestAnimationFrame(audioPlayer.visualizer.renderFrame);

			audioPlayer.visualizer.analyser.getByteFrequencyData(audioPlayer.visualizer.frequencyData);

			var i;

			for(i = 0; i < audioPlayer.visualizer.bars.length; i++) {
				var bar = audioPlayer.visualizer.bars[i];
				var heightCap = (parseInt($("#audioVisualizer").css("height")));// - 25);

				$(bar).css("height",(heightCap * (audioPlayer.visualizer.frequencyData[i] / 255)) + 'px');

				if(audioPlayer.visualizer.barColor === 1){
					$(bar).css("background-color","rgb("+Math.round(audioPlayer.visualizer.frequencyData[i])+",0,0)");
				}
				else if(audioPlayer.visualizer.barColor === 2){
					$(bar).css("background-color","rgb(0,"+Math.round(audioPlayer.visualizer.frequencyData[i])+",0)");
				}
				else{
					$(bar).css("background-color","rgb(0,0,"+Math.round(audioPlayer.visualizer.frequencyData[i])+")");
				}
			}

			// if(audioPlayer.visualizer.barColor === 1){
			// 	$("#audioVol").trigger("configure",{"bgColor":"rgb("+audioPlayer.visualizer.frequencyData[audioPlayer.visualizer.barCount / 2]+",0,0)"});
			// }
			// else if(audioPlayer.visualizer.barColor === 2){
			// 	$("#audioVol").trigger("configure",{"bgColor":"rgb(0,"+audioPlayer.visualizer.frequencyData[audioPlayer.visualizer.barCount / 2]+",0)"})
			// }
		},
	},
	createAudio:function(hosted,id){
		// If statement declares if given id is a file name
		// Or a URL
		if(hosted){
			// Use audio constructor in audio var
			audioPlayer.audio = new Audio(id);
			audioPlayer.visualizer.audio = new Audio(id);
		}
		else{
			// Use audio constructor in audio var
			audioPlayer.audio = new Audio("audio/"+id);
		}

		// Removing CORS access restriction
		audioPlayer.audio.crossOrigin = "anonymous";
		audioPlayer.visualizer.audio.crossOrigin = "anonymous";

		// Cannot play; loading
		audioPlayer.canPlay = false;

		// Show loading gif
		$("#loadingDiv").css("display","block");

		// Audio function for if the file is not returned
		audioPlayer.audio.onerror = function(){
			if(hosted){
				console.log("Failed to load hosted file. Attempting to load local file.");

				audioPlayer.audio = new Audio("audio/"+audioArray[currentTrack].localFile+".mp3");

				hosted = 0;

				audioPlayer.audio.onerror = function(){
					console.log("Failed to load local file. Removing and skipping.");
					console.log("File failure: "+id);
					console.log("File failure: "+audioPlayer.playlist[audioPlayer.currentTrack].localFile);

					audioPlayer.removeFromPlaylist(currentTrack);

					audioPlayer.checkCurrentTrack();
				};
			}
			else{
				console.log("Failed to load local file. Attempting to load hosted file.");

				audioPlayer.audio = new Audio(audioPlayer.playlist[audioPlayer.currentTrack].hostedFile);

				hosted = 1;

				audioPlayer.audio.onerror = function(){
					console.log("Failed to load hosted file. Removing and skipping.");
					console.log("File failure: "+id);
					console.log("File failure: "+audioPlayer.playlist[audioPlayer.currentTrack].hostedFile);

					audioPlayer.removeFromPlaylist(currentTrack);

					audioPlayer.checkCurrentTrack();
				}
			}
		}

		audioPlayer.audioReady = false;

		audioPlayer.audio.canplaythrough = function(){
			audioPlayer.audioReady = true;
		}

		audioPlayer.visualizer.audioReady = false;

		audioPlayer.visualizer.audio.canplaythrough = function(){
			audioPlayer.visualizer.audioReady = true;
		}


		audioPlayer.checkLoaded = setInterval(audioPlayer.isLoaded, 100);
	},
	isLoaded:function(){
		if(audioPlayer.audio.readyState == 4 || audioPlayer.audioReady){
			if((!audioPlayer.isChrome) ||  (audioPlayer.visualizer.audio.readyState == 4) || (audioPlayer.visualizer.audioReady)){
				// Play the created audio
				// audioPlayer.play();
				// $("#playButton").addClass("activeControl");
				// $("#pauseButton").removeClass("activeControl");

				// Pause the created audio
				// audioPlayer.pause();
				// $("#playButton").removeClass("activeControl");
				// $("#pauseButton").addClass("activeControl");

				// if(currentTrack>0){
				if(audioPlayer.isPlaying){
					setTimeout(audioPlayer.play, 500);
				}
				else{
					setTimeout(audioPlayer.pause, 500);
				}

				// Set the volume of the created audio
				audioPlayer.setVol(audioPlayer.volume);

				// Keep track of the current audio track
				// audioPlayer.currentTrack++

				// Tell everything else that that they can fire
				audioPlayer.canPlay = true;

				// Hide loading gif
				$("#loadingDiv").css("display","none");

				// Stop looping
				clearInterval(audioPlayer.checkLoaded);

				if(audioPlayer.isChrome){
					audioPlayer.visualizer.loadAudio();
				}

				// Run trackProgress every tenth of a second
				audioPlayer.tickTen = setInterval(audioPlayer.trackProgress, 100);
			}
		}
	},
	play:function(){
		audioPlayer.audio.play();

		if(audioPlayer.isChrome){
			audioPlayer.visualizer.audio.play();
			audioPlayer.visualizer.updateTick = requestAnimationFrame(audioPlayer.visualizer.renderFrame);
		}

		// These classes control the background on the play/pause
		// buttons to show which one is active
		$("#playButton").addClass("activeControl");
		$("#pauseButton").removeClass("activeControl");
	},
	pause:function(){
		audioPlayer.audio.pause();

		if(audioPlayer.isChrome){
			cancelAnimationFrame(audioPlayer.visualizer.updateTick);
		}

		// These classes control the background on the play/pause
		// buttons to show which one is active
		$("#playButton").removeClass("activeControl");
		$("#pauseButton").addClass("activeControl");
	},
	setVol:function(vol){
		// If the given volume is a number
		if(typeof vol == "number"){
			// If the volume is within the valid range
			if(vol <= 1 && vol >= 0){
				// If the audio exists
				if(typeof audioPlayer.audio != "undefined"){
					if(audioPlayer.audio != null){
						audioPlayer.audio.volume = vol;
					}
				}
				if(audioPlayer.isChrome){
					if(typeof audioPlayer.visualizer.audio != "undefined"){
						if(audioPlayer.visualizer.audio != null){
							audioPlayer.visualizer.audio.volume = vol;
						}
					}
				}

				audioPlayer.volume = vol;
			}
		}
	},
	skipBackward:function(){
		if(audioPlayer.currentTrack>0){
			audioPlayer.pause();

			audioPlayer.currentTrack--;

			audioPlayer.checkCurrentTrack();
		}
	},
	skipForward:function(){
		if(audioPlayer.currentTrack<audioPlayer.maxTracks){
			audioPlayer.pause()

			audioPlayer.currentTrack++

			audioPlayer.checkCurrentTrack();
		}
	},
	repeatToggle:function(){
		var icoCol = $("#repeatButton").attr("data-color");

		switch($("#repeatButton").attr("data-repeat")){
			case "none":
				$("#repeatButton").attr("data-repeat","single");
				$("#repeatButton img").attr("src","assets/img/repeatIco/"+icoCol+"/repeat-1.svg");
				audioPlayer.repeat = "single";
				break;
			case "single":
				$("#repeatButton").attr("data-repeat","all");
				$("#repeatButton img").attr("src","assets/img/repeatIco/"+icoCol+"/repeat-all.svg");
				audioPlayer.repeat = "all";
				break;
			default:
				$("#repeatButton").attr("data-repeat","none");
				$("#repeatButton img").attr("src","assets/img/repeatIco/"+icoCol+"/repeat-none.svg");
				audioPlayer.repeat = "none";
		}
	},
	isValid:function(fileToCheck){
		// This function checks if the given file is valid or not

		if(fileToCheck != ""){
			var checkEXT = fileToCheck.split(".")

			// Boolean vars to make if statement shorter
			var isMP3 = (checkEXT[checkEXT.length - 1] == "mp3");
			var isM4A = (checkEXT[checkEXT.length - 1] == "m4a");

			// Audio formats
			if(isMP3 || isM4A){
				return true;
			}
			else {
				return false;
			}
		}
	},
	checkCurrentTrack:function(){
		// Error prevention
		audioPlayer.maxTracks = (audioPlayer.playlist.length - 1);

		// Set button disabled or not
		if(audioPlayer.currentTrack>0){
			$("#backButton").removeClass("disabled");
		}
		else{
			$("#backButton").addClass("disabled");
		}

		if(audioPlayer.currentTrack<audioPlayer.maxTracks){
			$("#skipButton").removeClass("disabled");
		}
		else{
			$("#skipButton").addClass("disabled");
		}

		if(audioPlayer.currentTrack >= audioPlayer.maxTracks && audioPlayer.repeat == "all"){
			audioPlayer.currentTrack = 0;
		}

		audioPlayer.updatePlaylist();

		// Border thickness
		var borderPx = "3px"

		// Add border-left to current track on playlist
		$("[data-item="+audioPlayer.currentTrack+"]").addClass("active");

		// Play the audio based on the current track
		// Error prevention
		if(audioPlayer.currentTrack <= audioPlayer.maxTracks){
			if(audioPlayer.isValid(audioPlayer.playlist[audioPlayer.currentTrack].hostedFile)){
				audioPlayer.createAudio(true,audioPlayer.playlist[audioPlayer.currentTrack].hostedFile);
			}
		}
	},
	trackProgress:function(){
		// Temporary variable, only needed to make sure the lable does not say NaN
		var audioDuration = audioPlayer.audio.duration;

		// If the audioDuration is NaN then set it to 0
		// This prevents the audio player saying "NaN" and appearing broken
		if(audioDuration.toString() == "NaN"){
			audioDuration = 0;
		}

		// Create a temporary variable
		// Initialise variable with a 360deg percentage of
		// the audio's current time verse its duration
		var currentArc = ((audioPlayer.audio.currentTime / audioDuration)*360)-5

		// If the arc is less than 0, set it to 0
		if(currentArc<0){
			currentArc=0
		}

		// Set the label element to show the audio's currentTime
		// $("#audioProgLabel").text(Math.round(audio.currentTime).toString());

		var audioPercent = (audioPlayer.audio.currentTime / audioPlayer.audio.duration);

		$("#audioProgLine").css("width",(audioPercent * 185)+"px");
		$("#audioProgDot").css("left",(audioPercent * 185)+"px");

		// If the audio is finished
		if(audioPlayer.audio.ended){
			audioPlayer.pause();
			if(audioPlayer.repeat == "single"){
				audioPlayer.audio.currentTime = 0;

				setTimeout(audioPlayer.play, 1000);
			}
			else{
				// Stop looping
				clearInterval(audioPlayer.tickTen);

				// New track
				audioPlayer.currentTrack++

				// Check the current track
				audioPlayer.checkCurrentTrack();
			}
		}
	},
	updatePlaylist:function(){
		// If playlist is updated; then playlist must have changed. Update maxTracks var
		audioPlayer.maxTracks = (audioPlayer.playlist.length - 1);

		// Create and declare htmlString as an empty string
		var htmlString = "";

		// For every item in the array
		// Create HTML for the item
		audioPlayer.playlist.forEach(function(currentValue, index){
			htmlString += "<div class='playlistItem' data-item='"+index+"'>";
			htmlString += "<div class='playlistBtnPos'>";
			htmlString += "<div class='playlistBtn' data-remove='"+index+"'>";
			htmlString += "<i class='fas fa-trash'></i>";
			htmlString += "</div>";
			htmlString += "</div><p>";
			// htmlString += "<strong>localFile:</strong>";
			// htmlString += "<br>"+currentValue.localFile+"<br>";
			htmlString += "<strong>File:</strong>";
			htmlString += "<br>"+currentValue.hostedFile+"";
			htmlString += "</p></div>";
			htmlString += "<hr>";
		});

		// Put the created HTML into the DOM
		$("#playlistView").html(htmlString);

		// This click event is in here instead of down with the others
		// Because the elements it targets are created here
		// And do not exist otherwise
		// Click event for the remove from playlist button
		$(".playlistBtn").click(function(){
			if(audioPlayer.canPlay){
				// console.log("Click");
				audioPlayer.removeFromPlaylist($(this).attr("data-remove"))
			}
		});
	},
	addToPlaylist:function(newFile){
		// If the given string is not blank
		if(newFile != ""){
			// Create variable to hold the split string
			var splitInput = newFile.split("");

			// Create variable to hold the first four letters of the split string
			var checkHTTP = ""+splitInput[0]+splitInput[1]+splitInput[2]+splitInput[3];

			// If the first four letters of the string
			// are "http" then it is a hosted file
			if(checkHTTP == "http"){
				if(audioPlayer.isValid(newFile)){
					// Push an object to the array containing the file
					audioPlayer.playlist.push({
						localFile:"",
						hostedFile:newFile
					});
				}
			}
			// else{
			// 	Push an object to the array containing the file
			// 	audioPlayer.playlist.push({
			// 		localFile:newFile,
			// 		hostedFile:""
			// 	});
			// }

			// For debug purposes
			// Allows forcibly loading audio files from any location
			var checkDebug = newFile.split(" ");

			if(checkDebug[0] == "debug"){
				// This will only allow debug commands when loaded from a file
				// NOT on a server
				var splitURL = window.location.href.split("");
				var checkFILE = ""+splitURL[0]+splitURL[1]+splitURL[2]+splitURL[3];

				if(checkFILE == "file"){
					audioPlayer.playlist.push({
						localFile:"",
						hostedFile:checkDebug[1]
					})
				}
			}

			// Update the DOM to reflect the updated playlist
			audioPlayer.updatePlaylist();

			// Clear the input
			$("#audioInput").val("");
		}
	},
	removeFromPlaylist:function(toRemove){
		// These variables are for checking if the removal of the track caused
		// the array to change
		if(audioPlayer.currentTrack < (audioPlayer.playlist.length - 1)){
			// Variable used to check if the file exists
			var checkTrackHosted = audioPlayer.playlist[audioPlayer.currentTrack].hostedFile;

			// Remove the track from the playlist
			audioPlayer.playlist.splice(toRemove,1);

			// Update the DOM to reflect the updated playlist
			audioPlayer.updatePlaylist();

			// If tree to get the new index of the file
			if(audioPlayer.playlist[audioPlayer.currentTrack].hostedFile != checkTrackHosted){
				// Incremental var
				var i;

				// For loop checks through audioArray for the file
				for(i=0; i < audioPlayer.playlist.length; i++){
					// If the hostedFile of the current index is the file
					if(audioPlayer.playlist[i].hostedFile == checkTrackHosted){
						// Set the track index to match
						audioPlayer.currentTrack=i;

						// Stop looping
						break
					}
					else if(i == (audioPlayer.playlist.length - 1)){
						// Else if already checked every item in the array

						// If the track index is greater than the array's max index
						if(audioPlayer.currentTrack > (audioPlayer.playlist.length - 1)){
							// Set the track index to the array's max index
							audioPlayer.currentTrack = (audioPlayer.playlist.length - 1);
						}

						// Stop the audio
						audioPlayer.pause();

						// Switch to the new track
						audioPlayer.checkCurrentTrack();
					}
				}
			}
		}
		else if((audioPlayer.playlist.length - 1) != 0){
			// Else if this is not the last item in the array

			// Remove the index from the array
			audioPlayer.playlist.splice(toRemove,1);

			// Update the DOM playlist
			audioPlayer.updatePlaylist();

			// Set the current track to the array's max index
			audioPlayer.currentTrack = (audioPlayer.playlist.length - 1);

			// Stop the audio
			audioPlayer.pause();

			// Switch to the new track
			audioPlayer.checkCurrentTrack();
		}
		else{
			// Else

			// Remove the last index from the array
			audioPlayer.playlist.splice(toRemove,1);

			// Update the DOM playlist
			audioPlayer.updatePlaylist();

			// Stop the audio
			audioPlayer.pause();

			// Set the current track to the array's max index which should be 0
			audioPlayer.currentTrack = (audioPlayer.playlist.length - 1);
		}
	},
	createKnobs:function(){
		// Audio volume knob
		$("#audioVol").knob({
			"angleOffset":-90,
			"angleArc":audioPlayer.config.volumeKnob.angleArc,
			"displayInput":audioPlayer.config.volumeKnob.angleArc,
			"displayPrevious":audioPlayer.config.volumeKnob.displayPrevious,
			"width":audioPlayer.config.volumeKnob.width,
			"height":audioPlayer.config.volumeKnob.height,
			"thickness":audioPlayer.config.volumeKnob.thickness,
			"fgColor":audioPlayer.config.volumeKnob.fgColor,
			"bgColor":audioPlayer.config.volumeKnob.bgColor,
			"min":0,
			"max":1,
			"step":0.01,
			"draw":function(){ audioPlayer.setVol(this.v)}
		});

		audioPlayer.updatePlaylist();

		if(audioPlayer.isChrome){
			audioPlayer.visualizer.createVisualizer();
		}

		// Creates the audio after a delay
		// This allows the knobs to initialise beforehand
		setTimeout(function(){
			// New track
			audioPlayer.currentTrack++;

			// Locally hosted
			// audioPlayer.createAudio(false,"jackle_app__fortune_cookie")

			// Dropbox hosted
			// audioPlayer.createAudio(true,"https://dl.dropboxusercontent.com/s/roy5ilvpiaoqav3/jackle_app__fortune_cookie.mp3")

			audioPlayer.checkCurrentTrack();
		}, 250)
	},
	detectBrowser:function(){
		var isChromium = window.chrome;
		var winNav = window.navigator;
		var vendorName = winNav.vendor;
		var isOpera = typeof window.opr !== "undefined";
		var isIEdge = winNav.userAgent.indexOf("Edge") > -1;
		var isIOSChrome = winNav.userAgent.match("CriOS");

		if(isIOSChrome){
			audioPlayer.isChrome = true;
		} else if(isChromium !== null && typeof isChromium !== "undefined" && vendorName == "Google Inc." && isOpera == false && isIEdge == false){
			audioPlayer.isChrome = true;
		} else{
			console.log("Browser not detected as chrome, cannot run audio visualizer")
			audioPlayer.isChrome = false;
		}
	}
}

// console.dir(audioPlayer);

$(document).ready(function(){
	// Browser detection
	audioPlayer.detectBrowser()

	// Click event for the play button
	$("#playButton").click(function(){
		if(audioPlayer.canPlay){
			audioPlayer.play();

			audioPlayer.isPlaying = true;
		}
	});

	// Click event for the pause button
	$("#pauseButton").click(function(){
		if(audioPlayer.canPlay){
			audioPlayer.pause();

			audioPlayer.isPlaying = false;
		}
	});

	// Click event for the back button
	$("#backButton").click(function(){
		if(audioPlayer.canPlay){
			audioPlayer.skipBackward();
		}
	});

	// Click event for the forward button
	$("#skipButton").click(function(){
		if(audioPlayer.canPlay){
			audioPlayer.skipForward();
		}
	});

	// Click event for the add to playlist button
	$("#audioInputBtn").click(function(e){
		e.preventDefault();

		if(audioPlayer.canPlay){
			// audioPlayer.addToPlaylist($("#audioInput").val());

			$("#audioInputDiv").ajaxForm().submit();
		}
	});

	// Click event for the repeat button
	$("#repeatButton").click(function(){
		if(audioPlayer.canPlay){
			audioPlayer.repeatToggle();
		}
	});

	// Min left 0px
	// Max left 185px
	$("#audioProgDot").draggable({
		axis:"x",
		containment:"parent",
		cursor:"ew-resize",
		scroll:false,
		drag:function(event,ui){
			$("#audioProgLine").css("width",ui.position.left);
		},
		stop:function(event,ui){
			audioPlayer.audio.currentTime = (ui.position.left / 185) * audioPlayer.audio.duration;
			audioPlayer.visualizer.audio.currentTime = (ui.position.left / 185) * audioPlayer.visualizer.audio.duration;
		}
	});

	$("#playlistDrawer").click(function(){
		if($("#playlistPosition").attr("data-open") == "true"){
			$("#playlistPosition").css("height", "");
			$("#playlistPosition").attr("data-open", "false");
			$("#playlistDrawer h3").text("Open Playlist");
			$("#playlistDrawer i").removeClass("fa-angle-up").addClass("fa-angle-up");
		} else {
			$("#playlistPosition").css("height", "25vh");
			$("#playlistPosition").attr("data-open", "true");
			$("#playlistDrawer h3").text("Close Playlist");
			$("#playlistDrawer i").removeClass("fa-angle-up").addClass("fa-angle-down");
		}
	});

	// Call functions
	audioPlayer.createKnobs();
});
