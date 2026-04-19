import { useState, useEffect } from 'react';
import { useCalendarLogic } from './useCalendarLogic';
import { AboutPage } from './AboutPage';
import { BrandLogo } from './components/BrandLogo';
import './App.css';

/* ---- SVG Icons ---- */
const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

/* ---- Localisation ---- */
const L = {
  miladi:        { en:'Gregorian',   fa:'میلادی',      ps:'زيږديیز'       },
  shamsi:        { en:'Solar Hijri',  fa:'هجری شمسی',  ps:'هجري لمریز'   },
  qamari:        { en:'Lunar Hijri',  fa:'هجری قمری',  ps:'هجري سپوږمیز' },
  year:          { en:'Year',     fa:'سال',    ps:'کال'    },
  month:         { en:'Month',    fa:'ماه',    ps:'میاشت'  },
  day:           { en:'Day',      fa:'روز',    ps:'ورځ'    },
  settings:      { en:'Settings', fa:'تنظیمات',ps:'تنظیمات' },
  language:      { en:'Language', fa:'زبان',   ps:'ژبه'    },
  theme:         { en:'Theme',    fa:'تم',     ps:'تم'     },
  layout:        { en:'Layout',   fa:'چیدمان', ps:'ډیزاین' },
  monthStyle:    { en:'Month Names Style', fa:'سبک نام ماه‌ها', ps:'د میاشتو نومونه' },
  afghani:       { en:'Afghani',   fa:'افغانی',  ps:'افغاني'  },
  iranian:       { en:'Iranian',  fa:'ایرانی',  ps:'ایراني'  },
  numFormat:     { en:'Number Format', fa:'قالب اعداد', ps:'د شمیرو بڼه' },
  numLatin:      { en:'Western (123)', fa:'لاتین (123)', ps:'لاتیني (123)' },
  numPersian:    { en:'Eastern (۱۲۳)', fa:'فارسی (۱۲۳)', ps:'د ورپه (۱۲۳)' },
  timeAway:      { en:'Time Away:', fa:'فاصله زمانی:', ps:'زماني واټن:' },
  tLight:        { en:'Light',    fa:'روشن',   ps:'روښانه'   },
  tDark:         { en:'Dark',     fa:'تاریک',  ps:'تیاره'    },
  tEmerald:      { en:'Emerald',  fa:'زمردی',  ps:'زمردي'    },
  tRose:         { en:'Rose',     fa:'گلبهی',  ps:'ګلابی'   },
  tOcean:        { en:'Ocean',    fa:'اقیانوس', ps:'سمندر'   },
  tSunset:       { en:'Sunset',   fa:'غروب',    ps:'غرماوې'    },
  tMidnight:     { en:'Midnight', fa:'نیمه‌شب', ps:'نیما شپه'  },
  lGrid:         { en:'Grid',     fa:'شبکه',   ps:'شبکه'    },
  lStack:        { en:'Stack',    fa:'عمودی',  ps:'پشته'    },
  lBento:        { en:'Bento',    fa:'بنتو',   ps:'بنتو'    },
  lCompact:      { en:'Compact',  fa:'فشرده',  ps:'کمین'    },
  lModern:       { en:'Modern',   fa:'مدرن',   ps:'مدرن'    },
  lLinear:       { en:'Linear',   fa:'خطی',    ps:'خطی'     },
  lCarousel:     { en:'Carousel', fa:'چرخشی',  ps:'چرخشی'   },
};

