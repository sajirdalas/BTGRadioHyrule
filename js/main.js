

function get_info() {

	$.getJSON("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22radiohyrule.com%2Fsites%2Fradiohyrule.com%2Fwww%2Fnowplaying.json%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
    function(data) {
        var song = data.query.results.json.title;
        var artist = data.query.results.json.artist;
        var album = data.query.results.json.album;
        var albumart = "http://radiohyrule.com/cover500/" + data.query.results.json.albumcover;
        if(album==undefined){
		 	album=" ";
		}
		var ExpectEnd = Number(data.query.results.json.started) + Number(data.query.results.json.duration);
		TimeForRefresh = Math.round(ExpectEnd - Math.round(new Date().getTime() / 1000 ))+1;

		$("#The_Parameters").html("<b>Song: </b>" + song + " <br  /> <b>Album: </b>" + album + " <br /> <b>Artist: </b>" + artist);
    	$("#Art").attr("src",albumart);
    			  }
        );
}

function get_info_timer() {

	$.getJSON("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22radiohyrule.com%2Fsites%2Fradiohyrule.com%2Fwww%2Fnowplaying.json%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
    function(data) {
        var song = data.query.results.json.title;
        var artist = data.query.results.json.artist;
        var album = data.query.results.json.album;
        if(Quality){
        var albumart = "http://radiohyrule.com/cover500/" + data.query.results.json.albumcover;}
        else{
        var albumart = "http://radiohyrule.com/cover81/" + data.query.results.json.albumcover;	
        }
        if(album==undefined){
		 	album=" ";
		}
		var ExpectEnd = Number(data.query.results.json.started) + Number(data.query.results.json.duration);
		TimeForRefresh = Math.round(ExpectEnd - Math.round(new Date().getTime() / 1000 ))+1;
		Timer = setTimeout(get_info_timer(),TimeForRefresh*1000);
		$("#The_Parameters").html("<b>Song: </b>" + song + " <br  /> <b>Album: </b>" + album + " <br /> <b>Artist: </b>" + artist);
    	$("#Art").attr("src",albumart);
    			  }
        );
}


function reload_on_error(){
	console.log("Attempting fix");
	var audio_player = $("audio").get(0);
		audio_player.load();
		//audio_player.pause();
		audio_player.play();
}

function stop() {

	var audio = $("audio").get(0);
	audio.pause();
	$("audio").attr("src","");
	audio.load();
	$("audio").remove();
	if(Quality){
		$("body").append('<audio id="ThePlayer" preload="none" src="http://listen.radiohyrule.com:8000/listen"></audio>');
	}else{
		$("body").append('<audio id="ThePlayer" preload="none" src="http://listen.radiohyrule.com:8000/listen-lo"></audio>');
	}
	$("audio").on("error", function() {
		console.log("I SHALL NOT GIVE UP");
		reload_on_error();
	});
	//add_bug_listeners();
}

function toggle() {
	var audio_player = $("audio").get(0);
	if (playing) {
		console.log("Changed to pause");
		//audio_player.pause();
		stop();
		playing = false;
		$("#PlayPauseButton").attr("src", "img/play.png");
		clearTimeout(Timer);
	} else {
		console.log("Changed to play");
		playing = true;
		get_info_timer();
		$("#PlayPauseButton").attr("src", "img/pause.png");
		audio_player.play();
	}
}



function init_process() {
	playing = false;
	TimeForRefresh = 60;
	Timer = null;
	Quality=true;

	get_info();

	$("#PlayPauseButton").click(function(){
		toggle();
	});

	$("audio").on("error", function() {
		console.log("I SHALL NOT GIVE UP");
		reload_on_error();
	});

	$("#OptionsB").click(function(){
		if(Quality){
			if (confirm('Do you want to change to Low Quality Mode?')) { 
				Quality=false;
				if(playing){
					toggle();
				}
			}
		}else{
			if (confirm('Do you want to change to High Quality Mode?')) { 
				Quality=true;
				if(playing){
					toggle();
				}
			}
		}
	});;

}


$(window).load(function() {
	init_process();
});
