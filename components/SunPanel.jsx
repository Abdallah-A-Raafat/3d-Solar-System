import { SUN_DATA } from '../data/planets'

const SunPanel = ({ onClose }) => (
  <div className="animate-slide-in" style={{
    position: 'fixed', top: 0, right: 0, bottom: 0, width: '340px',
    background: 'rgba(0,0,10,0.92)',
    borderLeft: '1px solid rgba(255,200,0,0.2)',
    backdropFilter: 'blur(12px)',
    zIndex: 50, overflowY: 'auto',
    padding: '24px',
    display: 'flex', flexDirection: 'column', gap: '20px',
  }}>
    <div className="corner-bracket tl" style={{ borderColor: 'rgba(255,200,0,0.4)' }} />
    <div className="corner-bracket tr" style={{ borderColor: 'rgba(255,200,0,0.4)' }} />
    <div className="corner-bracket bl" style={{ borderColor: 'rgba(255,200,0,0.4)' }} />
    <div className="corner-bracket br" style={{ borderColor: 'rgba(255,200,0,0.4)' }} />

    <button onClick={onClose} style={{
      position: 'absolute', top: '16px', right: '16px',
      background: 'none', border: 'none', cursor: 'pointer',
      color: '#ffd700', fontSize: '18px', fontFamily: 'var(--font-hud)',
      opacity: 0.7,
    }}>✕</button>

    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #fff7a0, #ffd700 50%, #ff8800)',
        boxShadow: '0 0 32px #ffd70066',
        flexShrink: 0,
        animation: 'pulse-hud 3s ease-in-out infinite',
      }} />
      <div>
        <div style={{
          fontFamily: 'var(--font-hud)', fontSize: '10px',
          letterSpacing: '0.15em', color: '#ffa500', marginBottom: '4px',
        }}>
          STAR
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: '28px', color: '#ffd700', letterSpacing: '0.05em', lineHeight: 1,
        }}>
          The Sun
        </h2>
      </div>
    </div>

    <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(255,200,0,0.4), transparent)' }} />

    <p style={{
      fontFamily: 'var(--font-display)', fontSize: '13px',
      color: 'var(--chalk-2)', lineHeight: '1.7', fontWeight: 300,
    }}>
      {SUN_DATA.description}
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      {[
        { label: 'DIAMETER',      value: SUN_DATA.diameter },
        { label: 'SURFACE TEMP',  value: SUN_DATA.surfaceTemp },
        { label: 'CORE TEMP',     value: SUN_DATA.coreTemp },
        { label: 'AGE',           value: SUN_DATA.age },
        { label: 'TYPE',          value: SUN_DATA.type.split(' ').slice(0,2).join(' '), full: SUN_DATA.type },
        { label: 'SOLAR SYSTEM MASS', value: '99.86%' },
      ].map(s => (
        <div key={s.label} style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,200,0,0.1)',
          borderRadius: '6px', padding: '10px 12px',
        }}>
          <div style={{
            fontFamily: 'var(--font-hud)', fontSize: '9px',
            letterSpacing: '0.12em', color: 'var(--chalk-3)', marginBottom: '4px',
          }}>
            {s.label}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '14px',
            fontWeight: 600, color: '#ffd700',
          }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>

    <div style={{
      background: 'rgba(255,200,0,0.05)',
      border: '1px solid rgba(255,200,0,0.15)',
      borderRadius: '8px', padding: '14px',
    }}>
      <div style={{
        fontFamily: 'var(--font-hud)', fontSize: '9px',
        letterSpacing: '0.15em', color: '#ffa500', marginBottom: '8px',
      }}>
        ◆ FUN FACT
      </div>
      <p style={{
        fontFamily: 'var(--font-display)', fontSize: '13px',
        color: 'var(--chalk-2)', lineHeight: '1.6',
      }}>
        {SUN_DATA.funFact}
      </p>
    </div>
  </div>
)

export default SunPanel
