// ==========================================================================
// Tech Pro — Premium Landing Page Logic
// ==========================================================================

// ── Real-World Scenario Showcase ───────────────────────────────────────────
const SCENARIOS = {
    nullai: {
        title: "Neal — nullai.tech",
        image: "assets/neal-twitter.jpg",
        imageAlt: "Zoth Studio Team lead consulting automation",
        desc: "Neal runs his tech consulting business, nullai.tech. He gets incoming messages asking about pricing, availability, and active invoices. Instead of breaking his coding flow to answer, his AI helper triages leads, shares booking links, and tracks payments.",
        benefits: [
            "Qualifies incoming leads and project budgets",
            "Automates scheduling for discovery calls",
            "Checks client invoice and payment statuses"
        ],
        messages: [
            { sender: "Customer", text: "Hi Neal, what is your pricing for a custom landing page? Do you have availability this month?" },
            { sender: "AI Helper", text: "Hi! Neal's custom landing pages start at $2,500. He has two slots open for next month. Would you like to schedule a quick 15-minute discovery call?" }
        ]
    },
    realtor: {
        title: "Rachel — Virginia Beach Realty",
        image: "assets/owner_realtor.png",
        imageAlt: "Realtor reviewing a lead summary",
        desc: "Rachel gets text and Facebook questions about listings while she's out showing properties. Her AI helper answers neighborhood questions, collects budget/timeline, and captures contact info so she can focus on hot leads.",
        benefits: [
            "Answers listing and Shore Drive neighborhood questions",
            "Collects budget, timeline, and contact details",
            "Sends Rachel qualified summaries directly to her phone"
        ],
        messages: [
            { sender: "Lead", text: "Hi, is the house on Shore Drive still available? What's the asking price?" },
            { sender: "AI Helper", text: "Yes, it's available at $425k. Are you looking to buy in the next 30, 60, or 90 days? I can have Rachel reach out with the best times to tour." }
        ]
    },
    contractor: {
        title: "Mike's HVAC & Electric",
        image: "assets/owner_contractor.png",
        imageAlt: "Contractor planning the day's jobs",
        desc: "Mike is usually crawling in attics or on service calls in Great Neck and Chic's Beach. His AI helper answers repeat questions ('What's your trip fee?'), gets their address, and books estimates directly onto his calendar.",
        benefits: [
            "Answers pricing and service area questions",
            "Captures addresses and photos of the issue",
            "Saves dates directly to Mike's Google Calendar"
        ],
        messages: [
            { sender: "Customer", text: "Can you come out to Chic's Beach for a quote? What is your standard service fee?" },
            { sender: "AI Helper", text: "Yes, Mike services Chic's Beach! A standard diagnostic visit is $95. What's your address and what issue are you seeing?" }
        ]
    },
    salon: {
        title: "Bella's Hair Studio",
        image: "assets/owner_salon.png",
        imageAlt: "Salon owner confirming appointments",
        desc: "Bella's clients text at all hours asking about openings, prices, and how to prep for a color. Her AI helper books appointments, sends reminders, and answers repeat questions — so Bella spends more time with clients and less time tied to her phone.",
        benefits: [
            "Books and reschedules appointments 24/7",
            "Answers pricing and service questions",
            "Sends reminder texts so clients show up"
        ],
        messages: [
            { sender: "Client", text: "Do you have any openings for a trim this Saturday?" },
            { sender: "AI Helper", text: "Yes! I have a 10:30 AM and a 2 PM opening for a trim. Which works better for you?" }
        ]
    },
    fitness: {
        title: "Coach Dan — VB Strength",
        image: "assets/owner_fitness.png",
        imageAlt: "Fitness coach checking signups",
        desc: "Dan runs small group training and gets flooded with questions about class times, pricing, and cancellations. His AI helper answers FAQs, signs up new members, and follows up with people who said they'd join next month.",
        benefits: [
            "Answers class schedule and pricing questions",
            "Collects new-member signup info",
            "Follows up with leads who go quiet"
        ],
        messages: [
            { sender: "Prospect", text: "How much are your small group sessions? Can I try one class first?" },
            { sender: "AI Helper", text: "Small group sessions are $149/month, and your first class is free. What's the best day to come in?" }
        ]
    },
    cleaning: {
        title: "Clean Slate Home Care",
        image: "assets/owner_cleaning.png",
        imageAlt: "Cleaning service owner managing bookings",
        desc: "Maria's cleaning business runs on repeat customers and referrals. Her AI helper handles quote requests, confirms addresses, and reminds clients before appointments — keeping her schedule full without the back-and-forth.",
        benefits: [
            "Gives instant quotes by home size",
            "Confirms addresses and access details",
            "Sends appointment reminders"
        ],
        messages: [
            { sender: "Customer", text: "Can I get a quote for a 3-bedroom, 2-bath house?" },
            { sender: "AI Helper", text: "A deep clean for that size starts at $180. Would you like weekly, biweekly, or a one-time service?" }
        ]
    },
    lawncare: {
        title: "Green Crew Lawn Care",
        image: "assets/owner_lawncare.png",
        imageAlt: "Lawn care owner scheduling jobs",
        desc: "Chris's crew moves fast during growing season. His AI helper answers service questions, captures addresses, and books estimates — so he's not answering texts while trying to finish a yard.",
        benefits: [
            "Answers service and pricing questions",
            "Collects addresses for estimates",
            "Books slots around the crew's route"
        ],
        messages: [
            { sender: "Customer", text: "Do you cut yards in Chic's Beach or Shore Drive? I need a one-time cut before the weekend." },
            { sender: "AI Helper", text: "Yes, we cover Chic's Beach and Shore Drive routes weekly. One-time cuts start at $45. What's your address and ideal day this week?" }
        ]
    }
};

function setupScenarioShowcase() {
    const tabs = document.querySelectorAll(".scenario-tab");
    const img = document.getElementById("scenario-img");
    const overlay = document.getElementById("scenario-overlay");
    const title = document.getElementById("scenario-title");
    const desc = document.getElementById("scenario-desc");
    const benefits = document.getElementById("scenario-benefits");

    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const key = tab.getAttribute("data-scenario");
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const data = SCENARIOS[key];
            if (!data) return;

            if (img) {
                img.src = data.image;
                img.alt = data.imageAlt;
            }
            if (title) title.textContent = data.title;
            if (desc) desc.textContent = data.desc;
            if (benefits) {
                benefits.innerHTML = data.benefits.map(b =>
                    `<div class="sb"><span class="sb-check">✓</span> ${b}</div>`
                ).join("");
            }
            if (overlay) {
                overlay.innerHTML = data.messages.map((m, i) =>
                    `<div class="scenario-message ${m.sender === "AI Helper" ? "out" : "in"}" style="animation-delay: ${i * 0.25}s">
                        <span class="msg-sender">${m.sender}</span>
                        <span class="msg-text">${m.text}</span>
                     </div>`
                ).join("");
            }
        });
    });
}

// ── Venue Dropdown (from Supabase / localStorage) ──────────────────────────
async function populateVenueDropdown() {
    const select = document.getElementById("reg-venue");
    if (!select) return;
    let events = [];
    try { events = await DB.events.list(); }
    catch (e) { events = JSON.parse(localStorage.getItem("zh_events")) || []; }
    select.innerHTML = "";

    const upcoming = events
        .filter(ev => new Date(ev.date).getTime() > Date.now() - 86400000)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcoming.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.disabled = true;
        opt.selected = true;
        opt.textContent = "No upcoming workshops — check back soon";
        select.appendChild(opt);
        return;
    }

    upcoming.forEach(ev => {
        const opt = document.createElement("option");
        opt.value = ev.id;
        const formatted = new Date(ev.date).toLocaleString("en-US", {
            month: "long", day: "numeric", hour: "numeric", minute: "2-digit"
        });
        const seatsLeft = Math.max(0, ev.capacity - ev.ticketsSold);
        opt.textContent = `${ev.venue} — ${formatted} (${seatsLeft} seats left)`;
        select.appendChild(opt);
    });
}

