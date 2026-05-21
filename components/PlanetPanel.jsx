const typeColors = {
  'Terrestrial': '#c8ff00',
  'Gas Giant':   '#ffa500',
  'Ice Giant':   '#7de8e8',
}

const PlanetPanel = ({ planet, onClose }) => {
  if (!planet) return null

  const accentColor = typeColors[planet.type] || '#c8ff00'

  return (
    <div className="animate-slide-in" style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: '340px',
      background: 'rgba(0,0,10,0.92)',
      borderLeft: `1px solid ${accentColor}22`,
      backdropFilter: 'blur(12px)',
      zIndex: 50, overflowY: 'auto',
      padding: '24px',
      display: 'flex', flexDirection: 'column', gap: '20px',
    }}>
      {/* Corner brackets */}
      <div className="corner-bracket tl" />
      <div className="corner-bracket tr" />
      <div className="corner-bracket bl" />
      <div className="corner-bracket br" />

      {/* Close */}
      <button onClick={onClose} style={{
        position: 'absolute', top: '16px', right: '16px',
        background: 'none', border: 'none', cursor: 'pointer',
        color: accentColor, fontSize: '18px', lineHeight: 1,
        fontFamily: 'var(--font-hud)', opacity: 0.7,
        transition: 'opacity 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}>
        ✕
      </button>

      {/* Planet visual */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${lighten(planet.color, 60)}, ${planet.color} 50%, ${planet.emissive})`,
          flexShrink: 0,
          boxShadow: `0 0 24px ${planet.color}44`,
        }} />
        <div>
          <div style={{
            fontFamily: 'var(--font-hud)', fontSize: '10px', letterSpacing: '0.15em',
            color: accentColor, marginBottom: '4px',
          }}>
            {planet.type.toUpperCase()}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '28px', color: '#fff', letterSpacing: '0.05em',
            lineHeight: 1,
          }}>
            {planet.name}
          </h2>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: `linear-gradient(to right, ${accentColor}44, transparent)` }} />

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-display)', fontSize: '13px',
        color: 'var(--chalk-2)', lineHeight: '1.7', fontWeight: 300,
      }}>
        {planet.description}
      </p>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {[
          { label: 'DIAMETER',    value: planet.diameter },
          { label: 'DAY LENGTH',  value: planet.dayLength },
          { label: 'YEAR LENGTH', value: planet.yearLength },
          { label: 'AVG TEMP',    value: planet.avgTemp },
          { label: 'GRAVITY',     value: planet.gravity },
          { label: 'MOONS',       value: planet.moons.toString() },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '6px', padding: '10px 12px',
          }}>
            <div style={{
              fontFamily: 'var(--font-hud)', fontSize: '9px',
              letterSpacing: '0.12em', color: 'var(--chalk-3)', marginBottom: '4px',
            }}>
              {s.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '15px',
              fontWeight: 600, color: accentColor,
            }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Fun fact */}
      <div style={{
        background: `${accentColor}08`,
        border: `1px solid ${accentColor}22`,
        borderRadius: '8px', padding: '14px',
      }}>
        <div style={{
          fontFamily: 'var(--font-hud)', fontSize: '9px',
          letterSpacing: '0.15em', color: accentColor, marginBottom: '8px',
        }}>
          ◆ FUN FACT
        </div>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: '13px',
          color: 'var(--chalk-2)', lineHeight: '1.6', fontWeight: 400,
        }}>
          {planet.funFact}
        </p>
      </div>

      {/* Tilt indicator */}
      <div>
        <div style={{
          fontFamily: 'var(--font-hud)', fontSize: '9px',
          letterSpacing: '0.12em', color: 'var(--chalk-3)', marginBottom: '8px',
        }}>
          AXIAL TILT
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '24px', height: '24px', border: `2px solid ${accentColor}66`,
            borderRadius: '50%', position: 'relative', flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: '1px', height: '20px', background: accentColor,
              transformOrigin: 'top center',
              transform: `translate(-50%, -100%) rotate(${Math.min(planet.tilt, 90)}deg)`,
            }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-hud)', fontSize: '14px', color: accentColor,
          }}>
            {planet.tilt}°
          </span>
        </div>
      </div>
    </div>
  )
}

function lighten(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + amount)
  const b = Math.min(255, (num & 0xff) + amount)
  return `rgb(${r},${g},${b})`
}

export default PlanetPanel
