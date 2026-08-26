// Kollect Web JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initializeTabs();
    
    // Fetch and display release information
    fetchLatestRelease();
    
    // Smooth scrolling for navigation links
    initializeSmoothScrolling();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

async function fetchLatestRelease() {
    const releaseInfo = document.getElementById('release-info');
    const downloadGrid = document.getElementById('download-grid');
    
    try {
        console.log('Fetching latest release from kollect-web repository...');
        // Fetch from the public kollect-web repository where releases are synced
        const response = await fetch('https://api.github.com/repos/MichaelCade/kollect-web/releases/latest');
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch release information: ${response.status} ${response.statusText}`);
        }
        
        const release = await response.json();
        console.log('Successfully fetched release:', release.tag_name);
        
        // Update release info
        releaseInfo.innerHTML = `
            <div class="release-header">
                <h3>Latest Release: ${release.tag_name}</h3>
                <p class="release-date">Released on ${formatDate(release.published_at)}</p>
            </div>
            <div class="release-notes">
                <h4>Release Notes</h4>
                <div class="release-body">${formatReleaseNotes(release.body)}</div>
            </div>
        `;
        
        // Create download links
        const downloads = createDownloadLinks(release.assets);
        downloadGrid.innerHTML = downloads;
        downloadGrid.style.display = 'grid';
        
    } catch (error) {
        console.error('Error fetching release:', error);
        
        // Fallback to showing known release data
        showFallbackRelease();
    }
}

function showFallbackRelease() {
    const releaseInfo = document.getElementById('release-info');
    const downloadGrid = document.getElementById('download-grid');
    
    releaseInfo.innerHTML = `
        <div class="release-header">
            <h3>Latest Release: 0.1.18</h3>
            <p class="release-date">Released on August 24, 2026</p>
            <p class="api-note"><i class="fas fa-info-circle"></i> Showing cached release info (the GitHub API may be rate-limited). Visit the <a href="https://github.com/MichaelCade/kollect-web/releases" target="_blank">releases page</a> for the most current version.</p>
        </div>
        <div class="release-notes">
            <h4>Release Notes</h4>
            <div class="release-body">The latest Kollect build with the newest platform integrations and fixes.<br><br>---<br><br><em>Releases are automatically synced from the private kollect repository.</em></div>
        </div>
    `;

    // Known assets for the current release, shown only when the live GitHub
    // API call fails (e.g. anonymous rate limit). Keep in sync with the latest
    // release; the live fetch above is the primary source of truth.
    const fallbackVersion = '0.1.18';
    const base = `https://github.com/MichaelCade/kollect-web/releases/download/${fallbackVersion}`;
    const fallbackAssets = [
        { name: 'kollect-darwin-amd64', size: 154992400, browser_download_url: `${base}/kollect-darwin-amd64` },
        { name: 'kollect-darwin-arm64', size: 147069042, browser_download_url: `${base}/kollect-darwin-arm64` },
        { name: 'kollect-linux-386', size: 140373755, browser_download_url: `${base}/kollect-linux-386` },
        { name: 'kollect-linux-amd64', size: 149547181, browser_download_url: `${base}/kollect-linux-amd64` },
        { name: 'kollect-linux-arm64', size: 140215715, browser_download_url: `${base}/kollect-linux-arm64` },
        { name: 'kollect-windows-386.exe', size: 143626752, browser_download_url: `${base}/kollect-windows-386.exe` },
        { name: 'kollect-windows-amd64.exe', size: 151039488, browser_download_url: `${base}/kollect-windows-amd64.exe` },
        { name: 'kollect-windows-arm64.exe', size: 140506624, browser_download_url: `${base}/kollect-windows-arm64.exe` }
    ];
    
    const downloads = createDownloadLinks(fallbackAssets);
    downloadGrid.innerHTML = downloads;
    downloadGrid.style.display = 'grid';
}

function createDownloadLinks(assets) {
    if (!assets || assets.length === 0) {
        return '<p>No release assets available.</p>';
    }
    
    const platformMap = {
        'linux': { icon: 'fab fa-linux', name: 'Linux' },
        'windows': { icon: 'fab fa-windows', name: 'Windows' },
        'darwin': { icon: 'fab fa-apple', name: 'macOS' },
        'arm64': { icon: 'fas fa-microchip', name: 'ARM64' },
        'amd64': { icon: 'fas fa-microchip', name: 'AMD64' }
    };
    
    return assets.map(asset => {
        const platform = detectPlatform(asset.name);
        const platformInfo = platformMap[platform] || { icon: 'fas fa-download', name: 'Download' };
        
        return `
            <div class="download-item">
                <div class="download-icon">
                    <i class="${platformInfo.icon}"></i>
                </div>
                <h4>${platformInfo.name}</h4>
                <p class="filename">${asset.name}</p>
                <p class="size">${formatFileSize(asset.size)}</p>
                <a href="${asset.browser_download_url}" class="btn btn-primary" download>
                    <i class="fas fa-download"></i>
                    Download
                </a>
            </div>
        `;
    }).join('');
}

function detectPlatform(filename) {
    const lower = filename.toLowerCase();
    if (lower.includes('linux')) return 'linux';
    if (lower.includes('windows') || lower.includes('.exe')) return 'windows';
    if (lower.includes('darwin') || lower.includes('macos')) return 'darwin';
    if (lower.includes('arm64')) return 'arm64';
    if (lower.includes('amd64')) return 'amd64';
    return 'unknown';
}

function formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatReleaseNotes(body) {
    if (!body) return '<p>No release notes available.</p>';
    
    // Convert markdown-style formatting to HTML. Headings are matched at the
    // start of a line and tolerate a missing space after the # markers.
    let formatted = body
        .replace(/^\s*#{3}\s*(.*)$/gm, '<h5>$1</h5>')
        .replace(/^\s*#{2}\s*(.*)$/gm, '<h4>$1</h4>')
        .replace(/^\s*#{1}\s*(.*)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
    
    return `<div class="formatted-notes">${formatted}</div>`;
}

// Add some interactive effects
document.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (!header) return;
    if (window.scrollY > 100) {
        header.style.background = 'var(--header-bg)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--bg-color)';
        header.style.backdropFilter = 'none';
    }
});

// Add loading animation for download cards
function addLoadingAnimation() {
    const cards = document.querySelectorAll('.download-item, .feature-card, .doc-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    cards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}