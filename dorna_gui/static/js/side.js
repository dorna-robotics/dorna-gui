
$( '.nav_btn' ).on( 'click', function( e ) {
	e.preventDefault()

	// close active panel
	$( ".sidepanel" ).filter(".active").each(function() {
		$(this).removeClass("active")
		this.style.display = "none";
		//this.style.width = "0px";
	});

	// close active nav button
	$( ".nav_btn" ).filter(".active").each(function() {
		$(this).removeClass("active")
	});

	// activate nav button
	$(this).addClass("active")

	// Open the panel
	let id = $(this).prop("name") + "_panel"
	$("#"+id).addClass("active")
	document.getElementById(id).style.display = "block";
	//document.getElementById(id).style.width = "350px";

	//script update
	if (id == "script_panel") {
		editor.refresh()
	}
})


$( '.full_screen' ).on( 'click', function( e ) {
	e.preventDefault()

	// close active panel
	$( ".sidepanel" ).filter(".active").each(function() {
		//$(this).removeClass("active")
		//this.style.display = "none";
		$( '.full_screen' ).toggle()
		$( '.full_screen_exit' ).toggle()
		this.style.width = "100%";
	});

})

$( '.full_screen_exit' ).on( 'click', function( e ) {
	e.preventDefault()

	// close active panel
	$( ".sidepanel" ).filter(".active").each(function() {
		//$(this).removeClass("active")
		//this.style.display = "none";
		$( '.full_screen_exit' ).toggle()
		$( '.full_screen' ).toggle()
		this.style.width = "350px";
	});

})

$( '.side_close' ).on( 'click', function( e ) {
	e.preventDefault()

	// close active panel
	$( ".sidepanel" ).filter(".active").each(function() {
		$(this).removeClass("active")
		this.style.display = "none";
		//this.style.width = "0px";
	});

	// close active sidebar
	$( ".nav_btn" ).filter(".active").each(function() {
		$(this).removeClass("active")
	});
})


let coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
		let arrow = $(this).children(".t_0")
		arrow.children(".t_1").toggle()

    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

$( ".view_screen" ).on("click", function(e) {
	$("#view-fullscreen").toggle()
	$("#cancel-fullscreen").toggle()
});


$( '#graphic_on' ).on( 'click', function( e ) {
  $( '#graphic_on' ).toggle()
  $( '#graphic_off' ).toggle()
  init_scene()
  graphic_on()
  init_collada()
  init_page()
})


$( '#graphic_off' ).on( 'click', function( e ) {
  $( '#graphic_on' ).toggle()
  $( '#graphic_off' ).toggle()
  graphic_off(scene)
  destroy_scene()
})