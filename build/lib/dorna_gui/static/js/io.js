// servo
$( "#servo" ).on("input", function(e) {
	$('#servo_n').text($(this).prop("value"))
});
/*
$( "#servo" ).mouseup(function(e) {

	let data = {"servo": Number($(this).prop("value"))}

	socket.emit("method",{
		method: "play",
		prm: {
			"commands": {"command": "set_io", "prm": data},
			"append": true
		}
	})
});

$( '.io' ).on( 'change', function( e ) {

	let data = {}
	data[$(this).prop("id")] = 0
	if($(this).prop("checked")){
		data[$(this).prop("id")] = 1
	}
	socket.emit("method",{
		method: "play",
		prm: {
			"commands": {"command": "set_io_async", "prm": data},
			"append": true
		}
	})
})
*/

$( "#servo" ).mouseup(function(e) {

	let data = {"servo": Number($(this).prop("value"))}

	socket.emit("method",{
		method: "play",
		prm: {
			"commands": {"command": "set_io", "prm": data},
			"append": false
		}
	})
});

$( '.io' ).on( 'change', function( e ) {

	let data = {}
	data[$(this).prop("id")] = 0
	if($(this).prop("checked")){
		data[$(this).prop("id")] = 1
	}
	socket.emit("method",{
		method: "play",
		prm: {
			"commands": {"command": "set_io", "prm": data},
			"append": false
		}
	})
})
function set_io(data) {
	Object.keys(data).forEach(function(key) {
		try{

			if(key[0] == "i"){
				$('#'+key).text(["Off", "On"][data[key]])
			}else if(key[0] == "s"){
				$('#servo').prop("value", data[key])
				$('#servo_n').text(data[key])
			}else{
 				$('#'+key).prop("checked", [false, true][data[key]])
			}
		}catch{
		}
	});

}
