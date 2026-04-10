/**
 * WalkWellMD Master Engine (V4.1 - Biomechanical Production Edition)
 * Handles 3D Foot Animation, Exclusive Tab State, and Robust Icon Rendering.
 */

let currentLang = localStorage.getItem('wwmd_lang') || 'en';
let activeTab = null; // Sir, as requested, start empty (no protocols shown on load)

/**
 * Main Initialization
 */
async function initializeWalkWellMD() {
    try {
        // 1. Detect Path Depth (Essential for assets in sub-folders)
        const isSubfolder = window.location.pathname.includes('/protocols/') || window.location.pathname.includes('/education/');
        const basePath = isSubfolder ? '../' : './';
        
        // 2. Fetch Master Library (data.json)
        const response = await fetch(basePath + 'data.json');
        if (!response.ok) throw new Error("Could not load data.json");
        const data = await response.json();
        const config = data.branding;

        // 3. Set Global Page Direction
        document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

        // 4. Inject Persistent UI Components
        injectHeader(config, basePath, isSubfolder);
        injectActionBar(config);

        // 5. Dashboard Specific Rendering
        if (document.getElementById('protocol-list')) {
            renderDashboard(data, config, basePath);
            // Initialize 3D Animation only on the home page
            if (!isSubfolder && typeof THREE !== 'undefined') {
                initFootAnimation();
            }
        }

    } catch (error) {
        console.error("WalkWellMD Engine Error:", error);
    }
}

/**
 * 3D BIOMECHANICAL ANIMATION (Three.js)
 * Creates a cinematic anatomical model of a foot performing flexion.
 */
function initFootAnimation() {
    const container = document.getElementById('foot-animation');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Anatomical Materials
    const boneMat = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 100, opacity: 0.85, transparent: true });
    const emeraldMat = new THREE.MeshPhongMaterial({ color: 0x2D8A6C });

    // Build the Biomechanical Rig
    const footGroup = new THREE.Group();
    
    // Lower Leg (Tibia/Fibula)
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 3, 32), boneMat);
    leg.position.y = 2.5;
    
    // Ankle/Heel
    const heel = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), boneMat);
    
    // Foot Body
    const midFoot = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 2.5), boneMat);
    midFoot.position.set(0, -0.2, 1);
    
    // Toes (Branded highlight)
    const toes = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.8), emeraldMat);
    toes.position.set(0, -0.4, 2.5);

    footGroup.add(heel, midFoot, toes);
    scene.add(leg, footGroup);

    // Lighting
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight, new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.set(8, 2, 8);
    camera.lookAt(0, 1, 0);

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.0015;
        // Rhythmic Biomechanical Flexion
        footGroup.rotation.x = Math.sin(time) * 0.2; 
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
}

/**
 * UI Component: Header (With Back Button)
 */
function injectHeader(config, basePath, isSubfolder) {
    const header = document.getElementById('global-header');
    if (!header) return;

    // Circular back button for clinical sub-navigation
    const backBtnHtml = isSubfolder ? `
        <a href="${basePath}index.html" class="back-btn">${currentLang === 'en' ? '←' : '→'}</a>
    ` : '';

    header.innerHTML = `
        <div class="header">
            <div class="header-left">
                ${backBtnHtml}
                <div class="surgeon-brand">
                    <div class="surgeon-name">${config['surgeon_' + currentLang]}</div>
                    <div class="hospital-brand">
                        <img src="${basePath}${config.logo}" alt="Hospital Logo" class="hospital-logo" onerror="this.style.opacity='0'">
                        <div class="hospital-info">${config['hospital_' + currentLang]}<br>${config['location_' + currentLang]}</div>
                    </div>
                </div>
            </div>
            <div style="font-size: 1.5rem; color: var(--emerald); cursor:pointer;" onclick="window.location.href='${basePath}index.html'">☰</div>
        </div>
    `;
}

/**
 * UI Component: Persistent Action Bar
 */
