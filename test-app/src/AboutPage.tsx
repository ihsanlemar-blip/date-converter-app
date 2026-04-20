import { useState } from 'react';
import type { SupportedLanguage } from './useCalendarLogic';
import { BrandLogo } from './components/BrandLogo';
import profilePic from './assets/ihsanlemarpic.png';
import './AboutPage.css';

/* ---- SVG Icons ---- */
const BackIcon = ({ rtl }: { rtl?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: rtl ? 'scaleX(-1)' : undefined }}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

/* ---- Localisation ---- */
const A: Record<string, Record<SupportedLanguage, string>> = {
  about: { en: 'About', fa: 'درباره', ps: 'د اپ معلومات' },
  mission: { en: 'Our Mission', fa: 'مأموریت ما', ps: 'زموږ ماموریت' },
  missionTxt: {
    en: 'To synchronize and simplify the world’s diverse timekeeping systems through intuitive, powerful, and reliable software. We provide seamless conversion across Gregorian, Solar Hijri, and Lunar Hijri calendars, empowering individuals and organizations to navigate temporal changes with absolute clarity and precision.',
    fa: 'ایجاد هماهنگی و ساده‌سازی سیستم‌های متنوع زمان‌سنجی در جهان از طریق نرم‌افزارهای هوشمند، قدرتمند و قابل اطمینان. ما با ارائه راهکارهای مؤثر برای تبدیل تقویم‌های میلادی، هجری خورشیدی و هجری قمری، افراد و نهادها را قادر می‌سازیم تا با دقت و شفافیت کامل با تغییرات زمانی جهان همگام بمانند.',
    ps: 'د دې اسانه، پياوړي او باوري سافټوېر  عمده موخه دا ده چې د نړۍ د مختلفو نيټو تر منځ همغږي رامنځته کوي. موږ د زیږدیز، هجري لمریز او هجري سپوږمیز کلیزو د بدلولو اغېزناکه حللاره وړاندې کوو، ترڅو اشخاص او بنسټونه وکولای شي د وخت په بدلونونو کې له بشپړ دقت او روښانتیا څخه برخمن وي.',
  },
  developer: { en: 'The Developer', fa: 'توسعه‌دهنده', ps: 'پراختیا ورکوونکی' },
  devName: { en: 'Ihsanullah Lemar', fa: 'احسان‌الله لمر', ps: 'احسان‌الله لمر' },
  devRole: { en: 'Indie Developer', fa: 'توسعه‌دهنده مستقل', ps: 'خپلواک پرمخیوونکی' },
  devBio: {
    en: 'Based in Kabul, Afghanistan, we specialize in engineering high-impact digital solutions that address complex regional challenges through global standards. Our work is a testament to innovation, accessibility, and purposeful technological advancement.',
    fa: 'مستقر در کابل، افغانستان؛ ما بر مهندسی راهکارهای دیجیتال با تأثیرگذاری بالا تمرکز داریم که چالش‌های پیچیده منطقه‌ای را مطابق با استانداردهای جهانی حل می‌کنند. فعالیت‌های ما بازتاب‌دهنده نوآوری، دسترسی‌پذیری و پیشرفت هدفمند در عرصه تکنولوژی است.',
    ps: 'مرکز مو په کابل، افغانستان کې دی؛ موږ د هغو ډیجیټلي حللارو جوړولو ته ژمن یو چې سیمه‌ییزې ننګونې د نړیوالو معیارونو سره سم حل کړي. زموږ کار د نوښت، لاسرسی او د ټیکنالوژۍ په برخه کې د مانا لرونکي پرمختګ ښکارندویي کوي.',
  },
  rateApp: { en: 'Rate this App', fa: 'امتیاز دهید', ps: 'ارزونه کړئ' },
  share: { en: 'Share', fa: 'اشتراک‌گذاری', ps: 'شریک کول' },
  contact: { en: 'Contact Support', fa: 'تماس با پشتیبانی', ps: 'د ملاتړ اړیکه' },
  privacy: { en: 'Privacy Policy', fa: 'حریم خصوصی', ps: 'د محرمیت پالیسي' },
  terms: { en: 'Terms of Service', fa: 'شرایط خدمات', ps: 'د خدمت شرطونه' },
  disclaimer: { en: 'Disclaimer', fa: 'سلب مسئولیت', ps: 'ردولو اعلامیه' },
  copyright: {
    en: '© 2026 Ihsanullah Lemar. All Rights Reserved.',
    fa: '© ۲۰۲۶ احسان‌الله لمر. تمام حقوق محفوظ است.',
    ps: '© ۲۰۲۶ احسان‌الله لمر. ټول حقوق خوندي دي.',
  },
  version: { en: '1.0.0.12', fa: '۱.۰.۰.۱۲', ps: '۱.۰.۰.۱۲' },
  back: { en: 'Back', fa: 'برگشت', ps: 'شاته' },
  close: { en: 'Close', fa: 'بستن', ps: 'تړل' },
};

