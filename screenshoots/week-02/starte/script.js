// ===============================
// CONFIGURACIÓN INICIAL
// ===============================

let projects = JSON.parse(localStorage.getItem("projects")) || [];

const form = document.getElementById("item-form");
const list = document.getElementById("item-list");
const emptyState = document.getElementById("empty-state");

const statTotal = document.getElementById("stat-total");
const statActive = document.getElementById("stat-active");
const statInactive = document.getElementById("stat-inactive");

const filterStatus = document.getElementById("filter-status");
const filterCategory = document.getElementById("filter-category");
const filterPriority = document.getElementById("filter-priority");
const searchInput = document.getElementById("search-input");

const cancelBtn = document.getElementById("cancel-btn");
const submitBtn = document.getElementById("submit-btn");

let editId = null;

// ===============================
// FUNCIONES PRINCIPALES
// ===============================

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function updateStats() {
  statTotal.textContent = projects.length;
  statActive.textContent = projects.filter(p => p.active).length;
  statInactive.textContent = projects.filter(p => !p.active).length;
}

function renderProjects() {
  list.innerHTML = "";

  let filtered = [...projects];

  const status = filterStatus.value;
  const category = filterCategory.value;
  const priority = filterPriority.value;
  const search = searchInput.value.toLowerCase();

  if (status !== "all") {
    filtered = filtered.filter(p => status === "active" ? p.active : !p.active);
  }

  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  if (priority !== "all") {
    filtered = filtered.filter(p => p.priority === priority);
  }

  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }

  if (filtered.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  filtered.forEach(project => {
    const div = document.createElement("div");
    div.className = "item-card";

    div.innerHTML = `
      <h3>${project.name}</h3>
      <p>${project.description || "Sin descripción"}</p>
      <div class="item-meta">
        <span>📂 ${project.category}</span>
        <span>⚡ ${project.priority}</span>
        <span>${project.active ? "🟢 Activo" : "⚪ Finalizado"}</span>
      </div>
      <div class="item-actions">
        <button onclick="toggleStatus('${project.id}')">🔄</button>
        <button onclick="editProject('${project.id}')">✏️</button>
        <button onclick="deleteProject('${project.id}')">🗑️</button>
      </div>
    `;

    list.appendChild(div);
  });

  updateStats();
  saveProjects();
}

// ===============================
// EVENTOS
// ===============================

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("item-name").value.trim();
  const description = document.getElementById("item-description").value.trim();
  const category = document.getElementById("item-category").value;
  const priority = document.getElementById("item-priority").value;

  if (!name) return;

  if (editId) {
    const project = projects.find(p => p.id === editId);
    project.name = name;
    project.description = description;
    project.category = category;
    project.priority = priority;
    editId = null;
    submitBtn.textContent = "Guardar Proyecto";
    cancelBtn.style.display = "none";
  } else {
    projects.push({
      id: Date.now().toString(),
      name,
      description,
      category,
      priority,
      active: true,
      created: new Date()
    });
  }

  form.reset();
  renderProjects();
});

cancelBtn.addEventListener("click", () => {
  form.reset();
  editId = null;
  submitBtn.textContent = "Guardar Proyecto";
  cancelBtn.style.display = "none";
});

filterStatus.addEventListener("change", renderProjects);
filterCategory.addEventListener("change", renderProjects);
filterPriority.addEventListener("change", renderProjects);
searchInput.addEventListener("input", renderProjects);

// ===============================
// FUNCIONES DE ACCIÓN
// ===============================

function deleteProject(id) {
  if (!confirm("¿Eliminar este proyecto?")) return;
  projects = projects.filter(p => p.id !== id);
  renderProjects();
}

function toggleStatus(id) {
  const project = projects.find(p => p.id === id);
  project.active = !project.active;
  renderProjects();
}

function editProject(id) {
  const project = projects.find(p => p.id === id);

  document.getElementById("item-name").value = project.name;
  document.getElementById("item-description").value = project.description;
  document.getElementById("item-category").value = project.category;
  document.getElementById("item-priority").value = project.priority;

  editId = id;
  submitBtn.textContent = "Actualizar Proyecto";
  cancelBtn.style.display = "inline-block";
}

// ===============================
// INICIO
// ===============================

renderProjects();
console.log("✅ App de Diseño Interior iniciada correctamente");