const MONTHS: any = {
  miladi: {
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    fa: {
      afghani:  ['جنوری','فبروری','مارچ','اپریل','می','جون','جولای','اگست','سپتمبر','اکتبر','نومبر','دسمبر'],
      iranian: ['ژانویه','فوریه','مارس','آوریل','مه','ژوئن','ژوئیه','اوت','سپتامبر','اکتبر','نوفمبر','دسامبر']
    },
    ps: ['جنوري','فبروري','مارچ','اپریل','مۍ','جون','جولای','اګست','سپتمبر','اکتوبر','نومبر','ډسمبر'],
  },
  shamsi: {
    en: {
      afghani:  ['Hamal','Sawar','Jawza','Saratan','Asad','Sunbula','Mizan','Aqrab','Qaws','Jadi','Dalwa','Hoot'],
      iranian: ['Farvardin','Ordibehesht','Khordad','Tir','Mordad','Shahrivar','Mehr','Aban','Azar','Dey','Bahman','Esfand']
    },
    fa: {
       afghani:  ['حمل','ثور','جوزا','سرطان','اسد','سنبله','میزان','عقرب','قوس','جدی','دلو','حوت'],
       iranian: ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']
    },
    ps: ['وری','غویی','غبرګولی','چنګاښ','زمری','وږی','تله','لړم','لیندۍ','مرغومی','سلواغه','کب'],
  },
  qamari: {
    en: ['Muharram','Safar','Rabi I','Rabi II','Jumada I','Jumada II','Rajab','Sha\'ban','Ramadan','Shawwal','Dhu al-Qi\'dah','Dhu al-Hijjah'],
    fa: ['محرم','صفر','ربیع‌الاول','ربیع‌الثانی','جمادی‌الاول','جمادی‌الثانی','رجب','شعبان','رمضان','شوال','ذیقعده','ذیحجه'],
    ps: ['محرم','صفر','ربیع الاول','ربیع الثاني','جمادي الاول','جمادي الثاني','رجب','شعبان','رمضان','شوال','ذوالقعده','ذوالحجه'],
  },
};

