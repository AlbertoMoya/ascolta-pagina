/* =========================================================
   HEADER
========================================================= */

const siteHeader =
  document.getElementById('siteHeader');

const menuButton =
  document.getElementById('menuButton');

const mobileMenu =
  document.getElementById('mobileMenu');


function updateHeaderState() {

  if (!siteHeader) {
    return;
  }

  if (window.scrollY > 20) {

    siteHeader.classList.add('scrolled');

  } else {

    siteHeader.classList.remove('scrolled');

  }

}


updateHeaderState();


window.addEventListener(
  'scroll',
  updateHeaderState,
  {
    passive: true
  }
);


/* =========================================================
   MENÚ MÓVIL
========================================================= */

if (menuButton && mobileMenu) {

  menuButton.addEventListener(
    'click',
    () => {

      const isOpen =
        mobileMenu.classList.toggle('open');


      menuButton.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

    }
  );


  mobileMenu
    .querySelectorAll('a')
    .forEach((link) => {

      link.addEventListener(
        'click',
        () => {

          mobileMenu
            .classList
            .remove('open');


          menuButton.setAttribute(
            'aria-expanded',
            'false'
          );

        }
      );

    });

}


/* =========================================================
   REVEAL ON SCROLL
========================================================= */

const revealElements =
  document.querySelectorAll('.reveal');


if ('IntersectionObserver' in window) {

  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }


          entry.target
            .classList
            .add('visible');


          observer.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.18
      }
    );


  revealElements.forEach(
    (element) => {

      revealObserver.observe(
        element
      );

    }
  );

} else {

  revealElements.forEach(
    (element) => {

      element
        .classList
        .add('visible');

    }
  );

}


/* =========================================================
   COUNTER
========================================================= */

const counters =
  document.querySelectorAll('.counter');


function animateCounter(counter) {

  const target =
    Number(
      counter.dataset.target || 0
    );


  const duration =
    1400;


  const startTime =
    performance.now();


  function step(currentTime) {

    const elapsed =
      currentTime - startTime;


    const progress =
      Math.min(
        elapsed / duration,
        1
      );


    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    const value =
      Math.round(
        target * eased
      );


    counter.textContent =
      value;


    if (progress < 1) {

      requestAnimationFrame(
        step
      );

    } else {

      counter.textContent =
        target;

    }

  }


  requestAnimationFrame(
    step
  );

}


if (
  'IntersectionObserver' in window &&
  counters.length
) {

  const counterObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }


          animateCounter(
            entry.target
          );


          observer.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.5
      }
    );


  counters.forEach(
    (counter) => {

      counterObserver.observe(
        counter
      );

    }
  );

}


/* =========================================================
   CARRUSEL DE OPERACIÓN
========================================================= */

const pillarsCarousel =
  document.getElementById(
    'pillarsCarousel'
  );


const pillarsPrev =
  document.getElementById(
    'pillarsPrev'
  );


const pillarsNext =
  document.getElementById(
    'pillarsNext'
  );


const pillarsDots =
  document.getElementById(
    'pillarsDots'
  );


let carouselPositions =
  [];


/* =========================================================
   CALCULAR POSICIONES
========================================================= */

function buildCarouselPositions() {

  if (!pillarsCarousel) {
    return;
  }


  const cards =
    Array.from(
      pillarsCarousel.querySelectorAll(
        '.pillar-card'
      )
    );


  const maxScroll =
    pillarsCarousel.scrollWidth -
    pillarsCarousel.clientWidth;


  const rawPositions =
    cards.map(
      (card) => {

        return Math.min(
          card.offsetLeft,
          maxScroll
        );

      }
    );


  carouselPositions =
    rawPositions.filter(
      (position, index) => {

        if (index === 0) {
          return true;
        }


        return (
          Math.abs(
            position -
            rawPositions[index - 1]
          ) > 8
        );

      }
    );


  if (!carouselPositions.length) {

    carouselPositions = [0];

  }


  buildCarouselDots();

  updateCarouselControls();

}


/* =========================================================
   DOTS
========================================================= */

function buildCarouselDots() {

  if (!pillarsDots) {
    return;
  }


  pillarsDots.innerHTML =
    '';


  carouselPositions.forEach(
    (position, index) => {

      const dot =
        document.createElement(
          'button'
        );


      dot.type =
        'button';


      dot.className =
        'carousel-dot';


      dot.setAttribute(
        'aria-label',
        `Ir a la vista ${index + 1}`
      );


      dot.addEventListener(
        'click',
        () => {

          pillarsCarousel.scrollTo({

            left:
              position,

            behavior:
              'smooth'

          });

        }
      );


      pillarsDots.appendChild(
        dot
      );

    }
  );

}