/* ---- Legal content ---- */
interface LegalBlock { heading: string; text: string; }
interface LegalDoc { title: string; body: LegalBlock[]; }
type LegalKey = 'privacy' | 'terms' | 'disclaimer';

const LEGAL: Record<LegalKey, Record<SupportedLanguage, LegalDoc>> = {
  privacy: {
    en: {
      title: 'Privacy Policy', body: [
        { heading: 'Data Collection', text: 'Lemar Date Converter does not collect, store, or transmit any personal data. All calculations are performed locally on your device.' },
        { heading: 'Local Storage', text: "Your preferences (language, theme, layout) are saved via your browser's localStorage. This data never leaves your device." },
        { heading: 'No Analytics', text: 'We do not use any analytics services, tracking pixels, or third-party cookies.' },
        { heading: 'Contact', text: 'For privacy concerns: ihsanlemar@gmail.com' },
      ]
    },
    fa: {
      title: 'سیاست حریم خصوصی', body: [
        { heading: 'جمع‌آوری داده', text: 'لمر هیچ داده شخصی را جمع‌آوری، ذخیره یا ارسال نمی‌کند. تمام محاسبات به صورت محلی در دستگاه شما انجام می‌شود.' },
        { heading: 'حافظه محلی', text: 'تنظیمات شما با localStorage ذخیره می‌شود و هرگز دستگاه شما را ترک نمی‌کنند.' },
        { heading: 'بدون آنالیتیکس', text: 'ما از هیچ سرویس ردیابی یا کوکی شخص ثالثی استفاده نمی‌کنیم.' },
        { heading: 'تماس', text: 'برای نگرانی‌های حریم خصوصی: ihsanlemar@gmail.com' },
      ]
    },
    ps: {
      title: 'د محرمیت پالیسي', body: [
        { heading: 'د معلوماتو راټولول', text: 'لمر هیڅ شخصي معلومات راټولوي، زیرمه کوي یا لیږي نه. ټولې محاسبې ستاسو وسیله کې محلي ترسره کیږي.' },
        { heading: 'محلي ذخیره', text: 'ستاسو تنظیمات د localStorage سره زیرمه کیږي او هیڅکله ستاسو وسیله نه پریږدي.' },
        { heading: 'بې تحلیله', text: 'موږ د کوم ډول ردیابي یا دریم ګوند کوکیز نه کاروو.' },
        { heading: 'اړیکه', text: 'د محرمیت اندیښنو لپاره: ihsanlemar@gmail.com' },
      ]
    },
  },
  terms: {
    en: {
      title: 'Terms of Service', body: [
        { heading: 'Acceptance', text: 'By using Lemar Date Converter, you agree to these terms.' },
        { heading: 'Use License', text: 'Permission is granted for personal, non-commercial use only.' },
        { heading: '⚠️ Disclaimer of Accuracy', text: 'Calculations are for reference only. Lemar Date Converter and its developers are NOT responsible for scheduling errors, missed appointments, or decisions made based on date outputs from this application.' },
        { heading: 'Modifications', text: 'We reserve the right to modify these terms at any time. Continued use constitutes acceptance.' },
      ]
    },
    fa: {
      title: 'شرایط خدمات', body: [
        { heading: 'پذیرش', text: 'با استفاده از لمر، با این شرایط موافقت می‌کنید.' },
        { heading: 'مجوز استفاده', text: 'اجازه استفاده موقت برای مقاصد شخصی و غیرتجاری داده می‌شود.' },
        { heading: '⚠️ سلب مسئولیت دقت', text: 'محاسبات صرفاً برای مرجع هستند. توسعه‌دهندگان مسئولیتی در قبال خطاهای برنامه‌ریزی یا تصمیمات مبتنی بر خروجی تاریخ ندارند.' },
        { heading: 'تغییرات', text: 'ما حق داریم در هر زمانی این شرایط را تغییر دهیم.' },
      ]
    },
    ps: {
      title: 'د خدمت شرطونه', body: [
        { heading: 'منل', text: 'د لمر ډیت کانورتر کارولو سره، تاسو د دې شرطونو سره موافق یئ.' },
        { heading: 'د کارولو اجازه', text: 'یوازې د شخصي، غیر تجارتي موخو لپاره د مؤقتي کارولو اجازه درکول کیږي.' },
        { heading: '⚠️ د دقت ردول', text: 'محاسبې یوازې د مرجع لپاره دي. لمر او پرمخیوونکي د مهالویش غلطیو یا د محاسبو پر بنسټ پریکړو مسوول ندي.' },
        { heading: 'بدلونونه', text: 'موږ دا حق لرو چې دا شرطونه هر وخت بدل کړو.' },
      ]
    },
  },
  disclaimer: {
    en: {
      title: 'Disclaimer', body: [
        { heading: 'Reference Only', text: 'All date conversions and calculations provided by Lemar are for reference purposes only.' },
        { heading: 'No Warranty', text: 'This application is provided "as is" without warranty of any kind, express or implied.' },
        { heading: '⚠️ Scheduling Errors', text: 'Calculations are for reference only. We are NOT responsible for scheduling errors, missed deadlines, contract disputes, or any other consequences arising from the use of this application.' },
        { heading: 'Calendar Variations', text: 'Different regional or religious authorities may use slightly different calculation methods. Always verify critical dates with a local authority.' },
      ]
    },
    fa: {
      title: 'سلب مسئولیت', body: [
        { heading: 'فقط برای مرجع', text: 'تمام تبدیل‌های تاریخ صرفاً برای مقاصد مرجع هستند.' },
        { heading: 'بدون ضمانت', text: 'این برنامه "همانطور که هست" بدون هیچ ضمانتی ارائه می‌شود.' },
        { heading: '⚠️ خطاهای برنامه‌ریزی', text: 'ما مسئولیتی در قبال خطاهای برنامه‌ریزی یا هرگونه عواقب ناشی از استفاده از این برنامه نداریم.' },
        { heading: 'تفاوت‌های تقویمی', text: 'مراجع منطقه‌ای مختلف ممکن است از روش‌های محاسباتی متفاوتی استفاده کنند.' },
      ]
    },
    ps: {
      title: 'ردولو اعلامیه', body: [
        { heading: 'یوازې مرجع', text: 'ټول د نیټې بدلونونه یوازې د مرجع موخو لپاره دي.' },
        { heading: 'بې ضمانته', text: 'دا اپلیکیشن د هر ډول ضمانت پرته "لکه چې دی" وړاندې کیږي.' },
        { heading: '⚠️ د مهالویش غلطۍ', text: 'موږ د مهالویش غلطیو یا د دې اپلیکیشن د کارولو د پایلو مسوول ندي.' },
        { heading: 'د تقویم توپیرونه', text: 'مختلف سیمه‌ییزې واکمنۍ ممکن لږ توپیرونکې محاسباتي میتودونه وکاروي.' },
      ]
    },
  },
};