// ── Mobile Navigation (slide-in sheet + backdrop) ─────────────────────────
function setupMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");
    const backdrop = document.getElementById("nav-backdrop");
    if (!toggle || !links) return;

    let isOpen = false;
    let openTimer = null;

    function setOpen(open, animate = true) {
        if (open) {
            if (openTimer) cancelAnimationFrame(openTimer);

            links.classList.remove("closing");
            links.classList.add("open");
            if (backdrop) backdrop.classList.add("open");
            document.documentElement.classList.add("nav-open");
            document.body.classList.add("nav-open");
            toggle.setAttribute("aria-expanded", "true");
            links.setAttribute("aria-hidden", "false");
            isOpen = true;
        } else {
            if (!animate) {
                links.classList.remove("open", "closing");
                if (backdrop) backdrop.classList.remove("open");
                document.documentElement.classList.remove("nav-open");
                document.body.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
                links.setAttribute("aria-hidden", "true");
                isOpen = false;
                return;
            }

            links.classList.add("closing");
            links.classList.remove("open");
            if (backdrop) backdrop.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");

            openTimer = setTimeout(() => {
                links.classList.remove("closing");
                document.documentElement.classList.remove("nav-open");
                document.body.classList.remove("nav-open");
                links.setAttribute("aria-hidden", "true");
                isOpen = false;
            }, 260);
        }
    }

    function trapFocus(e) {
        if (!links.classList.contains("open")) return;
        const focusable = links.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.key === "Tab") {
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    toggle.addEventListener("click", () => {
        const shouldOpen = !links.classList.contains("open");
        setOpen(shouldOpen);
        if (shouldOpen) {
            requestAnimationFrame(() => {
                const focusable = links.querySelector('a, button, [tabindex]');
                if (focusable) focusable.focus();
            });
        }
    });

    // Close on backdrop
    if (backdrop) {
        backdrop.addEventListener("click", () => setOpen(false));
    }

    // Close on nav link tap
    links.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => setOpen(false, false));
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) {
            setOpen(false);
            toggle.focus();
        }
    });

    // Focus trap
    links.addEventListener("keydown", (e) => {
        trapFocus(e);
    });

    // Close if resized to desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 860 && isOpen) {
            setOpen(false, false);
        }
    });

    // Swipe to close
    let startX = 0;
    links.addEventListener(
        "touchstart",
        (e) => {
            if (!links.classList.contains("open")) return;
            startX = e.touches[0].clientX;
        },
        { passive: true }
    );
    links.addEventListener(
        "touchend",
        (e) => {
            if (!links.classList.contains("open")) return;
            const dx = (e.changedTouches[0].clientX || startX) - startX;
            if (dx > 60) setOpen(false);
        },
        { passive: true }
    );
}

// ── Navbar Scroll Effect ───────────────────────────────────────────────────
function setupNavbarScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    const onScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

// ── Scroll Reveal Animations ───────────────────────────────────────────────
function setupScrollReveal() {
    const reveals = document.querySelectorAll("[data-reveal]");
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
    });

    reveals.forEach(el => observer.observe(el));
}