/* =========================================================
   POSICIÓN ACTUAL
========================================================= */

function getClosestCarouselIndex() {

  if (
    !pillarsCarousel ||
    !carouselPositions.length
  ) {

    return 0;

  }


  const current =
    pillarsCarousel.scrollLeft;


  let closestIndex =
    0;


  let closestDistance =
    Math.abs(
      carouselPositions[0] -
      current
    );


  carouselPositions.forEach(
    (position, index) => {

      const distance =
        Math.abs(
          position -
          current
        );


      if (
        distance <
        closestDistance
      ) {

        closestDistance =
          distance;


        closestIndex =
          index;

      }

    }
  );


  return closestIndex;

}


/* =========================================================
   CONTROLES
========================================================= */

function updateCarouselControls() {

  if (
    !pillarsCarousel ||
    !carouselPositions.length
  ) {

    return;

  }


  const activeIndex =
    getClosestCarouselIndex();


  if (pillarsPrev) {

    pillarsPrev.disabled =
      activeIndex <= 0;

  }


  if (pillarsNext) {

    pillarsNext.disabled =
      activeIndex >=
      carouselPositions.length - 1;

  }


  if (pillarsDots) {

    Array.from(
      pillarsDots.children
    )
      .forEach(
        (dot, index) => {

          dot.classList.toggle(
            'active',
            index === activeIndex
          );

        }
      );

  }

}


/* =========================================================
   EVENTOS DEL CARRUSEL
========================================================= */

if (pillarsCarousel) {

  buildCarouselPositions();


  if (pillarsPrev) {

    pillarsPrev.addEventListener(
      'click',
      () => {

        const currentIndex =
          getClosestCarouselIndex();


        const targetIndex =
          Math.max(
            0,
            currentIndex - 1
          );


        pillarsCarousel.scrollTo({

          left:
            carouselPositions[
              targetIndex
            ],

          behavior:
            'smooth'

        });

      }
    );

  }


  if (pillarsNext) {

    pillarsNext.addEventListener(
      'click',
      () => {

        const currentIndex =
          getClosestCarouselIndex();


        const targetIndex =
          Math.min(
            carouselPositions.length - 1,
            currentIndex + 1
          );


        pillarsCarousel.scrollTo({

          left:
            carouselPositions[
              targetIndex
            ],

          behavior:
            'smooth'

        });

      }
    );

  }


  pillarsCarousel.addEventListener(
    'scroll',
    () => {

      requestAnimationFrame(
        updateCarouselControls
      );

    },
    {
      passive: true
    }
  );


  window.addEventListener(
    'resize',
    buildCarouselPositions
  );

}


/* =========================================================
   PARALLAX TECNOLOGÍA
========================================================= */

const technologySection =
  document.querySelector(
    '.technology-section'
  );


function updateTechnologyMobileParallax() {

  if (!technologySection) {
    return;
  }


  /*
   * En escritorio CSS utiliza:
   *
   * background-attachment: fixed
   */
  if (window.innerWidth > 720) {

    technologySection.style
      .removeProperty(
        '--tech-mobile-position'
      );


    return;

  }


  const rect =
    technologySection
      .getBoundingClientRect();


  const viewportHeight =
    window.innerHeight;


  if (
    rect.bottom < 0 ||
    rect.top > viewportHeight
  ) {

    return;

  }


  const totalDistance =
    viewportHeight +
    rect.height;


  const traveled =
    viewportHeight -
    rect.top;


  let progress =
    traveled /
    totalDistance;


  progress =
    Math.max(
      0,
      Math.min(
        1,
        progress
      )
    );


  const start =
    25;


  const end =
    75;


  const position =
    start +
    (
      (end - start) *
      progress
    );


  technologySection.style
    .setProperty(
      '--tech-mobile-position',
      `${position}%`
    );

}


/* =========================================================
   OPTIMIZACIÓN PARALLAX
========================================================= */

let technologyTicking =
  false;


function requestTechnologyUpdate() {

  if (technologyTicking) {
    return;
  }


  technologyTicking =
    true;


  requestAnimationFrame(
    () => {

      updateTechnologyMobileParallax();


      technologyTicking =
        false;

    }
  );

}


/* =========================================================
   EVENTOS PARALLAX
========================================================= */

window.addEventListener(
  'scroll',
  requestTechnologyUpdate,
  {
    passive: true
  }
);


window.addEventListener(
  'resize',
  updateTechnologyMobileParallax
);


window.addEventListener(
  'load',
  updateTechnologyMobileParallax
);


updateTechnologyMobileParallax();