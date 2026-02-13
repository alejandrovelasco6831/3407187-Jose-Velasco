/* ============================================
   PROYECTO SEMANA 01 - FICHA DE INFORMACIÓN INTERACTIVA
   DOMINIO: DISEÑO DE INTERIORES, INMOBILIARIA Y CONSTRUCCIÓN
   EMPRESA: Velasco Elite Homes
   ============================================ */

const entityData = {
  name: 'Velasco Elite Homes',
  description: 'Más que espacios, creamos lugares donde nacen historias. Somos una empresa especializada en diseño de interiores, construcción y asesoría inmobiliaria. Transformamos espacios en lugares modernos, funcionales y con alto valor estético.',
  identifier: 'VEH-001',

  contact: {
    email: 'velascoehomes1@gmail.com',
    phone: '3114791721',
    location: 'Carrera 7 #28-66, Bogotá, Colombia'
  },

  items: [
    { name: 'Construcción y remodelación', level: 95, category: 'Construcción' },
    { name: 'Diseño de interiores', level: 98, category: 'Diseño' },
    { name: 'Planos arquitectónicos', level: 90, category: 'Arquitectura' },
    { name: 'Asesoría inmobiliaria', level: 92, category: 'Inmobiliaria' },
    { name: 'Decoración', level: 88, category: 'Diseño' },
    { name: 'Optimización de espacios', level: 93, category: 'Diseño' }
  ],

  links: [
    { platform: 'Facebook', url: 'https://facebook.com', icon: '📘', text: 'Velasco Élite Ginés' },
    { platform: 'TikTok', url: 'https://tiktok.com/@velascoelitegines', icon: '🎵', text: '@velascoelitegines' }
  ],

  stats: {
    total: 150,
    active: 30,
    rating: 98,
    experience: 10
  }
};

// ================= DOM =================

const entityName = document.getElementById('userName');
const entityDescription = document.getElementById('userBio');
const entityLocation = document.getElementById('userLocation');
const entityEmail = document.getElementById('userEmail');
const entityPhone = document.getElementById('userPhone');
const entityTitle = document.getElementById('userTitle');

const itemsList = document.getElementById('skillsList');
const statsContainer = document.getElementById('stats');
const linksContainer = document.getElementById('socialLinks');

const themeToggle = document.getElementById('themeToggle');
const copyBtn = document.getElementById('copyEmailBtn');
const toggleItemsBtn = document.getElementById('toggleSkills');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ================= RENDER =================

const renderBasicInfo = () => {
  const { name, description, contact: { email, phone, location } } = entityData;

  entityName.textContent = name;
  entityTitle.textContent = 'Diseño de Interiores | Inmobiliaria | Construcción';
  entityDescription.textContent = description;
  entityLocation.textContent = `📍 ${location}`;
  entityEmail.textContent = email;
  entityPhone.textContent = phone;
};

const renderItems = (showAll = false) => {
  const { items } = entityData;
  const itemsToShow = showAll ? items : items.slice(0, 4);

  itemsList.innerHTML = itemsToShow.map(({ name, level }) => `
    <span>${name}</span>
  `).join('');
};

const renderLinks = () => {
  const { links } = entityData;

  linksContainer.innerHTML = links.map(({ url, icon, text }) => `
    <a href="${url}" target="_blank">${icon} ${text}</a>
  `).join('');
};

const renderStats = () => {
  const { stats } = entityData;

  const statsArray = [
    { label: 'Proyectos completados', value: `+${stats.total}` },
    { label: 'Satisfacción del cliente', value: `${stats.rating}%` },
    { label: 'Años de experiencia', value: stats.experience }
  ];

  statsContainer.innerHTML = statsArray.map(({ label, value }) => `
    <div class="stat">
      <strong>${value}</strong><br>${label}
    </div>
  `).join('');
};

// ================= FUNCIONES =================

const toggleTheme = () => {
  const currentTheme = document.documentElement.dataset.theme ?? 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.dataset.theme = newTheme;
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', newTheme);
};

const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') ?? 'light';
  document.documentElement.dataset.theme = savedTheme;
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
};

const copyInfo = () => {
  const { name, contact: { email, phone } } = entityData;
  const text = `${name}\nCorreo: ${email}\nTeléfono: ${phone}`;

  navigator.clipboard.writeText(text);
  showToast('Datos copiados correctamente 📋');
};

const showToast = message => {
  toastMessage.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2500);
};

let showingAllItems = false;

const handleToggleItems = () => {
  showingAllItems = !showingAllItems;
  renderItems(showingAllItems);
  toggleItemsBtn.textContent = showingAllItems ? 'Mostrar menos' : 'Mostrar más';
};

// ================= EVENTOS =================

themeToggle.addEventListener('click', toggleTheme);
copyBtn.addEventListener('click', copyInfo);
toggleItemsBtn.addEventListener('click', handleToggleItems);

// ================= INIT =================

const init = () => {
  loadTheme();
  renderBasicInfo();
  renderItems();
  renderLinks();
  renderStats();
  console.log('✅ Velasco Elite Homes funcionando correctamente');
};

init();

