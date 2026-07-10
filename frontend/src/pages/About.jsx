import Typewriter from '../components/Typewriter'
import './About.css'

export default function About() {
  return (
    <div className="about">
      <header className="about__header">
        <h1 className="about__title">about</h1>
        <p className="about__subtitle">
          <Typewriter text="based in barcelona, spain." />
        </p>
      </header>

      <div className="about__body">
        <p>
          async/await drip is a tiny ceramics studio for people who talk to
          machines all day. we make handmade mugs — each one a little different,
          same as the code you ship.
        </p>
        <p>
          everything is thrown, glazed and packed by hand in{' '}
          <strong>barcelona, spain</strong>, then sent asynchronously to wherever
          a promise can reach.
        </p>
        <p className="about__note">// no two mugs resolve the same way.</p>
      </div>
    </div>
  )
}
