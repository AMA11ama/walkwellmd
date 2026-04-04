/**
 * WalkWellMD Master Engine (V3.3 - Robust Asset Support)
 * Handles Branding, Language, and Dynamic Icon Rendering.
 */

let currentLang = localStorage.getItem('wwmd_lang') || 'en';

async function initializeWalkWellMD() {
    try {
        // 1. Path Depth Detection
        const isSubfolder = window.location.pathname.includes('/protocols/') || window.location.pathname.includes('/education/');
        const basePath = isSubfolder ? '../' : './';
        
        // 2. Fetch Master Library
        const response = await fetch(basePath + 'data.json');
        if (!response.ok) throw new Error("Could not load data.json");
        const data = await response.json();
        const config = data.branding;

        // 3. Set Global Direction
        document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

        injectHeader(config, basePath);
        injectActionBar(config);

        // 4. Dashboard Rendering
        if (document.getElementById('protocol-list')) {
            renderDashboard(data, config, basePath);
        }

    } catch (error) {
        console.error("WalkWellMD Engine Error:", error);
    }
}

function injectHeader(config, basePath) {
    const header = document.getElementById('global-header');
    if (!header) return;
    header.innerHTML = `
        <div class="header">
            <div class="surgeon-brand">
                <div class="surgeon-name">${config['surgeon_' + currentLang]}</div>
                <div class="hospital-brand">
                    <img src="${basePath}${config.logo}" alt="Logo" class="hospital-logo" onerror="this.style.opacity='0'">
                    <div class="hospital-info">${config['hospital_' + currentLang]}<br>${config['location_' + currentLang]}</div>
                </div>
            </div>
            <div style="font-size: 1.5rem; color: var(--emerald); cursor:pointer;" onclick="window.location.href='${basePath}index.html'">☰</div>
        </div>
    `;
}

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
 * Robust Icon Detection Logic
 * Fixes the issue where file paths were appearing as text.
 */
function getIconHtml(icon, basePath) {
    if (!icon) return '';
    const cleanIcon = icon.trim(); 
    
    // Check if the string ends in an image extension
    const isImage = /\.(jpg|jpeg|png|svg|webp|gif)$/i.test(cleanIcon);
    
    if (isImage) {
        // Returns an image tag using the card-icon-img class
        return `<img src="${basePath}${cleanIcon}" class="card-icon-img" onerror="this.outerHTML='<div class=\'icon-fallback\'>🦴</div>'">`;
    }
    // Returns a standard emoji div
    return `<div class="card-icon-emoji">${cleanIcon}</div>`;
}

function renderDashboard(data, config, basePath) {
    const protoContainer = document.getElementById('protocol-list');
    const eduContainer = document.getElementById('education-list');
    const profileImg = document.querySelector('.profile-img');
    
    if (profileImg) profileImg.src = basePath + config.headshot;
    if (document.getElementById('ui-prof-title')) document.getElementById('ui-prof-title').innerText = config['surgeon_' + currentLang];
    if (document.getElementById('ui-prof-desc')) document.getElementById('ui-prof-desc').innerText = config['profession_' + currentLang];

    const generateCards = (items) => items.map(item => `
        <a href="${basePath}${item.url}" class="glass-card">
            <div class="icon-container">${getIconHtml(item.icon, basePath)}</div>
            <h3>${currentLang === 'en' ? item.title_en : item.title_ar}</h3>
            <p class="view-label">${currentLang === 'en' ? 'VIEW DETAILS' : 'عرض التفاصيل'}</p>
        </a>
    `).join('');

    if (protoContainer) protoContainer.innerHTML = generateCards(data.protocols);
    if (eduContainer) eduContainer.innerHTML = generateCards(data.education);

    if (currentLang === 'ar') {
        const els = { 'ui-hero-sub': "التميز في الحركة", 'ui-hero-main': "جراحة العظام والقدم والكاحل", 'label-protocols': "بروتوكولات الجراحة", 'label-education': "تثقيف المرضى" };
        for (let id in els) { if (document.getElementById(id)) document.getElementById(id).innerText = els[id]; }
    }
}

function setGlobalLanguage(lang) {
    localStorage.setItem('wwmd_lang', lang);
    window.location.reload();
}

window.addEventListener('DOMContentLoaded', initializeWalkWellMD);