// ── Hero Particle Canvas ───────────────────────────────────────────────────
function setupParticles() {
    const canvas = document.getElementById("hero-particles");
    if (!canvas || typeof THREE === "undefined") return;

    const hero = canvas.parentElement;
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(60, hero.offsetWidth / hero.offsetHeight, 0.1, 100);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(hero.offsetWidth, hero.offsetHeight);

    // Create a smooth, glowing circular dot texture dynamically
    function createCircleTexture() {
        const c = document.createElement('canvas');
        c.width = 16;
        c.height = 16;
        const ctx = c.getContext('2d');
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
        return new THREE.CanvasTexture(c);
    }

    // Colors mapping
    const colorAmber = new THREE.Color(0xf59e0b); // Warm Coffee Amber
    const colorCream = new THREE.Color(0xfef3c7); // Light Latte Cream
    const colorCyan = new THREE.Color(0x0ea5e9);  // Digital AI Cyan
    const colorPurple = new THREE.Color(0x8b5cf6); // Digital AI Purple
    const colorMagenta = new THREE.Color(0xec4899); // Transition Orchid/Magenta

    // Particle layout configuration
    // 100 body + 25 handle + 30 saucer = 155 cup particles
    const N_cup = 155; 
    const N_steam = 65;
    const totalCount = N_cup + N_steam;

    const cupParticles = [];
    
    // 1. Body: 10 layers, 10 points per layer
    for (let l = 0; l < 10; l++) {
        const v = l / 9;
        const y = v * 1.8; // height 1.8
        const r = 1.1 + 0.3 * v; // radius tapered from 1.1 to 1.4
        for (let p = 0; p < 10; p++) {
            const theta = (p / 10) * Math.PI * 2;
            cupParticles.push({
                x: r * Math.cos(theta),
                y: y,
                z: r * Math.sin(theta),
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    // 2. Handle: 25 points forming a C-shape
    for (let i = 0; i < 25; i++) {
        const phi = -Math.PI * 0.6 + (i / 24) * Math.PI * 1.2;
        const hx = 1.25 + 0.45 * Math.cos(phi);
        const hy = 0.9 + 0.55 * Math.sin(phi);
        const hz = 0.15 * Math.sin((i / 24) * Math.PI);
        cupParticles.push({
            x: hx,
            y: hy,
            z: hz,
            phase: Math.random() * Math.PI * 2
        });
    }
    
    // 3. Saucer: 3 rings of 10 points
    for (let rIdx = 0; rIdx < 3; rIdx++) {
        const r = 0.6 + rIdx * 0.6; // radii: 0.6, 1.2, 1.8
        for (let p = 0; p < 10; p++) {
            const theta = (p / 10) * Math.PI * 2;
            cupParticles.push({
                x: r * Math.cos(theta),
                y: -0.1,
                z: r * Math.sin(theta),
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    // Steam particles
    const steamParticles = [];
    function resetSteamParticle(p, cCenter) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 1.2; // spawn within top rim of cup
        p.pos.set(
            cCenter.x + r * Math.cos(theta),
            cCenter.y + 1.8 + Math.random() * 0.3,
            r * Math.sin(theta)
        );
        p.vel.set(
            (Math.random() - 0.5) * 0.01,
            0.015 + Math.random() * 0.02, // upward drift speed
            (Math.random() - 0.5) * 0.01
        );
        p.phase = Math.random() * Math.PI * 2;
    }

    // Determine initial cup Center for steam distribution
    const initialAspect = hero.offsetWidth / hero.offsetHeight;
    let initCX = 0, initCY = -3.2;
    if (initialAspect >= 1.0) {
        initCX = 3.2 * initialAspect - 1.8;
        initCY = -2.8;
    } else {
        initCX = 0;
        initCY = -3.4;
    }
    const initialCupCenter = new THREE.Vector3(initCX, initCY, 0);

    for (let i = 0; i < N_steam; i++) {
        const p = {
            pos: new THREE.Vector3(),
            vel: new THREE.Vector3(),
            phase: Math.random() * Math.PI * 2,
            speed: 0.015 + Math.random() * 0.02,
            phaseSpeed: 0.5 + Math.random() * 1.0
        };
        resetSteamParticle(p, initialCupCenter);
        // Distribute steam vertically so it is fully formed on load
        p.pos.y += Math.random() * 7.5;
        steamParticles.push(p);
    }

    // Initialize geometry buffers
    const positions = new Float32Array(totalCount * 3);
    const colors = new Float32Array(totalCount * 3);

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.28,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        map: createCircleTexture(),
        depthWrite: false
    });

    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    scene.add(pointsMesh);

    // Dynamic line segments for the plexus neural network
    const maxLines = 180;
    const linePositions = new Float32Array(maxLines * 2 * 3);
    const lineColors = new Float32Array(maxLines * 2 * 3);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        linewidth: 1
    });

    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    let mouse = { x: 0, y: 0, active: false };

    hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        mouse.active = true;
        clearTimeout(mouse._t);
        mouse._t = setTimeout(() => (mouse.active = false), 150);
    });

    hero.addEventListener("mouseleave", () => {
        mouse.active = false;
    });

    const posAttr = pointsGeo.getAttribute("position");
    const colAttr = pointsGeo.getAttribute("color");
    const linePosAttr = lineGeo.getAttribute("position");
    const lineColAttr = lineGeo.getAttribute("color");

    const clock = new THREE.Clock();

    function resize() {
        const w = hero.offsetWidth;
        const h = hero.offsetHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    let animId;
    function draw() {
        animId = requestAnimationFrame(draw);

        const aspect = hero.offsetWidth / hero.offsetHeight;
        const time = clock.getElapsedTime();

        // Mouse tracking in 3D
        const mouse3D = new THREE.Vector3(
            mouse.x * 12 * aspect,
            mouse.y * 8,
            0
        );

        // Responsive cup centering
        let cupCenterX = 0;
        let cupCenterY = -3.2;
        if (aspect >= 1.0) {
            cupCenterX = 3.2 * aspect - 1.8;
            cupCenterY = -2.8;
        } else {
            cupCenterX = 0;
            cupCenterY = -3.4;
        }
        const cupCenter = new THREE.Vector3(cupCenterX, cupCenterY, 0);

        const tempColor = new THREE.Color();

        // 1. Update Cup Particles (Static structures with micro-vibrations)
        for (let i = 0; i < N_cup; i++) {
            const p = cupParticles[i];
            
            // Micro-vibrations simulating heat / glowing energy
            const vib = Math.sin(time * 3.5 + p.phase) * 0.03;
            const px = cupCenter.x + p.x + vib * Math.cos(p.phase);
            const py = cupCenter.y + p.y + vib * Math.sin(p.phase);
            const pz = cupCenter.z + p.z + vib * Math.cos(p.phase + 1);

            posAttr.setXYZ(i, px, py, pz);

            // Shimmering warm coffee gradient
            const heightRatio = p.y / 1.8;
            tempColor.copy(colorAmber).lerp(colorCream, heightRatio);
            const shimmer = Math.sin(time * 4.0 + p.phase) * 0.08;
            tempColor.r = Math.max(0, Math.min(1, tempColor.r + shimmer));
            tempColor.g = Math.max(0, Math.min(1, tempColor.g + shimmer * 0.4));
            tempColor.b = Math.max(0, Math.min(1, tempColor.b + shimmer * 0.2));

            colAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        }

        // 2. Update Steam / AI Particles (Swirling and rising)
        for (let i = 0; i < N_steam; i++) {
            const p = steamParticles[i];
            const idx = N_cup + i;

            // Rise upward
            p.pos.y += p.vel.y;
            // Swirl motion using sine/cosine waves
            p.pos.x += p.vel.x + Math.sin(p.pos.y * 1.0 + p.phase) * 0.018;
            p.pos.z += p.vel.z + Math.cos(p.pos.y * 1.0 + p.phase) * 0.018;

            // Gentle mouse attraction / swirl when active
            if (mouse.active) {
                const dist = p.pos.distanceTo(mouse3D);
                if (dist < 4.5) {
                    const dir = new THREE.Vector3().subVectors(p.pos, mouse3D);
                    const force = (4.5 - dist) * 0.003;
                    p.pos.addScaledVector(dir.normalize(), force);
                }
            }

            // Loop reset when rising past threshold
            if (p.pos.y > cupCenter.y + 1.8 + 7.5) {
                resetSteamParticle(p, cupCenter);
            }

            posAttr.setXYZ(idx, p.pos.x, p.pos.y, p.pos.z);

            // Color transition from warm coffee to digital AI
            const heightAboveCup = p.pos.y - (cupCenter.y + 1.8);
            const ratio = Math.max(0, Math.min(1, heightAboveCup / 7.5));

            if (ratio < 0.2) {
                // Near rim: coffee amber/gold
                const t = ratio / 0.2;
                tempColor.copy(colorAmber).lerp(colorMagenta, t);
            } else if (ratio < 0.65) {
                // Mid height: transition to orchid/purple
                const t = (ratio - 0.2) / 0.45;
                tempColor.copy(colorMagenta).lerp(colorPurple, t);
            } else {
                // Top: cyber cyan
                const t = (ratio - 0.65) / 0.35;
                tempColor.copy(colorPurple).lerp(colorCyan, t);
            }

            colAttr.setXYZ(idx, tempColor.r, tempColor.g, tempColor.b);
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        // 3. Dynamic line calculations for plexus (only steam particles)
        let lineIdx = 0;
        let linePosOffset = 0;
        let lineColOffset = 0;
        const maxDist = 2.4;

        for (let i = 0; i < N_steam; i++) {
            const nodeA = steamParticles[i].pos;
            const idxA = N_cup + i;
            const rA = colAttr.getX(idxA);
            const gA = colAttr.getY(idxA);
            const bA = colAttr.getZ(idxA);

            for (let j = i + 1; j < N_steam; j++) {
                const nodeB = steamParticles[j].pos;
                const dist = nodeA.distanceTo(nodeB);

                if (dist < maxDist && lineIdx < maxLines) {
                    // Line fades as distance grows
                    const alpha = (1.0 - (dist / maxDist)) * 0.16;

                    const idxB = N_cup + j;
                    const rB = colAttr.getX(idxB);
                    const gB = colAttr.getY(idxB);
                    const bB = colAttr.getZ(idxB);

                    linePositions[linePosOffset++] = nodeA.x;
                    linePositions[linePosOffset++] = nodeA.y;
                    linePositions[linePosOffset++] = nodeA.z;

                    lineColors[lineColOffset++] = rA * alpha;
                    lineColors[lineColOffset++] = gA * alpha;
                    lineColors[lineColOffset++] = bA * alpha;

                    linePositions[linePosOffset++] = nodeB.x;
                    linePositions[linePosOffset++] = nodeB.y;
                    linePositions[linePosOffset++] = nodeB.z;

                    lineColors[lineColOffset++] = rB * alpha;
                    lineColors[lineColOffset++] = gB * alpha;
                    lineColors[lineColOffset++] = bB * alpha;

                    lineIdx++;
                }
            }
        }

        linePosAttr.needsUpdate = true;
        lineColAttr.needsUpdate = true;
        lineGeo.setDrawRange(0, lineIdx * 2);

        renderer.render(scene, camera);
    }

    resize();
    draw();

    window.addEventListener("resize", resize);
}

// ── Checkout Logic ─────────────────────────────────────────────────────────
const TICKET_PRICES = { Class: 99, Private: 299 };
const SUBSCRIPTION_PRICE = { Starter: 19, Text: 39, Media: 79 };

const DEFAULT_PAYMENT_LINKS = {
    class99: "",
    private299: "",
    privateMonthly499: "",
    privateAnnual4790: "",
    starter19: "",
    autopilot39: "",
    media79: "",
    default: ""
};

const PAYMENT_LINKS = {
    ...DEFAULT_PAYMENT_LINKS,
    ...(window.PAYMENT_LINKS || {})
};

function getPaymentLink(ticketType, subTier, isPrivateAnnual = false, isPrivateMonthly = false) {
    if (isPrivateAnnual) return PAYMENT_LINKS.privateAnnual4790;
    if (isPrivateMonthly) return PAYMENT_LINKS.privateMonthly499;
    if (ticketType === "Private") return PAYMENT_LINKS.private299;
    if (subTier === "Starter") return PAYMENT_LINKS.starter19;
    if (subTier === "Text") return PAYMENT_LINKS.autopilot39;
    if (subTier === "Media") return PAYMENT_LINKS.media79;
    return PAYMENT_LINKS.class99;
}

function getSubscriptionPaymentLink(subTier) {
    if (subTier === "Starter") return PAYMENT_LINKS.starter19;
    if (subTier === "Text") return PAYMENT_LINKS.autopilot39;
    if (subTier === "Media") return PAYMENT_LINKS.media79;
    return PAYMENT_LINKS.default;
}

function isPlaceholderLink(link) {
    return typeof link !== "string" || link.startsWith("#stripe-payment-link") || link.trim() === "";
}

function setupCheckout() {
    const ticketSelect = document.getElementById("reg-ticket");
    const subSelect = document.getElementById("reg-subscription");
    const subtotalText = document.getElementById("summary-subtotal");
    const totalText = document.getElementById("summary-total");
    const checkoutForm = document.getElementById("checkout-form");
    const successOverlay = document.getElementById("checkout-success");

    if (!checkoutForm) return;

    // Registration Tab switcher
    const tabCheckout = document.getElementById("tab-checkout");
    const tabWaitlist = document.getElementById("tab-waitlist");
    const billingSummary = document.querySelector(".billing-summary");
    const checkoutBtn = document.getElementById("checkout-btn");
    const fgRow = ticketSelect ? ticketSelect.closest(".fg-row") : null;

    if (tabCheckout && tabWaitlist) {
        tabCheckout.addEventListener("click", () => {
            tabCheckout.classList.add("active");
            tabCheckout.style.color = "var(--text-primary)";
            tabCheckout.style.borderBottomColor = "var(--accent-cyan)";
            
            tabWaitlist.classList.remove("active");
            tabWaitlist.style.color = "var(--text-muted)";
            tabWaitlist.style.borderBottomColor = "transparent";

            if (billingSummary) billingSummary.style.display = "block";
            if (checkoutBtn) checkoutBtn.textContent = "Complete Reservation →";
            if (fgRow) fgRow.style.display = "flex";
        });

        tabWaitlist.addEventListener("click", () => {
            tabWaitlist.classList.add("active");
            tabWaitlist.style.color = "var(--text-primary)";
            tabWaitlist.style.borderBottomColor = "var(--accent-cyan)";

            tabCheckout.classList.remove("active");
            tabCheckout.style.color = "var(--text-muted)";
            tabCheckout.style.borderBottomColor = "transparent";

            if (billingSummary) billingSummary.style.display = "none";
            if (checkoutBtn) checkoutBtn.textContent = "Join Waitlist →";
            if (fgRow) fgRow.style.display = "none";
        });
    }

    function updatePrices() {
        const ticketType = (ticketSelect.value === "Private") ? "Private" : "Class";
        const subTier = subSelect ? subSelect.value : "None";
        const ticket = TICKET_PRICES[ticketType] || 99;
        const sub = SUBSCRIPTION_PRICE[subTier] || 0;
        const total = ticket + sub;
        subtotalText.textContent = "$" + ticket.toFixed(2);
        totalText.textContent = "$" + total.toFixed(2);
    }

    ticketSelect.addEventListener("change", updatePrices);
    if (subSelect) subSelect.addEventListener("change", updatePrices);

    // Pricing card clicks -> auto-select ticket and route to payment link
    document.querySelectorAll(".select-tier-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const tier = btn.getAttribute("data-tier");
            const isPrivateAnnual = btn.id === "payment-option-private-annual";
            const isPrivateMonthly = btn.id === "payment-option-private-monthly";
            if (tier) {
                ticketSelect.value = tier;
                updatePrices();
            }
            const link = getPaymentLink(tier || "Class", subSelect ? subSelect.value : "None", isPrivateAnnual, isPrivateMonthly);
            if (!isPlaceholderLink(link)) {
                window.open(link, "_blank");
            } else {
                alert("Payment link coming soon — this button will open Stripe once the link is created.");
            }
        });
    });

    // Private options toggle
    const privateBtn = document.getElementById("private-options-btn");
    const paymentOptions = document.getElementById("payment-options");
    if (privateBtn && paymentOptions) {
        privateBtn.addEventListener("click", () => {
            paymentOptions.hidden = !paymentOptions.hidden;
            privateBtn.textContent = paymentOptions.hidden ? "View Payment Options" : "Hide Payment Options";
        });
    }

    // Subscription card clicks -> route directly to subscription payment link
    document.querySelectorAll(".select-sub-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const sub = btn.getAttribute("data-sub");
            if (subSelect) subSelect.value = sub;
            updatePrices();
            const link = getSubscriptionPaymentLink(sub);
            if (!isPlaceholderLink(link)) {
                window.open(link, "_blank");
            } else {
                alert("Payment link coming soon — this button will open Stripe once the link is created.");
            }
        });
    });

    // Form submit: save registration, then route to appropriate payment link
    checkoutForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const isWaitlist = tabWaitlist && tabWaitlist.classList.contains("active");
        const name = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const ticketClass = isWaitlist ? "Waitlist" : ((ticketSelect.value === "Private") ? "Private" : "Class");
        const eventId = document.getElementById("reg-venue").value;
        const retainerTier = isWaitlist ? "None" : (subSelect ? subSelect.value : "None");
        const businessRole = document.getElementById("reg-business-role").value;
        const businessType = document.getElementById("reg-business-type").value.trim();
        const painPoint = document.getElementById("reg-pain-point").value.trim();
        const primaryGoal = document.getElementById("reg-primary-goal").value;

        const newCustomer = {
            name, email, ticketClass, eventId, retainerTier,
            businessRole, businessType, painPoint, primaryGoal, waitlist: isWaitlist
        };
        try {
            await DB.customers.add(newCustomer);
        } catch (e) {
            const cur = JSON.parse(localStorage.getItem("zh_customers")) || [];
            cur.push({ id: "c_" + Date.now(), ...newCustomer });
            localStorage.setItem("zh_customers", JSON.stringify(cur));
        }

        // Increment sold seats if not waitlist
        if (!isWaitlist) {
            try {
                const events = await DB.events.list();
                const ev = events.find(x => x.id === eventId);
                if (ev) { ev.ticketsSold = (ev.ticketsSold || 0) + 1; await DB.events.upsert(ev); }
            } catch (e) {
                const cur = JSON.parse(localStorage.getItem("zh_events")) || [];
                const i = cur.findIndex(x => x.id === eventId);
                if (i !== -1) { cur[i].ticketsSold++; localStorage.setItem("zh_events", JSON.stringify(cur)); }
            }
        }

        if (isWaitlist) {
            const successTitle = successOverlay.querySelector("h3");
            const successDesc = successOverlay.querySelector("p");
            if (successTitle && successDesc) {
                successTitle.textContent = "You're on the waitlist!";
                successDesc.textContent = "We'll notify you as soon as new workshop slots or seats open up.";
            }
            successOverlay.style.display = "flex";
            return;
        }

        // Redirect to payment link after saving registration
        const link = getPaymentLink(ticketSelect.value, retainerTier);
        if (!isPlaceholderLink(link)) {
            window.location.href = link;
        } else {
            const successTitle = successOverlay.querySelector("h3");
            const successDesc = successOverlay.querySelector("p");
            if (successTitle && successDesc) {
                successTitle.textContent = "Registration saved!";
                successDesc.textContent = "Your seat is held for 15 minutes. Payment link will be added here once Stripe is connected.";
            }
            successOverlay.style.display = "flex";
        }
    });

    // Reset
    document.getElementById("reset-checkout-btn").addEventListener("click", () => {
        checkoutForm.reset();
        updatePrices();
        successOverlay.style.display = "none";
    });
}

