    (function() {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.navbar-custom .nav-link');
      
      // Function to update active class (underline style, accent text color)
      function updateActiveSection() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;  // offset for better trigger
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop - 100;
          const sectionBottom = sectionTop + section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSectionId = section.getAttribute('id');
          }
        });
        
        // Fallback for top of page
        if (!currentSectionId && window.scrollY < 80) {
          currentSectionId = 'home';
        }
        
        // Bottom of page detection: last section active
        const isBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 15;
        if (isBottom && sections.length > 0) {
          currentSectionId = sections[sections.length-1].getAttribute('id');
        }
        
        // Update classes: remove active from all, then add to matching
        navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });
      }
      
      // smooth scroll with offset for fixed navbar
      function handleNavClick(e) {
        const link = e.currentTarget;
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const offset = 90;  // because navbar fixed height approx 80px
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            // update active immediately
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            // update URL hash without jumping (optional)
            history.pushState(null, null, targetId);
          }
        }
      }
      
      // attach click listeners
      navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
      });
      
      // Scroll event listener with throttle
      let ticking = false;
      window.addEventListener('scroll', function() {
        if (!ticking) {
          requestAnimationFrame(function() {
            updateActiveSection();
            ticking = false;
          });
          ticking = true;
        }
      });
      
      // resize and load
      window.addEventListener('load', function() {
        updateActiveSection();
        // ensure if url has hash on load, scroll properly
        if (window.location.hash) {
          const hashId = window.location.hash.substring(1);
          const targetEl = document.getElementById(hashId);
          if (targetEl) {
            setTimeout(() => {
              const offset = 90;
              const y = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }, 100);
          }
        }
      });
      window.addEventListener('resize', updateActiveSection);
    })();