//function to set height of preload element
function setPreloadHeight() {
  const preloads = document.querySelectorAll('.preload');

  preloads.forEach(preload => {
    let img =
        preload.firstElementChild.nodeName === 'IMG' &&
        preload.firstElementChild,
      aspectRatio;
    if (img)
      aspectRatio = img.getAttribute('width') / img.getAttribute('height');

    preload.style.paddingTop = aspectRatio ? `${100 / aspectRatio}%` : '56.25%';
  });
}

//Function to create an Intersection Observer
function createObserver(callback, options) {
  const defaultOptions = {
    root: null,
    rootMargin: '150px',
    threshold: 0,
  };
  if (!options) return new IntersectionObserver(callback, defaultOptions);
  return new IntersectionObserver(callback, options);
}

//Function to handle intersection of "image-container" to the root
function handleImageIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      let container = entry.target;
      let img = container.children[0];
      let placeholder = img.dataset.placeholder;
      let src = img.dataset.src;

      if (placeholder) {
        img.src = placeholder;
      }
      img.onload = () => {
        container.classList.remove('preload');
        container.style.removeProperty('padding-top');
      };
      fetch(src)
        .then(response => response.blob())
        .then(imgBlob => {
          img.src = URL.createObjectURL(imgBlob);
          img.classList.remove('blur');
        });

      observer.unobserve(entry.target);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const lazyImageContainers = Array.from(
    document.querySelectorAll('.lazy-img')
  );
  setPreloadHeight();

  if (
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype
  ) {
    let imageObserver = createObserver(handleImageIntersection);
    lazyImageContainers.forEach(async container => {
      imageObserver.observe(container);
    });
  }
});
