import { Link } from "react-router-dom";
import "./LandingPage.css";

const features = [
  {
    icon: "🏋️",
    title: "Personalized Training Plans",
    desc: "Your coach builds custom weekly workouts tailored to your goals and schedule.",
  },
  {
    icon: "🥗",
    title: "Nutrition Guidance",
    desc: "Daily macro and calorie targets with detailed meal guidance from your coach.",
  },
  {
    icon: "📊",
    title: "Weekly Check-Ins",
    desc: "Log your weight, measurements, and photos each week to track real progress.",
  },
  {
    icon: "📈",
    title: "Progress History",
    desc: "See your full timeline of check-ins and measurements in one clear view.",
  },
];

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your account and tell us about your goals in minutes." },
  { num: "02", title: "Get Your Plan", desc: "Your coach designs a custom training and nutrition plan for you." },
  { num: "03", title: "Check In Weekly", desc: "Submit your weekly progress so your coach can adjust and support." },
  { num: "04", title: "See Real Results", desc: "Watch your progress compound week by week with expert guidance." },
];

export default function LandingPage() {
  return (
    <div className="lp-root">

      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <div className="lp-navInner">
          <span className="lp-logo">OwnCoaching</span>
          <div className="lp-navLinks">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#for-coaches">For Coaches</a>
          </div>
          <div className="lp-navActions">
            <Link to="/login" className="lp-navLogin">Log In</Link>
            <Link to="/signup" className="lp-navSignup">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-heroContent">
          <span className="lp-badge">Online Coaching Platform</span>
          <h1 className="lp-heroTitle">
            Your Coaching<br />Journey Starts Here
          </h1>
          <p className="lp-heroSub">
            OwnCoaching connects you with expert coaches who build personalized training
            and nutrition plans — then guide you every step of the way.
          </p>
          <div className="lp-heroActions">
            <Link to="/signup" className="lp-btnPrimary">Start for Free →</Link>
            <a href="#how-it-works" className="lp-btnOutline">See How It Works</a>
          </div>
        </div>

        <div className="lp-heroVisual">
          <div className="lp-heroCard lp-heroCard1">
            <div className="lp-hcLabel">This Week's Goal</div>
            <div className="lp-hcValue">4 Workouts</div>
            <div className="lp-hcProgress"><div className="lp-hcBar" style={{ width: "75%" }} /></div>
            <div className="lp-hcSub">3 of 4 completed</div>
          </div>
          <div className="lp-heroCard lp-heroCard2">
            <div className="lp-hcLabel">Daily Calories</div>
            <div className="lp-hcValue">2,400 kcal</div>
            <div className="lp-hcMacros">
              <span className="lp-macro lp-macroP">Protein 180g</span>
              <span className="lp-macro lp-macroC">Carbs 240g</span>
              <span className="lp-macro lp-macroF">Fat 80g</span>
            </div>
          </div>
          <div className="lp-heroCard lp-heroCard3">
            <div className="lp-hcLabel">Weekly Check-In</div>
            <div className="lp-hcCheck"><span className="lp-checkDot" />Weight logged ✓</div>
            <div className="lp-hcCheck"><span className="lp-checkDot" />Measurements sent ✓</div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="lp-stats">
        <div className="lp-statsInner">
          <div className="lp-stat">
            <span className="lp-statNum">500+</span>
            <span className="lp-statLabel">Active Clients</span>
          </div>
          <div className="lp-statDivider" />
          <div className="lp-stat">
            <span className="lp-statNum">120+</span>
            <span className="lp-statLabel">Expert Coaches</span>
          </div>
          <div className="lp-statDivider" />
          <div className="lp-stat">
            <span className="lp-statNum">12,000+</span>
            <span className="lp-statLabel">Check-Ins Completed</span>
          </div>
          <div className="lp-statDivider" />
          <div className="lp-stat">
            <span className="lp-statNum">98%</span>
            <span className="lp-statLabel">Client Satisfaction</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lp-section" id="features">
        <div className="lp-sectionInner">
          <div className="lp-sectionHead">
            <span className="lp-badge">Everything You Need</span>
            <h2 className="lp-sectionTitle">A complete coaching toolkit</h2>
            <p className="lp-sectionSub">
              From workout plans to nutrition tracking — everything synced between
              you and your coach in real time.
            </p>
          </div>
          <div className="lp-featGrid">
            {features.map((f) => (
              <div key={f.title} className="lp-featCard card cardHover statAccent">
                <div className="lp-featIcon">{f.icon}</div>
                <div className="lp-featTitle">{f.title}</div>
                <div className="lp-featDesc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="lp-section lp-sectionAlt" id="how-it-works">
        <div className="lp-sectionInner">
          <div className="lp-sectionHead">
            <span className="lp-badge">Simple Process</span>
            <h2 className="lp-sectionTitle">Up and running in minutes</h2>
            <p className="lp-sectionSub">
              No complicated setup. Just sign up and your coach takes care of the rest.
            </p>
          </div>
          <div className="lp-stepsGrid">
            {steps.map((s, i) => (
              <div key={s.num} className="lp-step">
                <div className="lp-stepNum">{s.num}</div>
                {i < steps.length - 1 && <div className="lp-stepLine" />}
                <div className="lp-stepTitle">{s.title}</div>
                <div className="lp-stepDesc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Coaches ── */}
      <section className="lp-section" id="for-coaches">
        <div className="lp-sectionInner lp-splitSection">
          <div className="lp-splitText">
            <span className="lp-badge">For Coaches</span>
            <h2 className="lp-sectionTitle">Manage all your clients from one dashboard</h2>
            <p className="lp-sectionSub">
              No more spreadsheets or scattered messages. OwnCoaching gives you a dedicated
              hub to manage training plans, nutrition targets, and client check-ins.
            </p>
            <ul className="lp-coachList">
              <li>Review weekly check-ins and add coaching notes</li>
              <li>Edit training schedules per client in minutes</li>
              <li>Update daily nutrition targets and macro splits</li>
              <li>Track client progress over time with full history</li>
            </ul>
            <Link to="/signup" className="lp-btnPrimary lp-btnInline">
              Join as a Coach →
            </Link>
          </div>

          <div className="lp-splitVisual">
            <div className="lp-coachPanel card">
              <div className="lp-panelHeader">Client Overview</div>
              <div className="lp-clientRow">
                <div className="lp-clientAvatar">JD</div>
                <div className="lp-clientInfo">
                  <span className="lp-clientName">John Doe</span>
                  <span className="lp-clientSub">Check-in pending</span>
                </div>
                <span className="lp-clientBadge lp-badgePending">Review</span>
              </div>
              <div className="lp-clientRow">
                <div className="lp-clientAvatar lp-avatarGreen">SM</div>
                <div className="lp-clientInfo">
                  <span className="lp-clientName">Sara M.</span>
                  <span className="lp-clientSub">On track this week</span>
                </div>
                <span className="lp-clientBadge lp-badgeGood">Good</span>
              </div>
              <div className="lp-clientRow">
                <div className="lp-clientAvatar lp-avatarOrange">AL</div>
                <div className="lp-clientInfo">
                  <span className="lp-clientName">Alex L.</span>
                  <span className="lp-clientSub">Plan updated today</span>
                </div>
                <span className="lp-clientBadge lp-badgeNew">New Plan</span>
              </div>
              <div className="lp-panelFooter">
                <span className="lp-panelFooterText">3 clients · 1 pending review</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="lp-cta">
        <div className="lp-ctaInner">
          <h2 className="lp-ctaTitle">Ready to transform your coaching?</h2>
          <p className="lp-ctaSub">
            Join hundreds of clients and coaches already using OwnCoaching to hit their goals.
          </p>
          <div className="lp-ctaActions">
            <Link to="/signup" className="lp-btnWhite">Create Free Account</Link>
            <Link to="/login" className="lp-btnOutlineWhite">Log In</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-footerInner">
          <div className="lp-footerBrand">
            <span className="lp-logo">OwnCoaching</span>
            <p className="lp-footerTagline">Expert coaching, personalized for you.</p>
          </div>
          <div className="lp-footerLinks">
            <div className="lp-footerGroup">
              <div className="lp-footerGroupTitle">Platform</div>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#for-coaches">For Coaches</a>
            </div>
            <div className="lp-footerGroup">
              <div className="lp-footerGroupTitle">Account</div>
              <Link to="/login">Log In</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
          </div>
        </div>
        <div className="lp-footerBottom">
          <span>© 2025 OwnCoaching. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
