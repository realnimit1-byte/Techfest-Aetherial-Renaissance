import './styles.css';
import { createExperience } from './experience.js';
import { setupInterface } from './ui.js';

const host = document.querySelector('#scene');
const fallback = document.querySelector('#webgl-fallback');
try {
  let ui;
  const experience = createExperience(host, data => ui?.onSelect(data));
  ui = setupInterface(experience);
  if (!host.querySelector('canvas')) fallback.hidden = false;
  window.addEventListener('pagehide', () => { ui.dispose(); experience.dispose(); }, { once: true });
} catch (error) {
  console.warn('WebGL experience could not start; showing the accessible story fallback.', error);
  fallback.hidden = false;
  setupInterface({ update() {}, select() {} });
}
