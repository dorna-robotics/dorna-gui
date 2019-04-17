// hold the script
let	script = {
	"line":[],
	"map": [],
	"commands":[]
	}

let editor = CodeMirror.fromTextArea($(".codemirror-textarea")[0], {
	lineNumbers : true,
	lineWrapping: false,
	matchBrackets: true,
	autoCloseBrackets: true,
	mode: "application/json",
	tabSize: 4,
	indentUnit: 4,

})

$( ".script_mode_l" ).on("input", function(e){
	let mode = $(this).prop("value")
	// setOption
	if (mode == "json") {
		editor.setOption("mode" ,"application/json")
	}else if (mode == "python") {

		editor.setOption("mode", {name: "python",
															version: 3,
															singleLineStringErrors: false},)
															
	}
})


$('#script_open_b').click(function(e){
	e.preventDefault();
	$("#script_open").trigger('click')
})

$("#script_open").change(function (e){
    let input = e.target;

    let reader = new FileReader();
    reader.onload = function(){
      let text = reader.result;
      editor.setValue(text)
    };

    reader.readAsText(input.files[0]);
  	/*
    let input = e.target;

    let reader = new FileReader();
    reader.onload = function(){
      let dataURL = reader.result;
      let output = document.getElementById('output');
      output.src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
  	*/
});

$('#script_download_b').click(function(e){
	e.preventDefault();
	let mode = $(".script_mode_l").prop("value")

	let hiddenElement = document.createElement('a');
	let ext = "txt"
	//hiddenElement.href = 'data:attachment/text,' + encodeURI(yaml.dump(data));
	hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(editor.getValue());
	hiddenElement.target = '_blank';
	if(mode == "python"){
		ext = "py" 
	}
	hiddenElement.download = "code." + ext ;
	hiddenElement.click();

})


$('#script_play').click(function(e){
	 e.preventDefault();

	 let mode = $(".script_mode_l").prop("value")
	 if (mode == "python") {
			 socket.emit("python",{
		 		"text" : editor.getValue()
		 	})
		 	return
	 }else if (mode == "json") {
		 let value = editor.getValue().split("\n")
	 	// update script
	 	script = {
	 		"line":[],
	 		"map": [],
	 		"commands":[]
	 	}
	 	// validate
	 	for (let i = 0; i <= value.length; i++) {
	 		try {
	 			// remove initial space
	 			value[i] = value[i].trim()
	 			//check for {
	 			if(value[i][0] == "{"){
	 				// command
	 				_command = JSON.parse(value[i])
	 				//script line
	 				_command["key"] = (i+1)
	 				script["commands"].push(_command)
	 				// line number
	 				script["line"].push(i+1)
	 			}
	 		}
	 		catch(err){

	 		}
	 	}
	 	socket.emit("method",{
	 		method: "play",
	 		prm: {
	 			"commands": script["commands"],
	 			"append": false
	 		}
	 	})
	 }
 });


 $('#script_kill').click(function(e){
	 $( '.halt' ).click()
 })

 $( ".command_l" ).on("input", function(e) {
		// hilde all
		$(".prm_r").hide()

		if ($(this).prop("value") == "method_list") {
			$(".ex2").css({"top": "calc(2*var(--height_t))"})
			return
		}
		//show
		$("."+$(this).prop("value")+"_c").show()

		$(".ex2").css({"top": "calc(8*var(--height_t) + 1px)"})
 });


$('#method_add_b').click(function(e){
	e.preventDefault();
	let data = {"command": $(".command_l").prop("value"), "prm":{}}

	if (data["command"] == "move") {
		data["prm"] = script_move_add()
	}else if (data["command"] == "sleep") {
		data["prm"] = script_sleep_add()
	}else if (data["command"] == "set_io") {
		data["prm"] = script_set_io_add()
	}else{
		return
	}

	editor.replaceRange(JSON.stringify(data) +'\n', CodeMirror.Pos(editor.lastLine()))

	editor.focus()
	editor.setCursor({line: Infinity, ch: 0})

})

