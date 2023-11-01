let isDesktop = true;
//reconfigure UI based on breakpoints
$(window).on("load resize", function () {
  const panel = document.querySelector(".left-panel");
  const top = document.querySelector(".left-panel .top");
  const middle = document.querySelector(".left-panel .middle");
  const bottom = document.querySelector(".left-panel .bottom");
  const left = document.querySelector(".left-panel .mobile .left");
  const right = document.querySelector(".left-panel .mobile .right");
  if ($(this).width() < 1216) {
    if (isDesktop) {
      panel.removeChild(top);
      panel.removeChild(middle);
      panel.removeChild(bottom);
      left.appendChild(top);
      left.appendChild(bottom);
      right.appendChild(middle);
      isDesktop = false;
    }
  } else {
    if (!isDesktop) {
      left.removeChild(top);
      right.removeChild(middle);
      left.removeChild(bottom);
      panel.appendChild(top);
      panel.appendChild(middle);
      panel.appendChild(bottom);
      isDesktop = true;
    }
  }
});
