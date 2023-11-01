//show and hide offline message
window.onoffline = () => {
  $("#offline").css("display", "flex");
};
window.ononline = () => {
  $("#offline").css("display", "none");
};
