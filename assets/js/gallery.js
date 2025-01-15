document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return; // Exit if lightbox element doesn't exist
  
  // Wait for Bootstrap to be available
  if (typeof bootstrap === 'undefined') {
    console.error('Bootstrap is not loaded');
    return;
  }
  
  const modal = new bootstrap.Modal(lightbox, {
    backdrop: true,
    keyboard: true
  });
  
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const thumbnails = document.querySelectorAll('.gallery-thumbnail');
  let currentIndex = 0;
  const maxIndex = thumbnails.length - 1;

  // Convert thumbnails to array for easier navigation
  const images = Array.from(thumbnails).map(thumb => ({
    thumbnail: thumb.src,
    original: thumb.dataset.original,
    caption: thumb.dataset.caption
  }));

  function updateNavigationButtons() {
    if (prevBtn) prevBtn.classList.toggle('disabled', currentIndex === 0);
    if (nextBtn) nextBtn.classList.toggle('disabled', currentIndex === maxIndex);
  }

  function showImage(index) {
    // Prevent going out of bounds
    if (index < 0 || index > maxIndex) return;
    
    currentIndex = index;
    lightboxImg.src = images[index].original;
    lightboxImg.alt = images[index].caption.replace(/<[^>]*>/g, ''); // Strip HTML for alt text
    lightboxCaption.innerHTML = images[index].caption; // Use innerHTML to render HTML in caption
    updateNavigationButtons();
    modal.show();
  }

  // Thumbnail click handler
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => showImage(index));
  });

  // Navigation handlers
  function showPrevious() {
    if (currentIndex > 0) {
      showImage(currentIndex - 1);
    }
  }

  function showNext() {
    if (currentIndex < maxIndex) {
      showImage(currentIndex + 1);
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', showPrevious);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

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

  // Initialize button states
  updateNavigationButtons();
});
