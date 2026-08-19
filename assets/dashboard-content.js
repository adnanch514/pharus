(async function () {
  const api = 'https://flpuq34d.api.sanity.io/v2025-02-19/data/query/production?query=';
  const query = encodeURIComponent('*[_type in ["homePage","standardsPage","valuesPage","servicesPage","contactPage","siteSettings"]]');
  const imageUrl = (image) => {
    if (!image || !image.asset || !image.asset._ref) return '';
    const parts = image.asset._ref.split('-');
    const extension = parts.pop();
    parts.shift();
    return `https://cdn.sanity.io/images/flpuq34d/production/${parts.join('-')}.${extension}`;
  };
  const paragraphs = (value) => (value || '').split(/\n\s*\n|\n/).filter(Boolean).map((p) => `<p>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('');
  const setImage = (selector, image) => {
    const url = imageUrl(image);
    if (url) document.querySelectorAll(selector).forEach((el) => { el.src = url; });
  };
  try {
    const response = await fetch(api + query);
    const {result = []} = await response.json();
    const byType = Object.fromEntries(result.map((item) => [item._type, item]));
    const home = byType.homePage;
    if (home) {
      const area = document.querySelector('.o-home-banner .left-part .content-area');
      if (area && home.intro) area.innerHTML = paragraphs(home.intro);
      setImage('.o-home-banner img', home.heroImage);
    }
    const standards = byType.standardsPage;
    if (standards) {
      const vision = document.querySelector('.o-standards-banner .left-area p');
      const mission = document.querySelector('.o-standards-banner .right-area');
      if (vision && standards.vision) vision.textContent = standards.vision;
      if (mission && standards.mission) mission.innerHTML = '<h3>MISSION STATEMENT</h3>' + paragraphs(standards.mission);
      setImage('.o-standards-banner img', standards.image);
    }
    const values = byType.valuesPage;
    if (values) {
      const area = document.querySelector('.o-values-banner .content-area');
      if (area) {
        const direct = area.querySelector(':scope > p');
        const items = area.querySelectorAll('.inner-content p');
        if (direct && values.introduction) direct.textContent = values.introduction;
        if (items[0] && values.quality) items[0].textContent = values.quality;
        if (items[1] && values.innovation) items[1].textContent = values.innovation;
      }
      setImage('.o-values-banner img', values.image);
    }
    const contact = byType.contactPage;
    if (contact) {
      const address = document.querySelector('.o-contact-banner .left-area p');
      const email = document.querySelector('.o-contact-banner .right-area p');
      if (address && contact.address) address.textContent = contact.address;
      if (email && contact.email) email.textContent = contact.email;
    }
    const services = byType.servicesPage;
    if (services && Array.isArray(services.services)) {
      document.querySelectorAll('.service-column').forEach((column, index) => {
        const item = services.services[index];
        if (!item) return;
        const heading = column.querySelector('.head');
        const description = column.querySelector('p');
        const icon = column.querySelector('.service-icon img');
        if (heading && item.name) heading.textContent = item.name;
        if (description && item.description) description.textContent = item.description;
        const url = imageUrl(item.icon);
        if (icon && url) icon.src = url;
      });
    }
  } catch (error) { console.warn('Dashboard content could not load yet.', error); }
})();