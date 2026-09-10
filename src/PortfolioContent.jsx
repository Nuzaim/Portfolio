import PropTypes from 'prop-types';
import { education, experienceHighlights, projects, skillGroups } from './content/portfolio';
import portrait from './assets/Nuzaim_Noushad_Thappi.png';

export default function PortfolioContent({ section }) {
  if (section === 'experience') return <>
    <div className="cardTopline"><h3>Software Engineer <span>· Turbolab Technologies</span></h3><span>June 2024 — Aug 2026</span></div>
    <p className="sectionLead">Professional contributions delivered as part of engineering teams.</p>
    <ul className="experienceList">{experienceHighlights.map(item => <li key={item}>{item}</li>)}</ul>
  </>;
  if (section === 'projects') return <div className="projectGrid">{projects.map((item, index) => <a className="projectCard" href={item.link} key={item.id}>
    <span className="cardIndex">{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.description}</p><span className="cardLink">View project ↗</span>
  </a>)}</div>;
  if (section === 'knowledge') return <><h3>Skills</h3><div className="skillsGrid">{skillGroups.map(group => <div key={group.title} className="skillsCard"><h4>{group.title}</h4><p>{group.items.join(' • ')}</p></div>)}</div><div className="educationStrip"><h3>Education</h3>{education.map(entry => <p key={entry}>{entry}</p>)}</div></>;
  if (section === 'contact') return <><div className="contactBody"><img src={portrait} alt="Nuzaim Noushad Thappi" loading="lazy" /><div><h3>About me</h3><p>Backend-focused software engineer with hands-on experience building distributed systems, event-driven pipelines, and automation tooling. I enjoy solving reliability and scalability challenges across scraping platforms, CI/CD workflows, and cloud-native services.</p><p>Reach out at <a href="mailto:nuzaim.t123@gmail.com">nuzaim.t123@gmail.com</a> or connect on <a href="https://linkedin.com/in/nuzaim" target="_blank" rel="noreferrer">LinkedIn</a>.</p></div></div><div className="socialLinks"><a href="https://github.com/nuzaim" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://twitter.com/nuzaim_noushad" target="_blank" rel="noreferrer">Twitter ↗</a><a href="mailto:nuzaim.t123@gmail.com">Email ↗</a></div></>;
  return <><p>This workspace uses freely licensed models, adapted to a grayscale palette.</p><ul className="creditsList"><li><a href="https://dmmotionarts.com/product/retro-computer-3d-model-free-download/">Retro Computer — DMmotionarts</a>. Personal and commercial use with attribution. Background removed; geometry optimized; materials adapted.</li><li><a href="https://polyhaven.com/a/metal_office_desk">Metal Office Desk — Ulan Cabanilla / Poly Haven</a>.</li><li><a href="https://polyhaven.com/a/book_encyclopedia_set_01">Book Encyclopedia Set 01 — John Malcolm / Poly Haven</a>.</li><li><a href="https://polyhaven.com/a/vintage_telephone_wall_clock">Vintage Telephone Wall Clock — Adrian C / Poly Haven</a>.</li></ul><p>Poly Haven models are <a href="https://polyhaven.com/license">CC0</a>. Textures resized to 512px, color textures converted to grayscale, geometry simplified, and models scaled for this composition.</p></>;
}
PortfolioContent.propTypes = { section: PropTypes.string.isRequired };