$('#method_refresh_b').click(function(e){
	e.preventDefault();


	let data = {"command": $(".command_l").prop("value"), "prm":{}}

	if (data["command"] == "move") {
		data["prm"] = script_move_refresh()
	}else if (data["command"] == "set_io") {
		data["prm"] = script_set_io_refresh()
	}
	/*
	editor.replaceRange(JSON.stringify(data) +'\n', CodeMirror.Pos(editor.lastLine()))

	editor.focus()
	editor.setCursor({line: Infinity, ch: 0})
	*/
})

function script_set_io_refresh() {
	let index = [
		"servo",
		"laser",
		"di1mo", "di2mo", "di3mo", "di4mo",
		"out1", "out2", "out3", "out4",
		"do1mo", "do2mo", "do3mo", "do4mo",
	]
	for (let i = 0; i < index.length; i++) {
		let value = 0
		if($("#"+index[i]).prop('checked')){
			value = 1
		}
		$(".set_io_"+index[i]+"_prm").prop("value", value)
	}
	$(".set_io_servo_prm").prop("value", $("#servo").prop("value"))
}

function script_set_io_add() {
	let rtn = {}
	let index = [
		"servo",
		"laser",
		"di1mo", "di2mo", "di3mo", "di4mo",
		"out1", "out2", "out3", "out4",
		"do1mo", "do2mo", "do3mo", "do4mo",
	]
	for (let i = 0; i < index.length; i++) {
		if($(".set_io_"+index[i]+"_prm_c").prop('checked')){
			rtn[index[i]] = Number($(".set_io_"+index[i]+"_prm").prop("value"))
		}
	}

	return rtn
}


function script_move_add() {
	let rtn = {}
	rtn["path"] = $(".move_path_prm").prop("value")
	rtn["movement"] = Number($(".move_movement_prm").prop("value"))
	if($('.move_speed_prm_c').is(':checked')){
		rtn["speed"] = Number($(".move_speed_prm").prop("value"))
	}
	if($('.move_jerk_prm_c').is(':checked')){
		try {
			rtn["jerk"] = JSON.parse($(".move_jerk_prm").prop("value"))
		} catch (e) {

		}
	}
	if($('.move_joint_prm_c').is(':checked')){
		try {
			rtn["joint"] = JSON.parse($(".move_joint_prm").prop("value"))
		} catch (e) {

		}
	}
	if($('.move_xyz_prm_c').is(':checked')){
		try {
			rtn["xyz"] = JSON.parse($(".move_xyz_prm").prop("value"))
		} catch (e) {

		}
	}
	return rtn
}

function script_move_refresh() {
	let tag = "joint"
	if ($(".move_path_prm").prop("value") == "line") {
		tag = "xyz"
	}
	let speed = $(".default_speed."+tag).prop("value")
	let jerk = [Number($(".default_jerk.0."+tag).prop("value")),
							Number($(".default_jerk.1."+tag).prop("value")),
							Number($(".default_jerk.2."+tag).prop("value")),
							Number($(".default_jerk.3."+tag).prop("value")),
							Number($(".default_jerk.4."+tag).prop("value")),
	]

	$(".move_speed_prm").prop("value", speed)
	$(".move_jerk_prm").prop("value", JSON.stringify(jerk))
	$(".move_joint_prm").prop("value", JSON.stringify(JSON.parse($(".joint_v").text())))
	$(".move_xyz_prm").prop("value", JSON.stringify(JSON.parse($(".xyz_v").text())))

}

function script_sleep_add() {
	let rtn = Number($(".sleep_prm").prop("value"))
	return rtn
}

function set_line_update(data) {
	data.forEach(function(value) {
		if (value["key"] != null) {
			let line_number = Number(value["key"])
			editor.removeLineClass(line_number, 'gutter')
			if (value["state"] >= 5) {
				//console.log("last line executed: ", line_number)
				$(".bar_foot_text").text("Last line executed: "+ line_number)
				// repeat script
				try {
					if (line_number == script["line"][script["line"].length - 1] && $("#script_repeat").prop("checked")) {
						$('#script_play').click()
					}
				} catch (e) {}
			}
		}
	})
}

function set_python_script(data) {
	console.log(data);
	$(".bar_foot_text").text(data["message"])
}
