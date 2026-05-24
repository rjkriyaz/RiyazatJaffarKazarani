document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. Theme Switcher (2-State Theme Sync)
  // ==========================================================================
  const themeToggle = document.getElementById("theme-toggle");
  
  const getSystemTheme = () => 
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelector('meta[name="color-scheme"]').content = theme === "dark" ? "dark light" : "light dark";
  };

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || getSystemTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    
    localStorage.setItem("color-scheme", nextTheme);
    setTheme(nextTheme);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("color-scheme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });

  // ==========================================================================
  // 2. 3D Scrollytelling Viewport Controller
  // ==========================================================================
  const trackers = document.querySelectorAll(".scroll-tracker");
  const scenes = document.querySelectorAll(".scene-section");
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollProgress = document.getElementById("scroll-progress");
  const mainHeader = document.getElementById("main-header");

  const update3DScenes = () => {
    const winScroll = window.scrollY;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    // Progress Bar
    if (scrollProgress) {
      scrollProgress.style.width = `${scrolled}%`;
    }

    // Shrink header on scroll
    if (winScroll > 50) {
      mainHeader.classList.add("shrunk");
    } else {
      mainHeader.classList.remove("shrunk");
    }

    // Determine active index based on scroll tracker positions
    let activeIndex = 0;
    const viewportHeight = window.innerHeight;
    const scrollMidpoint = winScroll + (viewportHeight / 2);

    trackers.forEach((tracker, index) => {
      const top = tracker.offsetTop;
      const bottom = top + tracker.offsetHeight;

      if (scrollMidpoint >= top && scrollMidpoint < bottom) {
        activeIndex = index;
      }
    });

    // Make sure we clamp activeIndex to valid boundaries
    if (winScroll + viewportHeight >= document.documentElement.scrollHeight - 50) {
      activeIndex = trackers.length - 1;
    }

    // Update scene state classes
    scenes.forEach((scene, index) => {
      scene.classList.remove("active", "previous", "next");
      
      if (index === activeIndex) {
        scene.classList.add("active");
      } else if (index < activeIndex) {
        scene.classList.add("previous");
      } else {
        scene.classList.add("next");
      }
    });

    // Update nav link highlighters
    navLinks.forEach((link) => {
      link.classList.remove("active");
      const linkIndex = parseInt(link.getAttribute("data-index"), 10);
      if (linkIndex === activeIndex) {
        link.classList.add("active");
      }
    });
  };

  // Nav link click scroll triggers
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const index = parseInt(link.getAttribute("data-index"), 10);
      const targetTracker = trackers[index];
      
      if (targetTracker) {
        window.scrollTo({
          top: targetTracker.offsetTop,
          behavior: "smooth"
        });
      }
    });
  });

  window.addEventListener("scroll", update3DScenes);
  window.addEventListener("resize", update3DScenes);
  update3DScenes(); // Initial run to center active slide

  // ==========================================================================
  // 3. Mouse Coordinate Spotlight & 3D Tilt Effect
  // ==========================================================================
  const radialGlow = document.getElementById("radial-glow");
  const tiltContainer = document.getElementById("animated-content");
  let lastMouseX = window.innerWidth / 2;
  let lastMouseY = window.innerHeight / 2;
  let ticking = false;

  document.addEventListener("mousemove", (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Spotlight glow coordinate
        if (radialGlow) {
          radialGlow.style.setProperty("--mouse-x", `${lastMouseX}px`);
          radialGlow.style.setProperty("--mouse-y", `${lastMouseY}px`);
        }

        // 3D Tilt calculations
        if (tiltContainer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          const dx = lastMouseX - cx;
          const dy = lastMouseY - cy;

          // Rotate max 8 degrees on X & Y axes for clean look
          const tiltX = -(dy / cy) * 8;
          const tiltY = (dx / cx) * 8;

          tiltContainer.style.setProperty("--tilt-x", `${tiltX}deg`);
          tiltContainer.style.setProperty("--tilt-y", `${tiltY}deg`);
        }

        ticking = false;
      });
      ticking = true;
    }
  });

  // ==========================================================================
  // 4. Dynamic Rotating Role Titles
  // ==========================================================================
  const roles = document.querySelectorAll(".dynamic-role");
  let activeRoleIndex = 0;

  const rotateRoles = () => {
    if (roles.length === 0) return;
    const currentRole = roles[activeRoleIndex];
    currentRole.classList.remove("active");
    currentRole.classList.add("exit");

    activeRoleIndex = (activeRoleIndex + 1) % roles.length;
    const nextRole = roles[activeRoleIndex];
    
    nextRole.classList.remove("exit");
    
    setTimeout(() => {
      currentRole.classList.remove("exit");
      nextRole.classList.add("active");
    }, 300);
  };

  setInterval(rotateRoles, 3500);

  // ==========================================================================
  // 5. Interactive Skills Tab Toggling
  // ==========================================================================
  const skillBtns = document.querySelectorAll(".skills-tab-btn");
  const skillPanels = document.querySelectorAll(".skills-panel");

  skillBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");

      skillBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      skillPanels.forEach((panel) => {
        panel.classList.remove("active");
        if (panel.id === `skills-${targetId}`) {
          panel.classList.add("active");
        }
      });
    });
  });

  // ==========================================================================
  // 6. Expandable Experience Cards
  // ==========================================================================
  const timelineItems = document.querySelectorAll(".timeline-interactive");

  timelineItems.forEach((item) => {
    const card = item.querySelector(".timeline-card");
    
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-expanded", item.classList.contains("active"));

    const toggleCard = (e) => {
      e.stopPropagation();
      const isAlreadyActive = item.classList.contains("active");
      
      // Close others first for visual layout ease in 3D panels
      timelineItems.forEach((t) => {
        t.classList.remove("active");
        t.querySelector(".timeline-card").setAttribute("aria-expanded", "false");
      });

      if (!isAlreadyActive) {
        item.classList.add("active");
        card.setAttribute("aria-expanded", "true");
      }
    };

    card.addEventListener("click", toggleCard);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCard(e);
      }
    });
  });

  // ==========================================================================
  // 7. Projects Filter System
  // ==========================================================================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filterValue = btn.getAttribute("data-filter");

      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filterValue === "all" || category === filterValue) {
          card.classList.remove("hidden");
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1) translateZ(10px)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95) translateZ(0px)";
          setTimeout(() => {
            card.classList.add("hidden");
          }, 300);
        }
      });
    });
  });

  // ==========================================================================
  // 8. Mobile Menu Toggle
  // ==========================================================================
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const menuLinks = document.querySelectorAll(".nav-link");

  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.contains("open");
    
    menuToggle.classList.toggle("menu-toggle-active");
    navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", !isOpen);
  };

  menuToggle.addEventListener("click", toggleMobileMenu);

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("open")) {
        toggleMobileMenu();
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && e.target !== menuToggle) {
      toggleMobileMenu();
    }
  });

  // ==========================================================================
  // 9. Download Resume / Window Print Action
  // ==========================================================================
  const downloadBtn = document.getElementById("download-resume-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // ==========================================================================
  // 10. Copy to Clipboard Features
  // ==========================================================================
  const copyBtns = document.querySelectorAll(".copy-btn");
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute("data-copy");
      const tooltip = btn.querySelector(".copy-tooltip");
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        if (tooltip) {
          tooltip.textContent = "Copied!";
          setTimeout(() => {
            tooltip.textContent = "Copy";
          }, 2000);
        }
      }).catch((err) => {
        console.error("Clipboard copy failed: ", err);
      });
    });
  });
});