function injectActionBar(config) {
    const bar = document.getElementById('global-action-bar');
    if (!bar) return;
    bar.innerHTML = `
        <div class="floating-lang">
            <button class="lang-switch ${currentLang === 'en' ? 'active' : ''}" onclick="setGlobalLanguage('en')">EN</button>
            <button class="lang-switch ${currentLang === 'ar' ? 'active' : ''}" onclick="setGlobalLanguage('ar')">العربية</button>
        </div>
        <nav class="action-bar">
            <a href="tel:${config.phone}" class="bar-item"><i>📞</i><span>${currentLang === 'en' ? 'Call' : 'اتصال'}</span></a>
            <a href="https://wa.me/${config.whatsapp}" class="bar-item" style="background: var(--emerald); color: white; border-radius: 12px; margin: 5px; padding: 10px;"><i>💬</i><span>WhatsApp</span></a>
            <a href="${config.reviewUrl}" class="bar-item" target="_blank"><i>⭐</i><span>${currentLang === 'en' ? 'Review' : 'تقييم'}</span></a>
        </nav>
    `;
}

/**
 * Robust Icon Helper (Trims spaces and handles hyphens)
 */
function getIconHtml(icon, basePath) {
    if (!icon) return '';
    const cleanIcon = icon.trim();
    const isImage = cleanIcon.includes('assets/') || /\.(jpg|jpeg|png|svg|webp)$/i.test(cleanIcon);
    
    if (isImage) {
        return `<img src="${encodeURI(basePath + cleanIcon)}" class="card-icon-img" onerror="this.outerHTML='<div class=\'icon-fallback\'>🦴</div>'">`;
    }
    return `<div class="card-icon-emoji">${cleanIcon}</div>`;
}

/**
 * Dashboard Logic: Exclusive Tabs & Grid Rendering
 */
function renderDashboard(data, config, basePath) {
    const list = document.getElementById('protocol-list');
    const tabAnchor = document.getElementById('tab-anchor');
    const profileImg = document.getElementById('ui-prof-img');

    // Update Profile Branding
    if (profileImg) {
        profileImg.src = basePath + config.headshot;
        profileImg.style.display = 'block';
    }
    document.getElementById('ui-prof-title').innerText = config['surgeon_' + currentLang];
    document.getElementById('ui-prof-desc').innerText = config['profession_' + currentLang];

    // Inject Segmented Control (Tabs)
    tabAnchor.innerHTML = `
        <div class="tab-container">
            <button class="tab-btn ${activeTab === 'protocols' ? 'active' : ''}" onclick="switchDashboardTab('protocols')">
                ${currentLang === 'en' ? 'Protocols' : 'البروتوكولات'}
            </button>
            <button class="tab-btn ${activeTab === 'education' ? 'active' : ''}" onclick="switchDashboardTab('education')">
                ${currentLang === 'en' ? 'Education' : 'التثقيف'}
            </button>
        </div>
    `;

    // Exclusive State: Hide content until a tab is clicked
    if (!activeTab) {
        list.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 60px; opacity:0.4; font-weight:600;">
            ${currentLang === 'en' ? 'Select a category to view surgical information' : 'اختر فئة لعرض المعلومات الجراحية'}
        </div>`;
        return;
    }

    const sourceData = activeTab === 'protocols' ? data.protocols : data.education;
    const label = activeTab === 'protocols' ? (currentLang === 'en' ? 'VIEW PROTOCOL' : 'عرض البروتوكول') : (currentLang === 'en' ? 'LEARN MORE' : 'اقرأ المزيد');

    list.innerHTML = sourceData.map(item => `
        <a href="${basePath}${item.url}" class="glass-card">
            <div class="icon-container">${getIconHtml(item.icon, basePath)}</div>
            <h3>${currentLang === 'en' ? item.title_en : item.title_ar}</h3>
            <p class="view-label">${label}</p>
        </a>
    `).join('');

    // Localize Hero Text
    if (currentLang === 'ar') {
        document.getElementById('ui-hero-sub').innerText = "التميز في الحركة";
        document.getElementById('ui-hero-main').innerText = "جراحة العظام والقدم والكاحل";
    }
}

/**
 * Global State Management
 */
window.switchDashboardTab = function(tab) {
    activeTab = tab;
    initializeWalkWellMD(); // Trigger clean re-render
};

window.setGlobalLanguage = function(lang) {
    localStorage.setItem('wwmd_lang', lang);
    window.location.reload();
};

window.addEventListener('DOMContentLoaded', initializeWalkWellMD);
