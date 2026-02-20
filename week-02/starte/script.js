// ============================================
// ESTADO GLOBAL
// ============================================

let items = [];
let editingItemId = null;

// ============================================
// CATEGORÍAS DEL DOMINIO
// ============================================

const CATEGORIES = {
  interior: { name: 'Diseño Interior', emoji: '🛋️' },
  inmobiliaria: { name: 'Inmobiliaria', emoji: '🏠' },
  construccion: { name: 'Construcción', emoji: '🏗️' },
  remodelacion: { name: 'Remodelación', emoji: '🔨' }
};

const PRIORITIES = {
  high: { name: 'Alta', color: '#dc2626' },
  medium: { name: 'Media', color: '#f59e0b' },
  low: { name: 'Baja', color: '#16a34a' },
};

// ============================================
// PERSISTENCIA
// ============================================

const loadItems = () =>
  JSON.parse(localStorage.getItem('interiorProjects') ?? '[]');

const saveItems = itemsToSave =>
  localStorage.setItem('interiorProjects', JSON.stringify(itemsToSave));

// ============================================
// CRUD
// ============================================

const createItem = (itemData = {}) => {
  const newItem = {
    id: Date.now(),
    name: itemData.name ?? '',
    description: itemData.description ?? '',
    category: itemData.category ?? 'interior',
    priority: itemData.priority ?? 'medium',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  const newItems = [...items, newItem];
  saveItems(newItems);
  return newItems;
};

const updateItem = (id, updates) => {
  const updatedItems = items.map(item =>
    item.id === id
      ? { ...item, ...updates, updatedAt: new Date().toISOString() }
      : item
  );
  saveItems(updatedItems);
  return updatedItems;
};

const deleteItem = id => {
  const filtered = items.filter(item => item.id !== id);
  saveItems(filtered);
  return filtered;
};

const toggleItemActive = id => {
  const updated = items.map(item =>
    item.id === id
      ? { ...item, active: !item.active, updatedAt: new Date().toISOString() }
      : item
  );
  saveItems(updated);
  return updated;
};

const clearInactive = () => {
  const activeItems = items.filter(item => item.active);
  saveItems(activeItems);
  return activeItems;
};

// ============================================
// FILTROS
// ============================================

const filterByStatus = (itemsToFilter, status = 'all') => {
  if (status === 'active') return itemsToFilter.filter(i => i.active);
  if (status === 'inactive') return itemsToFilter.filter(i => !i.active);
  return itemsToFilter;
};

const filterByCategory = (itemsToFilter, category = 'all') =>
  category === 'all'
    ? itemsToFilter
    : itemsToFilter.filter(i => i.category === category);

const filterByPriority = (itemsToFilter, priority = 'all') =>
  priority === 'all'
    ? itemsToFilter
    : itemsToFilter.filter(i => i.priority === priority);

const searchItems = (itemsToFilter, query = '') => {
  if (!query.trim()) return itemsToFilter;
  const q = query.toLowerCase();
  return itemsToFilter.filter(i =>
    i.name.toLowerCase().includes(q) ||
    (i.description ?? '').toLowerCase().includes(q)
  );
};

const applyFilters = (itemsToFilter, filters = {}) => {
  const {
    status = 'all',
    category = 'all',
    priority = 'all',
    search = ''
  } = filters;

  return searchItems(
    filterByPriority(
      filterByCategory(
        filterByStatus(itemsToFilter, status),
        category
      ),
      priority
    ),
    search
  );
};

// ============================================
// ESTADÍSTICAS
// ============================================

const getStats = (itemsToAnalyze = []) => {
  const total = itemsToAnalyze.length;
  const active = itemsToAnalyze.filter(i => i.active).length;
  const inactive = total - active;

  const byCategory = itemsToAnalyze.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  const byPriority = itemsToAnalyze.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] ?? 0) + 1;
    return acc;
  }, {});

  return { total, active, inactive, byCategory, byPriority };
};

// ============================================
// RENDER
// ============================================

const getCategoryEmoji = category =>
  CATEGORIES[category]?.emoji ?? '📌';

const formatDate = date =>
  new Date(date).toLocaleDateString('es-CO');

