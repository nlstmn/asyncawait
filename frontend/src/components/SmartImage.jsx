import { useState } from 'react'
import './SmartImage.css'

/**
 * Image with a built-in loading state: a shimmering skeleton shows until the
 * image finishes loading (or errors), then the image fades in. Used for the
 * product imagery (shop cards, detail carousel, about photo) where the remote
 * photos can be slow.
 *
 * `wrapClassName` styles/sizes the wrapper (the box the skeleton fills);
 * `imgClassName` keeps any existing selectors that target the <img> working.
 */
export default function SmartImage({ src, alt = '', wrapClassName = '', imgClassName = '', ...rest }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <span className={`simg ${wrapClassName} ${loaded ? 'simg--loaded' : ''}`.trim()}>
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        {...rest}
      />
    </span>
  )
}
