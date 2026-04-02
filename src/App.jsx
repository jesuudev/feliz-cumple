import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useAnimate } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Zap } from 'lucide-react'
import './index.css'

// ─── DATOS ────────────────────────────────────────────────────────────────────

const REGALOS = [
  { emoji: '🍟', texto: 'Una salchipapa fría' },
  { emoji: '☕', texto: 'Un café recalentado' },
  { emoji: '💸', texto: '$1.000 pesitos' },
  { emoji: '🍬', texto: 'Un chicle masticado' },
  { emoji: '🧦', texto: 'Un par de medias rotas' },
  { emoji: '🤡', texto: 'Un "gracias por participar"' },
  { emoji: '🪨', texto: 'Una piedra pintada con amor' },
  { emoji: '📎', texto: 'Un clip de oficina usado' },
  { emoji: '🌵', texto: 'Un cactus de plástico' },
  { emoji: '🎟️', texto: 'Un cupón de "después te lo doy"' },
]

const PANIC_EMOJIS = ['🎉', '🥳', '🍻', '🧨', '🎊', '🎈', '🔥', '🚀', '💥', '⚡', '🎂', '✨', '🎆', '🎇', '💃']
const CONFETTI_COLORS = ['#ff00de', '#00d4ff', '#ffe600', '#ff6b35', '#7c3aed', '#10b981', '#f43f5e', '#ffffff']

// ─── CONFETI — CAÑÓN MASIVO ───────────────────────────────────────────────────

function fireMassiveConfetti() {
  const fire = (opts) => confetti({ colors: CONFETTI_COLORS, ...opts })

  // Salva 1 — explosión central
  fire({ particleCount: 400, spread: 360, origin: { x: 0.5, y: 0.45 }, scalar: 1.6, startVelocity: 60 })

  // Salva 2 — laterales
  setTimeout(() => {
    fire({ particleCount: 250, angle: 55,  spread: 100, origin: { x: 0,   y: 0.5 }, startVelocity: 70 })
    fire({ particleCount: 250, angle: 125, spread: 100, origin: { x: 1,   y: 0.5 }, startVelocity: 70 })
  }, 180)

  // Salva 3 — lluvia desde arriba
  setTimeout(() => {
    fire({ particleCount: 300, angle: 90, spread: 180, origin: { x: 0.5, y: 0 }, gravity: 1.3, startVelocity: 55 })
  }, 400)

  // Salva 4 — 4 esquinas
  setTimeout(() => {
    fire({ particleCount: 180, angle: 135, spread: 80, origin: { x: 0, y: 0 } })
    fire({ particleCount: 180, angle: 45,  spread: 80, origin: { x: 1, y: 0 } })
    fire({ particleCount: 180, angle: 45,  spread: 80, origin: { x: 0, y: 1 } })
    fire({ particleCount: 180, angle: 135, spread: 80, origin: { x: 1, y: 1 } })
  }, 700)

  // Salva 5 — remate final aleatorio
  setTimeout(() => {
    ;[0.2, 0.4, 0.6, 0.8].forEach((x) =>
      fire({ particleCount: 120, spread: 360, origin: { x, y: Math.random() * 0.6 }, scalar: 1.2 })
    )
  }, 1100)
}

// ─── EMOJI RAIN ───────────────────────────────────────────────────────────────

