/**
 * WalkWellMD Global Configuration & UI Engine
 * PRO-TIP: Edit this file to update branding or contact info globally.
 */

const WWMD_CONFIG = {
    surgeon: {
        en: "Dr. ALHADDAD",
        ar: "د. علي الحداد"
    },
    profession: {
        en: "Consultant Orthopedic Surgeon",
        ar: "استشاري جراحة العظام"
    },
    hospital: {
        en: "Dr. Sulaiman Al Habib",
        ar: "مجموعة د. سليمان الحبيب"
    },
    location: {
        en: "Jeddah - Al Faiha",
        ar: "جدة - الفيحاء"
    },
    contact: {
        phone: "0127444444",
        whatsapp: "966599124348",
        reviewUrl: "https://g.page/r/CSnV8ayiP6q5EBI/review"
    },
    assets: {
        logo: "image_14f64b.png",
        headshot: "AA headshot.jpg"
    }
};

// State Management: Persistence for language choice
let currentLang = localStorage.getItem('wwmd_lang') || 'en';

/**
 * Global Component Injector
 * Injects the Luxury Header and Action Bar into placeholders
 */
async function injectGlobalUI() {
    const headerPlaceholder = document.getElementById('global-header');
    const actionBarPlaceholder = document.getElementById('global-action-bar');
    const body = document.body;

    // Set document direction based on language
    body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = `
            <div class="header">
                <div class="surgeon-brand">
                    <div class="surgeon-name">${WWMD_CONFIG.surgeon[currentLang]}</div>
                    <div class="hospital-brand">
                        <img src="${WWMD_CONFIG.assets.logo}" alt="Hospital Logo" class="hospital-logo">
                        <div class="hospital-info">
                            ${WWMD_CONFIG.hospital[currentLang]}<br>
                            ${WWMD_CONFIG.location[currentLang]}
                        </div>
                    </div>
                </div>
                <div style="font-size: 1.5rem; color: var(--emerald); cursor:pointer;" onclick="window.location.href='/index.html'">☰</div>
            </div>
        `;
    }

    if (actionBarPlaceholder) {
        actionBarPlaceholder.innerHTML = `
            <!-- Floating Language Toggle -->
            <div class="floating-lang">
                <button class="lang-switch ${currentLang === 'en' ? 'active' : ''}" onclick="setGlobalLanguage('en')">EN</button>
                <button class="lang-switch ${currentLang === 'ar' ? 'active' : ''}" onclick="setGlobalLanguage('ar')">العربية</button>
            </div>
            
            <!-- Standardized Action Bar -->
            <nav class="action-bar">
                <a href="tel:${WWMD_CONFIG.contact.phone}" class="bar-btn bar-item">
                    <i>📞</i><span>${currentLang === 'en' ? 'Call' : 'اتصال'}</span>
                </a>
                <a href="https://wa.me/${WWMD_CONFIG.contact.whatsapp}" class="bar-item" style="background: var(--emerald); color: var(--charcoal);">
                    <i>💬</i><span>WhatsApp</span>
                </a>
                <a href="${WWMD_CONFIG.contact.reviewUrl}" class="bar-item">
                    <i>⭐</i><span>${currentLang === 'en' ? 'Review' : 'تقييم'}</span>
                </a>
            </nav>
        `;
    }
}

/**
 * Language State Controller
 */
function setGlobalLanguage(lang) {
    localStorage.setItem('wwmd_lang', lang);
    // Reload to apply changes across dynamic components
    window.location.reload();
}

// Initialize UI on load
window.addEventListener('DOMContentLoaded', injectGlobalUI);
