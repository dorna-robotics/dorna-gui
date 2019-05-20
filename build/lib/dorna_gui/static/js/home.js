// button
$( ".home_b" ).on("click", function(e) {
	e.preventDefault()

	let data = []
	$( ".home_s" ).each(function() {
		if ($(this).prop("checked")){
			data.push($(this).prop("name"))
		}
	});

	socket.emit("method",{
		method: "home",
		prm: {
			"joint": data
		}
	})
});


// set joint
$( ".set_joint_b" ).on("click", function(e) {
	e.preventDefault()
	let new_joint = []
	for (let i = 0; i < 5; i++) {
		new_joint[i] = Number($( ".set_joint_"+i+"_v" ).prop("value"))
	}

	socket.emit("method",{
		method: "set_joint",
		prm: {
			"joint": new_joint
		}
	})
});

// set joint
$( ".calibrate_b" ).on("click", function(e) {
	e.preventDefault()
	let new_joint = []
	for (let i = 0; i < 5; i++) {
		new_joint[i] = Number($( ".set_joint_"+i+"_v" ).prop("value"))
	}

	socket.emit("method",{
		method: "calibrate",
		prm: {
			"joint": new_joint
		}
	})
});



function set_home(data) {
	Object.keys(data).forEach(function(key) {
		/*
		if (data[key]) {
			$('#home_s_'+key).prop( "checked", false );
		}
		*/

		$('.home_v_'+key).html(["Not homed", "Homed"][data[key]])
	})
}
