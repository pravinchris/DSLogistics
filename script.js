// Dahnay Website - Interactive Scripting Logics

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initHeroWidget();
  initPlatformShowcase();
  initStatsCounters();
  initScrollAnimationsFallback();
});

/* ==========================================
   1. Theme Management (Light / Dark Modes)
   ========================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const footerLightBtn = document.getElementById('theme-btn-light');
  const footerDarkBtn = document.getElementById('theme-btn-dark');
  const htmlEl = document.documentElement;

  // Retrieve existing preference or check system setting
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlEl.className = savedTheme + '-mode';
  } else {
    // Default to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    htmlEl.className = prefersDark ? 'dark-mode' : 'light-mode';
  }

  // Header circular toggle click handler
  toggleBtn.addEventListener('click', () => {
    const isDark = htmlEl.classList.contains('dark-mode');
    setTheme(isDark ? 'light' : 'dark');
  });

  // Footer text buttons click handlers
  footerLightBtn.addEventListener('click', () => setTheme('light'));
  footerDarkBtn.addEventListener('click', () => setTheme('dark'));

  function setTheme(theme) {
    htmlEl.className = theme + '-mode';
    localStorage.setItem('theme', theme);
  }
}

/* ==========================================
   2. Mobile Drawer Navigation Menu
   ========================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isExpanded);
  });

  // Close menu drawer if any links are clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  function toggleMenu(open) {
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileDrawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) {
      mobileDrawer.style.display = 'block';
      // Force repaint
      mobileDrawer.offsetHeight;
      mobileDrawer.classList.add('open');
    } else {
      mobileDrawer.classList.remove('open');
      setTimeout(() => {
        if (!mobileDrawer.classList.contains('open')) {
          mobileDrawer.style.display = 'none';
        }
      }, 300);
    }
  }
}

/* ==========================================
   3. Hero Widget (Tracker & Quote Estimator)
   ========================================== */
