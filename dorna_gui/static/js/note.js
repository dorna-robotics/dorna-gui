$(".note_colse").on("click", function(){
	$("#note").hide()
})

function set_note(message){
	$("#note_msg").html(message["message"])
	$("#note").show()
}
