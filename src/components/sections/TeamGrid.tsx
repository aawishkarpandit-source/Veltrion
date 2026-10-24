import { useAsync } from '../../lib/hooks';
import { getTeam, getTextBlocks } from '../../lib/content';
import Reveal from '../ui/Reveal';

export default function TeamGrid() {
  const { data: team } = useAsync(() => getTeam(), []);
  const { data: blocks } = useAsync(() => getTextBlocks(), []);

  return (
    <section className="section section-wash">
      <div className="section-inner">
        <Reveal className="section-head">
          <h2 className="heading">{blocks?.['about.team_title'] ?? 'Our team.'}</h2>
        </Reveal>

        <div className="grid-3">
          {(team ?? []).map((member, i) => (
            <Reveal key={member.id} delay={(i % 3) * 70}>
              <article className="member">
                <span className="avatar">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} />
                  ) : (
                    member.initials ||
                    member.name
                      .split(' ')
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join('')
                  )}
                </span>
                <div>
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  {member.bio && <p className="member-bio">{member.bio}</p>}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {blocks?.['about.org_note'] && (
          <Reveal delay={120}>
            <p className="org-note">{blocks['about.org_note']}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
