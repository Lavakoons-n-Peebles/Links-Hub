// Evaluates the icon field string format and returns valid element HTML template
function getIconHtml(iconSource) {
    const defaultIconClass = "fas fa-link"; 
    
    if (!iconSource) {
        return `<i class="${defaultIconClass} link-icon-fa"></i>`;
    }

    const isUrl = iconSource.startsWith('http://') || iconSource.startsWith('https://') || iconSource.includes('/');

    if (isUrl) {
        return `<img class="link-icon-img" src="${iconSource}" alt="icon">`;
    } else {
        return `<i class="${iconSource} link-icon-fa"></i>`;
    }
}

// Injects dynamic SEO parameters into document head
function applyMeta(metaData) {
    if (!metaData) return;
    
    if (metaData.title) document.title = metaData.title;
    
    const descTag = document.getElementById('meta-description');
    if (descTag && metaData.description) descTag.setAttribute('content', metaData.description);
    
    const keywordsTag = document.getElementById('meta-keywords');
    if (keywordsTag && metaData.keywords) keywordsTag.setAttribute('content', metaData.keywords);
}

// Renders profile header section from config node
function renderHeader(profileData) {
    const headerElement = document.getElementById('profile-header');
    headerElement.innerHTML = `
        <img class="profile-avatar" src="${profileData.avatar}" alt="${profileData.name}">
        <h1 class="profile-name clay-text clay-btn brend-neon-light">${profileData.name}</h1>
        <p class="profile-bio">${profileData.bio}</p>
    `;
}

function renderDashboard(data) {
    applyMeta(data.meta);
    renderHeader(data.profile);

    const container = document.getElementById('content-container');
    container.innerHTML = '';

    data.categories.forEach(group => {
        const visibleLinks = group.links.filter(link => link.hidden !== true);
        if (visibleLinks.length === 0) return;

        const groupSection = document.createElement('section');
        groupSection.className = 'group-section';

        const linksHtml = visibleLinks.map(link => {
            const isTodo = link.active === false;
            const todoClass = isTodo ? 'is-todo' : '';
            const todoBadge = isTodo ? '<div class="todo-badge">COMING SOON</div>' : '';
            
            // Keeps the link active if provided, fallback to javascript:void(0) only if empty
            const hasValidLink = link.link && link.link !== "#" && link.link !== "";
            const targetLink = hasValidLink ? link.link : 'javascript:void(0)';
            const targetBlank = hasValidLink ? 'target="_blank" rel="noopener noreferrer"' : '';

            return `
                <a href="${targetLink}" class="link-item is-${group.class} ${todoClass}" ${targetBlank} data-tooltip="${link.tooltip}">
                    ${todoBadge}
                    <div class="link-icon-container ${link.active ? `neon-light` : `light-off`}">
                        ${getIconHtml(link.icon)}
                    </div>
                    <div class="link-content">
                        <span class="link-text">${link.text}</span>
                        ${link.description ? `<span class="link-description">${link.description}</span>` : ''}
                    </div>
                </a>
            `;
        }).join('');

        groupSection.innerHTML = `
            <h2 class="group-title">${group.categoryTitle}</h2>
            <div class="links-list">
                ${linksHtml}
            </div>
        `;

        container.appendChild(groupSection);
    });
}

// Asynchronously load initialization data from external JSON file
async function loadConfig() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        renderDashboard(data);
    } catch (error) {
        console.error("Could not load initial data file:", error);
        document.getElementById('content-container').innerHTML = `<p style="text-align:center; opacity:0.5;">Failed to load data.</p>`;
    }
}

// Global initialization sequence binding
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
});

