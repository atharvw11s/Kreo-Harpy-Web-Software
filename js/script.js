// Basic UI navigation for tabs and pages

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      setActiveTab(tab.dataset.tab);
    });
  });

  // Profile switching under DPI tab
  document.querySelectorAll('.dpi-profiles button').forEach(profileBtn => {
    profileBtn.addEventListener('click', () => {
      setActiveProfile(profileBtn.dataset.profile);
    });
  });

  // Polling rate change
  document.querySelectorAll('input[name="polling"]').forEach(radio => {
    radio.addEventListener('change', e => {
      console.log("Polling rate set to", e.target.value);
      // you can save or process the polling rate here
    });
  });

  // Back to dashboard button
  document.getElementById('back-to-dashboard').addEventListener('click', e => {
    e.preventDefault();
    setPage('dashboard');
  });

  // Initialize UI
  setActiveTab('dpi');
  setActiveProfile('general');
  setPage('dashboard');
  updateDPIValues('general');
});

function setPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

// Tab management
function setActiveTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(tabContent => {
    tabContent.classList.toggle('active', tabContent.id === tabId);
  });
}

// Profile management
let currentProfile = 'general';
function setActiveProfile(profileId) {
  currentProfile = profileId;
  document.querySelectorAll('.dpi-profiles button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.profile === profileId);
  });
  updateDPIValues(profileId);
}

// Sample DPI values for profiles
const dpiProfiles = {
  general: [800, 1600, 2400, 3200, 4000, 4800],
  fps: [400, 800, 1600, 3200, 6400, 12800],
  mmo: [600, 1200, 2400, 4800, 9600, 12800]
};

function updateDPIValues(profileId) {
  const container = document.getElementById('dpi-values');
  container.innerHTML = '';
  dpiProfiles[profileId].forEach((dpi, idx) => {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 200;
    input.max = 12800;
    input.step = 200;
    input.value = dpi;
    input.id = `dpi-stage-${idx+1}`;
    input.name = `dpi-stage-${idx+1}`;
    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = `Stage ${idx + 1}: `;

    const div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(input);

    container.appendChild(div);
  });
}

// WebUSB connection logic and device filtering

let harpyDevice = null;
const KREO_VID = 0x30fa;    // Replace with your actual
const KREO_PID = 0x1440;    // Replace with your actual

async function connectToMouse() {
  if (!navigator.usb) {
    alert('WebUSB not supported in this browser. Use Chrome or Edge.');
    return;
  }
  try {
    const device = await navigator.usb.requestDevice({
      filters: [{ vendorId: KREO_VID, productId: KREO_PID }]
    });
    harpyDevice = device;
    await harpyDevice.open();
    if (harpyDevice.configuration === null) {
      await harpyDevice.selectConfiguration(1);
    }
    await harpyDevice.claimInterface(0);

    updateConnectionStatus(true);
    document.getElementById('device-info').textContent = `Connected to: Vendor ID ${harpyDevice.vendorId.toString(16)}, Product ID ${harpyDevice.productId.toString(16)}`;
    document.getElementById('view-config-link').style.display = 'inline-block';
    setPage('config');
    document.getElementById('connect-usb-btn').textContent = 'Device Connected';
    document.getElementById('connect-usb-btn').disabled = true;
  } catch (error) {
    updateConnectionStatus(false);
    alert('Failed to connect: ' + error.message);
  }
}

function updateConnectionStatus(connected) {
  const dot = document.getElementById('connection-status-dot');
  const text = document.getElementById('connection-status-text');
  if (connected) {
    dot.classList.remove('disconnected');
    dot.classList.add('connected');
    text.textContent = 'Connected (USB)';
    text.classList.remove('disconnected');
    text.classList.add('connected');
  } else {
    dot.classList.remove('connected');
    dot.classList.add('disconnected');
    text.textContent = 'Disconnected';
    text.classList.remove('connected');
    text.classList.add('disconnected');
  }
}

