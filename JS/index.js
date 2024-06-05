

// Website JS //

const cardContainer = document.querySelector('.card-container');
const card = document.querySelector('.pokemon-card');

cardContainer.addEventListener('mousemove', (event) => {
  const rect = cardContainer.getBoundingClientRect();
  const xAxis = (rect.width / 2 - (event.clientX - rect.left)) / 15;
  const yAxis = (rect.height / 2 - (event.clientY - rect.top)) / 15;
  card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

cardContainer.addEventListener('mouseenter', (event) => {
  card.style.transition = 'none';
});

cardContainer.addEventListener('mouseleave', (event) => {
  card.style.transition = 'transform 0.5s ease';
  card.style.transform = 'rotateY(0deg) rotateX(0deg)';
});

document.addEventListener('DOMContentLoaded', function() {
  const infoSection = document.querySelector('.info');
  const leftCard = document.querySelector('.left-card');
  const rightCard = document.querySelector('.right-card');

  function parallaxEffect() {
    const sectionTop = infoSection.offsetTop;
    const sectionHeight = infoSection.offsetHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
        const progress = (scrollY + windowHeight - sectionTop) / windowHeight;

        // Clamp progress to the range [0, 1]
        const clampedProgress = Math.min(Math.max(progress, 0), 1);

        // Calculate the movement based on clamped progress
        const moveDistance = 100 * (1 - clampedProgress);

        leftCard.style.transform = `translateX(${-moveDistance}%)`;
        rightCard.style.transform = `translateX(${moveDistance}%)`;
    } else {
        if (scrollY + windowHeight < sectionTop) {
            leftCard.style.transform = `translateX(-100%)`;
            rightCard.style.transform = `translateX(100%)`;
        } else {
            leftCard.style.transform = `translateX(0)`;
            rightCard.style.transform = `translateX(0)`;
        }
    }
  }


  window.addEventListener('scroll', parallaxEffect);
});

document.addEventListener('DOMContentLoaded', function() {
  const steps = document.querySelectorAll('.step');

  function checkSteps() {
      const triggerBottom = window.innerHeight * 0.8;

      steps.forEach(step => {
          const stepTop = step.getBoundingClientRect().top;

          if (stepTop < triggerBottom) {
              step.classList.add('step-visible');
              step.classList.remove('step-hidden');
          } else {
              step.classList.remove('step-visible');
              step.classList.add('step-hidden');
          }
      });
  }

  window.addEventListener('scroll', checkSteps);
  checkSteps(); // Initial check
});


