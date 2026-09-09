// Reemplaza el valor por tu usuario público de GitHub.
const GITHUB_USERNAME = 'KhaledAle';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`;

const projectsGrid = document.querySelector('#projects-grid');
const projectsStatus = document.querySelector('#projects-status');
const githubProfile = document.querySelector('#github-profile');

function createProjectCard(repository, index) {
  const card = document.createElement('article');
  card.className = 'project-card';

  const number = document.createElement('span');
  number.className = 'project-index';
  number.textContent = `${String(index + 1).padStart(2, '0')} / PROYECTO`;

  const title = document.createElement('h3');
  title.textContent = repository.name;

  const description = document.createElement('p');
  description.textContent = repository.description || 'Este repositorio todavía no tiene una descripción.';

  const link = document.createElement('a');
  link.href = repository.html_url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = 'Ver repositorio ↗';
  link.setAttribute('aria-label', `Ver el repositorio ${repository.name} en GitHub`);

  card.append(number, title, description, link);
  return card;
}

function showProjectMessage(message) {
  const emptyMessage = document.createElement('p');
  emptyMessage.className = 'project-empty';
  emptyMessage.textContent = message;
  projectsGrid.replaceChildren(emptyMessage);
}

async function loadRepositories() {
  if (!GITHUB_USERNAME || GITHUB_USERNAME === '[TU_USUARIO]') {
    projectsStatus.textContent = 'Configura tu usuario para cargar proyectos.';
    githubProfile.hidden = true;
    showProjectMessage('Reemplaza [TU_USUARIO] en script.js por tu nombre de usuario de GitHub.');
    return;
  }

  githubProfile.href = `https://github.com/${GITHUB_USERNAME}`;

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: { Accept: 'application/vnd.github+json' }
    });

    if (!response.ok) {
      throw new Error(`GitHub respondió con el estado ${response.status}.`);
    }

    const repositories = await response.json();
    projectsGrid.replaceChildren(...repositories.map(createProjectCard));
    projectsStatus.textContent = `${repositories.length} repositorio${repositories.length === 1 ? '' : 's'} público${repositories.length === 1 ? '' : 's'}`;

    if (repositories.length === 0) {
      showProjectMessage('Todavía no hay repositorios públicos para mostrar.');
    }
  } catch (error) {
    projectsStatus.textContent = 'No se pudieron cargar los repositorios.';
    showProjectMessage('Revisa tu usuario de GitHub o vuelve a intentarlo más tarde.');
    console.error('Error al consultar la API de GitHub:', error);
  }
}

loadRepositories();
