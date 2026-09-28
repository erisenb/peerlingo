// Renders plain text with any http(s) URLs turned into clickable links,
// e.g. an assignment description that points to an external resource
// (like the official Cambridge exam page) rather than reproducing it.
export default function Linkified({ text, style, linkStyle }) {
  if (!text) return null
  const parts = text.split(/(https?:\/\/[^\s]+)/g)
  return (
    <span style={{ whiteSpace: 'pre-wrap', ...style }}>
      {parts.map((part, i) => (part.startsWith('http://') || part.startsWith('https://'))
        ? <a key={i} href={part} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: '#008080', fontWeight: 700, wordBreak: 'break-all', ...linkStyle }}>{part}</a>
        : <span key={i}>{part}</span>
      )}
    </span>
  )
}
