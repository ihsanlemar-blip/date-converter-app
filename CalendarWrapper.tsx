import React, { useState } from 'react';
import { useCalendarLogic } from './useCalendarLogic';
import './app.css';

export function CalendarWrapper() {
    const {
        language, setLanguage,
        gregorian, shamsi, qamari,
        handlers,
        qamariOffset, setQamariOffset,
        copyToClipboard, toastMessage,
        getFormattedDifference, format
    } = useCalendarLogic();

    // State for dates to compare
    const [compareJdn1, setCompareJdn1] = useState<number | null>(null);
    const [compareJdn2, setCompareJdn2] = useState<number | null>(null);

    const handleCopy = () => {
        const text = `${format(shamsi.year)}/${format(shamsi.month)}/${format(shamsi.day)}`;
        copyToClipboard(text);
    };

    return (
        <div className="calendar-container" dir={document.documentElement.dir}>
            {toastMessage && <div className="toast">{toastMessage}</div>}

            <header>
                <h1>Lemar Date Converter</h1>
                <select value={language} onChange={e => setLanguage(e.target.value as any)}>
                    <option value="en">English</option>
                    <option value="fa">Persian (فارسی)</option>
                    <option value="ps">Pashto (پښتو)</option>
                </select>
            </header>

            <main>
                <div className="card">
                    <h2>Miladi (Gregorian)</h2>
                    <input type="number" value={gregorian.year} onChange={e => handlers.onMiladiChange(parseInt(e.target.value), gregorian.month, gregorian.day)} />
                    <input type="number" value={gregorian.month} onChange={e => handlers.onMiladiChange(gregorian.year, parseInt(e.target.value), gregorian.day)} />
                    <input type="number" value={gregorian.day} onChange={e => handlers.onMiladiChange(gregorian.year, gregorian.month, parseInt(e.target.value))} />
                </div>

                <div className="card">
                    <h2>Shamsi (Solar Hijri)</h2>
                    <p>Formatted: {format(shamsi.year)}/{format(shamsi.month)}/{format(shamsi.day)}</p>
                    <button onClick={handleCopy}>Copy Shamsi Date</button>
                    <br/><br/>
                    <input type="number" value={shamsi.year} onChange={e => handlers.onShamsiChange(parseInt(e.target.value), shamsi.month, shamsi.day)} />
                    <input type="number" value={shamsi.month} onChange={e => handlers.onShamsiChange(shamsi.year, parseInt(e.target.value), shamsi.day)} />
                    <input type="number" value={shamsi.day} onChange={e => handlers.onShamsiChange(shamsi.year, shamsi.month, parseInt(e.target.value))} />
                </div>

                <div className="card">
                    <h2>Qamari (Lunar Hijri)</h2>
                    <p>Current JDN calculation minus offset</p>
                    <input type="number" value={qamari.year} onChange={e => handlers.onQamariChange(parseInt(e.target.value), qamari.month, qamari.day)} />
                    <input type="number" value={qamari.month} onChange={e => handlers.onQamariChange(qamari.year, parseInt(e.target.value), qamari.day)} />
                    <input type="number" value={qamari.day} onChange={e => handlers.onQamariChange(qamari.year, qamari.month, parseInt(e.target.value))} />
                    
                    <div className="qamari-controls">
                        <label>Moon Sighting Offset: {qamariOffset}</label>
                        <button onClick={() => setQamariOffset(prev => prev + 1)}>+1 Day</button>
                        <button onClick={() => setQamariOffset(prev => prev - 1)}>-1 Day</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CalendarWrapper;
