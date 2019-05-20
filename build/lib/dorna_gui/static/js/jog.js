function coordinate_map(key){
	if(key[0] == "x"){
		let index = Number(key[key.length - 1])
		return ["x", "y", "z", "a", "b"][index]
	}
	return key
}

function mode_180_180( n ){
	return (((n +180 % 360) + 360) % 360)-180
}

function mode_x( n , x ){
	return (((n +x % (2*x)) + (2*x)) % (2*x))-x
}

function invrs_mode_x( n , m, x ){
	return Math.floor((n + x)/(2*x)) * (2*x) + m
}

function get_speed(mode){
	return Number($(".default_speed."+mode+".0").prop("value"));
}

function get_jerk(mode){
 return [Number($(".default_jerk."+mode+".0").prop("value")),
								 Number($(".default_jerk."+mode+".1").prop("value")),
								 Number($(".default_jerk."+mode+".2").prop("value")),
								 Number($(".default_jerk."+mode+".3").prop("value")),
								 Number($(".default_jerk."+mode+".4").prop("value"))]
}

// jog tab
$( '.jog_tab' ).on( 'click', function( e ) {
	e.preventDefault()

	// close active panel
	$( ".jog_panel" ).filter(".active").each(function() {
		$(this).removeClass("active")
		this.style.display = "none";
	});

	// close active nav button
	$( ".jog_tab" ).filter(".active").each(function() {
		$(this).removeClass("active")
	});

	// activate nav button
	$(this).addClass("active")


	// Open the panel
	let cls = $(this).prop("name")
	$("."+cls+".jog_panel").addClass("active")
	$("."+cls+".jog_panel").css({"display": "block"});

})


// continuous
$( ".jog_b" ).on("mousedown", function(e) {

	// path mode
	let btn = $(this).prop("name").split("_")
	let data = {"path": "line", "movement": 1}
	let mode = "xyz"
	if (btn[0][0] == "j") {
		data["path"] = "joint"
		mode = "joint"
	}

	// avoid step jog
	let step = $("#jog_"+mode+"_step_c").prop("checked")
	if (step == true) {
		return
	}

	data[coordinate_map(btn[0])] = Number(btn[1])*360

	// speed
	try {
		data["speed"] = get_speed(mode)
	} catch (e) {

	}

	// speed
	try {
		data["jerk"] = get_jerk(mode)
	} catch (e) {

	}
	socket.emit("method",{
		method: "play",
		prm: {
			"commands": {"command": "move", "prm": data, },
			"append": false
		}
	})
});

// discrete
$( ".jog_b" ).on("click", function(e) {

	// path mode
	let btn = $(this).prop("name").split("_")
	let data = {"path": "line", "movement": 1}
	let mode = "xyz"
	if (btn[0][0] == "j") {
		data["path"] = "joint"
		mode = "joint"
	}

	if ($("#jog_"+mode+"_step_c").prop("checked") == false) {

		return
	}

	let step = $("#jog_"+mode+"_step_v").prop("value")

	data[coordinate_map(btn[0])] = Number(btn[1])*step
	// speed
	try {
		data["speed"] =	get_speed(mode)
	} catch (e) {

	}

	// speed
	try {
		data["jerk"] =	get_jerk(mode)
	} catch (e) {

	}
	socket.emit("method",{
		method: "play",
		prm: {
			"commands": {"command": "move", "prm": data, },
			"append": false
		}
	})
});



$( ".jog_b" ).on("mouseup", function(e) {

	let btn = $(this).prop("name").split("_")
	let mode = "xyz"
	if (btn[0][0] == "j") {
		mode = "joint"
	}

	if ($("#jog_"+mode+"_step_c").prop("checked") == true) {
		return
	}
	
	socket.emit("method",{
		method: "halt",
		prm: {}
	})

	//$( '.halt' ).click()
});



// range submit
$( ".jog_r" ).mouseup(function(e) {
	let range_max = Number($(this).prop("max"))

	let position = $(this).prop("name")
	let value = Number($(this).prop("value"))

	let coordinate_mode = "xyz"
	let path = "line"
	if (position[0] == "j") {
		coordinate_mode = "joint"
		path = "joint"
	}
	//update value
	let value_orig = Number($("."+$(this).prop("name") + "_t:first").text())
	let display = $("."+$(this).prop("name") + "_v.number_t_1")


	display.prop("value", value_orig)
	$(this).prop("value", mode_x(value_orig, 0.9 * range_max))



	// module
	value = invrs_mode_x(value_orig, value, 0.9 * range_max)

	let data = {"path": path, "movement": 0}
	data[coordinate_map(position)] = Number(value)

	// speed
	try {
		data["speed"] =	get_speed(coordinate_mode)
	} catch (e) {

	}

	// speed
	try {
		data["jerk"] =	get_jerk(coordinate_mode)
	} catch (e) {

	}

	socket.emit("method",{
		method: "play",
		prm: {
			"commands": {"command": "move", "prm": data},
			"append": false
		}
	})

});

// range show
$( ".jog_r" ).on("input", function(e) {
		let value = Number($(this).prop("value"))
		let range_max = Number($(this).prop("max"))

		let display = $("."+$(this).prop("name") + "_v.number_t_1")
		let value_orig =Number($("."+$(this).prop("name") + "_t:first").text())

		if (Math.abs(value) == range_max){
			$(this).prop("value", mode_x(value_orig, 0.9 * range_max))
			display.prop("value", value_orig)
			return
		}

		// module
		value = invrs_mode_x(value_orig, value, 0.9 * range_max)

		display.prop("value", value)

});


// button
$( ".jog_go" ).on("click", function(e) {
	let coordinate_mode = "xyz"
	let name = $(this).prop("name")
	if (name == "joint") {
		coordinate_mode = "joint"
	}
	let data = {"movement": 0}

	data["path"] = name

	data[coordinate_mode] = []
	for (let i = 0; i < 5; i++) {
		data[coordinate_mode].push(
				Number($("."+coordinate_mode+"_"+i).prop("value"))
			)
	}
	// speed
	try {
		data["speed"] =	get_speed(coordinate_mode)
	} catch (e) {

	}

	// speed
	try {
		data["jerk"] =	get_jerk(coordinate_mode)
	} catch (e) {

	}
	socket.emit("method",{
		method: "play",
		prm: {
			"commands": {"command": "move", "prm": data, },
			"append": false
		}
	})

});

/*
$(".jog_b").mouseleave(function(){
	if ($(this).mouseup()) {
		console.log("leaving")
	}
});
*/

$(".refresh_position").on("click", function(e){
	e.preventDefault()
	init_page()	

})