function FallingEmoji({ emoji, left, delay, duration }) {
  return (
    <span className="falling-emoji" style={{ left: `${left}%`, top: '-80px', animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
      {emoji}
    </span>
  )
}

function EmojiRain({ active, onDone }) {
  const [emojis, setEmojis] = useState([])
  useEffect(() => {
    if (!active) return
    const items = Array.from({ length: 70 }, (_, i) => ({
      id: i,
      emoji: PANIC_EMOJIS[Math.floor(Math.random() * PANIC_EMOJIS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2.5,
    }))
    setEmojis(items)
    const t = setTimeout(() => { setEmojis([]); onDone() }, 8000)
    return () => clearTimeout(t)
  }, [active])
  return <>{emojis.map((e) => <FallingEmoji key={e.id} {...e} />)}</>
}

// ─── OVERLAY "¡FELIZ CUMPLEAÑOS!" ────────────────────────────────────────────

const FLASH_COLORS = ['#ff00de', '#00d4ff', '#ffe600', '#ff6b35', '#7c3aed', '#10b981']

function BirthdayOverlay({ active }) {
  const [colorIdx, setColorIdx] = useState(0)

  useEffect(() => {
    if (!active) return
    const iv = setInterval(() => setColorIdx((i) => (i + 1) % FLASH_COLORS.length), 120)
    return () => clearInterval(iv)
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 1, 0] }}
          transition={{ duration: 4.5, times: [0, 0.08, 0.5, 0.88, 1] }}
          className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 200, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
        >
          {/* Emojis encima */}
          <motion.div
            animate={{ y: [0, -8, 0], scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="text-5xl mb-4"
          >
            🎂🥳🎊
          </motion.div>

          {/* Texto principal — cicla colores */}
          <motion.p
            animate={{ scale: [1, 1.06, 1], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 0.3 }}
            className="font-black text-center leading-tight px-6 drop-shadow-lg"
            style={{
              fontSize: 'clamp(2.8rem, 14vw, 5.5rem)',
              color: FLASH_COLORS[colorIdx],
              textShadow: `0 0 30px ${FLASH_COLORS[colorIdx]}, 0 0 60px ${FLASH_COLORS[colorIdx]}`,
              letterSpacing: '-1px',
            }}
          >
            ¡FELIZ<br />CUMPLE!
          </motion.p>

          {/* Nombre */}
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="font-black text-white mt-3"
            style={{ fontSize: 'clamp(1.4rem, 7vw, 2.5rem)', letterSpacing: '0.05em' }}
          >
            NATHALIE 🚀🔥
          </motion.p>

          {/* Emojis abajo */}
          <motion.div
            animate={{ y: [0, 8, 0], scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 0.5, delay: 0.25 }}
            className="text-4xl mt-4"
          >
            🧨🎉🍻
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── CATS DESDE LOS 4 BORDES ──────────────────────────────────────────────────

const BORDER_CATS = [
  // Desde izquierda → derecha
  ...Array.from({ length: 7 }, (_, i) => ({ side: 'left',   top: `${10 + i * 12}%`, delay: i * 0.08 })),
  // Desde derecha → izquierda
  ...Array.from({ length: 7 }, (_, i) => ({ side: 'right',  top: `${15 + i * 11}%`, delay: i * 0.08 + 0.05 })),
  // Desde arriba → abajo
  ...Array.from({ length: 6 }, (_, i) => ({ side: 'top',    left: `${8 + i * 15}%`, delay: i * 0.1 })),
  // Desde abajo → arriba
  ...Array.from({ length: 6 }, (_, i) => ({ side: 'bottom', left: `${12 + i * 14}%`, delay: i * 0.1 + 0.07 })),
]

function BorderCat({ side, top, left, delay }) {
  const fromLeft   = side === 'left'
  const fromRight  = side === 'right'
  const fromTop    = side === 'top'
  const fromBottom = side === 'bottom'

  const initial = {
    x: fromLeft ? '-120px' : fromRight ? '120vw' : 0,
    y: fromTop  ? '-120px' : fromBottom ? '120vh' : 0,
    opacity: 1,
  }
  const animate = {
    x: fromLeft ? '120vw' : fromRight ? '-120px' : 0,
    y: fromTop  ? '120vh' : fromBottom ? '-120px' : 0,
    opacity: [1, 1, 0],
  }
  const posStyle = {
    top:  top  ?? (fromLeft || fromRight ? undefined : undefined),
    left: left ?? (fromTop  || fromBottom ? undefined : undefined),
  }
  if (side === 'left' || side === 'right') posStyle.top = top
  if (side === 'top'  || side === 'bottom') posStyle.left = left

  const flip = fromRight ? 'scaleX(-1)' : fromBottom ? 'rotate(90deg)' : fromTop ? 'rotate(-90deg)' : 'scaleX(1)'

  return (
    <motion.div
      className="fixed pointer-events-none select-none text-3xl"
      style={{ zIndex: 150, ...posStyle }}
      initial={initial}
      animate={animate}
      transition={{ duration: 1.6 + Math.random() * 0.6, ease: 'linear', delay, times: [0, 0.7, 1] }}
    >
      <span style={{ display: 'inline-block', transform: flip }}>🐱</span>
    </motion.div>
  )
}

function PanicBorderCats({ triggerKey }) {
  const [cats, setCats] = useState([])

  useEffect(() => {
    if (triggerKey === 0) return
    const stamped = BORDER_CATS.map((c, i) => ({ ...c, id: `${triggerKey}-${i}` }))
    setCats(stamped)
    const t = setTimeout(() => setCats([]), 4000)
    return () => clearTimeout(t)
  }, [triggerKey])

  return <>{cats.map((c) => <BorderCat key={c.id} {...c} />)}</>
}

// ─── DR. CAT VOLADOR (NYAN CAT) ───────────────────────────────────────────────

const CAT_FRAMES = ['🐱', '😸', '🐱', '😹']

function DrCatVolador() {
  const [visible, setVisible] = useState(false)
  const [frame, setFrame]     = useState(0)
  const [cfg, setCfg]         = useState({ goingRight: true, startY: 30, endY: 30 })

  useEffect(() => {
    let t
    const schedule = () => {
      t = setTimeout(() => {
        setCfg({
          goingRight: Math.random() > 0.5,
          startY: 10 + Math.random() * 55,
          endY:   10 + Math.random() * 55,
        })
        setVisible(true)
      }, 10000 + Math.random() * 10000)
    }
    schedule()
    return () => clearTimeout(t)
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const iv = setInterval(() => setFrame((f) => (f + 1) % CAT_FRAMES.length), 150)
    return () => clearInterval(iv)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="nyancat"
          className="fixed pointer-events-none z-50 select-none"
          style={{ top: `${cfg.startY}%`, left: cfg.goingRight ? '-130px' : '110vw' }}
          animate={{ left: cfg.goingRight ? '110vw' : '-130px', top: `${cfg.endY}%` }}
          transition={{ duration: 3.8, ease: 'linear' }}
          onAnimationComplete={() => setVisible(false)}
        >
          <div className="flex items-center" style={{ transform: cfg.goingRight ? 'scaleX(1)' : 'scaleX(-1)' }}>
            <div className="flex flex-col justify-center" style={{ width: '55px', gap: '3px', marginRight: '2px' }}>
              {['#ff0000', '#ff8800', '#ffff00', '#00cc00', '#0088ff', '#8800ff'].map((c, i) => (
                <div key={i} style={{ height: '4px', background: c, borderRadius: '2px', opacity: 0.9 }} />
              ))}
            </div>
            <div className="relative flex items-center justify-center" style={{ width: '48px', height: '48px' }}>
              <div className="absolute inset-0 rounded-lg" style={{ background: 'linear-gradient(135deg, #d4a574, #c49060)', border: '2px solid #ff69b4', borderRadius: '8px' }} />
              <span style={{ fontSize: '2.4rem', lineHeight: 1, position: 'relative', zIndex: 1 }}>{CAT_FRAMES[frame]}</span>
            </div>
            <div className="flex flex-col gap-0.5 ml-1">
              {['✨', '⭐', '✨'].map((s, i) => <span key={i} style={{ fontSize: '0.65rem' }}>{s}</span>)}
            </div>
          </div>
          <div className="text-center mt-0.5" style={{ transform: cfg.goingRight ? 'scaleX(1)' : 'scaleX(-1)' }}>
            <span className="font-black text-white rounded-full px-1.5 py-0.5"
              style={{ fontSize: '0.55rem', background: 'rgba(0,0,0,0.75)', letterSpacing: '0.05em' }}>
              DR. CAT 🚀
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── DESCUBRIDOR DE REGALOS ───────────────────────────────────────────────────

function DescubridorRegalos() {
  const [regalo, setRegalo] = useState(null)
  const [animKey, setAnimKey] = useState(0)

  const fireGiftConfetti = useCallback(() => {
    const fire = (opts) => confetti({ colors: CONFETTI_COLORS, ...opts })
    fire({ particleCount: 180, spread: 100, origin: { x: 0.5, y: 0.55 }, scalar: 1.2 })
    setTimeout(() => {
      fire({ particleCount: 120, angle: 55,  spread: 80, origin: { x: 0, y: 0.6 } })
      fire({ particleCount: 120, angle: 125, spread: 80, origin: { x: 1, y: 0.6 } })
    }, 150)
    setTimeout(() => {
      fire({ particleCount: 100, angle: 90, spread: 120, origin: { x: 0.5, y: 0 }, gravity: 0.8 })
    }, 350)
  }, [])

  const handleClick = () => {
    const idx = Math.floor(Math.random() * REGALOS.length)
    setRegalo(REGALOS[idx])
    setAnimKey((k) => k + 1)
    fireGiftConfetti()
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.85, rotate: -3 }}
        whileHover={{ scale: 1.04 }}
        className="relative w-full font-black cursor-pointer select-none rounded-3xl px-6 py-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #ff00de, #ff6b35)',
          boxShadow: '0 0 40px rgba(255, 0, 222, 0.5), 0 0 80px rgba(124, 58, 237, 0.3)',
          border: '3px solid rgba(255,255,255,0.25)',
        }}
      >
        <motion.div className="text-5xl mb-2"
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}>🎁</motion.div>
        <div className="text-lg leading-tight">Descubre tu regalo</div>
        <motion.span className="absolute top-2 right-3 text-xl"
          animate={{ scale: [1, 1.4, 1], rotate: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}>✨</motion.span>
        <motion.span className="absolute bottom-2 left-3 text-xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, delay: 0.5 }}>🎉</motion.span>
      </motion.button>

      <AnimatePresence mode="wait">
        {regalo && (
          <motion.div key={animKey}
            initial={{ opacity: 0, scale: 0.3, y: 30, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -15 }}
            transition={{ type: 'spring', stiffness: 320, damping: 16 }}
            className="w-full rounded-3xl p-6 text-center"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '2px solid rgba(255,255,255,0.2)' }}
          >
            <motion.div className="text-6xl mb-3"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}>{regalo.emoji}</motion.div>
            <p className="text-white font-black text-2xl leading-tight">{regalo.texto}</p>
            <p className="text-white/50 text-xs mt-2">¡Felicidades, lo mereces! 🥳</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────

export default function App() {
  const [panicActive,   setPanicActive]   = useState(false)
  const [panicRaining,  setPanicRaining]  = useState(false)
  const [showOverlay,   setShowOverlay]   = useState(false)
  const [catTrigger,    setCatTrigger]    = useState(0)
  const [scope, animate] = useAnimate()

  const handlePanic = () => {
    if (panicActive) return
    setPanicActive(true)
    setPanicRaining(true)
    setShowOverlay(true)
    setCatTrigger((k) => k + 1)

    // Screen shake
    animate(scope.current, { x: [0, -14, 14, -10, 10, -6, 6, -3, 3, 0] }, { duration: 0.7, ease: 'easeInOut' })

    // Confeti masivo en 5 salvas
    fireMassiveConfetti()

    // Apagar overlay tras 4.5 s
    setTimeout(() => setShowOverlay(false), 4500)
    // Apagar todo tras 8 s
    setTimeout(() => { setPanicRaining(false); setPanicActive(false) }, 8000)
  }

  return (
    <div ref={scope} className="animated-bg min-h-screen w-full relative">

      <EmojiRain active={panicRaining} onDone={() => {}} />
      <BirthdayOverlay active={showOverlay} />
      <PanicBorderCats triggerKey={catTrigger} />
      <DrCatVolador />

      {/* Partículas de fondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {[...Array(12)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full opacity-20"
            style={{
              width: Math.random() * 80 + 20,
              height: Math.random() * 80 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#ff00de', '#00d4ff', '#ffe600', '#7c3aed'][i % 4],
              filter: 'blur(40px)',
            }}
            animate={{ x: [0, Math.random() * 60 - 30], y: [0, Math.random() * 60 - 30] }}
            transition={{ repeat: Infinity, repeatType: 'mirror', duration: 4 + Math.random() * 4, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="relative z-10 max-w-md mx-auto px-4 py-8 flex flex-col gap-10">

        {/* ══ HEADER ══ */}
        <section className="text-center pt-4">
          <div className="flex justify-center gap-5 mb-5">
            {['🎉', '🥳', '🎊'].map((emoji, i) => (
              <motion.span key={i} className="text-3xl"
                animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 + i * 0.3, delay: i * 0.2 }}>
                {emoji}
              </motion.span>
            ))}
          </div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.4, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 11 }}
            className="font-black leading-none mb-4"
            style={{ fontSize: 'clamp(2rem, 9.5vw, 3.4rem)' }}
          >
            <span style={{ background: 'linear-gradient(135deg, #ff00de, #00d4ff, #ffe600)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Nathalie:
            </span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #ffe600, #ff6b35, #ff00de)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ¡Subiste al
            </span>
            <br />
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ display: 'inline-block', background: 'linear-gradient(135deg, #00d4ff, #7c3aed, #ff00de)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Nivel 21! 🚀🔥
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mx-auto rounded-full overflow-hidden"
            style={{ maxWidth: '280px', height: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <motion.div
              initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.8, delay: 0.7, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #ff00de, #ff6b35, #ffe600)' }}
            />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
            className="text-white/60 text-xs mt-2 font-semibold">
            NIVEL CARGADO AL 100% ✅
          </motion.p>
        </section>

        {/* ══ DESCUBRIDOR DE REGALOS ══ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center"
        >
          <DescubridorRegalos />
        </motion.section>

        {/* ══ MENSAJE FINAL ══ */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} className="text-center py-4"
        >
          <div className="flex justify-center gap-3 mb-4">
            {['🎂', '🥳', '🎊', '🍻', '🧨'].map((e, i) => (
              <motion.span key={i} className="text-2xl"
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.25 }}>
                {e}
              </motion.span>
            ))}
          </div>

          <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <p className="font-handwrite text-white leading-snug" style={{ fontSize: 'clamp(1.2rem, 5vw, 1.6rem)' }}>
              "Que tu año 21 sea épico,<br />
              lleno de fiestas memorables,<br />
              amigos que valen la pena<br />
              y cero estrés innecesario. 🚀"
            </p>
          </div>

          <p className="text-white/30 text-xs mt-4">Desarrollado con 0% de seriedad 🤡🥳</p>
        </motion.section>

        <div className="h-20" />
      </div>

      {/* ══ BOTÓN FLOTANTE DE PÁNICO ══ */}
      <motion.button
        onClick={handlePanic}
        disabled={panicActive}
        whileTap={{ scale: 0.85, rotate: 5 }}
        whileHover={{ scale: 1.12 }}
        animate={{ boxShadow: panicActive ? 'none' : ['0 0 20px rgba(255,0,102,0.6)', '0 0 45px rgba(255,0,102,1)', '0 0 20px rgba(255,0,102,0.6)'] }}
        transition={{ boxShadow: { repeat: Infinity, duration: 1.2 } }}
        className="fixed bottom-6 right-4 z-50 rounded-full font-black shadow-2xl flex items-center gap-2 px-4 py-4"
        style={{
          background: panicActive ? 'linear-gradient(135deg, #6b7280, #9ca3af)' : 'linear-gradient(135deg, #ff0066, #7c3aed)',
          border: '3px solid rgba(255,255,255,0.3)',
          color: 'white',
          minWidth: '64px',
          minHeight: '64px',
        }}
      >
        <Zap size={22} />
        <span className="hidden sm:inline text-sm">¡PÁNICO!</span>
      </motion.button>

      {/* Hint del FAB */}
      <motion.div
        className="fixed bottom-22 right-4 z-40 text-right"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: [0, 1, 1, 0], x: [10, 0, 0, 10] }}
        transition={{ duration: 3.5, delay: 3, times: [0, 0.15, 0.85, 1] }}
      >
        <span className="text-xs text-white font-semibold px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          👆 Toca para caos total
        </span>
      </motion.div>
    </div>
  )
}
