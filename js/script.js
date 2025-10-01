// Store the state of the currently selected button
let selectedButtonId = null; 

// Initial button assignments (mock data)
const buttonAssignments = {
    'LMB': 'Primary Click (Default)',
    'RMB': 'Secondary Click (Default)',
    'MWH': 'Scroll Wheel Click',
    'Side1': 'Forward',
    'Side2': 'Back',
    'DPI': 'DPI Cycle',
};

// --- WEBUSB FUNCTIONS (Placeholders for GitHub Pages implementation) ---
let harpyDevice = null;
// NOTE: These are placeholders. Replace with your actual mouse's IDs.
const VENDOR_ID = 0xABCD; 
const PRODUCT_ID = 0x1234; 

async function connectToMouse() {
    if (!navigator.usb) {
        // Using a custom UI function instead of alert()
        alertModal('Error', 'WebUSB is not supported in this browser. Please use Chrome, Edge, or Opera over HTTPS.');
        return;
    }

    try {
        // Request the device from the user (requires user click)
        const device = await navigator.usb.requestDevice({
            filters: [{ vendorId: VENDOR_ID, productId: PRODUCT_ID }]
        });
        
        harpyDevice = device;
        await harpyDevice.open();
        
        if (harpyDevice.configuration === null) {
            await harpyDevice.selectConfiguration(harpyDevice.configurations[0].configurationValue);
        }
        
        // You would need to determine the correct interface number (e.g., 0)
        // await harpyDevice.claimInterface(0); 
        
        updateConnectionStatus(true);
        document.getElementById('connect-usb-btn').textContent = 'Connected!';
        document.getElementById('connect-usb-btn').disabled = true;

    } catch (error) {
        updateConnectionStatus(false);
        console.error("WebUSB connection failed:", error);
        alertModal('Connection Failed', `Could not connect to the device. Error: ${error.message}`);
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
    // Placeholder for a proper UI modal
    console.warn(`[UI Alert - ${title}]: ${message}`);
}

// --- UI NAVIGATION FUNCTIONS ---

function switchTab(activeTab, clickedElement) {
    document.querySelectorAll('.tab-content').forEach(panel => {
        panel.style.display = 'none';
    });

    const activePanel = document.querySelector(`.tab-content[data-tab="${activeTab}"]`);
    if (activePanel) {
        activePanel.style.display = 'block';
    }

    document.querySelectorAll('.tab-label').forEach(label => {
        label.classList.remove('bg-kreo-accent', 'font-semibold', 'text-white');
        label.classList.add('bg-gray-800', 'hover:bg-gray-700', 'text-gray-200');
    });
    
    if (clickedElement) {
        clickedElement.classList.add('bg-kreo-accent', 'font-semibold', 'text-white');
        clickedElement.classList.remove('bg-gray-800', 'hover:bg-gray-700', 'text-gray-200');
    }

    if (activeTab === 'dpi') {
        const defaultProfile = document.querySelector('.profile-label[data-profile-name="general"]');
        const defaultPolling = document.querySelector('.polling-label[data-rate="1000Hz"]');
        if (defaultProfile) switchProfile('general', defaultProfile);
        if (defaultPolling) switchPolling('1000Hz', defaultPolling);
    }
    
    if (activeTab !== 'buttons') {
        clearButtonSelection();
    }
}

function switchProfile(activeProfile, clickedElement) {
    document.querySelectorAll('.profile-content').forEach(panel => {
        panel.style.display = 'none';
    });

    const activePanel = document.querySelector(`.profile-content[data-profile="${activeProfile}"]`);
    if (activePanel) {
        activePanel.style.display = 'block';
    }

    document.querySelectorAll('.profile-label').forEach(label => {
        label.classList.remove('bg-kreo-accent', 'font-semibold', 'text-white');
        label.classList.add('bg-gray-700', 'hover:bg-gray-600', 'text-gray-200');
    });

    if (clickedElement) {
        clickedElement.classList.add('bg-kreo-accent', 'font-semibold', 'text-white');
        clickedElement.classList.remove('bg-gray-700', 'hover:bg-gray-600', 'text-gray-200');
    }
}

function switchPolling(activeRate, clickedElement) {
    document.querySelectorAll('.polling-label').forEach(label => {
        label.classList.remove('bg-kreo-accent', 'font-semibold', 'text-white');
        label.classList.add('bg-gray-700', 'hover:bg-gray-600', 'text-gray-200');
    });

    if (clickedElement) {
        clickedElement.classList.add('bg-kreo-accent', 'font-semibold', 'text-white');
        clickedElement.classList.remove('bg-gray-700', 'hover:bg-gray-600', 'text-gray-200');
    }
    console.log(`Polling Rate set to: ${activeRate}`);
}

// --- BUTTON MAPPING FUNCTIONS ---

function clearButtonSelection() {
    document.querySelectorAll('.mouse-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    selectedButtonId = null;
    document.getElementById('current-button-label').textContent = 'None Selected';
    document.getElementById('current-assignment-label').textContent = 'Current Action: N/A';
    document.getElementById('remap-controls').style.display = 'none';
    document.getElementById('key-input').value = '';
}

function selectButton(buttonId, clickedElement) {
    clearButtonSelection();

    selectedButtonId = buttonId;
    clickedElement.classList.add('selected');

    const buttonNameMap = {
        'LMB': 'Left Mouse Button',
        'RMB': 'Right Mouse Button',
        'MWH': 'Scroll Click',
        'Side1': 'Side Button 1 (Forward)',
        'Side2': 'Side Button 2 (Back)',
        'DPI': 'DPI Switch Button'
    };

    document.getElementById('current-button-label').textContent = buttonNameMap[buttonId] || buttonId;
    document.getElementById('current-assignment-label').textContent = `Current Action: ${buttonAssignments[buttonId]}`;
    document.getElementById('remap-controls').style.display = 'block';
    document.getElementById('key-input').focus();
}

function captureKey(event) {
    event.preventDefault(); 
    
    const inputField = event.target;
    let keyString = '';

    if (event.ctrlKey) keyString += 'Ctrl+';
    if (event.shiftKey) keyString += 'Shift+';
    if (event.altKey) keyString += 'Alt+';
    
    if (event.key === ' ') {
        keyString += 'Space';
    } else if (event.key.length === 1 || event.key.startsWith('F') || event.key === 'Enter' || event.key === 'Tab') {
        if (!event.ctrlKey && !event.shiftKey && !event.altKey || event.key.length === 1) {
            keyString += event.key.toUpperCase();
        } else if (event.key.toUpperCase() !== 'CONTROL' && event.key.toUpperCase() !== 'SHIFT' && event.key.toUpperCase() !== 'ALT') {
            keyString += event.key.toUpperCase();
        }
    } else if (event.code.startsWith('Arrow')) {
        keyString += event.code.replace('Arrow', '');
    }

    if (keyString.endsWith('+')) {
        keyString = keyString.slice(0, -1);
    }
    
    if (keyString) {
        inputField.value = keyString;
    } else {
        inputField.value = event.key.toUpperCase();
    }

    return false;
}


// --- INITIALIZATION ---
window.onload = () => {
    // Set Button Mapping tab as active by default (based on last interaction)
    const defaultTab = document.querySelector('.tab-label[data-tab-name="buttons"]');
    if (defaultTab) {
        switchTab('buttons', defaultTab);
    }
    
    // Manually ensure DPI/Polling defaults are visible/styled correctly
    const defaultProfile = document.querySelector('.profile-label[data-profile-name="general"]');
    const defaultPolling = document.querySelector('.polling-label[data-rate="1000Hz"]');
    
    if (defaultProfile) {
        document.querySelectorAll('.profile-content').forEach(panel => panel.style.display = 'none');
        document.querySelector(`.profile-content[data-profile="general"]`).style.display = 'block';
    }
    if (defaultPolling) {
         const pollingLabels = document.querySelectorAll('.polling-label');
         pollingLabels.forEach(label => {
            label.classList.remove('bg-kreo-accent', 'font-semibold', 'text-white');
            label.classList.add('bg-gray-700', 'hover:bg-gray-600', 'text-gray-200');
         });
         defaultPolling.classList.add('bg-kreo-accent', 'font-semibold', 'text-white');
         defaultPolling.classList.remove('bg-gray-700', 'hover:bg-gray-600', 'text-gray-200');
    }
    
    // Handle initial view if URL hash is present
    if (window.location.hash === '#config-page') {
        document.getElementById('config-page').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
    }
};
