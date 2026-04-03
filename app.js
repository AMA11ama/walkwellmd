/**
 * WalkWellMD Global Engine (V2.1)
 * Pulls branding, images, and contact data from the Master Library (data.json).
 */

let currentLang = localStorage.getItem('wwmd_lang') || 'en';

/**
 * Initialize UI Components
 */
async function initializeGlobalUI() {
    try {
        // Detect path depth to locate data.json and assets correctly
        const isSubfolder = window.location.pathname.includes('/protocols/') || window.location.pathname.includes('/education/');
        const basePath = isSubfolder ? '../' : './';
        
        // 1. Fetch the master library from Canvas
        const response = await fetch(basePath + 'data.json');
        if (!response.ok) throw new Error("Failed to load data.json");
        const data = await response.json();
        const config = data.branding;

        // 2. Set Global Page Direction
        document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

        // 3. Inject Global Header
        const header = document.getElementById('global-header');
        if (header) {
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

        // 4. Inject Global Action Bar & Floating Lang Toggle
        const bar = document.getElementById('global-action-bar');
        if (bar) {
            bar.innerHTML = `
                <div class="floating-lang">
                    <button class="lang-switch ${currentLang === 'en' ? 'active' : ''}" onclick="setGlobalLanguage('en')">EN</button>
                    <button class="lang-switch ${currentLang === 'ar' ? 'active' : ''}" onclick="setGlobalLanguage('ar')">العربية</button>
                </div>
                <nav class="action-bar">
                    <a href="tel:${config.phone}" class="bar-item"><i>📞</i><span>${currentLang === 'en' ? 'Call' : 'اتصال'}</span></a>
                    <a href="https://wa.me/${config.whatsapp}" class="bar-item" style="background: var(--emerald); color: var(--charcoal); font-weight: 800;"><i>💬</i><span>WhatsApp</span></a>
                    <a href="${config.reviewUrl}" class="bar-item" target="_blank"><i>⭐</i><span>${currentLang === 'en' ? 'Review' : 'تقييم'}</span></a>
                </nav>
            `;
        }

        // 5. Dashboard Specific Updates (Headshot & Surgeon Name)
        const profileName = document.getElementById('ui-prof-title');
        const profileDesc = document.getElementById('ui-prof-desc');
        const profileImg = document.querySelector('.profile-img');

        if (profileName) profileName.innerText = config['surgeon_' + currentLang];
        if (profileDesc) profileDesc.innerText = config['profession_' + currentLang];
        if (profileImg) {
            profileImg.src = basePath + config.headshot;
            profileImg.alt = config['surgeon_' + currentLang];
        }

    } catch (error) {
        console.error("WalkWellMD Engine Error:", error);
    }
}

/**
 * Language Switcher logic
 */
function setGlobalLanguage(lang) {
    localStorage.setItem('wwmd_lang', lang);
    window.location.reload();
}

// Start Engine
window.addEventListener('DOMContentLoaded', initializeGlobalUI);
