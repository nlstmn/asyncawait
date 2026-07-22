import Typewriter from '../components/Typewriter'
import SmartImage from '../components/SmartImage'
import makerPhoto from '../assets/5924640461664490176.jpg'
import mugPhoto from '../assets/5812090667579150242.jpg'
import './About.css'

export default function About() {
  return (
    <div className="about">
      <header className="about__header">
        <h1 className="about__title">about</h1>
        <p className="about__subtitle">
          <Typewriter text="tech merch · dev society" />
        </p>
      </header>

      <div className="about__content">
        <div className="about__photos">
          <SmartImage
            wrapClassName="about__photo about__photo--maker"
            src={makerPhoto}
            alt="the maker"
          />
          <SmartImage
            wrapClassName="about__photo about__photo--mug"
            src={mugPhoto}
            alt="a handmade mug stamped 'push with force'"
          />
        </div>

        <div className="about__body">
          <p>
            async/await drip is a one-person thing — just me,<br />
            a developer, who decided to make merch specifically<br />
            for coders.
          </p>
        <p>
          right now that means mugs. every one is handcrafted and unique — no two
          are the same, nothing mass-produced.
        </p>
        <p>
          designed and made in <strong>Barcelona, Spain</strong>, then shipped
          asynchronously across the EU.
        </p>
          <p className="about__note">// real merch for people who code</p>
        </div>
      </div>
    </div>
  )
}
