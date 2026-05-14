import './Marquee.css'

export default function Marquee({ items, variant = 'blue', speed = 30 }) {
  const repeated = [...items, ...items]
  return (
    <div className={`marquee marquee--${variant}`} aria-hidden="true">
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {repeated.map((item, i) => (
          <span key={i} className="marquee__item">{item}</span>
        ))}
      </div>
    </div>
  )
}
