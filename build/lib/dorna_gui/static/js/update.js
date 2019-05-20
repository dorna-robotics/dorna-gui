$( '#check_for_update_b' ).on( 'click', function( e ) {
	e.preventDefault()
	socket.emit("check_for_update",{})

})

$( '#update_b' ).on( 'click', function( e ) {
	e.preventDefault()

	// path
	let firmware_path = null
	let type = Number($("#firmware_type_l").prop("value"))
	if (type == 1) {
		firmware_path = $("#firmware_s").prop("value")
		firmware_path = firmware_path.replace(/\\/g, '/')
	}

	// port
	let firmware_port = $("#firmware_port_l").prop("value")
	// check for null
	if (firmware_port == "null") {
		firmware_port = null
	}


	socket.emit("method",{
		method: "update_firmware",
		prm: {
			"port_name": firmware_port,
			"firmware_path": firmware_path
		}
	})

})


$( '#reset_board_b' ).on( 'click', function( e ) {
	e.preventDefault()


	// port
	let reset_port = $("#reset_port_l").prop("value")
	// check for null
	if (reset_port == "null") {
		reset_port = null
	}


	socket.emit("method",{
		method: "reset_board",
		prm: {
			"port_name": reset_port
		}
	})

})

$(document).on('click', '#update_software_b', function(){
	socket.emit("update_software",{})
});

/*
var time_out;
function set_update_firmware(message){
	
	console.log("firmware message: ", message)	
	try {
		clearTimeout(time_out)
	} catch (e) {
	}

	$("#firmware_m").text(message["message"])

	if (message["status"] != 1) {
		setTimeout(function(){ 
			$("#firmware_m").text(""); }, 10000);
	}
}

*/
$( "#firmware_type_l" ).on("input", function(e) {
	 if ($(this).prop("value") == "1") {
		 $("#open_firmware").show()
	 }else {
		 $("#open_firmware").hide()
	 }
 });
