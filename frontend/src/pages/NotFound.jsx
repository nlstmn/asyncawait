import { Link } from 'react-router-dom'
import { ICONS } from '../components/icons'
import Typewriter from '../components/Typewriter'

// catch-all for unknown routes and missing products, on the shared .status layout
export default function NotFound({ title = '404', message = '// route not found' }) {
  return (
    <div className="status">
      <h1 className="status__title">{title}</h1>
      <span className="status__icon" aria-hidden="true">{ICONS.missing}</span>
      <p className="status__sub"><Typewriter text={message} /></p>
      <Link to="/shop" className="status__btn">back to shop &gt;</Link>
    </div>
  )
}
