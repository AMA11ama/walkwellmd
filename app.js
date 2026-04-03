/**
 * WalkWellMD Global Configuration & UI Engine (V2)
 * Fetches branding and identity from data.json to ensure a single-point of update.
 */

let currentLang = localStorage.getItem('wwmd_lang') || 'en';

/**
 * Fetch Config and Inject UI Components
 */
async function initializeGlobalUI() {
    try {
        // 1. Fetch the central library
        const response = await fetch('/data.json');
        const data = await response.json();
        const config = data.branding;

        // 2. Set Page Direction
        document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

        // 3. Inject Header
        const header = document.getElementById('global-header');
        if (header) {
            header.innerHTML = `
                <div class="header">
                    <div class="surgeon-brand">
                        <div class="surgeon-name">${config['surgeon_' + currentLang]}</div>
                        <div class="hospital-brand">
                            <img src="/${config.logo}" alt="Hospital Logo" class="hospital-logo" onerror="this.style.display='none'">
                            <div class="hospital-info">
                                ${config['hospital_' + currentLang]}<br>
                                ${config['location_' + currentLang]}
                            </div>
                        </div>
                    </div>
                    <div style="font-size: 1.5rem; color: var(--emerald); cursor:pointer;" onclick="window.location.href='/index.html'">☰</div>
                </div>
            `;
        }

        // 4. Inject Action Bar & Language Toggle
        const bar = document.getElementById('global-action-bar');
        if (bar) {
            bar.innerHTML = `
                <div class="floating-lang">
                    <button class="lang-switch ${currentLang === 'en' ? 'active' : ''}" onclick="setGlobalLanguage('en')">EN</button>
                    <button class="lang-switch ${currentLang === 'ar' ? 'active' : ''}" onclick="setGlobalLanguage('ar')">العربية</button>
                </div>
                <nav class="action-bar">
                    <a href="tel:${config.phone}" class="bar-item"><i>📞</i><span>${currentLang === 'en' ? 'Call' : 'اتصال'}</span></a>
                    <a href="https://wa.me/${config.whatsapp}" class="bar-item" style="background: var(--emerald); color: var(--charcoal);"><i>💬</i><span>WhatsApp</span></a>
                    <a href="${config.reviewUrl}" class="bar-item"><i>⭐</i><span>${currentLang === 'en' ? 'Review' : 'تقييم'}</span></a>
                </nav>
            `;
        }

        // 5. Update Profile Card if on Dashboard
        const profileName = document.getElementById('ui-prof-title');
        const profileImg = document.querySelector('.profile-img');
        if (profileName) profileName.innerText = config['surgeon_' + currentLang];
        if (profileImg) profileImg.src = '/' + config.headshot;

    } catch (error) {
        console.error("WWMD Engine Error:", error);
    }
}

function setGlobalLanguage(lang) {
    localStorage.setItem('wwmd_lang', lang);
    window.location.reload();
}

window.addEventListener('DOMContentLoaded', initializeGlobalUI);