// ── CTA Popup ──────────────────────────────────────────────────────────────
function setupCtaPopup() {
    const popup = document.getElementById("cta-popup");
    const closeBtn = document.getElementById("cta-popup-close");
    const registerBtn = document.getElementById("cta-popup-register");
    const waitlistBtn = document.getElementById("cta-popup-waitlist");
    const skipBtn = document.getElementById("cta-popup-skip");
    const muteBtn = document.getElementById("cta-popup-mute");
    const video = document.getElementById("cta-popup-video");
    const visual = popup.querySelector(".cta-popup-visual");
    
    const tabCheckout = document.getElementById("tab-checkout");
    const tabWaitlist = document.getElementById("tab-waitlist");
    const mobileChipMedia = window.matchMedia("(max-width: 768px)");

    if (!popup) return;

    function pauseVideo() {
        if (video && !video.paused) {
            video.pause();
        }
    }

    function playVideo() {
        if (video && video.paused) {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {
                    // Autoplay blocked — user can still interact with popup
                });
            }
        }
    }

    function setMobileChipBurst(isVisible) {
        if (!visual || !mobileChipMedia.matches) return;
        visual.classList.toggle("mobile-chip-burst", isVisible);
    }

    function syncMobileChipBurst() {
        if (!visual || !video) return;
        if (!mobileChipMedia.matches || !Number.isFinite(video.duration) || video.duration <= 0) {
            visual.classList.remove("mobile-chip-burst");
            return;
        }

        const burstWindow = Math.min(1.8, Math.max(video.duration * 0.18, 0.9));
        const isNearLoopEnd = (video.duration - video.currentTime) <= burstWindow;
        const isLoopRestart = video.currentTime < 0.35;
        setMobileChipBurst(isNearLoopEnd && !isLoopRestart);
    }

    const closePopup = () => {
        popup.classList.remove("show");
        if (visual) visual.classList.remove("mobile-chip-burst");
        pauseVideo();
        setTimeout(() => {
            popup.style.display = "none";
        }, 400);
    };

    // Show popup every page load, but delayed until the user scrolls
    let popupHasShown = false;

    const scrollOptions = { passive: true };

    function triggerPopupAfterScroll() {
        if (popupHasShown) return;

        window.removeEventListener("scroll", onUserScroll, scrollOptions);

        // Delay the actual appearance after the user has scrolled
        setTimeout(() => {
            if (!popupHasShown) {
                popupHasShown = true;
                popup.style.display = "flex";
                popup.offsetHeight; // force reflow
                popup.classList.add("show");
                playVideo();
            }
        }, 2200);
    }

    function onUserScroll() {
        if (popupHasShown) {
            window.removeEventListener("scroll", onUserScroll, scrollOptions);
            return;
        }
        // Trigger after user scrolls a meaningful distance (past hero + first sections)
        if (window.scrollY > 520) {
            triggerPopupAfterScroll();
        }
    }

    // Attach scroll listener
    window.addEventListener("scroll", onUserScroll, scrollOptions);

    // Handle case where user loads the page already scrolled down
    if (window.scrollY > 520) {
        triggerPopupAfterScroll();
    }

    if (closeBtn) closeBtn.addEventListener("click", closePopup);

    // Close on backdrop click
    popup.addEventListener("click", (e) => {
        if (e.target === popup) closePopup();
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popup.classList.contains("show")) {
            closePopup();
        }
    });

    // Mute toggle
    if (muteBtn && video) {
        muteBtn.addEventListener("click", () => {
            video.muted = !video.muted;
            const isMuted = video.muted;
            muteBtn.setAttribute("aria-pressed", String(!isMuted));
            muteBtn.setAttribute("aria-label", isMuted ? "Unmute video" : "Mute video");
        });
    }

    // Video errors: hide broken video, show poster fallback
    if (video) {
        video.addEventListener("loadedmetadata", syncMobileChipBurst);
        video.addEventListener("timeupdate", syncMobileChipBurst);
        video.addEventListener("seeked", syncMobileChipBurst);
        video.addEventListener("play", syncMobileChipBurst);
        video.addEventListener("error", () => {
            if (visual) visual.classList.remove("mobile-chip-burst");
            video.style.display = "none";
            const fallback = document.createElement("img");
            fallback.src = video.getAttribute("poster") || "assets/lynnhaven_coffee_base.jpg";
            fallback.alt = "AI and Coffee workshop";
            fallback.className = "cta-popup-video-fallback";
            video.parentNode.insertBefore(fallback, video.nextSibling);
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            closePopup();
            if (tabCheckout) tabCheckout.click();
            const target = document.getElementById("register");
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    }

    if (waitlistBtn) {
        waitlistBtn.addEventListener("click", () => {
            closePopup();
            if (tabWaitlist) tabWaitlist.click();
            const target = document.getElementById("register");
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    }

    if (skipBtn) {
        skipBtn.addEventListener("click", () => {
            closePopup();
            const target = document.getElementById("how-it-works");
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    }

    // Book seat from CTA popup -> open the correct Class payment link
    const bookBtn = document.getElementById("cta-popup-book");
    if (bookBtn) {
        bookBtn.addEventListener("click", () => {
            closePopup();
            const link = PAYMENT_LINKS.class99;
            if (!isPlaceholderLink(link)) {
                window.open(link, "_blank");
            } else {
                alert("Payment link coming soon — this button will open Stripe once the link is created.");
            }
        });
    }

    if (typeof mobileChipMedia.addEventListener === "function") {
        mobileChipMedia.addEventListener("change", syncMobileChipBurst);
    } else if (typeof mobileChipMedia.addListener === "function") {
        mobileChipMedia.addListener(syncMobileChipBurst);
    }
}

// ── Sauce Section Video Popup (opens clean video modal) ────────────────────
function setupSauceVideoPopup() {
    const preview = document.getElementById("sauce-video-preview");
    const popup = document.getElementById("video-popup");
    if (!preview || !popup) return;

    const closeBtn = popup.querySelector(".video-popup-close");
    const video = document.getElementById("section-video");
    const backdrop = popup.querySelector(".video-popup-backdrop");

    const openPopup = () => {
        popup.style.display = "flex";
        if (video) {
            video.currentTime = 0;
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {});
            }
        }
    };

    const closePopup = () => {
        popup.style.display = "none";
        if (video) {
            video.pause();
        }
    };

    preview.addEventListener("click", openPopup);

    if (closeBtn) closeBtn.addEventListener("click", closePopup);
    if (backdrop) backdrop.addEventListener("click", closePopup);

    popup.addEventListener("click", (e) => {
        if (e.target === popup) closePopup();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popup.style.display !== "none") {
            closePopup();
        }
    });
}

// ── Counter Animation for Hero Metrics ─────────────────────────────────────
function animateCounters() {
    const counters = document.querySelectorAll(".fac-metric-value");
    counters.forEach(el => {
        const target = el.textContent;
        const isNumeric = /^[\d,.]+$/.test(target.replace(/[$khm]/gi, ''));
        if (!isNumeric) return; // skip non-numeric like "$2.1k"
    });
}

// ── Initialise ─────────────────────────────────────────────────────────────
window.onload = () => {
    setupThemeToggle();
    populateVenueDropdown();
    setupMobileNav();
    setupNavbarScroll();
    setupScenarioShowcase();
    setupSmartphoneSimulator();
    setupRoiCalculator();
    setupTestimonialCarousel();
    setupFaqAccordion();
    setupCheckout();
    setupCtaPopup();
    setupSauceVideoPopup();
    setupScrollReveal();
    setupParticles();
    animateCounters();
    setupAiCoffeeLounge();
    setupKeyboardHotkeys();
};

// ── Theme Manager (Dark Mode) ────────────────────────────────────────────────
function setupThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add("dark-theme");
    }

    toggle.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

// ── Smartphone Chatbot Mock Database & Logic ─────────────────────────────────
const MOCK_REPLIES = {
    nullai: [
        { keys: ["price", "cost", "landing page", "website", "project", "app"], reply: "Neal's custom landing pages start at $2,500, and full web applications start at $5,000. Each project includes custom UI mocks, SEO setup, and hosting configuration." },
        { keys: ["availability", "schedule", "call", "discovery", "time", "date"], reply: "Neal has two client project slots open starting next month. Would you like me to share his booking link to schedule a discovery call?" },
        { keys: ["invoice", "payment", "bill", "track"], reply: "I can check the status of your invoice. Please share your project name or company name, and I will pull up the details." },
        { keys: ["social", "post", "marketing", "twitter", "linkedin"], reply: "Neal uses AI to draft weekly tech posts. Would you like me to draft a quick post about React, Node, or local SEO strategy for your site?" }
    ],
    realtor: [
        { keys: ["price", "cost", "house", "asking", "shore drive"], reply: "The property near Lynnhaven Colony is listed at $425,000. It's a 3-bed, 2.5-bath, just two blocks from the bay!" },
        { keys: ["tour", "see", "view", "schedule", "visit"], reply: "I can set up a private tour for you this Saturday. Are morning or afternoon times better for you?" },
        { keys: ["neighborhood", "school", "beach", "district"], reply: "It's located in the Shore Drive corridor. Very walkable to Lynnhaven Coffee Co. and local parks, and zoned for highly rated local schools." }
    ],
    contractor: [
        { keys: ["standard fee", "trip fee", "diagnostic", "cost", "price", "quote"], reply: "Mike's standard diagnostic visit is $95. What's your address and what issue are you seeing?" },
        { keys: ["where", "service area", "coverage", "vb", "norfolk", "chesapeake"], reply: "Mike services Virginia Beach, Norfolk, and Chesapeake. Where is your home or job site located?" },
        { keys: ["attic", "ac", "electrical", "hvac", "leak"], reply: "Mike handles attic wiring, electrical service calls, panel upgrades, and HVAC issues. Can you send a photo of the setup?" }
    ],
    salon: [
        { keys: ["opening", "appointment", "book", "saturday"], reply: "I have openings at 10:30 AM and 2 PM this Saturday for a trim. Which works better for you?" },
        { keys: ["price", "cost", "cut", "color"], reply: "A haircut is $65, and full color starts at $120. Would you like to schedule a session?" },
        { keys: ["hours", "open", "time"], reply: "We are open Wednesday through Saturday, 9 AM to 7 PM. Closed Sundays and Mondays." }
    ],
    fitness: [
        { keys: ["price", "cost", "month", "membership"], reply: "Small group training is $149/month, which includes unlimited access to Dan's sessions. First class is free!" },
        { keys: ["schedule", "time", "class"], reply: "Classes run Monday through Friday at 6 AM, 12 PM, and 5:30 PM. Saturday morning class is at 9 AM." },
        { keys: ["try", "trial", "free"], reply: "Yes, you can try any class for free! Which day and time works best to start?" }
    ],
    cleaning: [
        { keys: ["quote", "price", "cost", "estimate"], reply: "Our deep cleans start at $180 for a 3-bed, 2-bath house. How many bedrooms and bathrooms does your home have?" },
        { keys: ["schedule", "frequency", "weekly", "biweekly"], reply: "We offer weekly, biweekly, or one-time cleanings. Biweekly is our most popular option. What works best?" },
        { keys: ["safe", "product", "pets"], reply: "Yes, we use 100% pet-safe and eco-friendly products that leave your home spotless without harsh chemical smells." }
    ],
    lawncare: [
        { keys: ["cut", "mow", "price", "cost"], reply: "Lawn cuts start at $45 per yard. What is your address so Chris can check Google Earth for a quick quote?" },
        { keys: ["schedule", "date", "week"], reply: "We can fit you in this Thursday or Friday. Would you like a regular biweekly cut or just a one-time mow?" },
        { keys: ["area", "serve", "chic's beach", "shore drive", "oceanfront"], reply: "Yes! We have regular routes in Chic's Beach, Shore Drive corridor, and the Oceanfront area." }
    ]
};

function getMockAiResponse(scenarioKey, userText) {
    const text = userText.toLowerCase();
    const replies = MOCK_REPLIES[scenarioKey] || [];
    for (const r of replies) {
        if (r.keys.some(k => text.includes(k))) {
            return r.reply;
        }
    }
    const fallbacks = {
        nullai: "I can check that for you! If it's about pricing or custom projects, would you like me to share Neal's booking link for a discovery call?",
        realtor: "That is a great question about the listing. I can have Rachel check the latest tax records. What is your phone number?",
        contractor: "Mike can help with AC or electrical repairs. What is your address or zip code so I can check standard availability?",
        salon: "We do offer that service! Bella's bookings fill up fast. Would you like to check our schedule online?",
        fitness: "Strength classes run daily! First class is free. Would you like to join Dan's 6 AM or 5:30 PM session tomorrow?",
        cleaning: "We provide deep cleanings. What is the approximate square footage of your home so I can estimate the price?",
        lawncare: "We cut grass, trim hedges, and edge borders. What is your address so Chris can check Google Earth for a quick quote?"
    };
    return fallbacks[scenarioKey] || "I'd be happy to check that for you. Would you like me to have our team follow up with you by text?";
}

function setupSmartphoneSimulator() {
    const form = document.getElementById("phone-chat-form");
    const input = document.getElementById("phone-chat-input");
    const overlay = document.getElementById("scenario-overlay");

    if (!form || !input || !overlay) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const userText = input.value.trim();
        if (!userText) return;
        
        // Find active scenario key
        const activeTab = document.querySelector(".scenario-tab.active");
        const scenarioKey = activeTab ? activeTab.getAttribute("data-scenario") : "nullai";

        // Append user message
        const userMsg = document.createElement("div");
        userMsg.className = "scenario-message in";
        userMsg.innerHTML = `<span class="msg-sender">Customer</span><span class="msg-text">${userText}</span>`;
        overlay.appendChild(userMsg);
        input.value = "";
        
        // Scroll to bottom
        overlay.scrollTop = overlay.scrollHeight;

        // Render typing indicator
        const typingMsg = document.createElement("div");
        typingMsg.className = "scenario-message out typing";
        typingMsg.id = "chat-typing";
        typingMsg.innerHTML = `<span></span><span></span><span></span>`;
        
        setTimeout(() => {
            overlay.appendChild(typingMsg);
            overlay.scrollTop = overlay.scrollHeight;
        }, 300);

        // Render response
        setTimeout(() => {
            const typing = document.getElementById("chat-typing");
            if (typing) typing.remove();

            const aiReplyText = getMockAiResponse(scenarioKey, userText);
            const aiMsg = document.createElement("div");
            aiMsg.className = "scenario-message out";
            aiMsg.innerHTML = `<span class="msg-sender">AI Helper</span><span class="msg-text">${aiReplyText}</span>`;
            overlay.appendChild(aiMsg);
            overlay.scrollTop = overlay.scrollHeight;
        }, 1500);
    });
}

