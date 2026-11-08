import { useEffect, useState } from 'react'

/** Types `text` character by character with a blinking terminal cursor.
 *  `keepCursor` leaves the cursor blinking after the text is done (for
 *  "waiting…" states). */
export default function Typewriter({ text, speed = 45, startDelay = 350, keepCursor = false }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
    let interval
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setCount(c => {
          if (c >= text.length) { clearInterval(interval); return c }
          return c + 1
        })
      }, speed)
    }, startDelay)
    return () => { clearTimeout(start); clearInterval(interval) }
  }, [text, speed, startDelay])

  const done = count >= text.length

  return (
    <span className="typewriter" aria-label={text}>
      {text.slice(0, count)}
      {(!done || keepCursor) && <span className="blink" aria-hidden="true">_</span>}
    </span>
  )
}
