$( '#connect_b' ).on( 'click', function( e ) {
	e.preventDefault()

	let type = Number($("#connection_type_l").prop("value"))

	let config_path = $("#connect_config_s").prop("value")
	config_path = config_path.replace(/\\/g, '/')

	let port_name = $("#connection_port_l").prop("value")
	// check for null
	if (port_name == "null") {
		port_name = null
	}

	socket.emit("method",{
		method: "connect",
		prm: {
			"port_name": port_name
		},
		type: type,
		config_path: config_path
	})

	init_page()

})

$( '#disconnect_b' ).on( 'click', function( e ) {
	e.preventDefault()

	socket.emit("method",{
		method: "disconnect",
		prm: {}
	})

})

$( "#connection_type_l" ).on("input", function(e) {
	 if ($(this).prop("value") == "1") {
		 $("#open_config").show()
	 }else {
		 $("#open_config").hide()
	 }
 });

function set_server_status(status) {
	$(".server_status").text(status)

	if(status == "Connected"){
		$("#server_icon").removeClass("red_dot")
		$("#server_icon").addClass("green_dot")

		// get the robot status	
		init_page()

	}else{
		$("#server_icon").removeClass("green_dot")
		$("#server_icon").addClass("red_dot")
	}
}


function set_device(data) {
	let progress = document.getElementById("connection_progress")

	let table = document.getElementById("connection_t")
	table.rows[0].cells[1].innerHTML = ['Disconnected', 'Connecting', 'Connected'][data["connection"]]
	table.rows[1].cells[1].innerHTML = ["Stopped", "Working"][data["state"]]
	table.rows[2].cells[1].innerHTML = data["id"]
	table.rows[3].cells[1].innerHTML = data["port"]
	/*table.rows[4].cells[1].innerHTML = data["config"]*/
	/*table.rows[5].cells[1].innerHTML = data["version"]*/
	table.rows[6].cells[1].innerHTML = data["fv"]

	$(".config_path_l").prop("value", data["config"])
	// connected
	if (data["connection"] == 2) {
		progress.style.width = 0+"%"
		$("#connct_div").hide()
		$("#disconnct_div").show()
		
		$("#robot_icon").removeClass("red_dot")
		$("#robot_icon").addClass("green_dot")

	}else if(data["connection"] == 0){
		progress.style.width = 0+"%"
		$("#disconnct_div").hide()
		$("#connct_div").show()

		$("#robot_icon").removeClass("green_dot")
		$("#robot_icon").addClass("red_dot")
	}

}

function set_percentage(data) {

	//let progress = document.getElementById("connection_progress")
	let progress = $("#connection_progress")
	// percentage
	let percentage = Math.floor( 100*data["nom"]/data["denom"])
	//progress.style.width = percentage.toString()+"%"
	progress.css({"width":percentage.toString()+"%"})
	let table = document.getElementById("connection_t")
	table.rows[0].cells[1].innerHTML = 'Connecting...'+percentage+ '%'
}

$( '.port_refresh_b' ).on( 'click', function( e ) {
	e.preventDefault()

	socket.emit("method",{
		method: "port_list",
		prm: {}
	})
})

$( '.halt' ).on( 'click', function( e ) {
	e.preventDefault();
	script = {
	 "line":[],
	 "map": [],
	 "commands":[]
	 }
	 socket.emit("method",{
		 method: "halt",
		 prm: {}
	 })
})


function set_port_list(data) {
	//clear
	$(".port_l").empty()
	//add
	$('.port_l').append('<option value="null" selected>Automatic</option>');
	for (let i = 0 ; i < data.length; i++) {
		$('.port_l').append("<option value='" + data[i]+ "'>" + data[i] + "</option>");
	}
}