/* ---- Main Component ---- */
export function CalendarWrapper() {
  const {
    currentJdn, todayJdn,
    language, setLanguage,
    theme, setTheme,
    layout, setLayout,
    monthStyle, setMonthStyle,
    numberSystem, setNumberSystem,
    gregorian, shamsi, qamari,
    handlers,
    copyToClipboard, toastMessage, format,
    getFormattedDifference,
    carouselActive, setCarouselActive,
  } = useCalendarLogic();

  const l = (k: keyof typeof L) => (L[k] as Record<string, string>)[language];
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showAbout,    setShowAbout]    = useState(false);

  /* Helper to get month list based on current style/lang */
  const getMonths = (type: string) => {
    const data = MONTHS[type][language];
    if (typeof data === 'object' && !Array.isArray(data)) {
      return data[monthStyle] || data['afghani'];
    }
    return data;
  };

  /* auto-clear toast */
  const [hiding, setHiding] = useState(false);
  useEffect(() => {
    if (!toastMessage) { setHiding(false); return; }
    const t = setTimeout(() => setHiding(true), 2500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const copy = (d: { year: number; month: number; day: number }) =>
    copyToClipboard(`${format(d.year)}/${format(d.month)}/${format(d.day)}`);

  const autoSelect = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

  const visible = (i: number) => layout !== 'carousel' || carouselActive === i;

  /* Calendar definitions */
  const cals = [
    { id: 'miladi', type: 'miladi' as const, data: gregorian, handler: handlers.onMiladiChange },
    { id: 'shamsi', type: 'shamsi' as const, data: shamsi,    handler: handlers.onShamsiChange },
    { id: 'qamari', type: 'qamari' as const, data: qamari,    handler: handlers.onQamariChange },
  ];

  return (
    <div className={`app-container layout-${layout}`}>
      {/* Toast */}
      {toastMessage && <div className={`toast${hiding ? ' hide' : ''}`}>{toastMessage}</div>}

      {/* Header — three-column grid so title is always centred */}
      <header className="header glass">
        {/* Left slot: settings button */}
        <div className="header-slot header-slot-start">
          <button className="icon-btn" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </button>
        </div>

        {/* Centre slot: logo — never moves */}
        <BrandLogo />

        {/* Right slot: info button + optional carousel dots */}
        <div className="header-slot header-slot-end">
          {layout === 'carousel' && (
            <div className="carousel-nav">
              {[0,1,2].map(i => (
                <span key={i} className={carouselActive===i ? 'active' : ''} onClick={()=>setCarouselActive(i)} />
              ))}
            </div>
          )}
          <button className="icon-btn" onClick={() => setShowAbout(true)} aria-label="About">
            <InfoIcon />
          </button>
        </div>
      </header>

      {/* Calendar Grid / Carousel Wrapper */}
      {layout === 'carousel' ? (
        <div className="carousel-wrapper">
          <button
            className="carousel-arrow"
            onClick={() => setCarouselActive((carouselActive + 2) % 3)}
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div className="carousel-card-area">
            {cals.map((cal, idx) => idx === carouselActive && (
              <div key={cal.id} className={`calendar-card glass cal-${cal.type}`}>
                <div className="card-header">
                  <span className="calendar-label">{l(cal.type)}</span>
                  <div className="date-output">
                    <span className="output-text">
                      {format(cal.data.year)}/{format(cal.data.month)}/{format(cal.data.day)}
                    </span>
                    <button className="mini-copy-btn" onClick={() => copy(cal.data)} title="Copy">
                      <CopyIcon />
                    </button>
                  </div>
                </div>
                <div className="card-inputs">
                  <div className="input-box">
                    <input className="minimal-input" type="number" value={cal.data.year} onFocus={autoSelect}
                      onChange={e => { if (e.target.value.length > 5) return; cal.handler(parseInt(e.target.value)||0, cal.data.month, cal.data.day); }}/>
                  </div>
                  <div className="input-box">
                    <div className="minimal-select-wrapper">
                      <span className="select-text">{getMonths(cal.type)[cal.data.month - 1]}</span>
                      <select className="minimal-select" value={cal.data.month}
                        onChange={e => cal.handler(cal.data.year, parseInt(e.target.value)||1, cal.data.day)}>
                        {getMonths(cal.type).map((name: string, i: number) => (
                          <option key={i+1} value={i+1}>{format(i+1)} — {name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="input-box">
                    <input className="minimal-input" type="number" value={cal.data.day} onFocus={autoSelect}
                      onChange={e => { if (e.target.value.length > 2) return; cal.handler(cal.data.year, cal.data.month, parseInt(e.target.value)||0); }}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-arrow"
            onClick={() => setCarouselActive((carouselActive + 1) % 3)}
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      ) : (
        <main className={`calendars-grid layout-${layout}`}>
          {cals.map((cal, idx) => visible(idx) && (
            <div key={cal.id} className={`calendar-card glass cal-${cal.type}`}>
              {/* Bento hero: qamari gets big year treatment */}
              {layout === 'bento' && cal.type === 'qamari' ? (
                <>
                  <div className="card-header">
                    <span className="calendar-label">{l(cal.type)}</span>
                    <button className="mini-copy-btn" onClick={() => copy(cal.data)} title="Copy"><CopyIcon /></button>
                  </div>
                  <div className="date-output">
                    <span className="output-year">{format(cal.data.year)}</span>
                  </div>
                  <div className="date-output" style={{marginTop: '4px'}}>
                    <span className="output-daymonth">
                      {getMonths(cal.type)[cal.data.month - 1]} · {format(cal.data.day)}
                    </span>
                  </div>
                  <div className="card-inputs">
                    <div className="input-box">
                      <input className="minimal-input" type="number" value={cal.data.year} onFocus={autoSelect}
                        onChange={e => { if (e.target.value.length > 5) return; cal.handler(parseInt(e.target.value)||0, cal.data.month, cal.data.day); }}/>
                    </div>
                    <div className="input-box">
                      <div className="minimal-select-wrapper">
                        <span className="select-text">{getMonths(cal.type)[cal.data.month - 1]}</span>
                        <select className="minimal-select" value={cal.data.month}
                          onChange={e => cal.handler(cal.data.year, parseInt(e.target.value)||1, cal.data.day)}>
                          {getMonths(cal.type).map((name: string, i: number) => (
                            <option key={i+1} value={i+1}>{format(i+1)} — {name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="input-box">
                      <input className="minimal-input" type="number" value={cal.data.day} onFocus={autoSelect}
                        onChange={e => { if (e.target.value.length > 2) return; cal.handler(cal.data.year, cal.data.month, parseInt(e.target.value)||0); }}/>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Standard card header */}
                  <div className="card-header">
                    <span className="calendar-label">{l(cal.type)}</span>
                    <div className="date-output">
                      <span className="output-text">
                        {format(cal.data.year)}/{format(cal.data.month)}/{format(cal.data.day)}
                      </span>
                      <button className="mini-copy-btn" onClick={() => copy(cal.data)} title="Copy"><CopyIcon /></button>
                    </div>
                  </div>
                  <div className="card-inputs">
                    <div className="input-box">
                      <input className="minimal-input" type="number" value={cal.data.year} onFocus={autoSelect}
                        onChange={e => { if (e.target.value.length > 5) return; cal.handler(parseInt(e.target.value)||0, cal.data.month, cal.data.day); }}/>
                    </div>
                    <div className="input-box">
                      <div className="minimal-select-wrapper">
                        <span className="select-text">{getMonths(cal.type)[cal.data.month - 1]}</span>
                        <select className="minimal-select" value={cal.data.month}
                          onChange={e => cal.handler(cal.data.year, parseInt(e.target.value)||1, cal.data.day)}>
                          {getMonths(cal.type).map((name: string, i: number) => (
                            <option key={i+1} value={i+1}>{format(i+1)} — {name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="input-box">
                      <input className="minimal-input" type="number" value={cal.data.day} onFocus={autoSelect}
                        onChange={e => { if (e.target.value.length > 2) return; cal.handler(cal.data.year, cal.data.month, parseInt(e.target.value)||0); }}/>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </main>
      )}

      {/* Footer: Time Away */}
      <footer className="footer-bar glass">
        <div className="time-away-badge">
          <span className="away-label">{l('timeAway')}</span>
          <bdi className="away-value">{getFormattedDifference(currentJdn, todayJdn)}</bdi>
        </div>
      </footer>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="modal-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{l('settings')}</h3>
              <button className="icon-btn" onClick={() => setSettingsOpen(false)}><CloseIcon /></button>
            </div>

            {/* Language */}
            <div className="setting-item">
              <label>{l('language')}</label>
              <select value={language} onChange={e => setLanguage(e.target.value as any)}>
                <option value="en">English</option>
                <option value="fa">فارسی</option>
                <option value="ps">پښتو</option>
              </select>
            </div>

            {/* Month Style */}
            <div className="setting-item">
              <label>{l('monthStyle')}</label>
              <select value={monthStyle} onChange={e => setMonthStyle(e.target.value as any)}>
                <option value="afghani">{l('afghani')}</option>
                <option value="iranian">{l('iranian')}</option>
              </select>
            </div>

            {/* Number Format — hidden for English (always Western) */}
            {language !== 'en' && (
              <div className="setting-item">
                <label>{l('numFormat')}</label>
                <select value={numberSystem} onChange={e => setNumberSystem(e.target.value as any)}>
                  <option value="persian">{l('numPersian')}</option>
                  <option value="latin">{l('numLatin')}</option>
                </select>
              </div>
            )}

            {/* Theme */}
            <div className="setting-item">
              <label>{l('theme')}</label>
              <select value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="dark">{l('tDark')}</option>
                <option value="light">{l('tLight')}</option>
                <option value="emerald">{l('tEmerald')}</option>
                <option value="rose">{l('tRose')}</option>
                <option value="ocean">{l('tOcean')}</option>
                <option value="sunset">{l('tSunset')}</option>
                <option value="midnight">{l('tMidnight')}</option>
              </select>
            </div>

            {/* Layout */}
            <div className="setting-item">
              <label>{l('layout')}</label>
              <select value={layout} onChange={e => setLayout(e.target.value as any)}>
                <option value="stack">{l('lStack')}</option>
                <option value="grid">{l('lGrid')}</option>
                <option value="bento">{l('lBento')}</option>
                <option value="compact">{l('lCompact')}</option>
                <option value="modern">{l('lModern')}</option>
                <option value="linear">{l('lLinear')}</option>
                <option value="carousel">{l('lCarousel')}</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {/* About / Info page — full-screen overlay */}
      {showAbout && (
        <AboutPage language={language} onClose={() => setShowAbout(false)} />
      )}
    </div>
  );
}

export default CalendarWrapper;
