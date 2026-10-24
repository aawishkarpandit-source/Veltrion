import { useAsync } from '../lib/hooks';
import { getSettings, getTextBlocks } from '../lib/content';
import Reveal from '../components/ui/Reveal';
import PageHeader from '../components/sections/PageHeader';
import ContactForm from '../components/sections/ContactForm';
import PageSections from '../components/layout/PageSections';

export default function Contact() {
  const { data: blocks } = useAsync(() => getTextBlocks(), []);
  const { data: settings } = useAsync(() => getSettings(), []);

  const details = (
    <Reveal>
      {settings?.contact_email && (
        <div className="contact-item">
          <p className="contact-item-label">Email</p>
          <a className="contact-item-value" href={`mailto:${settings.contact_email}`}>
            {settings.contact_email}
          </a>
        </div>
      )}
      {settings?.phone && (
        <div className="contact-item">
          <p className="contact-item-label">Phone</p>
          <a className="contact-item-value" href={`tel:${settings.phone.replace(/\s+/g, '')}`}>
            {settings.phone}
          </a>
        </div>
      )}
      {settings?.address && (
        <div className="contact-item">
          <p className="contact-item-label">Address</p>
          <p className="contact-item-value">{settings.address}</p>
        </div>
      )}
      {(settings?.social_links ?? []).length > 0 && (
        <div className="contact-item">
          <p className="contact-item-label">Follow us</p>
          <div className="socials">
            {settings!.social_links.map((social) => (
              <a key={social.url} href={social.url} target="_blank" rel="noopener noreferrer" className="tag">
                {social.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </Reveal>
  );

  const form = (
    <Reveal delay={80} variant="tilt3d">
      <ContactForm />
    </Reveal>
  );

  const sections = {
    details,
    form,
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={blocks?.['contact.title'] ?? 'Contact us.'}
        subtitle={blocks?.['contact.subtitle'] ?? ''}
      />
      <section className="section section-canvas">
        <div className="contact-grid">
          <PageSections page="contact" sections={sections} />
        </div>
      </section>
    </>
  );
}
