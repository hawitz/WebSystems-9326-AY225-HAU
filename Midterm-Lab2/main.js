// Main JavaScript for GeeksforGeeks Academic Scraper

// Update current datetime
function updateDateTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('current-datetime').textContent = now.toLocaleDateString('en-US', options);
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Show alert messages
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    const alertId = 'alert-' + Date.now();
    
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    alertContainer.innerHTML += alertHTML;
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            alertElement.remove();
        }
    }, 5000);
}

// Update progress bar
function updateProgress(percent, message = '') {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = percent + '%';
    progressBar.textContent = percent + '%';
    
    if (message) {
        progressBar.setAttribute('data-message', message);
    }
}

// Update statistics
function updateStatistics(data) {
    let easy = 0, medium = 0, hard = 0;
    
    data.forEach(topic => {
        const difficulty = topic.difficulty.toLowerCase();
        if (difficulty.includes('easy')) easy++;
        else if (difficulty.includes('medium')) medium++;
        else if (difficulty.includes('hard')) hard++;
    });
    
    document.getElementById('topic-count').textContent = data.length;
    document.getElementById('easy-count').textContent = easy;
    document.getElementById('medium-count').textContent = medium;
    document.getElementById('hard-count').textContent = hard;
}

// Start scraping
document.getElementById('start-scrape').addEventListener('click', async function() {
    const button = this;
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Scraping...';
    
    updateProgress(10, 'Initializing scraper...');
    
    try {
        const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Scraping completed successfully! ' + result.message, 'success');
            updateProgress(100, 'Complete!');
            
            // Auto preview after scraping
            setTimeout(() => {
                document.getElementById('preview-data').click();
            }, 500);
        } else {
            showAlert('Error: ' + result.message, 'danger');
            updateProgress(0, 'Failed');
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'danger');
        updateProgress(0, 'Error');
    } finally {
        button.disabled = false;
        button.innerHTML = '<i class="bi bi-play-fill"></i> Start Scraping';
        
        // Reset progress after 2 seconds
        setTimeout(() => {
            updateProgress(0);
        }, 2000);
    }
});

// Preview data
document.getElementById('preview-data').addEventListener('click', async function() {
    const button = this;
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Loading...';
    
    try {
        const response = await fetch('/api/preview');
        const data = await response.json();
        
        if (data.length > 0) {
            displayTableData(data);
            updateStatistics(data);
            showAlert('Data loaded successfully! Found ' + data.length + ' topics.', 'success');
            
            // Enable PDF download button
            document.getElementById('download-pdf').disabled = false;
        } else {
            showAlert('No data available. Please scrape first.', 'warning');
        }
    } catch (error) {
        showAlert('Error loading data: ' + error.message, 'danger');
    } finally {
        button.disabled = false;
        button.innerHTML = '<i class="bi bi-eye"></i> Preview Data';
    }
});

// Display data in table
function displayTableData(data) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    
    data.forEach((topic, index) => {
        const row = document.createElement('tr');
        
        // Format difficulty badge
        let difficultyClass = 'badge-difficulty ';
        if (topic.difficulty.toLowerCase().includes('easy')) {
            difficultyClass += 'badge-easy';
        } else if (topic.difficulty.toLowerCase().includes('medium')) {
            difficultyClass += 'badge-medium';
        } else {
            difficultyClass += 'badge-hard';
        }
        
        // Truncate long text
        const truncate = (text, length = 50) => {
            return text.length > length ? text.substring(0, length) + '...' : text;
        };
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${topic.title}</strong></td>
            <td><span class="${difficultyClass}">${topic.difficulty}</span></td>
            <td><span class="tooltip">${truncate(topic.concepts, 40)}
                <span class="tooltiptext">${topic.concepts}</span>
            </span></td>
            <td><div class="code-snippet">${topic.code || 'N/A'}</div></td>
            <td>${topic.complexity || 'N/A'}</td>
            <td><a href="${topic.references}" target="_blank" class="text-decoration-none">Link</a></td>
        `;
        
        tbody.appendChild(row);
    });
}

// Generate PDF
document.getElementById('generate-pdf').addEventListener('click', async function() {
    const button = this;
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Generating PDF...';
    
    try {
        const response = await fetch('/api/generate-pdf', {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('PDF generated successfully! Filename: ' + result.filename, 'success');
        } else {
            showAlert('Error generating PDF: ' + result.message, 'danger');
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'danger');
    } finally {
        button.disabled = false;
        button.innerHTML = '<i class="bi bi-file-pdf"></i> Generate PDF';
    }
});

// Download PDF
document.getElementById('download-pdf').addEventListener('click', function() {
    window.location.href = '/api/download-pdf';
    showAlert('Downloading PDF...', 'info');
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S for scraping
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        document.getElementById('start-scrape').click();
    }
    // Ctrl+P for preview
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        document.getElementById('preview-data').click();
    }
    // Ctrl+G for generate PDF
    if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        document.getElementById('generate-pdf').click();
    }
});

// Auto-refresh data every 30 seconds (optional)
let autoRefreshInterval;
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearInterval(autoRefreshInterval);
    } else {
        autoRefreshInterval = setInterval(() => {
            if (document.getElementById('preview-data').disabled === false) {
                document.getElementById('preview-data').click();
            }
        }, 30000);
    }
});