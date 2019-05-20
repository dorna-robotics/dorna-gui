// save
$( '#save_config_b' ).on( 'click', function( e ) {
	e.preventDefault()

	let save_path = $(".config_path_s").prop("value")
	save_path = save_path.replace(/\\/g, '/')

	
	socket.emit("method",{
		method: "save_config",
		prm: {
			"save_path": save_path
		}
	})
})

// download
$( '#download_config_b' ).on( 'click', function( e ) {
	e.preventDefault()
	socket.emit("download_config", null)
})

// unit
$( '#unit_b' ).on( 'click', function( e ) {
	e.preventDefault()
	let unit = $('input[name=length_r]:checked').prop("value");

	socket.emit("method",{
		method: "set_unit",
		prm: {
			"unit": {"length": unit}
		}
	})

	init_page()
})

// toolhead
$( '#toolhead_b' ).on( 'click', function( e ) {
	e.preventDefault()

	let prm = {
		"x": Number($('input[name=tool_head_length_x]').prop("value"))
	};

	socket.emit("method",{
		method: "set_toolhead",
		prm: {
			"prm": prm
		}
	})
})

// limit
$( '#limit_b' ).on( 'click', function( e ) {
	e.preventDefault()
	let prm = {
		"j0": [Number($('.limit.j0.0').prop("value")), Number($('.limit.j0.1').prop("value"))],
		"j1": [Number($('.limit.j1.0').prop("value")), Number($('.limit.j1.1').prop("value"))],
		"j2": [Number($('.limit.j2.0').prop("value")), Number($('.limit.j2.1').prop("value"))],
	};

	socket.emit("method",{
		method: "set_limit",
		prm: {
			"prm": prm
		}
	})
})

// default_speed
$( '#default_speed_b' ).on( 'click', function( e ) {
	e.preventDefault()
	let prm = {
		"joint": Number($('.default_speed.joint.0').prop("value")),
		"xyz": Number($('.default_speed.xyz.0').prop("value")),
	};

	socket.emit("method",{
		method: "set_default_speed",
		prm: {
			"prm": prm
		}
	})
})

// default_jerk
$( '#default_jerk_b' ).on( 'click', function( e ) {
	e.preventDefault()
	let prm = {
		"joint": [Number($('.default_jerk.joint.0').val()),
							Number($('.default_jerk.joint.1').val()),
							Number($('.default_jerk.joint.2').val()),
							Number($('.default_jerk.joint.3').val()),
							Number($('.default_jerk.joint.4').val()),],
		"xyz": [Number($('.default_jerk.xyz.0').val()),
							Number($('.default_jerk.xyz.1').val()),
							Number($('.default_jerk.xyz.2').val()),
							Number($('.default_jerk.xyz.3').val()),
							Number($('.default_jerk.xyz.4').val()),],
	};

	socket.emit("method",{
		method: "set_default_jerk",
		prm: {
			"prm": prm
		}
	})
})

// motion
$( '#motion_b' ).on( 'click', function( e ) {
	e.preventDefault()
	let prm = {
		"ct": Number($(".motion.ct").prop("value")),
		"gpa": Number($(".motion.gpa").prop("value")),
		"jt":Number($(".motion.jt").prop("value"))
	};
	socket.emit("method",{
		method: "set_motion",
		prm: {
			"prm": prm
		}
	})
})

// cancel config
$( '.config_cancel_b' ).on( 'click', function( e ) {
	e.preventDefault()
	init_page()
})



function set_range(unit, toolhead){

	let scale = 1
	if (unit == "mm"){
		scale = 25.4
	}
	let min_max = Math.ceil(1.2 * (22.111*scale + toolhead))
	$( ".jog_r.cartesian" ).each(function() {

			$(this).prop("min", -1* min_max)
			$(this).prop("max", min_max)
	});
}

function set_config(data) {
	
	let unit = $(".unit_length:first").text()
	let toolhead = Number($(".toolhead.x").prop("value"))

	// unit
	try {
		$('input[name=length_r]').filter('[value='+data["unit"]["length"]+']').prop('checked', true);
		$(".unit_length").text(data["unit"]["length"].substring(0, 2))
		// update unit
		unit = $(".unit_length:first").text()
		set_range(unit, toolhead)
	} catch (e) {
		console.log(e.message);
	}

	// default_speed
	try {
		let index = ["xyz", "joint"]
		for (let i = 0; i < index.length; i++) {
			$(".default_speed."+index[i]).prop("value", data["default_speed"][index[i]])
		}
	} catch (e) {

	}


	// default_jerk
	try {
		index = ["xyz", "joint"]
		for (let i = 0; i < index.length; i++) {
			for (let j = 0; j < data["default_jerk"][index[i]].length; j++) {
				$(".default_jerk."+index[i] +"."+j).prop("value", data["default_jerk"][index[i]][j])
			}
		}
	} catch (e) {

	}

	//toolhead
	try {
		$(".toolhead.x").prop("value", data["toolhead"]["x"])

		//update toolhead
		toolhead = Number($(".toolhead.x").prop("value"))
		set_range(unit, toolhead)
	} catch (e) {
		console.log(e.message);
	}

	//limit
	try {
		index = ["j0", "j1", "j2"]
		for (let i = 0; i < index.length; i++) {
			for (let j = 0; j < data["limit"][index[i]].length; j++) {
				$(".limit."+index[i] +"."+j).prop("value", data["limit"][index[i]][j])
			}
			let low = (200+data["limit"][index[i]][0])/4
			let high = 100 - (200-data["limit"][index[i]][1])/4

			$("."+index[i] + "_v.jog_r").css({
				"background":"linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 5%, var(--blue) 5%, var(--blue)"+low+"%, var(--gray) "+low+"%, var(--gray) "+high+"%,var(--blue) "+high+"%,var(--blue) 95%,rgba(0,0,0,0) 95%, rgba(0,0,0,0) 100%)"
			})
		}
	} catch (e) {

	}

	//motion
	try {
		index = ["ct", "gpa", "jt"]
		for (let i = 0; i < index.length; i++) {
			$(".motion."+index[i]).prop("value", data["motion"][index[i]])
		}
	} catch (e) {

	}
}

function set_download_config(data){

	//console.log(yaml.dump(data));

	let hiddenElement = document.createElement('a');

	//hiddenElement.href = 'data:attachment/text,' + encodeURI(yaml.dump(data));
	hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(JSON.stringify(data));
	hiddenElement.target = '_blank';
	hiddenElement.download = "config_tmp.json";
	hiddenElement.click();

}
