// UI helpers: toast notifications and global loading indicator
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    container.appendChild(toast);
    // auto-remove
    setTimeout(() => {
        toast.classList.add('toast-hide');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

function createToastContainer() {
    const c = document.createElement('div');
    c.id = 'toast-container';
    document.body.appendChild(c);
    return c;
}

function showLoading(show = true) {
    const spinner = document.getElementById('loading-spinner') || createSpinner();
    spinner.style.display = show ? 'flex' : 'none';
}

function createSpinner() {
    const s = document.createElement('div');
    s.id = 'loading-spinner';
    s.className = 'loading-spinner';
    s.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(s);
    return s;
}

// expose for older browsers
window.showToast = showToast;
window.showLoading = showLoading;
