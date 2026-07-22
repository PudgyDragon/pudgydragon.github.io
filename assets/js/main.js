(() => {
  'use strict';

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#site-navigation');

  if (navToggle && nav) {
    const closeNav = () => {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
    };

    navToggle.addEventListener('click', () => {
      const opening = !nav.classList.contains('open');
      nav.classList.toggle('open', opening);
      navToggle.classList.toggle('active', opening);
      navToggle.setAttribute('aria-expanded', String(opening));
      navToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
  }

  const guideFilter = document.querySelector('#guide-filter');
  const projectFilter = document.querySelector('#project-filter');

  const filterGuides = () => {
    const query = (guideFilter?.value || '').trim().toLowerCase();
    const project = projectFilter?.value || '';

    document.querySelectorAll('#guide-list > a').forEach((item) => {
      const matchesQuery = !query || (item.dataset.search || '').toLowerCase().includes(query);
      const matchesProject = !project || item.dataset.project === project;
      item.hidden = !(matchesQuery && matchesProject);
    });
  };

  guideFilter?.addEventListener('input', filterGuides);
  projectFilter?.addEventListener('change', filterGuides);

  const searchInput = document.querySelector('#site-search');
  const results = document.querySelector('#search-results');
  const dataNode = document.querySelector('#search-data');

  if (searchInput && results && dataNode) {
    let items = [];
    try {
      items = JSON.parse(dataNode.textContent || '[]');
    } catch (error) {
      console.error('Unable to load the PudgyDragon search index.', error);
    }

    const clearResults = () => {
      results.replaceChildren();
      results.hidden = true;
    };

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query.length < 2) {
        clearResults();
        return;
      }

      const matches = items
        .filter((item) => `${item.title} ${item.meta} ${item.description || ''}`.toLowerCase().includes(query))
        .slice(0, 8);

      results.replaceChildren();

      if (!matches.length) {
        const empty = document.createElement('p');
        empty.className = 'search-empty';
        empty.textContent = 'No matching guides or projects found.';
        results.append(empty);
      } else {
        matches.forEach((item) => {
          const link = document.createElement('a');
          link.href = item.url;

          const meta = document.createElement('small');
          meta.textContent = item.meta || 'Knowledge base';

          const title = document.createElement('strong');
          title.textContent = item.title;

          link.append(meta, title);
          results.append(link);
        });
      }

      results.hidden = false;
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.search-wrap')) clearResults();
    });
  }
})();