// ── ROI CALCULATOR LOGIC ─────────────────────────────────────────────────
function setupRoiCalculator() {
    const hoursReplies = document.getElementById("calc-hours-replies");
    const hoursBooking = document.getElementById("calc-hours-booking");
    const hoursSocial = document.getElementById("calc-hours-social");
    const hoursAdmin = document.getElementById("calc-hours-admin");
    const rate = document.getElementById("calc-rate");

    const repliesVal = document.getElementById("calc-hours-replies-val");
    const bookingVal = document.getElementById("calc-hours-booking-val");
    const socialVal = document.getElementById("calc-hours-social-val");
    const adminVal = document.getElementById("calc-hours-admin-val");
    const rateVal = document.getElementById("calc-rate-val");

    const resTimeSaved = document.getElementById("res-time-saved");
    const resMoneySaved = document.getElementById("res-money-saved");
    const resRoi = document.getElementById("res-roi");

    if (!hoursReplies || !hoursBooking || !hoursSocial || !hoursAdmin || !rate) return;

    const presetBtns = document.querySelectorAll(".calc-preset-btn");
    const PRESETS = {
        nullai: { replies: 6, booking: 4, social: 5, admin: 3, rate: 75 },
        contractor: { replies: 8, booking: 6, social: 2, admin: 4, rate: 50 },
        salon: { replies: 5, booking: 4, social: 4, admin: 3, rate: 40 },
        realtor: { replies: 10, booking: 6, social: 6, admin: 3, rate: 75 },
        lawncare: { replies: 6, booking: 4, social: 2, admin: 2, rate: 35 }
    };

    function recalculate() {
        const hReplies = parseInt(hoursReplies.value, 10);
        const hBooking = parseInt(hoursBooking.value, 10);
        const hSocial = parseInt(hoursSocial.value, 10);
        const hAdmin = parseInt(hoursAdmin.value, 10);
        const rateHour = parseInt(rate.value, 10);

        repliesVal.textContent = `${hReplies} hrs/wk`;
        bookingVal.textContent = `${hBooking} hrs/wk`;
        socialVal.textContent = `${hSocial} hrs/wk`;
        adminVal.textContent = `${hAdmin} hrs/wk`;
        rateVal.textContent = `$${rateHour}/hr`;

        const totalHoursSavedWeekly = hReplies + hBooking + hSocial + hAdmin;
        const totalHoursSavedMonthly = Math.round(totalHoursSavedWeekly * 4.33);
        const totalHoursSavedYearly = Math.round(totalHoursSavedWeekly * 52);

        // Deduct $39/mo for the Text AI plan
        const moneySavedYearly = (totalHoursSavedYearly * rateHour) - (39 * 12);
        
        const aiCostYearly = 39 * 12;
        const roiVal = Math.round(((totalHoursSavedYearly * rateHour) / aiCostYearly) * 100);

        resTimeSaved.textContent = `${totalHoursSavedMonthly} Hours`;
        resMoneySaved.textContent = `$${moneySavedYearly.toLocaleString()}`;
        resRoi.textContent = `${roiVal.toLocaleString()}%`;
    }

    function removePresetActive() {
        presetBtns.forEach(btn => {
            if (btn.getAttribute("data-preset") === "custom") {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    if (presetBtns.length) {
        presetBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const key = btn.getAttribute("data-preset");
                presetBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                if (key !== "custom" && PRESETS[key]) {
                    hoursReplies.value = PRESETS[key].replies;
                    hoursBooking.value = PRESETS[key].booking;
                    hoursSocial.value = PRESETS[key].social;
                    hoursAdmin.value = PRESETS[key].admin;
                    rate.value = PRESETS[key].rate;
                    recalculate();
                }
            });
        });
    }

    hoursReplies.addEventListener("input", () => {
        removePresetActive();
        recalculate();
    });
    hoursBooking.addEventListener("input", () => {
        removePresetActive();
        recalculate();
    });
    hoursSocial.addEventListener("input", () => {
        removePresetActive();
        recalculate();
    });
    hoursAdmin.addEventListener("input", () => {
        removePresetActive();
        recalculate();
    });
    rate.addEventListener("input", () => {
        removePresetActive();
        recalculate();
    });

    recalculate();
}