function initHeroWidget() {
  const tabTrack = document.getElementById('tab-track');
  const tabQuote = document.getElementById('tab-quote');
  const panelTrack = document.getElementById('panel-track');
  const panelQuote = document.getElementById('panel-quote');

  const trackerForm = document.getElementById('tracker-form');
  const trackerResults = document.getElementById('tracker-results');
  
  const quoteForm = document.getElementById('quote-form');
  const quoteResults = document.getElementById('quote-results');

  // Tab switching mechanics
  tabTrack.addEventListener('click', () => switchTab('track'));
  tabQuote.addEventListener('click', () => switchTab('quote'));

  function switchTab(mode) {
    if (mode === 'track') {
      tabTrack.classList.add('active');
      tabTrack.setAttribute('aria-selected', 'true');
      tabQuote.classList.remove('active');
      tabQuote.setAttribute('aria-selected', 'false');
      
      panelTrack.classList.add('active');
      panelTrack.removeAttribute('hidden');
      panelQuote.classList.remove('active');
      panelQuote.setAttribute('hidden', 'true');
    } else {
      tabQuote.classList.add('active');
      tabQuote.setAttribute('aria-selected', 'true');
      tabTrack.classList.remove('active');
      tabTrack.setAttribute('aria-selected', 'false');
      
      panelQuote.classList.add('active');
      panelQuote.removeAttribute('hidden');
      panelTrack.classList.remove('active');
      panelTrack.setAttribute('hidden', 'true');
    }
  }

  // 3a. Shipment Tracker Simulation
  trackerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const trackVal = document.getElementById('track-id').value.trim().toUpperCase();
    
    // Simulate query loading
    trackerResults.innerHTML = `
      <div style="display:flex; justify-content:center; padding-block:var(--space-sm);">
        <div class="loader animate-pulse" style="font-size:0.9rem; font-weight:600; color:var(--color-primary);">Querying global trade registers...</div>
      </div>
    `;
    trackerResults.classList.remove('hidden');

    setTimeout(() => {
      const displayId = trackVal.startsWith('DHNY') ? trackVal : `DHNY-${trackVal}`;
      
      trackerResults.innerHTML = `
        <div class="results-card-summary">
          <div style="display:flex; justify-content:space-between; margin-block-end:var(--space-xs);">
            <span class="result-header-label">Tracking ID: <strong>${displayId}</strong></span>
            <span class="status-pill status-active">On Schedule</span>
          </div>
          <div class="simulated-timeline" style="margin-block-start:var(--space-sm);">
            <div class="timeline-node">
              <div class="node-dot completed"></div>
              <div class="node-text">
                <div class="node-title">Cargo Released at Factory</div>
                <div class="node-time">Origin Terminal Depot | Port Terminal</div>
              </div>
            </div>
            <div class="timeline-node">
              <div class="node-dot completed"></div>
              <div class="node-text">
                <div class="node-title">Loaded on Vessel</div>
                <div class="node-time">Stowed on Containership | Cargo Manifest Clear</div>
              </div>
            </div>
            <div class="timeline-node">
              <div class="node-dot current"></div>
              <div class="node-text">
                <div class="node-title">Ocean Transit (Pacific Crossing)</div>
                <div class="node-time">Current Location: 34.11° N, -145.32° W | ETA 5 Days</div>
              </div>
            </div>
            <div class="timeline-node">
              <div class="node-dot"></div>
              <div class="node-text">
                <div class="node-title">Customs Clearance & Final Delivery</div>
                <div class="node-time">Pending Vessel Arrival | Broker Pre-Cleared</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }, 800);
  });

  // 3b. Freight Quote Calculator Simulation
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const origin = document.getElementById('quote-origin').value;
    const destination = document.getElementById('quote-destination').value;
    const mode = document.getElementById('quote-mode').value;
    const weight = parseFloat(document.getElementById('quote-weight').value);

    // Loading State
    quoteResults.innerHTML = `
      <div style="display:flex; justify-content:center; padding-block:var(--space-sm);">
        <div class="loader animate-pulse" style="font-size:0.9rem; font-weight:600; color:var(--color-primary);">Calculating routes & tariff indices...</div>
      </div>
    `;
    quoteResults.classList.remove('hidden');

    setTimeout(() => {
      // Calculate realistic cost based on transport type and cargo weight
      let baseRatePerKg = 0.45; // default ocean LCL
      let days = 22;
      let carbonRate = 0.05; // metric tons CO2 per ton-mile

      if (mode === 'ocean-fcl') {
        baseRatePerKg = 0.35;
        days = 16;
        carbonRate = 0.045;
      } else if (mode === 'air-express') {
        baseRatePerKg = 4.20;
        days = 3;
        carbonRate = 0.65;
      }

      // Calculate rates
      const distanceModifier = getPortDistanceModifier(origin, destination);
      const computedCost = Math.max(350, weight * baseRatePerKg * distanceModifier);
      const computedTransit = Math.ceil(days * distanceModifier);
      const computedCO2 = ((weight / 1000) * carbonRate * distanceModifier * 5).toFixed(2);

      // Render Results
      quoteResults.innerHTML = `
        <div class="results-card-summary">
          <span class="result-header-label">Ocean Lane Quote: <strong>${origin} ➔ ${destination}</strong></span>
          <div class="result-grid-mini">
            <div class="result-metric">
              <span class="result-header-label" style="font-size:0.75rem;">Est. Freight Cost</span>
              <span class="metric-val">$${computedCost.toLocaleString('en-US', {maximumFractionDigits: 2})}</span>
            </div>
            <div class="result-metric">
              <span class="result-header-label" style="font-size:0.75rem;">Transit Speed</span>
              <span class="metric-val">${computedTransit} Days</span>
            </div>
          </div>
          <div style="margin-block-start:var(--space-xs); font-size:0.8rem; color:var(--color-text-sub); border-top:1px solid var(--color-border); padding-top:var(--space-xs); display:flex; justify-content:space-between; align-items:center;">
            <span>CO₂ Emission Impact: <strong>${computedCO2} Tons</strong></span>
            <button class="btn btn-secondary" style="min-block-size:28px; padding:2px 8px; font-size:0.75rem; border-radius:4px;" type="button" id="btn-offset-carbon">Offset CO₂</button>
          </div>
        </div>
      `;

      // Set listener on Carbon offset button for microinteraction
      document.getElementById('btn-offset-carbon').addEventListener('click', function() {
        this.innerHTML = "✓ Offset Secured";
        this.classList.add('status-verified');
        this.style.backgroundColor = '#d1fae5';
        this.disabled = true;
      });

    }, 850);
  });

  // Quick helper for port distances
  function getPortDistanceModifier(o, d) {
    if (o === d) return 1.0;
    // Mock lane distances relative multiplier
    const lanes = {
      'CNSHA-USLAX': 1.0,
      'CNSHA-NLRTM': 1.6,
      'CNSHA-AEDXB': 1.1,
      'CNSHA-GBFXT': 1.65,
      'INMAA-USLAX': 1.8,
      'INMAA-NLRTM': 1.25,
      'INMAA-AEDXB': 0.6,
      'INMAA-GBFXT': 1.3,
      'SGPIN-USLAX': 1.4,
      'SGPIN-NLRTM': 1.45,
      'SGPIN-AEDXB': 0.8,
      'SGPIN-GBFXT': 1.5,
      'DEHAM-USLAX': 1.35,
      'DEHAM-NLRTM': 0.2,
      'DEHAM-AEDXB': 1.2,
      'DEHAM-GBFXT': 0.35,
    };
    const key = `${o}-${d}`;
    return lanes[key] || lanes[`${d}-${o}`] || 1.25;
  }
}

/* ==========================================
   4. Platform Showcase Tab Actions
   ========================================== */
function initPlatformShowcase() {
  const tabs = document.querySelectorAll('.platform-tab-btn');
  const panels = document.querySelectorAll('.showcase-panel');
  const uploadBtn = document.getElementById('btn-upload-test');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('aria-controls');
      
      // Update Tab Selection State
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update Panel Display (Discrete animation handling)
      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.removeAttribute('hidden');
          // Delay opacity slightly for fade
          setTimeout(() => {
            panel.classList.add('active');
          }, 50);
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', 'true');
        }
      });
    });
  });

  // Microinteraction: Upload Document Sim
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      uploadBtn.disabled = true;
      uploadBtn.innerHTML = "Processing...";
      
      setTimeout(() => {
        const docGrid = document.querySelector('.customs-document-grid');
        const newDoc = document.createElement('div');
        newDoc.className = 'document-card animate-pulse';
        newDoc.innerHTML = `
          <div class="doc-meta">
            <span class="doc-icon">📄</span>
            <div class="doc-details">
              <span class="doc-name">Packing_List_DHNY_8923.pdf</span>
              <span class="doc-size">88 KB</span>
            </div>
          </div>
          <span class="doc-status status-pending">Auditing</span>
        `;
        // Insert at first position
        docGrid.insertBefore(newDoc, docGrid.firstChild);

        // Reset button
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = "Upload Document";

        // After 2.5 seconds, change status to Verified
        setTimeout(() => {
          newDoc.classList.remove('animate-pulse');
          const statusSpan = newDoc.querySelector('.doc-status');
          statusSpan.innerHTML = "Verified";
          statusSpan.className = "doc-status status-verified";
        }, 2200);

      }, 1000);
    });
  }
}

/* ==========================================
   5. Numeric Counter Animations (Stats Section)
   ========================================== */
function initStatsCounters() {
  const statsSection = document.getElementById('network');
  const counters = [
    { id: 'stat-countries', target: 120, suffix: '+' },
    { id: 'stat-containers', target: 650, suffix: 'k+' },
    { id: 'stat-ontime', target: 99.8, suffix: '%' },
    { id: 'stat-carbon', target: 45, suffix: 'k Tons' }
  ];

  let triggered = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        counters.forEach(counter => animateCounter(counter));
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.25 });

  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateCounter(item) {
    const el = document.getElementById(item.id);
    if (!el) return;

    let start = 0;
    const duration = 1500; // ms
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const ease = progress * (2 - progress);
      const currentVal = (ease * item.target);

      if (Number.isInteger(item.target)) {
        el.innerHTML = Math.floor(currentVal) + item.suffix;
      } else {
        el.innerHTML = currentVal.toFixed(1) + item.suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerHTML = item.target + item.suffix; // snap to target
      }
    }

    requestAnimationFrame(update);
  }
}

/* ==========================================
   6. Scroll Animations Fallback (Firefox etc.)
   ========================================== */
function initScrollAnimationsFallback() {
  // Check if native view timelines are NOT supported
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const scrollElements = document.querySelectorAll(
      '.value-card, .platform-layout, .service-card, .cta-container, .stat-item'
    );

    // Apply baseline styles for JS fallback
    scrollElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px' // trigger slightly early
    });

    scrollElements.forEach(el => observer.observe(el));
  }
}
