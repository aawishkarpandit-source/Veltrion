import { Link } from 'react-router-dom';
import PageHeader from '../components/sections/PageHeader';
import Reveal from '../components/ui/Reveal';

export default function Privacy() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy."
        subtitle="How we handle information on this site — plainly stated."
      />
      <section className="section section-wash">
        <Reveal>
          <div className="legal-body">
            <p className="legal-updated">Last updated: 2 November 2026</p>

            <h2>1. Who we are</h2>
            <p>
              This site is operated by <strong>VELTRION</strong> — a digital technology company that is,
              as of the date above, <strong>not registered as a company</strong>. We are a youth-run
              team: some of our members are under 18, and our work is guided by our Legal Advisor
              (see the About page). Wherever a topic here touches formal legal territory, we keep it
              simple, honest and conservative — and we take advice from our Legal Advisor before
              making binding commitments.
            </p>

            <h2>2. What we collect</h2>
            <ul>
              <li>
                <strong>Contact form:</strong> your name, email address, optional subject and message.
                The form also records that you accepted our Privacy Policy and Terms of Service when
                you sent it.
              </li>
              <li>
                <strong>Messages you send us by email</strong> (if you contact us directly), which we
                keep in our mailbox.
              </li>
              <li>
                <strong>Admin logins:</strong> only for our own team, via our database provider's
                authentication. This has nothing to do with visitors to the site.
              </li>
            </ul>
            <p>We do not run advertising, we do not sell data, and we do not track you around the web.</p>

            <h2>3. Why we use it</h2>
            <p>
              The only purposes are: to reply to your enquiry, to deliver work you have asked us for,
              to keep our own records of projects, and to keep the site working. We use your contact
              details for those purposes only — never for unrelated marketing lists, and we don't add
              you to a newsletter you didn't ask for.
            </p>

            <h2>4. Cookies and local storage</h2>
            <p>
              This site uses <strong>no tracking or advertising cookies</strong>. We only use:
            </p>
            <ul>
              <li>Your <strong>theme preference</strong> (light / dark), stored in your browser.</li>
              <li>Your <strong>cookie-notice choice</strong> itself, stored in your browser.</li>
              <li>
                A signed-in <strong>admin session cookie</strong> — this exists only if you are a
                VELTRION team member using the admin panel; visitors never get it.
              </li>
            </ul>
            <p>
              Because everything above is strictly functional, there is nothing here that follows you
              around or profiles you.
            </p>

            <h2>5. Where your data lives</h2>
            <p>
              Form messages are stored in a cloud database (Supabase) and the site itself is served
              from Vercel's hosting platform. Our team members can view messages so that we can reply
              to you; younger team members do this together with, or under the oversight of, the
              Legal Advisor and senior members rather than on their own.
            </p>

            <h2>6. Sharing</h2>
            <p>
              We share message data only with the service providers named above (database and
              hosting) to the extent needed to run this site. We never sell or rent personal
              information, and we don't share it with advertisers — we don't have any.
            </p>

            <h2>7. How long we keep it</h2>
            <p>
              Enquiries are kept while they are useful — typically until a project is finished and
              delivered, or for a reasonable time in case you come back to us. If you ask us to
              delete a message you sent, we will delete it.
            </p>

            <h2>8. Your choices and rights</h2>
            <p>
              You can ask us at any time to show you what we have from you, correct it, or delete
              it. Email us and we will respond within a reasonable time. You can also clear the
              theme preference and cookie choice yourself from your browser settings — they are
              stored only on your device.
            </p>

            <h2>9. Age notes</h2>
            <p>
              This is a business site and is not aimed at young children. If you are under 18 and
              want to use our services, we recommend — and in some cases will require — that a
              parent or guardian is aware of, and agrees to, the arrangement. On our side, any the
              agreement is reviewed by the Legal Advisor.
            </p>

            <h2>10. Changes to this policy</h2>
            <p>
              If we change how we handle information, we will update this page and the date above.
              Material changes will be called out clearly at the top of the page.
            </p>

            <h2>11. Contact</h2>
            <p>
              Privacy questions or deletion requests: <a href="cg.npdigital@gmail.com">cg.npdigital@gmail.com</a>{' '}
              — or use the <Link to="/contact">contact form</Link> (privacy requests in the subject
              line reach us faster).
            </p>

            <p className="legal-note">
              This page describes, in general terms, how we operate. It is not formal legal advice,
              and it may be reviewed or updated as the company grows (including on registration).
            </p>

            <p className="legal-links">
              <Link to="/terms">Read our Terms of Service →</Link>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
