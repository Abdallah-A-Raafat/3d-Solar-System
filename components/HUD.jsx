import { PLANETS } from '../data/planets'

const typeColors = {
  'Terrestrial': '#c8ff00',
  'Gas Giant':   '#ffa500',
  'Ice Giant':   '#7de8e8',
}

const HUD = ({ isPaused, onTogglePause, speed, onSpeedChange, onPlanetSelect, activePlanet, showPanel }) => (
  <>
    {/* Top-left title */}
    <div className="animate-fade-in" style={{
      position: 'fixed', top: '24px', left: '24px', zIndex: 40,
    }}>
      <div style={{
        fontFamily: 'var(--font-hud)', fontSize: '9px',
        letterSpacing: '0.2em', color: 'var(--hud-dim)', marginBottom: '4px',
      }}>
        SOLAR SYSTEM EXPLORER
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: '22px', color: 'var(--chalk)', letterSpacing: '0.08em',
      }}>
        HELIOCENTRIC<span style={{ color: 'var(--hud)' }}>.</span>
      </div>
    </div>

    {/* Top-right controls */}
    <div className="animate-fade-in" style={{
      position: 'fixed', top: '24px', right: showPanel ? '360px' : '24px',
      zIndex: 40, display: 'flex', gap: '8px', alignItems: 'center',
      transition: 'right 0.4s cubic-bezier(0.22,1,0.36,1)',
    }}>
      {/* Pause/Play */}
      <button onClick={onTogglePause} style={{
        background: isPaused ? 'var(--hud)' : 'rgba(200,255,0,0.08)',
        border: '1px solid var(--hud-dim)',
        color: isPaused ? '#000' : 'var(--hud)',
        fontFamily: 'var(--font-hud)', fontSize: '11px',
        padding: '8px 14px', borderRadius: '4px',
        cursor: 'pointer', letterSpacing: '0.1em',
        transition: 'all 0.2s',
      }}>
        {isPaused ? '▶ PLAY' : '⏸ PAUSE'}
      </button>

      {/* Speed control */}
      <div style={{
        background: 'rgba(0,0,10,0.8)',
        border: '1px solid var(--wire)',
        borderRadius: '4px', padding: '8px 12px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{ fontFamily: 'var(--font-hud)', fontSize: '9px',
          letterSpacing: '0.1em', color: 'var(--hud-dim)' }}>
          SPEED
        </span>
        <input type="range" min="0.1" max="5" step="0.1"
          value={speed} onChange={e => onSpeedChange(parseFloat(e.target.value))}
          style={{ width: '80px', accentColor: 'var(--hud)' }} />
        <span style={{ fontFamily: 'var(--font-hud)', fontSize: '11px',
          color: 'var(--hud)', minWidth: '28px' }}>
          {speed.toFixed(1)}×
        </span>
      </div>
    </div>

    {/* Bottom-left planet list */}
    <div className="animate-fade-in" style={{
      position: 'fixed', bottom: '24px', left: '24px', zIndex: 40,
    }}>
      <div style={{
        fontFamily: 'var(--font-hud)', fontSize: '9px',
        letterSpacing: '0.15em', color: 'var(--hud-dim)', marginBottom: '10px',
      }}>
        PLANETS ── CLICK TO FOCUS
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '380px' }}>
        {PLANETS.map((p) => (
          <button key={p.name} onClick={() => onPlanetSelect(p)}
            style={{
              background: activePlanet?.name === p.name
                ? typeColors[p.type]
                : 'rgba(0,0,10,0.8)',
              border: `1px solid ${activePlanet?.name === p.name ? typeColors[p.type] : 'var(--wire)'}`,
              color: activePlanet?.name === p.name ? '#000' : 'var(--chalk-2)',
              fontFamily: 'var(--font-hud)', fontSize: '10px',
              padding: '5px 10px', borderRadius: '4px',
              cursor: 'pointer', letterSpacing: '0.08em',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
            onMouseEnter={e => {
              if (activePlanet?.name !== p.name) {
                e.currentTarget.style.borderColor = typeColors[p.type]
                e.currentTarget.style.color = typeColors[p.type]
              }
            }}
            onMouseLeave={e => {
              if (activePlanet?.name !== p.name) {
                e.currentTarget.style.borderColor = 'var(--wire)'
                e.currentTarget.style.color = 'var(--chalk-2)'
              }
            }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: p.color, display: 'inline-block', flexShrink: 0,
            }} />
            {p.name.toUpperCase()}
          </button>
        ))}
      </div>
    </div>

    {/* Bottom-right hint */}
    <div style={{
      position: 'fixed', bottom: '24px', right: showPanel ? '360px' : '24px',
      zIndex: 40, transition: 'right 0.4s cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{
        fontFamily: 'var(--font-hud)', fontSize: '9px',
        letterSpacing: '0.12em', color: 'var(--hud-dim)',
        textAlign: 'right', lineHeight: '1.8',
      }}>
        DRAG TO ROTATE<br />
        SCROLL TO ZOOM<br />
        CLICK PLANET TO INSPECT
      </div>
    </div>
  </>
)

export default HUD
