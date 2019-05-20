/*
let command_e = CodeMirror.fromTextArea($(".command_t")[0], {
  lineNumbers : false,
  lineWrapping: true,
  matchBrackets: true,
  autoCloseBrackets: true,
  mode: "application/json",

})
*/

function set_scale(data) {
  let speed = Math.round(data["speed"]*100)
  let jerk = Math.round(data["jerk"]*100)
  $("#speed_scale_s").prop("value", speed)
  $("#speed_scale_n").prop("value", speed)
  $("#jerk_scale_s").prop("value", jerk)
  $("#jerk_scale_n").prop("value", jerk)
}
//slider and input
$( ".bind_t_1" ).on("input", function(e) {
  let input = $($(this).prop("name"))
  input.prop("value", $(this).prop("value"))
});

// range
$( ".bind_s" ).on("input", function(e) {
  let _type = null
  let ref = null

  if ($(this).prop("id").includes("speed")) {
    _type = "speed"
    ref = $( "#speed_scale_s")
  }else if ($(this).prop("id").includes("jerk")) {
    _type = "jerk"
    ref = $( "#jerk_scale_s")
  }else {
    return 0
  }

  let _prm = {}
  _prm[_type] = Number(ref.prop("value"))/100
  console.log(_prm);
  socket.emit("method",{
    method: "set_scale",
    prm: {
      "prm": _prm
    }
  })
});
