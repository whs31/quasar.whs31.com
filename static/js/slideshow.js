(function () {
  var slides = document.querySelectorAll('.slide');
  var dots   = document.querySelectorAll('.slide-dot');

  var current = 0;
  var interval = 5000;

  function loadImage(slide) {
    var image = slide.querySelector('img[data-src]');
    if (!image) return;
    image.src = image.getAttribute('data-src');
    image.removeAttribute('data-src');
  }

  function loadVideo(video) {
    var source = video.querySelector('source[data-src]');
    if (!source) return;
    source.src = source.getAttribute('data-src');
    source.removeAttribute('data-src');
    video.load();
  }

  function loadSlide(slide) {
    if (!slide) return;
    loadImage(slide);
    var video = slide.querySelector('video');
    if (video) loadVideo(video);
  }

  function videoIn(slide) {
    var v = slide.querySelector('video');
    if (!v) return;
    loadVideo(v);
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
    loadSlide(slides[current]);
    loadSlide(slides[(current + 1) % slides.length]);
    videoIn(slides[current]);
  }

  if (slides.length) {
    loadSlide(slides[0]);
    loadSlide(slides[1]);
    videoIn(slides[0]);
  }

  if (slides.length > 1) {
    var timer = setInterval(function () { goTo(current + 1); }, interval);

    Array.prototype.forEach.call(dots, function (dot, i) {
      dot.addEventListener('click', function () {
        clearInterval(timer);
        goTo(i);
        timer = setInterval(function () { goTo(current + 1); }, interval);
      });
    });
  }

  var lazyVideos = document.querySelectorAll('video[data-lazy-video]');

  function loadArticleVideo(video) {
    if (!video.getAttribute('data-src')) return;
    video.src = video.getAttribute('data-src');
    video.removeAttribute('data-src');
    video.load();
    if (video.autoplay) video.play().catch(function () {});
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        loadArticleVideo(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '400px 0px' });

    Array.prototype.forEach.call(lazyVideos, function (video) {
      observer.observe(video);
    });
  } else {
    Array.prototype.forEach.call(lazyVideos, loadArticleVideo);
  }
})();
