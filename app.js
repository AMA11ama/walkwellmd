/**
 * WalkWellMD Master Engine (V3.5 - Production Grade)
 * Features: Tabbed Navigation, Back-Button Injection, Path-Depth Resolution.
 */

let currentLang = localStorage.getItem('wwmd_lang') || 'en';
let activeTab = 'protocols'; // State for dashboard tabs

/**
 * Main Initialization
 */
async function initializeWalkWellMD() {
    try {
        // 1. Detect Path Depth (Essential for assets and logos)
        const isSubfolder = window.location.pathname.includes('/protocols/') || window.location.pathname.includes('/education/');
        const basePath = isSubfolder ? '../' : './';
        
        // 2. Fetch Master Library (data.json)
        const response = await fetch(basePath + 'data.json');
        if (!response.ok) throw new Error("Could not load data.json");
        const data = await response.json();
        const config = data.branding;

        // 3. Set Global Page Direction
        document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

        // 4. Inject UI Components
        injectHeader(config, basePath, isSubfolder);
        injectActionBar(config);

        // 5. If on Dashboard, Render Tabs and Content
        if (document.getElementById('protocol-list')) {
            renderDashboard(data, config, basePath);
        }

    } catch (error) {
        console.error("WalkWellMD Engine Error:", error);
    }
}

/**
 * UI Component: Header (With Conditional Back Button)
 */
function injectHeader(config, basePath, isSubfolder) {
    const header = document.getElementById('global-header');
    if (!header) return;

    // The Back button appears ONLY on sub-pages
    const backBtnHtml = isSubfolder ? `
        <a href="${basePath}index.html" class="back-btn">
            ${currentLang === 'en' ? '←' : '→'}
        </a>
    ` : '';

    header.innerHTML = `
        <div class="header">
            <div class="header-left">
                ${backBtnHtml}
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
            </div>
            <div style="font-size: 1.5rem; color: var(--emerald); cursor:pointer;" onclick="window.location.href='${basePath}index.html'">☰</div>
        </div>
    `;
}

/**
 * UI Component: Action Bar
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
 * Robust Icon Helper (Trims spaces, detects assets folder)
 */
function getIconHtml(icon, basePath) {
    if (!icon) return '';
    const cleanIcon = icon.trim();
    
    // Logic: If it contains 'assets/' OR ends in an image extension, render as IMG
    const isImage = cleanIcon.includes('assets/') || /\.(jpg|jpeg|png|svg|webp)$/i.test(cleanIcon);
    
    if (isImage) {
        // encodeURI handles spaces if any remain
        return `<img src="${encodeURI(basePath + cleanIcon)}" class="card-icon-img" onerror="this.outerHTML='<div class=\'icon-fallback\'>🦴</div>'">`;
    }
    return `<div class="card-icon-emoji">${cleanIcon}</div>`;
}

/**
 * Dashboard Logic: Tabs & Grid Rendering
 */
function renderDashboard(data, config, basePath) {
    const container = document.getElementById('protocol-list');
    const profileImg = document.querySelector('.profile-img');
    const profileTitle = document.getElementById('ui-prof-title');
    const profileDesc = document.getElementById('ui-prof-desc');

    // 1. Set Profile Data
    if (profileImg) profileImg.src = basePath + config.headshot;
    if (profileTitle) profileTitle.innerText = config['surgeon_' + currentLang];
    if (profileDesc) profileDesc.innerText = config['profession_' + currentLang];

    // 2. Inject Tabs into the Dashboard
    let tabContainer = document.querySelector('.tab-container');
    if (!tabContainer) {
        tabContainer = document.createElement('div');
        tabContainer.className = 'tab-container';
        container.parentNode.insertBefore(tabContainer, container);
    }

    tabContainer.innerHTML = `
        <button class="tab-btn ${activeTab === 'protocols' ? 'active' : ''}" onclick="switchDashboardTab('protocols')">
            ${currentLang === 'en' ? 'Protocols' : 'البروتوكولات'}
        </button>
        <button class="tab-btn ${activeTab === 'education' ? 'active' : ''}" onclick="switchDashboardTab('education')">
            ${currentLang === 'en' ? 'Education' : 'التثقيف'}
        </button>
    `;

    // 3. Render Filtered Content
    const sourceData = activeTab === 'protocols' ? data.protocols : data.education;
    const label = activeTab === 'protocols' ? (currentLang === 'en' ? 'VIEW PROTOCOL' : 'عرض البروتوكول') : (currentLang === 'en' ? 'LEARN MORE' : 'اقرأ المزيد');

    container.innerHTML = sourceData.map(item => `
        <a href="${basePath}${item.url}" class="glass-card">
            <div class="icon-container">${getIconHtml(item.icon, basePath)}</div>
            <h3>${currentLang === 'en' ? item.title_en : item.title_ar}</h3>
            <p class="view-label">${label}</p>
        </a>
    `).join('');

    // 4. Localize Hero
    if (currentLang === 'ar') {
        const sub = document.getElementById('ui-hero-sub');
        const main = document.getElementById('ui-hero-main');
        if (sub) sub.innerText = "التميز في الحركة";
        if (main) main.innerText = "جراحة العظام والقدم والكاحل";
    }
}

/**
 * State Management
 */
window.switchDashboardTab = function(tab) {
    activeTab = tab;
    initializeWalkWellMD(); // Re-render with new tab state
};

window.setGlobalLanguage = function(lang) {
    localStorage.setItem('wwmd_lang', lang);
    window.location.reload();
};

// Start the Engine
window.addEventListener('DOMContentLoaded', initializeWalkWellMD);
