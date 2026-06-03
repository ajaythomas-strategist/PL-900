/**
 * PL-900 Course Landing Page Controller
 * Handles dynamic assessment availability checking and navigation.
 */

// Folder mappings for the practice assessments
const mockTests = [
  { 
    id: 1, 
    name: "PL 900 Mock 1", 
    btnId: "btn-1", 
    badgeId: "badge-1", 
    path: "PL%20900%20Mock%201/index.html" 
  },
  { 
    id: 2, 
    name: "PL 900 Mock 2", 
    btnId: "btn-2", 
    badgeId: "badge-2", 
    path: "PL%20900%20Mock%202/index.html" 
  },
  { 
    id: 3, 
    name: "PL 900 Mock 3", 
    btnId: "btn-3", 
    badgeId: "badge-3", 
    path: "PL%20900%20Mock%203/index.html" 
  }
];

/**
 * Checks if a mock test's index.html file is accessible on the server or filesystem.
 * If accessible, updates the UI card to "Available" and links to it.
 * If not accessible, falls back to "Not Available" styling.
 * @param {Object} mock - The mock test configuration object.
 */
async function checkTestAvailability(mock) {
  const btn = document.getElementById(mock.btnId);
  const badge = document.getElementById(mock.badgeId);
  
  if (!btn || !badge) return;
  
  let available = false;
  
  try {
    if (window.location.protocol === 'file:') {
      // Use stylesheet check for local file protocol to bypass CORS
      available = await checkLocalFileExists(mock.path);
    } else {
      // Use standard HEAD request for http/https protocols
      const response = await fetch(mock.path, { method: 'HEAD' });
      available = response.ok;
    }
  } catch (error) {
    available = false;
  }
  
  const card = document.getElementById(`mock-card-${mock.id}`);
  if (available) {
    // The file is found, enable the card and buttons
    if (card) card.classList.remove('not-available');
    badge.textContent = "Available";
    badge.className = "badge-status available";
    btn.textContent = "Go to Mock Test";
    btn.className = "btn btn-primary";
    btn.href = mock.path;
    btn.onclick = null; // Remove any inline prevent-default handler
  } else {
    // File not found (e.g. 404), style as "Not Available"
    if (card) card.classList.add('not-available');
    setNotAvailableState(btn, badge);
  }
}

/**
 * Checks if a local styles.css exists under a given path to verify folder existence.
 * Works on file:// protocol without CORS blocks.
 * @param {string} indexPath 
 * @returns {Promise<boolean>}
 */
function checkLocalFileExists(indexPath) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    // Check index.html existence directly by loading it as a script (safely bypassed by file:// CORS rules)
    script.src = indexPath;
    
    script.onload = () => {
      script.remove();
      resolve(true);
    };
    script.onerror = () => {
      script.remove();
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

/**
 * Sets the button and badge states to "Not Available".
 * @param {HTMLElement} btn 
 * @param {HTMLElement} badge 
 */
function setNotAvailableState(btn, badge) {
  badge.textContent = "Not Available";
  badge.className = "badge-status coming-soon";
  btn.textContent = "Not Available";
  btn.className = "btn btn-disabled";
  btn.href = "#";
  btn.onclick = function(event) {
    event.preventDefault();
    alert("This Mock Test is not available yet.");
    return false;
  };
}

// Check availability when the document completes loading
document.addEventListener("DOMContentLoaded", () => {
  mockTests.forEach(checkTestAvailability);
});
