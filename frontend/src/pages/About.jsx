import Typewriter from '../components/Typewriter'
import SmartImage from '../components/SmartImage'
import makerPhoto from '../assets/about/maker.jpg'
import mugPhoto from '../assets/about/push-with-force-mug.jpg'
import makerPoufPhoto from '../assets/about/maker-pouf.jpg'
import mugsStripesPhoto from '../assets/about/mugs-stripes.jpg'
import deskPhoto from '../assets/about/desk.jpg'
import './About.css'

// scrapbook page: a handwritten line over a strip of three overlapping taped
// prints, the story in typewriter text with two more prints taped beside it
export default function About() {
  return (
    <div className="about">
      <header className="about__header">
        <h1 className="about__title">about</h1>
        <p className="about__subtitle">
          <Typewriter text="tech merch · dev society" />
        </p>
      </header>

      <section className="about__page">
        <p className="about__script">
          real merch for people who code
          <svg className="about__script-line" viewBox="0 0 220 12" aria-hidden="true">
            <path d="M 2 5 C 60 1, 130 8, 218 3" />
            <path d="M 70 10 C 110 7, 150 11, 190 8" />
          </svg>
        </p>

        <div className="about__strip">
          <span className="about__tape about__tape--strip" aria-hidden="true" />
          <SmartImage
            wrapClassName="about__print about__print--pouf"
            src={makerPoufPhoto}
            alt="the maker, cross-legged with a can't reproduce mug"
          />
          <SmartImage
            wrapClassName="about__print about__print--up"
            src={mugsStripesPhoto}
            alt="three mugs on a striped sheet"
          />
          <SmartImage
            wrapClassName="about__print"
            src={deskPhoto}
            alt="the desk where the code happens"
          />
        </div>

        <div className="about__body">
          <div className="about__story">
            <p>
              async/await drip is a one-person thing — just me,<br />
              a developer, who decided to make merch specifically for coders.
            </p>
            <p>
              right now that means mugs. every one is handcrafted and unique — no two
              are the same, nothing mass-produced.
            </p>
            <p>
              designed and made in <strong>Barcelona, Spain</strong>, then shipped
              asynchronously across the EU.
            </p>
          </div>

          <div className="about__pair">
            <span className="about__tape about__tape--pair" aria-hidden="true" />
            <SmartImage
              wrapClassName="about__print about__print--maker"
              src={makerPhoto}
              alt="the maker"
            />
            <SmartImage
              wrapClassName="about__print about__print--mug"
              src={mugPhoto}
              alt="a handmade mug stamped 'push with force'"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
