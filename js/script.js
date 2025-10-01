// Store the state of selected button etc
let selectedButtonId = null;

const buttonAssignments = {
    'LMB': 'Primary Click (Default)',
    'RMB': 'Secondary Click (Default)',
    'MWH': 'Scroll Wheel Click',
    'Side1': 'Forward',
    'Side2': 'Back',
    'DPI': 'DPI Cycle',
};

// --- WebUSB placeholders ---
let harpyDevice = null;
// Replace with real VID and PID
const VENDOR_ID = 0xABCD;
const PRODUCT_ID = 0x1234;

async function connectToMouse() {
    if (!navigator.usb) {
        alertModal('Error', 'WebUSB not supported in this browser.');
        return;
    }
    try {
        const device = await navigator.usb.requestDevice({
            filters: [{ vendorId: VENDOR_ID, productId: PRODUCT_ID }]
        });
        harpyDevice = device;
        await harpyDevice.open();

        if (!harpyDevice.configuration) {
            await harpyDevice.selectConfiguration(harpyDevice.configurations[0].configurationValue);
        }

        updateConnectionStatus(true);
        document.getElementById('connect-usb-btn').textContent = 'Connected!';
        document.getElementById('connect-usb-btn').disabled = true;
    } catch (error) {
        updateConnectionStatus(false);
        alertModal('Failed to connect', error.message);
    }
}

function updateConnectionStatus(isConnected) {
    const dot = document.getElementById('connection-status-dot');
    const text = document.getElementById('connection-status-text');

    if (isConnected) {
        dot.classList.remove('bg-gray-500');
        dot.classList.add('bg-kreo-connected');
        text.classList.remove('text-gray-400');
        text.classList.add('text-kreo-connected');
        text.textContent = 'Connected (USB)';
    } else {
        dot.classList.remove('bg-kreo-connected');
        dot.classList.add('bg-gray-500');
        text.classList.remove('text-kreo-connected');
        text.classList.add('text-gray-400');
        text.textContent = 'Disconnected';
    }
}

function alertModal(title, message) {
    console.warn(`[UI Alert - ${title}]: ${message}`);
}

// UI Navigation Functions: switchTab, switchProfile, switchPolling, selectButton, etc.
// (Include all the functions you pasted in your code similarly here)

// Initialize the UI on window load (replicate your window.onload logic)
window.onload = () => {
    const defaultTab = document.querySelector('.tab-label[data-tab-name="buttons"]');
    if (defaultTab) {
        switchTab('buttons', defaultTab);
    }

    // Set initial polling and profile defaults with your logic...

    // Show device visibility based on hash (#config-page)
    if (window.location.hash === '#config-page') {
        document.getElementById('config-page').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    }
};
