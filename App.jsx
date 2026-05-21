import { useState, useRef, useCallback } from 'react'
import { useSolarSystem } from './hooks/useSolarSystem'
import PlanetPanel from './components/PlanetPanel'
import SunPanel from './components/SunPanel'
import HUD from './components/HUD'

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [showSun, setShowSun]               = useState(false)
  const [isPaused, setIsPaused]             = useState(false)
  const [speed, setSpeed]                   = useState(1)

  const handlePlanetClick = useCallback((planet) => {
    setSelectedPlanet(planet)
    setShowSun(false)
  }, [])

  const handleSunClick = useCallback(() => {
    setShowSun(true)
    setSelectedPlanet(null)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedPlanet(null)
    setShowSun(false)
  }, [])

  const { mountRef } = useSolarSystem({
    onPlanetClick: handlePlanetClick,
    onSunClick: handleSunClick,
    isPaused,
    speedMultiplier: speed,
  })

  const showPanel = !!selectedPlanet || showSun

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', cursor: 'grab' }}>
      {/* Three.js canvas mount */}
      <div
        ref={mountRef}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      />

      {/* HUD overlay */}
      <HUD
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(p => !p)}
        speed={speed}
        onSpeedChange={setSpeed}
        onPlanetSelect={(planet) => { setSelectedPlanet(planet); setShowSun(false) }}
        activePlanet={selectedPlanet}
        showPanel={showPanel}
      />

      {/* Info panels */}
      {selectedPlanet && (
        <PlanetPanel planet={selectedPlanet} onClose={handleClose} />
      )}
      {showSun && (
        <SunPanel onClose={handleClose} />
      )}
    </div>
  )
}

export default App
