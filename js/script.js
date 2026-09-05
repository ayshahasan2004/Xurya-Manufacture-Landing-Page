document.addEventListener("DOMContentLoaded", function () {
  setupNavActive();
  setupCtaLinks();
  setupLogoCircleActive();
  setupCardClickLogs();
  setupCarouselAutoplay();
  setupTestimonialTabs();
  setupStatCounter();
  setupCircleShuffle();
  setupGlassCardTilt();
});

//NAVBAR — toggle active link on click, and smooth-scroll to the target section
function setupNavActive() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navItems.forEach((navItem) => navItem.classList.remove("active"));
      this.classList.add("active");
    });
  });

  document
    .querySelectorAll(".nav-item a, .xurya-menu a, .xurya-brand")
    .forEach((link) => {
      link.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
}

//Hero "Our services" is a real anchor link with an href already — this just
//upgrades the jump to a smooth scroll. All three "Get in touch" links are
//mailto links now and need no JS at all.
function setupCtaLinks() {
  const link = document.querySelector(".hero-services-link");
  if (!link) return;
  link.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
}

//QUALITY SECTION — clicking a company logo makes it the active (colored) one
function setupLogoCircleActive() {
  const logoCircles = document.querySelectorAll(".company-logo-circle");
  logoCircles.forEach((circle) => {
    circle.addEventListener("click", function () {
      logoCircles.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

//FEATURES grid cards + trusted "View Details" buttons — click logging,
//replace with real navigation when you have real pages.
function setupCardClickLogs() {
  document.querySelectorAll(".grid-card").forEach((card) => {
    card.addEventListener("click", function () {
      const title = this.querySelector("h3")?.textContent;
      console.log("Feature clicked:", title);
    });
  });

  document.querySelectorAll(".view-details-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation(); //don't also trigger the parent .trusted-card, if you add a handler there later
      const card = this.closest(".trusted-card");
      const title = card.querySelector("h3").textContent;
      const description = card.dataset.description || "";

      document.getElementById("serviceDetailsModalLabel").textContent = title.replace(/\s+/g, " ");
      document.getElementById("serviceDetailsModalBody").textContent = description;

      const modalEl = document.getElementById("serviceDetailsModal");
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    });
  });

  document.querySelectorAll(".testimonial-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const content = this.closest(".testimonial-content");
      const company = content.querySelector(".testimonial-name").textContent;
      const quote = content.querySelector(".testimonial-quote").textContent;
      const author = content.querySelector(".testimonial-author").innerHTML;

      document.getElementById("caseStudyModalLabel").textContent = company;
      document.getElementById("caseStudyModalQuote").textContent = quote;
      document.getElementById("caseStudyModalAuthor").innerHTML = author;

      const modalEl = document.getElementById("caseStudyModal");
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    });
  });
}

// Explicitly forces the testimonial carousel to autoplay via the Bootstrap
// Carousel JS API, instead of relying only on the data-bs-ride HTML attribute.
// Some browsers/OS settings (e.g. "reduce motion") silently stop Bootstrap's
// own autoplay — this guarantees it keeps cycling regardless, and never
// pauses on hover/touch.
function setupCarouselAutoplay() {
  const carouselEl = document.getElementById("testimonialCarousel");
  if (!carouselEl || typeof bootstrap === "undefined") return;

  const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
    interval: 5000,
    ride: "carousel",
    pause: false,
    wrap: true,
  });
  carousel.cycle();
}

//showing the sliding effect for the TestimonialTabs
function setupTestimonialTabs() {
  const carousel = document.getElementById("testimonialCarousel");
  const tabs = Array.from(document.querySelectorAll(".testimonial-tab"));
  if (!carousel || !tabs.length) return;

  function activateTab(index) {
    tabs.forEach((tab) => tab.classList.remove("active"));
    //reflow so the progress bar animation restarts cleanly each time
    void tabs[index].offsetWidth;
    tabs[index].classList.add("active");
  }

  carousel.addEventListener("slide.bs.carousel", (e) => activateTab(e.to));
}

//this for the numbers moving in the hero, this function splits the numeric value and suffix (mil / k) out of something like "6 mil" or "120K"
function readStatText(text) {
  const number = parseFloat(text);
  let label = "";
  if (text.indexOf("mil") !== -1) label = " mil";
  if (text.toLowerCase().indexOf("k") !== -1) label = "K";
  return { number, label };
}

