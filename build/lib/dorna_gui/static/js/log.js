let log_editor = CodeMirror.fromTextArea($(".log_editor")[0], {
	/*lineNumbers : true,*/
	lineWrapping: false,
	matchBrackets: true,
	autoCloseBrackets: true,
	mode: "application/json",
})

/*

	lineNumbers : false,
	lineWrapping: true,
	matchBrackets: true,
	autoCloseBrackets: true,
	mode: "application/json",
*/

 function set_log(data, type) {

	 if (! $("#log_print").prop("checked")) {
	 		return 0
	 }

	 log_editor.replaceRange(type + ": "+ data+'\n', CodeMirror.Pos(log_editor.lastLine()))

	 log_editor.focus()
	 log_editor.setCursor({line: Infinity, ch: 0})
 }

 $( ".check_btn" ).on("click", function(e) {
	let mode = Number($(this).prop("name"))
 	$(this).prop("name", (mode+1)%2)
 	$(this).children('i').each(function () {
 	    $(this).toggle()
 	});
 });

 $( ".log_close" ).on("click", function(e) {
	 $(".c_0").addClass("t_2")
	 $(".c_1").addClass("t_2")
	 /*
	 $(".c_0").hide()
	 $(".c_1").css({"border-right": "0px", "width": "calc(100% - 37px)"})
	 */
 });

 $( ".log_open" ).on("click", function(e) {
	 $(".c_0").removeClass("t_2")
	 $(".c_1").removeClass("t_2")
	 /*
	$(".c_1").css({"border-right": "0px", "width": "calc(100% - 37px)"})
	$(".c_0").show()
	*/
 });