/* ---- Component ---- */
interface Props {
  language: SupportedLanguage;
  onClose: () => void;
}

export function AboutPage({ language, onClose }: Props) {
  const [legalOpen, setLegalOpen] = useState<LegalKey | null>(null);
  const isRtl = language !== 'en';
  const t = (k: string): string => A[k]?.[language] ?? A[k]?.['en'] ?? '';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Lemar Date Converter', url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch { /* ignore */ }
  };

  const legalDoc: LegalDoc | null = legalOpen
    ? (LEGAL[legalOpen][language] ?? LEGAL[legalOpen]['en'])
    : null;

  return (
    <div className="about-page" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Page header (always LTR grid for stability) ── */}
      <div className="about-header glass">
        <button className="icon-btn" onClick={onClose} aria-label={t('back')}>
          <BackIcon rtl={isRtl} />
        </button>
        <BrandLogo />
      </div>

      {/* ── Scrollable content ── */}
      <div className="about-content">

        {/* Profile Header */}
        <div className="about-profile-header">
          <div className="about-profile-avatar">
            <img src={profilePic} alt={t('devName')} />
          </div>
          <h1 className="about-profile-name">{t('devName')}</h1>
        </div>

        {/* Meta Chips Row */}
        <div className="about-meta-chips">
          <div className="meta-chip">📍 Kabul, AF</div>
          <div className="meta-chip">📱 {t('version')}</div>
        </div>

        {/* Unified Information Card */}
        <div className="about-card unified glass">
          {/* Mission Section */}
          <div className="card-section">
            <h2 className="about-card-title">{t('mission')}</h2>
            <p className="about-card-text">{t('missionTxt')}</p>
          </div>

          <div className="card-divider" />

          {/* Developer Section */}
          <div className="card-section">
            <h2 className="about-card-title">{t('developer')}</h2>
            <p className="about-card-text">{t('devBio')}</p>

            <div className="about-social-row">
              <a href="https://github.com" className="social-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><GithubIcon /></a>
              <a href="https://www.facebook.com/share/1E3DgTcSA2/" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FacebookIcon /></a>
              <a href="https://linkedin.com" className="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a>
              <a href="https://lemardate.vercel.app/" className="social-link" aria-label="Website" target="_blank" rel="noopener noreferrer"><GlobeIcon /></a>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="about-actions">
          <button className="about-action-btn glass" onClick={() => alert('Coming soon!')}>
            <StarIcon /><span>{t('rateApp')}</span>
          </button>
          <button className="about-action-btn glass" onClick={handleShare}>
            <ShareIcon /><span>{t('share')}</span>
          </button>
          <a href="mailto:ihsanlemar@gmail.com" className="about-action-btn glass">
            <MailIcon /><span>{t('contact')}</span>
          </a>
        </div>

        {/* Footer Section */}
        <div className="about-footer">
          <div className="about-legal-section">
            <div className="about-legal-links">
              <button className="legal-link-btn" onClick={() => setLegalOpen('privacy')}>   {t('privacy')}   </button>
              <span className="legal-sep" />
              <button className="legal-link-btn" onClick={() => setLegalOpen('terms')}>     {t('terms')}     </button>
              <span className="legal-sep" />
              <button className="legal-link-btn" onClick={() => setLegalOpen('disclaimer')}>{t('disclaimer')}</button>
            </div>
            <p className="about-copyright">{t('copyright')}</p>
          </div>
          <p className="about-version-text">{t('version')}</p>
        </div>

      </div>{/* /about-content */}

      {/* ── Legal bottom-sheet dialog ── */}
      {legalOpen && legalDoc && (
        <div className="legal-overlay" onClick={() => setLegalOpen(null)}>
          <div className="legal-dialog glass" onClick={e => e.stopPropagation()}>
            <div className="legal-dialog-header">
              <h3>{legalDoc.title}</h3>
              <button className="icon-btn" onClick={() => setLegalOpen(null)}><CloseIcon /></button>
            </div>
            <div className="legal-dialog-body">
              {legalDoc.body.map((block, i) => (
                <div key={i}>
                  <h4 className="legal-block-heading">{block.heading}</h4>
                  <p className="legal-block-text">{block.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AboutPage;