const renderItem = item => {
  const { id, name, description, category, priority, active, createdAt } = item;

  return `
    <div class="project-item ${!active ? 'completed' : ''} priority-${priority}" data-item-id="${id}">
      <input type="checkbox" class="item-checkbox" ${active ? 'checked' : ''}>
      <div>
        <h3>${name}</h3>
        ${description ? `<p>${description}</p>` : ''}
        <div>
          <span>${getCategoryEmoji(category)} ${CATEGORIES[category].name}</span> |
          <span>${PRIORITIES[priority].name}</span> |
          <span>📅 ${formatDate(createdAt)}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-edit">✏️</button>
        <button class="btn-delete">🗑️</button>
      </div>
    </div>
  `;
};

const renderItems = itemsToRender => {
  const list = document.getElementById('item-list');
  const empty = document.getElementById('empty-state');

  if (itemsToRender.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    list.innerHTML = itemsToRender.map(renderItem).join('');
  }
};

const renderStats = stats => {
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-active').textContent = stats.active;
  document.getElementById('stat-inactive').textContent = stats.inactive;

  const detail = document.getElementById('stats-details');

  detail.innerHTML = Object.entries(stats.byCategory)
    .map(([cat, count]) =>
      `<div class="stat-card"><h4>${CATEGORIES[cat].name}</h4><p>${count}</p></div>`
    ).join('');
};

// ============================================
// EVENTOS
// ============================================

const handleFormSubmit = e => {
  e.preventDefault();

  const name = document.getElementById('item-name').value.trim();
  const description = document.getElementById('item-description').value.trim();
  const category = document.getElementById('item-category').value;
  const priority = document.getElementById('item-priority').value;

  if (!name) return alert('El nombre es obligatorio');

  const data = { name, description, category, priority };

  items = editingItemId
    ? updateItem(editingItemId, data)
    : createItem(data);

  resetForm();
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

const handleItemToggle = id => {
  items = toggleItemActive(id);
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

const handleItemEdit = id => {
  const item = items.find(i => i.id === id);
  if (!item) return;

  document.getElementById('item-name').value = item.name;
  document.getElementById('item-description').value = item.description ?? '';
  document.getElementById('item-category').value = item.category;
  document.getElementById('item-priority').value = item.priority;

  document.getElementById('form-title').textContent = '✏️ Editar Proyecto';
  document.getElementById('submit-btn').textContent = 'Actualizar';
  document.getElementById('cancel-btn').style.display = 'inline-block';

  editingItemId = id;
};

const handleItemDelete = id => {
  if (!confirm('¿Eliminar este proyecto?')) return;
  items = deleteItem(id);
  renderItems(applyCurrentFilters());
  renderStats(getStats(items));
};

const getCurrentFilters = () => ({
  status: document.getElementById('filter-status').value,
  category: document.getElementById('filter-category').value,
  priority: document.getElementById('filter-priority').value,
  search: document.getElementById('search-input').value
});

const applyCurrentFilters = () =>
  applyFilters(items, getCurrentFilters());

const handleFilterChange = () =>
  renderItems(applyCurrentFilters());

const resetForm = () => {
  document.getElementById('item-form').reset();
  document.getElementById('form-title').textContent = '➕ Nuevo Proyecto';
  document.getElementById('submit-btn').textContent = 'Crear';
  document.getElementById('cancel-btn').style.display = 'none';
  editingItemId = null;
};

// ============================================
// EVENT LISTENERS
// ============================================

const attachEventListeners = () => {
  document.getElementById('item-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancel-btn').addEventListener('click', resetForm);

  ['filter-status', 'filter-category', 'filter-priority', 'search-input']
    .forEach(id => document.getElementById(id).addEventListener('input', handleFilterChange));

  document.getElementById('clear-inactive').addEventListener('click', () => {
    if (confirm('¿Eliminar proyectos inactivos?')) {
      items = clearInactive();
      renderItems(items);
      renderStats(getStats(items));
    }
  });

  document.getElementById('item-list').addEventListener('click', e => {
    const el = e.target.closest('.project-item');
    if (!el) return;

    const id = Number(el.dataset.itemId);

    if (e.target.classList.contains('item-checkbox')) handleItemToggle(id);
    if (e.target.classList.contains('btn-edit')) handleItemEdit(id);
    if (e.target.classList.contains('btn-delete')) handleItemDelete(id);
  });
};

// ============================================
// INIT
// ============================================

const init = () => {
  items = loadItems();
  renderItems(items);
  renderStats(getStats(items));
  attachEventListeners();
  console.log('✅ App de Diseño Interior inicializada');
};

document.addEventListener('DOMContentLoaded', init);