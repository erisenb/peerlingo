// Scattered bilingual word pairs as a decorative background layer
const PAIRS = [
  { text: 'Hello · Hola',            font: 'Pacifico',        color: '#60a5fa', size: 36, top: '4%',  left: '2%',  rot: -8  },
  { text: 'Gracias · Thank You',     font: '"Dancing Script"', color: '#f472b6', size: 30, top: '3%',  left: '30%', rot: 5   },
  { text: 'Good Morning · Buenos Días', font: '"Fredoka One"', color: '#34d399', size: 21, top: '7%',  left: '62%', rot: -3  },
  { text: 'Dream · Sueño',           font: 'Caveat',           color: '#a78bfa', size: 40, top: '2%',  left: '83%', rot: 8   },
  { text: 'Friend · Amigo',          font: '"Fredoka One"',    color: '#fb923c', size: 28, top: '17%', left: '7%',  rot: 6   },
  { text: 'Happy · Feliz',           font: 'Pacifico',         color: '#fbbf24', size: 32, top: '16%', left: '43%', rot: -5  },
  { text: 'Beautiful · Hermoso',     font: '"Dancing Script"', color: '#f9a8d4', size: 28, top: '19%', left: '72%', rot: 4   },
  { text: 'Learn · Aprender',        font: 'Caveat',           color: '#4ade80', size: 38, top: '31%', left: '1%',  rot: -10 },
  { text: 'Music · Música',          font: 'Pacifico',         color: '#f472b6', size: 28, top: '36%', left: '22%', rot: 7   },
  { text: 'Together · Juntos',       font: '"Dancing Script"', color: '#60a5fa', size: 36, top: '40%', left: '50%', rot: -4  },
  { text: 'Love · Amor',             font: 'Pacifico',         color: '#fb7185', size: 42, top: '34%', left: '74%', rot: 5   },
  { text: 'Family · Familia',        font: '"Fredoka One"',    color: '#fb923c', size: 26, top: '50%', left: '86%', rot: -7  },
  { text: 'Hope · Esperanza',        font: '"Dancing Script"', color: '#2dd4bf', size: 34, top: '57%', left: '4%',  rot: 8   },
  { text: 'Book · Libro',            font: 'Caveat',           color: '#c084fc', size: 38, top: '61%', left: '31%', rot: -5  },
  { text: 'School · Escuela',        font: '"Fredoka One"',    color: '#60a5fa', size: 26, top: '64%', left: '62%', rot: 4   },
  { text: 'Star · Estrella',         font: 'Pacifico',         color: '#fde047', size: 30, top: '77%', left: '2%',  rot: -6  },
  { text: 'Peace · Paz',             font: '"Dancing Script"', color: '#4ade80', size: 38, top: '79%', left: '26%', rot: 7   },
  { text: 'Future · Futuro',         font: 'Caveat',           color: '#a78bfa', size: 36, top: '74%', left: '56%', rot: -3  },
  { text: 'Bright · Brillante',      font: '"Fredoka One"',    color: '#fb923c', size: 24, top: '81%', left: '80%', rot: 5   },
  { text: 'Welcome · Bienvenido',    font: 'Pacifico',         color: '#60a5fa', size: 28, top: '89%', left: '13%', rot: -8  },
  { text: 'Journey · Camino',        font: '"Dancing Script"', color: '#f472b6', size: 32, top: '88%', left: '48%', rot: 4   },
  { text: 'Colors · Colores',        font: '"Fredoka One"',    color: '#2dd4bf', size: 24, top: '85%', left: '77%', rot: -5  },
]

export default function WordBackground() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      opacity: 0.18,
      userSelect: 'none',
    }}>
      {PAIRS.map((p, i) => (
        <span key={i} style={{
          position: 'absolute',
          top: p.top,
          left: p.left,
          fontFamily: p.font,
          fontSize: p.size,
          color: p.color,
          transform: `rotate(${p.rot}deg)`,
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}>
          {p.text}
        </span>
      ))}
    </div>
  )
}
