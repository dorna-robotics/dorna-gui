// socket
var socket = io.connect('http://' + document.domain + ':' + location.port);

// connect
socket.on( 'connect', function( ){
  set_server_status("Connected")
})
// disconnect
socket.on( 'disconnect', function( ){
  set_server_status("Disconnected")
})

// receive
socket.on( 'log', function( msg ) {
  msg = JSON.parse(msg)
	

  switch (msg["type"]) {
    case "receive":
      set_log(JSON.stringify(msg["message"]), "receive")
      break
    case "send":
      set_log(JSON.stringify(msg["message"]), "send")
      break
    case "device":
      set_device(msg["message"])
      break;
    case "connect_percentage":
  		set_percentage(msg["message"])
      break;
    case "io":

      set_io(msg["message"])
    	break;
    case "joint":
      //msg["message"] = round(msg["message"] , 3)
  		set_joint(msg)
      break;
    case "xyz":
      //msg["message"] = round(msg["message"] , 3)
  		set_xyz(msg)
      break;
    case "scale":
      //msg["message"] = round(msg["message"] , 3)
  		set_scale(msg["message"])
      break;
  	case "homed":
  		set_home(msg["message"])
      break;
  	case "port_list":
  		set_port_list(msg["message"])
      break;
  	case "line_update":
  		set_line_update(msg["message"])
      break;
    case "config":
  		set_config(msg["message"])
      break;
    case "download_config":
      set_download_config(msg["message"])
      break;
    case "python_script":
      set_python_script(msg["message"])
      break;
    case "note":
      set_note(msg["message"])
      break;      
  	case "update_firmware":
      set_note(msg["message"])
  }
})



function init_page() {
  _init = [
          {"method": "device", "prm": {}, "log_key": "device"},
          {"method": "io", "prm": {}, "log_key": "io"},
          {"method": "scale", "prm": {}, "log_key": "scale"},
          {"method": "homed", "prm": {}, "log_key": "homed"},
          {"method": "config", "prm": {}, "log_key": "config"},
          {"method": "position", "prm": {"space": "joint"}, "log_key": "joint"},
          {"method": "position", "prm": {"space": "xyz"}, "log_key": "xyz"},
        ]
  for (let i = 0; i < _init.length; i++) {
    socket.emit("method",{
  		method: _init[i]["method"],
  		prm: _init[i]["prm"],
      log_key: _init[i]["log_key"]
  	})
  }

}
init_page()

function send_method(method_name, obj, event) {
	event.preventDefault()
	let data = $(obj).serializeToJSON({
		parseFloat: {
			condition: ".number,.money"
		}
	})

	socket.emit("method",{
		method: method_name,
		prm: data
	})

}


function round(data, p){

  for (index = 0; index < data.length; ++index) {
      data[index] = Math.round(data[index]*(Math.pow(10, p)))/Math.pow(10, p);
  }

  return data
}


function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}