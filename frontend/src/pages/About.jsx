import Typewriter from '../components/Typewriter'
import SmartImage from '../components/SmartImage'
import makerPhoto from '../assets/about/maker.jpg'
import mugPhoto from '../assets/about/push-with-force-mug.jpg'
import makerPoufPhoto from '../assets/about/maker-pouf.jpg'
import mugsStripesPhoto from '../assets/about/mugs-stripes.jpg'
import deskPhoto from '../assets/about/desk.jpg'
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

      {/* ── who: the maker collage next to the opening lines ── */}
      <section className="about__hero">
        <div className="about__collage">
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

        <div className="about__story">
          <p className="about__lead">
            async/await drip is a one-person thing — just me,<br />
            a developer, who decided to make merch specifically for coders.
          </p>
          <p>
            right now that means mugs. every one is handcrafted and unique — no two
            are the same, nothing mass-produced.
          </p>
        </div>
      </section>

      {/* ── where: three photos scattered on the table, the sticker and the
          Barcelona line in the middle ── */}
      <section className="about__board">
        <SmartImage
          wrapClassName="about__photo about__photo--pouf"
          src={makerPoufPhoto}
          alt="the maker, cross-legged with a can't reproduce mug"
        />

        <div className="about__center">
          <div className="about__stripes-wrap">
            <SmartImage
              wrapClassName="about__photo about__photo--stripes"
              src={mugsStripesPhoto}
              alt="three mugs on a striped sheet"
            />
            <span className="about__sticker">// real merch for people who code</span>
          </div>
          <p className="about__caption">
            designed and made in <strong>Barcelona, Spain</strong>, then shipped
            asynchronously across the EU.
          </p>
        </div>

        <SmartImage
          wrapClassName="about__photo about__photo--desk"
          src={deskPhoto}
          alt="the desk where the code happens"
        />
      </section>
    </div>
  )
}
