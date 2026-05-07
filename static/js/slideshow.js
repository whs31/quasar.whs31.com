(function () {
  new SweetScroll({});

  var slides = document.querySelectorAll('.slide');
  var dots   = document.querySelectorAll('.slide-dot');
  if (slides.length < 2) return;

  var current = 0;
  var interval = 5000;

  function videoIn(slide) {
    var v = slide.querySelector('video');
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(function () {});
  }

  function videoOut(slide) {
    var v = slide.querySelector('video');
    if (v) v.pause();
  }

  function goTo(n) {
    videoOut(slides[current]);
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = ((n % slides.length) + slides.length) % slides.length;

    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    videoIn(slides[current]);
  }

  videoIn(slides[0]);

  var timer = setInterval(function () { goTo(current + 1); }, interval);

  Array.prototype.forEach.call(dots, function (dot, i) {
    dot.addEventListener('click', function () {
      clearInterval(timer);
      goTo(i);
      timer = setInterval(function () { goTo(current + 1); }, interval);
    });
  });
})();