// ── TESTIMONIAL CAROUSEL LOGIC ───────────────────────────────────────────
function setupTestimonialCarousel() {
    const track = document.getElementById("testimonial-track");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    const dotsContainer = document.getElementById("carousel-dots");

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const slides = Array.from(track.children);
    let currentIndex = 0;
    
    function getItemsPerView() {
        return window.innerWidth >= 768 ? 2 : 1;
    }

    function getMaxIndex() {
        return Math.max(0, slides.length - getItemsPerView());
    }

    function renderDots() {
        dotsContainer.innerHTML = "";
        const dotCount = slides.length - getItemsPerView() + 1;
        if (dotCount <= 1) {
            dotsContainer.style.display = "none";
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
            return;
        } else {
            dotsContainer.style.display = "flex";
            prevBtn.style.display = "flex";
            nextBtn.style.display = "flex";
        }

        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
            dot.ariaLabel = `Go to slide ${i + 1}`;
            dot.addEventListener("click", () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= getMaxIndex();
        
        prevBtn.style.opacity = prevBtn.disabled ? "0.4" : "1";
        nextBtn.style.opacity = nextBtn.disabled ? "0.4" : "1";
    }

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
            updateCarousel();
        }
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            currentIndex = Math.min(currentIndex, getMaxIndex());
            renderDots();
            updateCarousel();
        }, 100);
    });

    renderDots();
    updateCarousel();
}

