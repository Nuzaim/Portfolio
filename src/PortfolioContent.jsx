import PropTypes from 'prop-types';
import { education, experienceHighlights, projects, skillGroups } from './content/portfolio';
import portrait from './assets/IMG_9613.jpeg';

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
  if (section === 'contact') return <><div className="contactBody"><img src={portrait} alt="Nuzaim Noushad Thappi" loading="lazy" /><div><h3>About me</h3><p>Backend-focused software engineer with hands-on experience building distributed systems, event-driven pipelines, and automation tooling. I enjoy solving reliability and scalability challenges across scraping platforms, CI/CD workflows, and cloud-native services.</p><p>Reach out at <a href="mailto:nuzaim.t123@gmail.com">nuzaim.t123@gmail.com</a> or connect on <a href="https://linkedin.com/in/nuzaim" target="_blank" rel="noreferrer">LinkedIn</a>.</p></div></div><div className="socialLinks"><a href="https://github.com/nuzaim" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://twitter.com/nuzaim_noushad" target="_blank" rel="noreferrer">Twitter ↗</a><a href="mailto:nuzaim.t123@gmail.com">Email ↗</a><a href="https://linkedin.com/in/nuzaim" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></>;
  return <><p>This workspace uses low-poly models from Polyfork and Kenney, styled in warm neutrals and muted sage.</p><ul className="creditsList"><li><a href="https://polyfork.dev/asset/sit-stand-desk-3ff7b8">Sit-Stand Desk — Polyfork</a>. Free remixable asset.</li><li><a href="https://polyfork.dev/asset/laptop-e775ba">Laptop — Polyfork</a>. Preview GLB, used for Experience.</li><li><a href="https://polyfork.dev/asset/small-server-rack-8ae0a4">Small Server Rack — Polyfork</a>. Preview GLB, used for Projects.</li><li><a href="https://polyfork.dev/asset/exercise-book-stack-266d9d">Exercise Book Stack — Polyfork</a>. Used for Knowledge.</li><li><a href="https://polyfork.dev/asset/smartphone-5f05e5">Smartphone — Polyfork</a>. Used for Contact.</li><li><a href="https://kenney.nl/assets/furniture-kit">Plant and table lamp — Kenney Furniture Kit</a>. CC0; recolored and scaled.</li><li><a href="https://kenney.nl/assets/food-kit">Ceramic cup — Kenney Food Kit</a>. CC0; recolored and scaled.</li></ul><p>All models are kept local for reliable loading. The desk mat is original scene geometry.</p></>;
}
PortfolioContent.propTypes = { section: PropTypes.string.isRequired };
