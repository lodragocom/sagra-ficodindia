import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

const RAGGIO = 1.6

/** Città collegate a Militello. Vengono dall'Art Direction, concept 02. */
const CITTA = [
  { nome: 'PARIS', lat: 48.9, lon: 2.4 },
  { nome: 'LONDON', lat: 51.5, lon: -0.1 },
  { nome: 'NEW YORK', lat: 40.7, lon: -74 },
  { nome: 'TOKYO', lat: 35.7, lon: 139.7 },
  { nome: 'ZÜRICH', lat: 47.4, lon: 8.5 },
]

/** I due segni identitari di Militello, sulla superficie del frutto. */
const LUOGHI = [
  { nome: 'Santa Maria della Stella', lat: 12, lon: 20 },
  { nome: 'San Nicolò – SS. Salvatore', lat: -4, lon: 44 },
]

function daLatLon(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ]
}

/**
 * Texture di prova, generata a runtime: verde cactus con le areole del ficodindia.
 * Va sostituita con la macro fotografica ad alta risoluzione quando arriva
 * (task del 07/09). Serve a validare movimento e composizione, non l'estetica.
 */
function useTexturaProvvisoria() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 512
    const g = c.getContext('2d')
    if (!g) return null

    const sfondo = g.createLinearGradient(0, 0, 0, 512)
    sfondo.addColorStop(0, '#2A6C5F')
    sfondo.addColorStop(0.45, '#4B9A64')
    sfondo.addColorStop(1, '#2A6C5F')
    g.fillStyle = sfondo
    g.fillRect(0, 0, 1024, 512)

    // areole in quinconce
    for (let riga = 0; riga < 16; riga++) {
      for (let col = 0; col < 30; col++) {
        const x = col * 34 + (riga % 2 ? 17 : 0) + 8
        const y = riga * 32 + 16
        g.beginPath()
        g.ellipse(x, y, 5.5, 4, 0, 0, Math.PI * 2)
        g.fillStyle = 'rgba(220, 172, 12, 0.55)'
        g.fill()
        g.beginPath()
        g.ellipse(x, y, 2, 1.5, 0, 0, Math.PI * 2)
        g.fillStyle = 'rgba(68, 64, 61, 0.7)'
        g.fill()
      }
    }

    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.wrapS = THREE.RepeatWrapping
    return t
  }, [])
}

function Frutto() {
  const texture = useTexturaProvvisoria()
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[RAGGIO, 96, 96]} />
      <meshStandardMaterial
        map={texture ?? undefined}
        color={texture ? '#ffffff' : '#4B9A64'}
        roughness={0.72}
        metalness={0.04}
      />
    </mesh>
  )
}

function Luoghi() {
  return (
    <>
      {LUOGHI.map((l) => {
        const p = daLatLon(l.lat, l.lon, RAGGIO * 1.01)
        return (
          <group key={l.nome} position={p}>
            <mesh>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshBasicMaterial color="#F7F4EA" />
            </mesh>
            <Html
              distanceFactor={7}
              className="pointer-events-none select-none whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-avorio drop-shadow"
            >
              {l.nome}
            </Html>
          </group>
        )
      })}
    </>
  )
}

function Rotte() {
  const inclinazioni: [number, number, number][] = [
    [Math.PI / 2.1, 0, 0.2],
    [Math.PI / 2.6, 0.7, -0.35],
    [Math.PI / 1.8, -0.5, 0.6],
  ]
  return (
    <>
      {inclinazioni.map((r, i) => (
        <mesh key={i} rotation={r}>
          <torusGeometry args={[RAGGIO + 0.55 + i * 0.28, 0.006, 8, 160]} />
          <meshBasicMaterial color={i === 1 ? '#E165A1' : '#DCAC0C'} transparent opacity={0.75} />
        </mesh>
      ))}
    </>
  )
}

function Citta() {
  return (
    <>
      {CITTA.map((c, i) => {
        const p = daLatLon(c.lat, c.lon, RAGGIO + 0.62 + (i % 3) * 0.28)
        return (
          <group key={c.nome} position={p}>
            <mesh>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshBasicMaterial color="#F5D63B" />
            </mesh>
            <Html
              distanceFactor={9}
              className="pointer-events-none select-none whitespace-nowrap text-[10px] uppercase tracking-[0.25em] text-antracite/70"
            >
              {c.nome}
            </Html>
          </group>
        )
      })}
    </>
  )
}

export default function PianetaTre() {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 6], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 2.5, 3]} intensity={2.1} />
      <directionalLight position={[-5, -1, -2]} intensity={0.4} color="#E165A1" />
      <Frutto />
      <Luoghi />
      <Rotte />
      <Citta />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.55}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  )
}
