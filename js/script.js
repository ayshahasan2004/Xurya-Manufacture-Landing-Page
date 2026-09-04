document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       1) NAVBAR — toggle active link on click
    ========================================================= */
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
        });
    });


    /* 
       2) QUALITY SECTION — company logo circles
          Clicking a logo makes it the active (colored) one*/
    const logoCircles = document.querySelectorAll('.company-logo-circle');
    logoCircles.forEach(circle => {
        circle.addEventListener('click', function () {
            logoCircles.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });


    /*
       3) FEATURES SECTION — grid cards
          Simple hover-lift handled by CSS already;
          this adds a click log, replace with real navigation
          (e.g. window.location.href) when you have real pages.*/
    const gridCards = document.querySelectorAll('.grid-card');
    gridCards.forEach(card => {
        card.addEventListener('click', function () {
            const title = this.querySelector('h3')?.textContent;
            console.log('Feature clicked:', title);
            // Example: window.location.href = "/features/" + slugify(title);
        });
    });


    /* =========================================================
       4) TRUSTED SERVICE SECTION — "View Details" buttons
    ========================================================= */
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const cardTitle = this.closest('.trusted-card').querySelector('h3').textContent;
            console.log('View Details clicked for:', cardTitle);
            // Example: window.location.href = "/services/" + slugify(cardTitle);
        });
    });

    /* "Get in touch" button — smooth scroll to a #contact section if one exists */
    const trustedCta = document.querySelector('.btn-trusted');
    if (trustedCta) {
        trustedCta.addEventListener('click', function () {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }


    /* =========================================================
       5) TESTIMONIALS — sync tab-fill progress bar with carousel
    ========================================================= */
    const carousel = document.getElementById('testimonialCarousel');
    if (carousel) {
        carousel.addEventListener('slide.bs.carousel', function (event) {
            const tabs = document.querySelectorAll('.testimonial-tab');
            tabs.forEach(tab => tab.classList.remove('active'));

            const activeTab = document.querySelector(
                `.testimonial-tab[data-bs-slide-to="${event.to}"]`
            );
            if (activeTab) {
                activeTab.classList.add('active');
                const fill = activeTab.querySelector('.tab-fill');
                fill.style.animation = 'none';
                void fill.offsetWidth; // force reflow to restart animation
                fill.style.animation = '';
            }
        });
    }

    /* "View case study" buttons inside testimonial cards */
    const caseStudyButtons = document.querySelectorAll('.testimonial-btn');
    caseStudyButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const company = this.closest('.testimonial-content').querySelector('.testimonial-name').textContent;
            console.log('View case study clicked for:', company);
            // Example: window.location.href = "/case-studies/" + slugify(company);
        });
    });

});