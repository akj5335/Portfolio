document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const nameHeading = document.getElementById('name-heading');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinkContainer = document.querySelector('.nav-links');
    const currentYearSpan = document.getElementById('current-year');
    const backToTopButton = document.querySelector('.back-to-top');

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        // Update cursor position
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;

        // Add slight delay to outline for smooth effect
        setTimeout(() => {
            cursorOutline.style.left = `${e.clientX}px`;
            cursorOutline.style.top = `${e.clientY}px`;
        }, 50);
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, .project-card, .skill-card, .case-study-card');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
            cursorOutline.classList.add('cursor-hover');
        });

        element.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
            cursorOutline.classList.remove('cursor-hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        }
    });

    document.addEventListener('mouseover', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });

    // --- Header Background on Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Smooth Scrolling for Nav Links ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if the link is internal
            if (link.hash !== "") {
                e.preventDefault();
                const targetId = link.hash;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = header.offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 10; // Added small offset

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (navLinkContainer.classList.contains('active')) {
                        navLinkContainer.classList.remove('active');
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Reset icon
                    }

                    // Update active link immediately (optional)
                    // updateActiveNavLink(targetId);
                }
            }
        });
    });
     // --- Smooth Scroll for Back to Top ---
     if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // --- Active Nav Link Highlighting on Scroll ---
    const updateActiveNavLink = (activeId = null) => {
        let currentActiveFound = false;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 100; // Adjust threshold
            const sectionHeight = section.offsetHeight;
            const sectionId = `#${section.id}`;

             // If an ID is passed directly (like from a click), use it
             if (activeId) {
                if (sectionId === activeId) {
                    document.querySelector(`.nav-link[href="${sectionId}"]`).classList.add('active');
                    currentActiveFound = true;
                } else {
                    document.querySelector(`.nav-link[href="${sectionId}"]`).classList.remove('active');
                }
            }
            // Otherwise, determine based on scroll position
            else if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                const currentLink = document.querySelector(`.nav-link[href="${sectionId}"]`);
                 if (currentLink) {
                    currentLink.classList.add('active');
                    currentActiveFound = true;
                 }
            }
        });

         // Fallback if no section is perfectly matched (e.g., at the very top/bottom)
        if (!currentActiveFound && !activeId) {
            // If near the top, activate 'Home'
            if (window.pageYOffset < sections[0].offsetTop) {
                 navLinks.forEach(link => link.classList.remove('active'));
                 const homeLink = document.querySelector('.nav-link[href="#home"]');
                 if (homeLink) homeLink.classList.add('active');
            }
            // If scrolled past the last section's start, keep the last section active
            // (This behavior might need adjustment based on preference)
            else if (window.pageYOffset >= sections[sections.length - 1].offsetTop - header.offsetHeight - 100) {
                 navLinks.forEach(link => link.classList.remove('active'));
                 const lastLink = document.querySelector(`.nav-link[href="#${sections[sections.length-1].id}"]`);
                 if (lastLink) lastLink.classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', () => updateActiveNavLink());
    // Initial call to set active link on page load
    updateActiveNavLink();


    // --- Intersection Observer for Fade-In Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use dataset to get delay if specified in CSS
                const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
                const animationDelayStep = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--animation-delay-step') || '0.15s') * 1000; // Get step from CSS variable

                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay * animationDelayStep); // Apply delay based on index

                // Optional: Unobserve after animation triggers once
                // observer.unobserve(entry.target);
            }
            // Optional: Reset animation if element scrolls out of view
            // else {
            //     entry.target.classList.remove('is-visible');
            // }
        });
    }, {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });


    // --- Random Color Animation for Name Heading ---
    if (nameHeading) {
        const colors = ['#32cd32', '#64f064', '#1ed760', '#4ae080']; // Shades of green or other accents
        let colorIndex = 0;

        // Initial color set in CSS is preferred for first load.
        // nameHeading.style.color = colors[0]; // Optionally set initial JS color

        setInterval(() => {
            colorIndex = (colorIndex + 1) % colors.length;
            nameHeading.style.color = colors[colorIndex];
        }, 2500); // Change color every 2.5 seconds
    }


    // --- Mobile Menu Toggle ---
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinkContainer.classList.toggle('active');
            // Change icon based on state
            if (navLinkContainer.classList.contains('active')) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>'; // Close icon
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Bars icon
            }
        });
    }

    // --- Update Footer Year ---
     if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Parallax Effect (Simple Example - Apply to Home Background) ---
    // Note: Real parallax is often more complex. This is a subtle background scroll effect.
    const homeSection = document.getElementById('home');
    if (homeSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            // Adjust the '0.3' multiplier for more/less effect
            homeSection.style.backgroundPositionY = `${scrollPosition * 0.3}px`;
        });
    }

}); // End DOMContentLoaded