//it takes the text and animates its content counting up.
function countUpStat(el) {
  const stat = readStatText(el.textContent);
  const steps = 40;
  let i = 0;

  const timer = setInterval(function () {
    i++;
    el.textContent = Math.round(stat.number * (i / steps)) + stat.label;
    if (i >= steps) clearInterval(timer);
  }, 20);
}

//Fires the count-up once each stat card actually scrolls into view, not on page load
function setupStatCounter() {
  const statNumbers = document.querySelectorAll(".hero-bottom-box .stat h2");
  if (!statNumbers.length) return;

  const watcher = new IntersectionObserver(
    function (entries) {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        countUpStat(entry.target);
        watcher.unobserve(entry.target); //once a stat has counted up there's no reason to keep watching it
      }
    },
    { threshold: 0.4 }
  );
  statNumbers.forEach((el) => watcher.observe(el));
}

//The company-logo circles slowly swap positions while visible on screen — just a bit of motion
function setupCircleShuffle() {
  const circleBox = document.querySelector(".company-logos");
  if (!circleBox) return;

  const circles = Array.from(circleBox.children);
  let homePositions = [];
  function saveHomePositions() {
    homePositions = circles.map((el) => el.getBoundingClientRect());
  }
  saveHomePositions();

  //recalculate positions after a resize but skip the transition so it doesn't look glitchy
  window.addEventListener("resize", function () {
    circles.forEach(function (el) {
      el.style.transition = "none";
      el.style.transform = "";
    });
    requestAnimationFrame(saveHomePositions);
  });

  //basic Fisher-Yates shuffle
  function shuffledOrder(n) {
    const order = Array.from({ length: n }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }

  function shuffleCircles() {
    if (!circles.length || !homePositions.length) return;
    const order = shuffledOrder(circles.length);
    circles.forEach(function (el, i) {
      const target = order[i];
      const dx = homePositions[target].left - homePositions[i].left;
      const dy = homePositions[target].top - homePositions[i].top;

      el.style.transition = "transform 1.8s cubic-bezier(.65,0,.35,1) " + i * 60 + "ms";
      el.style.transform = "translate(" + dx + "px, " + dy + "px) scale(1.05)";
    });
  }

  let shuffleTimer = null;
  function startShuffling() {
    if (shuffleTimer) return;
    shuffleCircles();
    shuffleTimer = setInterval(shuffleCircles, 3200);
  }
  function stopShuffling() {
    clearInterval(shuffleTimer);
    shuffleTimer = null;
  }

  // only animate while the section is actually on screen, no point burning cycles otherwise
  const watcher = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        entry.isIntersecting ? startShuffling() : stopShuffling();
      });
    },
    { threshold: 0.2 }
  );
  watcher.observe(circleBox);
}

// Card tilts toward the cursor on hover and gently floats when idle
function setupGlassCardTilt() {
  const card = document.querySelector(".glass-card");
  if (!card) return;
  if (!window.matchMedia("(pointer: fine)").matches) return; // skip on touch devices

  let currentTiltX = 0;
  let currentTiltY = 0;
  let wantedTiltX = 0;
  let wantedTiltY = 0;

  card.addEventListener("pointermove", function (e) {
    const rect = card.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;
    wantedTiltY = (xPercent - 0.5) * 26;
    wantedTiltX = (0.5 - yPercent) * 26;
    card.classList.add("tilting");
  });
  card.addEventListener("pointerleave", function () {
    wantedTiltX = 0;
    wantedTiltY = 0;
    card.classList.remove("tilting");
  });

  function moveTowards(current, target, amount) {
    return current + (target - current) * amount;
  }

  function animateCard(time) {
    currentTiltX = moveTowards(currentTiltX, wantedTiltX, 0.08);
    currentTiltY = moveTowards(currentTiltY, wantedTiltY, 0.08);
    const floatAmount = card.classList.contains("tilting") ? 0 : Math.sin(time / 900) * 8;
    card.style.transform =
      "perspective(900px) rotateX(" + currentTiltX + "deg) rotateY(" + currentTiltY + "deg) translateY(" + floatAmount + "px)";
    requestAnimationFrame(animateCard);
  }

  requestAnimationFrame(animateCard);
}