// ── FAQ ACCORDION LOGIC ──────────────────────────────────────────────────
function setupFaqAccordion() {
    const questions = document.querySelectorAll(".faq-question");
    questions.forEach(q => {
        q.addEventListener("click", () => {
            const isExpanded = q.getAttribute("aria-expanded") === "true";
            const answer = q.nextElementSibling;
            const icon = q.querySelector(".faq-icon");

            questions.forEach(otherQ => {
                if (otherQ !== q) {
                    otherQ.setAttribute("aria-expanded", "false");
                    if (otherQ.nextElementSibling) otherQ.nextElementSibling.hidden = true;
                    const otherIcon = otherQ.querySelector(".faq-icon");
                    if (otherIcon) otherIcon.textContent = "+";
                }
            });

            q.setAttribute("aria-expanded", !isExpanded);
            if (answer) answer.hidden = isExpanded;
            if (icon) icon.textContent = isExpanded ? "+" : "−";
        });
    });
}

// ── Web Audio API Sound Effects Engine ─────────────────────────────────────
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    initCtx() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    playChime(freqs = [523.25, 659.25, 783.99], duration = 0.4) {
        if (!this.enabled) return;
        try {
            this.initCtx();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            freqs.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);

                gain.gain.setValueAtTime(0.01, now + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + duration);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + duration);
            });
        } catch (e) {
            // Audio context fallback
        }
    }

    playBrewSound() {
        this.playChime([440, 554.37, 659.25, 880], 0.5);
    }

    playSuccessSound() {
        this.playChime([523.25, 659.25, 783.99, 1046.50], 0.6);
    }
}

const AudioSFX = new SoundEngine();

