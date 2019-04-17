
function dragElement(elmnt, anchor, parent) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (anchor) {

    anchor.on("mousedown", dragMouseDown);
  } else {

    elmnt.on("mousedown", dragMouseDown);
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:

    let left = Number(elmnt.css("left").substring(0, elmnt.css("left").length-2))
    let top = Number(elmnt.css("top").substring(0, elmnt.css("top").length-2))

    elmnt.css('top', Math.min(Math.max(0, top -pos2) , parent.height()- elmnt.height()));
    elmnt.css('left', Math.min(Math.max(0, left -pos1) , parent.width()- elmnt.width()));

  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


dragElement($(".general_info"), $(".info_drag_bar"), $(".c_1"));


var min = 300;
var max = 3600;
var mainmin = 200;

$('#split-bar').mousedown(function (e) {
    e.preventDefault();
    $(document).mousemove(function (e) {
        e.preventDefault();
        var x = e.pageX - $('.c_1').offset().left;
        if (x > min && x < max && e.pageX < ($(window).width() - mainmin)) {
          $('.c_1').css("width", x);
          $('.c_0').css("margin-left", x);
        }
    })
});
$(document).mouseup(function (e) {
    $(document).unbind('mousemove');
});
