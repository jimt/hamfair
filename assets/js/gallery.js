document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.querySelector('.lightbox');
  const modal = new bootstrap.Modal(lightbox);
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const thumbnails = document.querySelectorAll('.gallery-thumbnail');
  let currentIndex = 0;

  // Convert thumbnails to array for easier navigation
  const images = Array.from(thumbnails).map(thumb => ({
    thumbnail: thumb.src,
    original: thumb.dataset.original,
    caption: thumb.dataset.caption
  }));

  function showImage(index) {
    currentIndex = index;
    lightboxImg.src = images[index].original;
    lightboxImg.alt = images[index].caption.replace(/<[^>]*>/g, ''); // Strip HTML for alt text
    lightboxCaption.innerHTML = images[index].caption; // Use innerHTML to render HTML in caption
    modal.show();
  }

  // Thumbnail click handler
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => showImage(index));
  });

  // Navigation handlers
  function showPrevious() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].original;
    lightboxImg.alt = images[currentIndex].caption.replace(/<[^>]*>/g, '');
    lightboxCaption.innerHTML = images[currentIndex].caption;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].original;
    lightboxImg.alt = images[currentIndex].caption.replace(/<[^>]*>/g, '');
    lightboxCaption.innerHTML = images[currentIndex].caption;
  }

  prevBtn.addEventListener('click', showPrevious);
  nextBtn.addEventListener('click', showNext);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
      if (e.key === 'ArrowLeft') showPrevious();
      if (e.key === 'ArrowRight') showNext();
    }
  });

  // Touch swipe handling
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeLength = touchEndX - touchStartX;

    if (Math.abs(swipeLength) > swipeThreshold) {
      if (swipeLength > 0) {
        showPrevious();
      } else {
        showNext();
      }
    }
  }
});