// ── Interactive AI Coffee Lounge & Prompt Bar Logic ────────────────────────
function setupAiCoffeeLounge() {
    const presetBtns = document.querySelectorAll(".lounge-presets-grid .preset-btn");
    const roastSelect = document.getElementById("lounge-roast-select");
    const promptInput = document.getElementById("lounge-prompt-input");
    const brewBtn = document.getElementById("lounge-brew-btn");
    const sfxToggle = document.getElementById("lounge-sfx-toggle");
    const outputBody = document.getElementById("lounge-output-body");
    const statusText = document.getElementById("lounge-status-text");
    const latencyText = document.getElementById("lounge-latency");
    const tokensText = document.getElementById("lounge-tokens");
    const copyRespBtn = document.getElementById("lounge-copy-response");
    const copyCodeBtn = document.getElementById("lounge-copy-code");
    const testSfxBtn = document.getElementById("lounge-test-sfx");

    if (!brewBtn || !outputBody) return;

    let currentResponseText = "";
    let isBrewing = false;

    // Presets handler
    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            presetBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const promptText = btn.getAttribute("data-prompt");
            if (promptText && promptInput) {
                promptInput.value = promptText;
            }

            const roast = btn.getAttribute("data-roast");
            if (roast && roastSelect) {
                if (roast === "support") roastSelect.value = "latte";
                else if (roast === "lead") roastSelect.value = "espresso";
                else if (roast === "booking") roastSelect.value = "coldbrew";
                else if (roast === "marketing") roastSelect.value = "macchiato";
            }

            AudioSFX.playChime([523.25, 659.25], 0.2);
        });
    });

    // SFX toggle handler
    if (sfxToggle) {
        sfxToggle.addEventListener("click", () => {
            AudioSFX.enabled = !AudioSFX.enabled;
            const isEnabled = AudioSFX.enabled;
            sfxToggle.setAttribute("aria-pressed", String(isEnabled));
            sfxToggle.innerHTML = `<span class="sfx-icon">${isEnabled ? "🔊" : "🔇"}</span><span class="sfx-text">${isEnabled ? "Audio ON" : "Audio OFF"}</span>`;
            if (isEnabled) AudioSFX.playChime([659.25, 880], 0.2);
        });
    }

    // Defensive offline mock engine generator
    function generateMockAgentResponse(prompt, tone) {
        const text = prompt.toLowerCase();
        let greeting = "Hi there!";
        let closing = "\n\nLet me know if you'd like me to lock this in for you!";

        if (tone === "latte") {
            greeting = "Hello! Thanks so much for reaching out to us today. ☕";
            closing = "\n\nWe're always here to make things easy for you. Have a fantastic day!";
        } else if (tone === "espresso") {
            greeting = "Got it.";
            closing = "\n\nReply YES to confirm.";
        } else if (tone === "coldbrew") {
            greeting = "Good day. Thank you for contacting our team.";
            closing = "\n\nWe look forward to assisting you.";
        } else if (tone === "macchiato") {
            greeting = "Hey there! Ready to bring some magic to your day ✨";
            closing = "\n\nDrop a message back whenever you're ready!";
        }

        if (text.includes("chic's beach") || text.includes("fee") || text.includes("service") || text.includes("diagnostic")) {
            return `${greeting}\nYes! We actively service Chic's Beach and the entire Shore Drive corridor. Our standard diagnostic visit is $95, which gets applied directly toward any service or repair you approve.\n\nWould you like me to reserve a service slot for you tomorrow morning?${closing}`;
        } else if (text.includes("shore drive") || text.includes("bay") || text.includes("buyer") || text.includes("listings")) {
            return `${greeting}\nWe have 2 fantastic 3-bedroom properties near Shore Drive currently available under $450k! Both feature updated kitchens and are just minutes from the beach.\n\nShall I send over the virtual tour links or schedule an in-person showing for this weekend?${closing}`;
        } else if (text.includes("trim") || text.includes("hair") || text.includes("salon") || text.includes("saturday")) {
            return `${greeting}\nWe have two openings open for Saturday morning: 9:30 AM and 11:15 AM! Both include a full consultation, wash, and style.\n\nWhich time slot works best for your schedule?${closing}`;
        } else if (text.includes("sourdough") || text.includes("social") || text.includes("bread") || text.includes("bakery")) {
            return `${greeting}\nHere is a 15-second promo script for your social reel:\n\n"🌅 Fresh outta the oven at Lynnhaven Coffee! Our signature artisan sourdough is warm, crusty, and ready for your Saturday morning. Grab yours before it's gone!"${closing}`;
        } else {
            return `${greeting}\nYour business helper is trained on your exact menu, pricing, and schedule. I've logged this inquiry: "${prompt.slice(0, 80)}..." and prepared an automated response.\n\nWould you like to review or customize your helper's rules further?${closing}`;
        }
    }

    // Brew Agent button listener
    brewBtn.addEventListener("click", () => {
        if (isBrewing) return;
        isBrewing = true;

        const promptText = promptInput ? promptInput.value.trim() : "Default prompt";
        const tone = roastSelect ? roastSelect.value : "latte";

        AudioSFX.playBrewSound();

        if (statusText) statusText.textContent = "Brewing agent response...";
        brewBtn.disabled = true;
        brewBtn.style.opacity = "0.75";

        // Initial loading shimmer state in output
        outputBody.innerHTML = `
            <div class="brewed-response" style="opacity: 0.6; font-style: italic;">
                ☕ Extracting business knowledge base &amp; brewing AI agent response...
            </div>
        `;

        const startTime = performance.now();

        setTimeout(() => {
            currentResponseText = generateMockAgentResponse(promptText, tone);
            const endTime = performance.now();
            const latency = ((endTime - startTime) / 1000).toFixed(2);
            const approxTokens = Math.round(currentResponseText.length / 3.8);

            // Stream response into DOM
            outputBody.innerHTML = `<div class="brewed-response" id="active-brewed-text"></div>`;
            const textElem = document.getElementById("active-brewed-text");

            let charIdx = 0;
            const streamTimer = setInterval(() => {
                if (charIdx < currentResponseText.length) {
                    charIdx += Math.min(4, currentResponseText.length - charIdx);
                    if (textElem) textElem.textContent = currentResponseText.slice(0, charIdx);
                } else {
                    clearInterval(streamTimer);
                    isBrewing = false;
                    brewBtn.disabled = false;
                    brewBtn.style.opacity = "1";

                    if (statusText) statusText.textContent = "Agent response brewed & ready";
                    if (latencyText) latencyText.textContent = `Latency: ${latency}s`;
                    if (tokensText) tokensText.textContent = `Tokens: ${approxTokens}`;

                    AudioSFX.playSuccessSound();
                }
            }, 20);

        }, 450);
    });

    // Copy response button
    if (copyRespBtn) {
        copyRespBtn.addEventListener("click", () => {
            if (!currentResponseText) {
                alert("Please brew an agent response first!");
                return;
            }
            navigator.clipboard.writeText(currentResponseText).then(() => {
                copyRespBtn.textContent = "✓ Copied!";
                setTimeout(() => (copyRespBtn.textContent = "📋 Copy Response"), 2000);
            });
        });
    }

    // Copy config JSON
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener("click", () => {
            const configObj = {
                agent: "AI & Coffee Helper Engine",
                instructor: "Zoth Studio Team (nullai.tech)",
                flavorTone: roastSelect ? roastSelect.value : "latte",
                prompt: promptInput ? promptInput.value : "",
                activeCapabilities: ["SMS Auto-Reply", "Lead Qualification", "Booking Triggers"],
                timestamp: new Date().toISOString()
            };
            navigator.clipboard.writeText(JSON.stringify(configObj, null, 2)).then(() => {
                copyCodeBtn.textContent = "✓ Config Copied!";
                setTimeout(() => (copyCodeBtn.textContent = "⚙️ Copy Config JSON"), 2000);
            });
        });
    }

    // Test audio chime button
    if (testSfxBtn) {
        testSfxBtn.addEventListener("click", () => {
            AudioSFX.playSuccessSound();
        });
    }
}

// ── Keyboard Hotkeys Accessibility (AX) ───────────────────────────────────
function setupKeyboardHotkeys() {
    document.addEventListener("keydown", (e) => {
        // Alt + P or Alt + L -> Jump to AI Coffee Lounge
        if (e.altKey && (e.key.toLowerCase() === "p" || e.key.toLowerCase() === "l")) {
            e.preventDefault();
            const lounge = document.getElementById("ai-lounge");
            if (lounge) {
                lounge.scrollIntoView({ behavior: "smooth" });
                const promptInput = document.getElementById("lounge-prompt-input");
                if (promptInput) promptInput.focus();
            }
        }
        // Alt + R -> Jump to Registration Section
        if (e.altKey && e.key.toLowerCase() === "r") {
            e.preventDefault();
            const reg = document.getElementById("register");
            if (reg) {
                reg.scrollIntoView({ behavior: "smooth" });
                const regName = document.getElementById("reg-name");
                if (regName) regName.focus();
            }
        }
    });
}

