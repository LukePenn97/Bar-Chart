
$(document).ready(function(){
  function hider(){
    $("p").toggle();
  }
  let intervalHide;
  $("#start").click(function(){
    intervalHide = setInterval(hider, 1000);
  })
  $("#stop").click(function(){
    clearInterval(intervalHide);
    $("p").show();
  })
});