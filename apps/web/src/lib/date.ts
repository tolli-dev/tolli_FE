export function getLocalMidnight(timeZone: string = 'Asia/Seoul'): Date {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    
    const localDateStr = formatter.format(now);
    const [month, day, year] = localDateStr.split('/');
    
    const guessUtc = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0));
    
    const guessFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZoneName: 'shortOffset'
    });
    
    const parts = guessFormatter.formatToParts(guessUtc);
    const offsetPart = parts.find(p => p.type === 'timeZoneName')?.value;
    
    let offsetHours = 0;
    let offsetMinutes = 0;
    if (offsetPart && offsetPart.length > 3) {
        const sign = offsetPart[3] === '-' ? -1 : 1;
        const [h, m] = offsetPart.substring(4).split(':');
        offsetHours = sign * parseInt(h);
        offsetMinutes = sign * parseInt(m || '0');
    }
    
    return new Date(guessUtc.getTime() - (offsetHours * 60 * 60 * 1000) - (offsetMinutes * 60 * 1000));
}
