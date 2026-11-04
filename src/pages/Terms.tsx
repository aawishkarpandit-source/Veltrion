import { Link } from 'react-router-dom';
import PageHeader from '../components/sections/PageHeader';
import Reveal from '../components/ui/Reveal';

export default function Terms() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service."
        subtitle="The ground rules for using this site and working with us."
      />
      <section className="section section-wash">
        <Reveal>
          <div className="legal-body">
            <p className="legal-updated">Last updated: 2 November 2026</p>

            <h2>1. Who we are</h2>
            <p>
              <strong>VELTRION</strong> is a digital technology team — websites, software, business
              systems, design, marketing and support. To be fully transparent:{' '}
              <strong>we are not registered as a company yet</strong> as of the date above, and{' '}
              <strong>some of the people running it are under 18</strong>. Day-to-day work happens
              under the guidance of our Legal Advisor, and anything legally binding is handled with
              her oversight. We publish this so clients always know exactly who they are dealing
              with.
            </p>

            <h2>2. Using this site</h2>
            <p>
              You may browse this site freely. If you send us a message through the contact form (or
              email), you agree to these terms and you confirm the information you send is accurate
              and yours to share. Don't send anything unlawful, harmful to others, or that you
              wouldn't want a young team to deal with — we will decline or report anything
              fraudulent, and we may stop aiding anyone who abuses this site or our team.
            </p>

            <h2>3. How projects are agreed</h2>
            <p>
              We don't do hidden charges or open-ended contracts. Before any work starts, the scope,
              timeline and price are agreed with you in <strong>writing</strong> (email or message is
              fine). Work happens to that written agreement; changes to scope are agreed the same
              way. If anything can't be clearly agreed, we won't start.
            </p>

            <h2>4. Capacity (our age)</h2>
            <p>
              Because some team members are minors, <strong>legally binding agreements are made
              with our Legal Advisor involved</strong>. In practice this means: (a) significant
              contracts are reviewed and signed off by the Legal Advisor; (b) when required by law
              for a minor to enter a contract, we may ask that a parent or guardian provides written
              consent or co-signs — on the client side too, if the client is under 18; and (c) any
              promise made outside the written agreement by a team member alone is not binding on
              VELTRION. This protects you as much as it protects us.
            </p>

            <h2>5. Payment and delivery</h2>
            <p>
              Payment is taken as agreed in the written project confirmation. We give regular
              progress updates, and we deliver by the agreed timeline. If a delay is coming —
              illness, exams, third parties — you will hear it from us early with a revised date,
              never radio silence.
            </p>

            <h2>6. What we need from you</h2>
            <p>
              Timely feedback and decisions, content you actually own or have the right to use
              (logos, photos, text), and access to what we need to complete the work (e.g. hosting
              or domain logins when agreed). We can't be responsible for hold-ups in the parts we
              depend on.
            </p>

            <h2>7. Ownership and portfolio</h2>
            <p>
              Once a project is fully paid, you own the custom work we made for you. We keep the
              right to show it in our portfolio and materials (e.g. "www site we built for X")
              unless you ask us in writing not to. Third-party assets (fonts, stock images,
              libraries) remain under their own licences — we'll tell you which apply.
            </p>

            <h2>8. Defects and changes after launch</h2>
            <p>
              If something we delivered doesn't work the way the written agreement says, tell us
              within <strong>30 days</strong> of delivery and we will correct it at no charge.
              Later changes, new features or support beyond what was agreed are quoted separately.
            </p>

            <h2>9. Downloads</h2>
            <p>
              Anything from our Download page is provided for normal use "as is". Install from our
              official links only, keep your own backups, and don't redistribute our build as your
              own. If a tool breaks something on your device, tell us and we will do our best to
              help — but use at your own risk and please back up first.
            </p>

            <h2>10. Limits</h2>
            <p>
              To the extent permitted by law: we provide our services with care and best effort,
              but without unlimited promises; our total responsibility for any single project is
              limited to the amount you actually paid for it; and we are not liable for indirect
              losses (e.g. lost profit caused by downtime) beyond what a written agreement says.
              This keeps small engagements, priced appropriately, risk-proportionate for both
              sides.
            </p>

            <h2>11. Ending the relationship</h2>
            <p>
              You can stop a project at any time; you pay for the work already done, and we hand
              over what exists so far. We may also decline or stop work that asks us to do
              something unlawful, unethical, or unsafe for our team (including our minors).
            </p>

            <h2>12. Changes to these terms</h2>
            <p>
              We'll update this page and the date above when terms change. Ongoing projects always
              follow the version agreed in their written confirmation, not later changes.
            </p>

            <h2>13. Contact</h2>
            <p>
              Questions about these terms: <a href="mailto:cg.npdigital@gmail.com">cg.npdigital@gmail.com</a> or
              the <Link to="/contact">contact form</Link>. Legal matters are handled by our Legal
              Advisor.
            </p>

            <p className="legal-note">
              These terms are written to be read by normal people, not lawyers. Where a court would
              interpret something differently, the intention above is what we agreed in spirit. This
              page is general information, not formal legal advice.
            </p>

            <p className="legal-links">
              <Link to="/privacy">Read our Privacy Policy →</Link>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
