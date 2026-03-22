import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'StealthShield — Premium Paint Protection Film for Cars & Motorcycles';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          position: 'relative',
        }}
      >
        {/* Corner accents */}
        <div style={{ position: 'absolute', top: 24, left: 24, width: 40, height: 40, borderLeft: '2px solid #D6422F', borderTop: '2px solid #D6422F', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 24, right: 24, width: 40, height: 40, borderRight: '2px solid #D6422F', borderTop: '2px solid #D6422F', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 24, left: 24, width: 40, height: 40, borderLeft: '2px solid #D6422F', borderBottom: '2px solid #D6422F', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 24, right: 24, width: 40, height: 40, borderRight: '2px solid #D6422F', borderBottom: '2px solid #D6422F', display: 'flex' }} />

        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: '#D6422F', display: 'flex' }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {/* Logo */}
          <svg width="80" height="85" viewBox="0 0 336.06 355.46" style={{ marginBottom: 8 }}>
            <path fill="#fff" d="M104.2,47.7c24.87,18.45,49.6,37.17,74.55,55.51,7.28,5.35,14.64,10.62,22.09,15.73L336.06,19.83c-.24,3.49-.71,7.03-.91,10.52-.08,1.42.09,2.86,0,4.28-1.88,33.97-4.11,67.84-6.17,101.78-27.07,21.48-55.56,41.21-83.7,61.3l-24.8,90.02.46.46c25.6-23.77,52.54-46.05,78.53-69.37,1.18-1.76.75-6.08.92-8.23.92-11.93,1.9-23.87,2.28-35.84l24.7-18.9c.19,1.96-.35,3.99-.47,5.93-1.37,22.52-2.56,44.98-4.16,67.48-3.48,3.3-6.92,6.74-10.47,10-16.82,15.44-34.4,30.29-51.54,45.43-18.04,15.94-35.67,32.53-54.27,47.89-.76.63-4.26,3.64-4.81,3.75-.86.18-3.36-2.04-4.19-2.7-24.18-19.32-47.62-41.85-70.85-62.49-15.81-14.04-32.08-27.6-47.26-42.32l-4.59-71.92.71-.44,23.88,18.51c.22,2.21-.07,4.45.05,6.66.55,9.85,1.08,19.71,1.55,29.56.09,1.89-.47,5.58.59,7.03,26.93,23.09,53.75,46.34,79.9,70.29l-24.55-90.87-55.41-39.36c-7.96-6.31-16.32-12.16-24.29-18.47-.84-.66-3.62-2.69-3.86-3.46-.47-3.19-.24-6.43-.44-9.62-2.04-31.39-4.17-62.81-6.09-94.24-.25-4.15-.03-8.39-.91-12.51l.61-.32c12.24,9.77,25.11,18.72,37.68,28.05ZM284.04,140.41c7.42-5.51,15.19-10.61,22.26-16.58.23-1.75.04-3.59.18-5.34,1.29-15.93,2.61-32.38,3.21-48.34.02-.41.28-.53-.31-.91l-52.53,39.32c-14.99,10.39-29.32,21.73-44.19,32.28-1.61,1.15-10.5,7.63-11.57,7.68-1.18-.34-2.36-1.11-3.39-1.76-6.18-3.92-12.5-8.91-18.48-13.24-19.01-13.78-37.78-27.89-56.6-41.9-8.92-6.64-17.84-14.02-26.88-20.38-.41-.29-2.37-1.76-2.72-1.4-.11.89.28,1.71.32,2.58.55,15.05.59,30.1,1.19,45.16.08,1.98.45,4.19.48,6.23l84.63,62.65c2.53,12.35,4.76,24.78,7.81,37.02,3.86,15.48,9.05,30.62,12.91,46.1,1.38-.1,1.08-2.07,1.36-3.06,6.23-21.43,12.84-42.44,17.77-64.27,1.21-5.38,2.08-10.83,3.31-16.21,20.31-15.31,40.8-30.47,61.24-45.64Z"/>
            <path fill="#D6422F" d="M279.04,46.35l-21.13,14.3-56.78-34.45-56.19,34.44c-.76.19-1.84-.59-2.55-.98-3.35-1.84-7.83-5.23-11.09-7.51-2.73-1.91-5.3-4.09-8.19-5.77l-.21-.77L200.8,0l78.24,46.35Z"/>
          </svg>

          {/* Brand name */}
          <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, color: '#f5f5f0', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
            STEALTHSHIELD
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, marginBottom: 4 }}>
            <div style={{ width: 60, height: 1, backgroundColor: '#333', display: 'flex' }} />
            <div style={{ width: 6, height: 6, backgroundColor: '#D6422F', transform: 'rotate(45deg)', display: 'flex' }} />
            <div style={{ width: 60, height: 1, backgroundColor: '#333', display: 'flex' }} />
          </div>

          {/* Tagline */}
          <div style={{ display: 'flex', fontSize: 22, color: '#a0a0a0', letterSpacing: '0.05em' }}>
            Precision-Cut Paint Protection for Cars & Motorcycles
          </div>

          {/* Features row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid #333' }}>
              <div style={{ width: 4, height: 4, backgroundColor: '#D6422F', transform: 'rotate(45deg)', display: 'flex' }} />
              <span style={{ fontSize: 13, color: '#f5f5f0', letterSpacing: '0.15em', textTransform: 'uppercase' as const, fontWeight: 700 }}>Free Fitting Kit</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid #333' }}>
              <div style={{ width: 4, height: 4, backgroundColor: '#D6422F', transform: 'rotate(45deg)', display: 'flex' }} />
              <span style={{ fontSize: 13, color: '#f5f5f0', letterSpacing: '0.15em', textTransform: 'uppercase' as const, fontWeight: 700 }}>UK-Based</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid #333' }}>
              <div style={{ width: 4, height: 4, backgroundColor: '#D6422F', transform: 'rotate(45deg)', display: 'flex' }} />
              <span style={{ fontSize: 13, color: '#f5f5f0', letterSpacing: '0.15em', textTransform: 'uppercase' as const, fontWeight: 700 }}>Fast Delivery</span>
            </div>
          </div>
        </div>

        {/* URL at bottom */}
        <div style={{ position: 'absolute', bottom: 32, display: 'flex', fontSize: 14, color: '#555', letterSpacing: '0.2em', textTransform: 'uppercase' as const }}>
          stealthshieldppf.com
        </div>
      </div>
    ),
    { ...size }
  );
}
