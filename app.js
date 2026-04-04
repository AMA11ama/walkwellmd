/**
 * WalkWellMD Master Engine (V3.1 - Light Luxury Edition)
 * Centralized logic for Branding, Language, Icons, and Dashboard Rendering.
 */

let currentLang = localStorage.getItem('wwmd_lang') || 'en';

/**
 * Main Initialization
 */
async function initializeWalkWellMD() {
    try {
        // 1. Detect Path Depth (Root vs Subfolders)
        // Helps determine if we need to go up a level to find data.json or images
        const isSubfolder = window.location.pathname.includes('/protocols/') || window.location.pathname.includes('/education/');
        const basePath = isSubfolder ? '../' : './';
        
        // 2. Fetch Master Library (data.json) from the Root
        const response = await fetch(basePath + 'data.json');
        if (!response.ok) throw new Error("Could not load data.json");
        const data = await response.json();
        const config = data.branding;

        // 3. Set Global Page Direction (Bilingual Support)
        document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

        // 4. Inject Global Header (Branding & Navigation)
        injectHeader(config, basePath);

        // 5. Inject Global Action Bar & Language Toggle
        injectActionBar(config);

        // 6. Dashboard Specific Logic
        // Only runs if the specific containers exist on the page (index.html)
        if (document.getElementById('protocol-list')) {
            renderDashboard(data, config, basePath);
        }

    } catch (error) {
        console.error("WalkWellMD Engine Error:", error);
    }
}

/**
 * UI Component: Global Header
 * Injects Surgeon Name, Hospital Logo, and Hospital Info
 */
function injectHeader(config, basePath) {
    const header = document.getElementById('global-header');
    if (!header) return;

    header.innerHTML = `
        <div class="header">
            <div class="surgeon-brand">
                <div class="surgeon-name">${config['surgeon_' + currentLang]}</div>
                <div class="hospital-brand">
                    <img src="${basePath}${config.logo}" alt="Hospital Logo" class="hospital-logo" onerror="this.style.opacity='0'">
                    <div class="hospital-info">
                        ${config['hospital_' + currentLang]}<br>
                        ${config['location_' + currentLang]}
                    </div>
                </div>
            </div>
            <div style="font-size: 1.5rem; color: var(--emerald); cursor:pointer;" onclick="window.location.href='${basePath}index.html'">☰</div>
        </div>
    `;
}

/**
 * UI Component: Persistent Action Bar
 * Features: Call, WhatsApp (Primary Action), and Google Review
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
 * Page-Specific: Dashboard Renderer
 * Builds the Profile Card and Protocol/Education Grids
 */
function renderDashboard(data, config, basePath) {
    const protoContainer = document.getElementById('protocol-list');
    const eduContainer = document.getElementById('education-list');
    const profileImg = document.querySelector('.profile-img');
    const profileTitle = document.getElementById('ui-prof-title');
    const profileDesc = document.getElementById('ui-prof-desc');

    // 1. Update Surgeon Profile Card
    if (profileImg) profileImg.src = basePath + config.headshot;
    if (profileTitle) profileTitle.innerText = config['surgeon_' + currentLang];
    if (profileDesc) profileDesc.innerText = config['profession_' + currentLang];

    // 2. Render Surgical Protocols Grid
    protoContainer.innerHTML = data.protocols.map(item => `
        <a href="${basePath}${item.url}" class="glass-card">
            <div style="font-size: 2.2rem; margin-bottom: 12px;">${item.icon}</div>
            <h3>${currentLang === 'en' ? item.title_en : item.title_ar}</h3>
            <p style="font-size: 0.7rem; color: var(--slate); margin-top: 8px; font-weight: 600;">
                ${currentLang === 'en' ? 'VIEW PROTOCOL' : 'عرض البروتوكول'}
            </p>
        </a>
    `).join('');

    // 3. Render Patient Education Grid
    eduContainer.innerHTML = data.education.map(item => `
        <a href="${basePath}${item.url}" class="glass-card">
            <div style="font-size: 2.2rem; margin-bottom: 12px;">${item.icon}</div>
            <h3>${currentLang === 'en' ? item.title_en : item.title_ar}</h3>
            <p style="font-size: 0.7rem; color: var(--slate); margin-top: 8px; font-weight: 600;">
                ${currentLang === 'en' ? 'LEARN MORE' : 'اقرأ المزيد'}
            </p>
        </a>
    `).join('');

    // 4. Handle Static UI Localization
    if (currentLang === 'ar') {
        const sub = document.getElementById('ui-hero-sub');
        const main = document.getElementById('ui-hero-main');
        const lp = document.getElementById('label-protocols');
        const le = document.getElementById('label-education');
        if (sub) sub.innerText = "التميز في الحركة";
        if (main) main.innerText = "جراحة العظام والقدم والكاحل";
        if (lp) lp.innerText = "بروتوكولات الجراحة";
        if (le) le.innerText = "تثقيف المرضى";
    }
}

/**
 * Language Persistence Logic
 */
function setGlobalLanguage(lang) {
    localStorage.setItem('wwmd_lang', lang);
    window.location.reload();
}

// Boot the Engine
window.addEventListener('DOMContentLoaded', initializeWalkWellMD);
