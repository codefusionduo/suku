/**
 * Suku AI - Application Controller
 * Handles UI interactions, view switching, chat rendering,
 * training interface, analytics, and settings.
 */

// ===== GLOBAL STATE =====
let ai;
let currentView = 'chat';
let chatHistory = [];
let isProcessing = false;

// ===== GOOGLE SIGN-IN =====
function handleCredentialResponse(response) {
    // Decode the JWT token to get user info if needed
    // const payload = JSON.parse(atob(response.credential.split('.')[1]));
    // console.log("User signed in:", payload);

    // Hide login overlay
    document.getElementById('login-overlay').classList.add('hidden');
    
    // Show main app container
    const appContainer = document.getElementById('app');
    appContainer.style.display = 'flex';
    
    // Optional: show a welcome toast
    showToast('Signed in successfully!', 'success');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AI
    ai = new SukuAI();

    // Load settings into UI
    loadSettingsUI();

    // Update stats
    updateStats();

    // Set up input listeners
    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('input', () => {
        document.getElementById('send-btn').disabled = chatInput.value.trim().length === 0;
    });

    // Load chat history from session
    loadChatHistory();

    // Initial analytics render
    renderAnalytics();
    renderKnowledgeBase();

    // Auto-login if running locally (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
        sessionStorage.setItem('suku_admin', 'true');
    }

    // Check if admin is logged in
    if (sessionStorage.getItem('suku_admin') === 'true') {
        showAdminFeatures();
    }

    console.log('🧠 Suku AI initialized! Ready to chat.');
});


// ===== VIEW SWITCHING =====
function switchView(view) {
    // Remove active from all views and nav items
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Activate selected view
    document.getElementById(`view-${view}`).classList.add('active');
    document.getElementById(`nav-${view}`).classList.add('active');

    currentView = view;

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');

    // Refresh view data
    if (view === 'analytics') renderAnalytics();
    if (view === 'knowledge') renderKnowledgeBase();
    if (view === 'chat') {
        setTimeout(() => {
            const input = document.getElementById('chat-input');
            input.focus();
        }, 100);
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ===== CHAT FUNCTIONS =====
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();

    if (!text || isProcessing) return;

    isProcessing = true;

    // Hide welcome screen
    const welcome = document.getElementById('welcome-screen');
    if (welcome) welcome.style.display = 'none';

    // Add user message
    addMessage('user', text);

    // Clear input
    input.value = '';
    input.style.height = 'auto';
    document.getElementById('send-btn').disabled = true;

    // Show typing indicator
    showTyping(true);

    // Process message (with simulated delay for realism)
    const delay = getTypingDelay();
    
    setTimeout(async () => {
        try {
            const response = await ai.processMessage(text);
            showTyping(false);
            addMessage('ai', response.text, response.confidence, response.processingTime);
            updateStats();
        } catch (e) {
            showTyping(false);
            addMessage('ai', 'Oops! Something went wrong in my circuits. 🔧 Please try again!', 0);
            console.error('AI Error:', e);
        }
        isProcessing = false;
    }, delay);
}

function sendQuickPrompt(text) {
    const input = document.getElementById('chat-input');
    input.value = text;
    document.getElementById('send-btn').disabled = false;
    sendMessage();
}

function addMessage(type, text, confidence = null, processingTime = null) {
    const container = document.getElementById('chat-messages');
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;

    const avatar = type === 'ai' ? 'S' : '👤';
    
    // Parse code blocks
    let formattedText = text;
    
    formattedText = formattedText.replace(/```([\w]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'Code';
        const displayLang = language.toUpperCase();
        const safeCode = escapeHtml(code.trim());
        
        return `
        <div class="code-block-container">
            <div class="code-block-header">
                <div class="code-block-lang">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    <span>${displayLang}</span>
                </div>
                <div class="code-block-actions">
                    <button class="code-action-btn" title="Copy code" onclick="navigator.clipboard.writeText(this.parentElement.parentElement.nextElementSibling.innerText); showToast('Code copied!', 'success');">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <button class="code-action-btn" title="Edit">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button class="code-action-btn" title="Run">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </button>
                </div>
            </div>
            <pre class="code-block-content"><code class="language-${language}">${safeCode}</code></pre>
        </div>`;
    });

    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
    const parts = formattedText.split(/(<div class="code-block-container">[\s\S]*?<\/div>)/);
    formattedText = parts.map((part, index) => {
        if (index % 2 === 0) return part.replace(/\n/g, '<br>');
        return part;
    }).join('');

    let metaHtml = `<span class="message-time">${timeStr}</span>`;
    
    if (type === 'ai' && confidence !== null && confidence > 0) {
        let confClass = 'confidence-low';
        let confLabel = 'Low';
        if (confidence >= 0.7) { confClass = 'confidence-high'; confLabel = 'High'; }
        else if (confidence >= 0.4) { confClass = 'confidence-medium'; confLabel = 'Medium'; }
        
        metaHtml += `<span class="message-confidence ${confClass}">${confLabel} ${Math.round(confidence * 100)}%</span>`;
    }

    if (processingTime !== null) {
        metaHtml += `<span class="message-time">${processingTime}ms</span>`;
    }

    msgDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-bubble">${formattedText}</div>
            <div class="message-meta">${metaHtml}</div>
        </div>
    `;

    container.appendChild(msgDiv);

    // Scroll to bottom
    requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
    });

    // Save to session history
    chatHistory.push({ type, text, time: now.toISOString(), confidence });
    saveChatHistory();
}

function showTyping(show) {
    const indicator = document.getElementById('typing-indicator');
    indicator.classList.toggle('active', show);
}

function getTypingDelay() {
    const speed = ai.settings.speed || 'normal';
    switch (speed) {
        case 'fast': return 300 + Math.random() * 300;
        case 'slow': return 1200 + Math.random() * 800;
        default: return 600 + Math.random() * 500;
    }
}

function handleInputKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function clearChat() {
    if (confirm('Clear all chat messages? This cannot be undone.')) {
        const container = document.getElementById('chat-messages');
        container.innerHTML = '';
        chatHistory = [];
        saveChatHistory();
        
        // Show welcome screen again
        container.innerHTML = getWelcomeHTML();
        
        showToast('Chat cleared!', 'info');
    }
}

function exportChat() {
    const text = chatHistory.map(msg => {
        const time = new Date(msg.time).toLocaleString();
        const sender = msg.type === 'user' ? 'You' : 'Suku AI';
        return `[${time}] ${sender}: ${msg.text}`;
    }).join('\n\n');

    downloadFile('suku-ai-chat.txt', text);
    showToast('Chat exported!', 'success');
}

function saveChatHistory() {
    try {
        sessionStorage.setItem('suku_chat_history', JSON.stringify(chatHistory));
    } catch (e) { /* ignore */ }
}

function loadChatHistory() {
    try {
        const stored = sessionStorage.getItem('suku_chat_history');
        if (stored) {
            const history = JSON.parse(stored);
            if (history.length > 0) {
                const welcome = document.getElementById('welcome-screen');
                if (welcome) welcome.style.display = 'none';
                
                for (const msg of history) {
                    const container = document.getElementById('chat-messages');
                    const timeStr = new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const avatar = msg.type === 'ai' ? 'S' : '👤';
                    
                    let formattedText = msg.text;
                    formattedText = formattedText.replace(/```([\w]*)\n([\s\S]*?)```/g, (match, lang, code) => {
                        const language = lang || 'Code';
                        const displayLang = language.toUpperCase();
                        const safeCode = escapeHtml(code.trim());
                        return `
                        <div class="code-block-container">
                            <div class="code-block-header">
                                <div class="code-block-lang">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                                    <span>${displayLang}</span>
                                </div>
                                <div class="code-block-actions">
                                    <button class="code-action-btn" title="Copy code" onclick="navigator.clipboard.writeText(this.parentElement.parentElement.nextElementSibling.innerText); showToast('Code copied!', 'success');">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    </button>
                                    <button class="code-action-btn" title="Edit">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                    </button>
                                    <button class="code-action-btn" title="Run">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    </button>
                                </div>
                            </div>
                            <pre class="code-block-content"><code class="language-${language}">${safeCode}</code></pre>
                        </div>`;
                    });
                    
                    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    const parts = formattedText.split(/(<div class="code-block-container">[\s\S]*?<\/div>)/);
                    formattedText = parts.map((part, index) => {
                        if (index % 2 === 0) return part.replace(/\n/g, '<br>');
                        return part;
                    }).join('');

                    let metaHtml = `<span class="message-time">${timeStr}</span>`;
                    if (msg.type === 'ai' && msg.confidence) {
                        let confClass = 'confidence-low';
                        let confLabel = 'Low';
                        if (msg.confidence >= 0.7) { confClass = 'confidence-high'; confLabel = 'High'; }
                        else if (msg.confidence >= 0.4) { confClass = 'confidence-medium'; confLabel = 'Medium'; }
                        metaHtml += `<span class="message-confidence ${confClass}">${confLabel} ${Math.round(msg.confidence * 100)}%</span>`;
                    }

                    const msgDiv = document.createElement('div');
                    msgDiv.className = `message ${msg.type}`;
                    msgDiv.innerHTML = `
                        <div class="message-avatar">${avatar}</div>
                        <div class="message-content">
                            <div class="message-bubble">${formattedText}</div>
                            <div class="message-meta">${metaHtml}</div>
                        </div>
                    `;
                    container.appendChild(msgDiv);
                }

                chatHistory = history;
                
                // Scroll to bottom
                const container = document.getElementById('chat-messages');
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight;
                });
            }
        }
    } catch (e) { /* ignore */ }
}

function getWelcomeHTML() {
    return `
        <div class="welcome-container" id="welcome-screen">
            <div class="welcome-logo">
                <svg viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="36" stroke="url(#wGrad2)" stroke-width="3" opacity="0.3"/>
                    <circle cx="40" cy="40" r="26" stroke="url(#wGrad2)" stroke-width="2.5"/>
                    <path d="M28 40C28 33.3726 33.3726 28 40 28C46.6274 28 52 33.3726 52 40" stroke="url(#wGrad2)" stroke-width="2.5" stroke-linecap="round"/>
                    <circle cx="40" cy="48" r="5" fill="url(#wGrad2)"/>
                    <defs>
                        <linearGradient id="wGrad2" x1="4" y1="4" x2="76" y2="76">
                            <stop stop-color="#a78bfa"/>
                            <stop offset="1" stop-color="#06b6d4"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <h2 class="welcome-title">Hello, I'm <span class="gradient-text">Suku AI</span></h2>
            <p class="welcome-subtitle">A trainable AI that learns from you. Ask me anything, or teach me something new!</p>
            <div class="quick-prompts">
                <button class="quick-prompt" onclick="sendQuickPrompt('What can you do?')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    What can you do?
                </button>
                <button class="quick-prompt" onclick="sendQuickPrompt('Tell me a joke')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    Tell me a joke
                </button>
                <button class="quick-prompt" onclick="sendQuickPrompt('How do I train you?')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    How do I train you?
                </button>
                <button class="quick-prompt" onclick="sendQuickPrompt('What is artificial intelligence?')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    What is AI?
                </button>
            </div>
        </div>
    `;
}

// ===== TRAINING FUNCTIONS =====
function trainSingle() {
    const category = document.getElementById('train-category').value;
    const patternsText = document.getElementById('train-patterns').value.trim();
    const responsesText = document.getElementById('train-responses').value.trim();

    if (!patternsText || !responsesText) {
        showToast('Please fill in both patterns and responses!', 'warning');
        return;
    }

    const patterns = patternsText.split('\n').map(p => p.trim()).filter(p => p);
    const responses = responsesText.split('\n').map(r => r.trim()).filter(r => r);

    if (patterns.length === 0 || responses.length === 0) {
        showToast('Please provide at least one pattern and one response!', 'warning');
        return;
    }

    const entry = ai.train(category, patterns, responses);

    // Clear form
    document.getElementById('train-patterns').value = '';
    document.getElementById('train-responses').value = '';

    // Add to training log
    addTrainingLogEntry('success', `Trained ${patterns.length} pattern(s) in "${category}" → ${responses.length} response(s)`);

    showToast(`Successfully trained ${patterns.length} pattern(s)!`, 'success');
    updateStats();
}

function trainBulk() {
    const jsonText = document.getElementById('train-json').value.trim();
    
    if (!jsonText) {
        showToast('Please paste JSON training data!', 'warning');
        return;
    }

    const result = ai.kb.importData(jsonText);

    if (result.success) {
        addTrainingLogEntry('success', `Bulk imported ${result.count} pattern(s)`);
        showToast(`Successfully imported ${result.count} patterns!`, 'success');
        document.getElementById('train-json').value = '';
        updateStats();
    } else {
        addTrainingLogEntry('warning', `Import failed: ${result.error}`);
        showToast(`Import failed: ${result.error}`, 'error');
    }
}

function exportTrainingData() {
    const data = ai.kb.exportData();
    downloadFile('suku-ai-training-data.json', data);
    showToast('Training data exported!', 'success');
}

function addTrainingLogEntry(type, message) {
    const container = document.getElementById('training-log-entries');
    
    // Remove empty state
    const empty = container.querySelector('.log-empty');
    if (empty) empty.remove();

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    entry.innerHTML = `
        <span class="log-entry-icon ${type}"></span>
        <span class="log-entry-text">${message}</span>
        <span class="log-entry-time">${timeStr}</span>
    `;

    container.insertBefore(entry, container.firstChild);
}

// ===== KNOWLEDGE BASE FUNCTIONS =====
let currentFilter = 'all';

function renderKnowledgeBase() {
    const grid = document.getElementById('knowledge-grid');
    let entries = ai.kb.getAll();
    
    // Filter out system entries
    entries = entries.filter(e => e.category !== 'system');

    // Apply category filter
    if (currentFilter !== 'all') {
        entries = entries.filter(e => e.category === currentFilter);
    }

    // Apply search filter
    const searchTerm = document.getElementById('knowledge-search')?.value?.toLowerCase() || '';
    if (searchTerm) {
        entries = entries.filter(e => 
            e.patterns.some(p => p.toLowerCase().includes(searchTerm)) ||
            e.responses.some(r => r.toLowerCase().includes(searchTerm))
        );
    }

    if (entries.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <p>No patterns found${currentFilter !== 'all' ? ` in "${currentFilter}"` : ''}${searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = entries.map(entry => {
        const catClass = `cat-${entry.category}`;
        const patternTags = entry.patterns.slice(0, 4).map(p => 
            `<span class="pattern-tag">${escapeHtml(p)}</span>`
        ).join('');
        const morePatterns = entry.patterns.length > 4 ? `<span class="pattern-tag">+${entry.patterns.length - 4} more</span>` : '';
        
        const responsesList = entry.responses.slice(0, 2).map(r => 
            `<div class="knowledge-response">${escapeHtml(r.substring(0, 120))}${r.length > 120 ? '...' : ''}</div>`
        ).join('');

        return `
            <div class="knowledge-card" data-id="${entry.id}">
                <div class="knowledge-card-header">
                    <span class="knowledge-category ${catClass}">${entry.category}</span>
                    <button class="knowledge-delete" onclick="deleteKnowledgeEntry('${entry.id}')" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
                <div class="knowledge-patterns">
                    <div class="knowledge-patterns-label">Patterns</div>
                    <div class="pattern-tags">${patternTags}${morePatterns}</div>
                </div>
                <div>
                    <div class="knowledge-responses-label">Responses</div>
                    ${responsesList}
                    ${entry.responses.length > 2 ? `<div class="knowledge-response" style="color: var(--text-muted); font-style: italic;">+${entry.responses.length - 2} more responses</div>` : ''}
                </div>
                <div class="knowledge-stats">
                    <span class="knowledge-stat">Matches: <strong>${entry.matchCount || 0}</strong></span>
                    <span class="knowledge-stat">Source: <strong>${entry.isUserTrained ? 'User' : 'Built-in'}</strong></span>
                </div>
            </div>
        `;
    }).join('');
}

function filterByCategory(category, btn) {
    currentFilter = category;
    
    // Update active filter chip
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    
    renderKnowledgeBase();
}

function filterKnowledge() {
    renderKnowledgeBase();
}

function deleteKnowledgeEntry(id) {
    if (confirm('Delete this knowledge entry? This cannot be undone.')) {
        ai.kb.remove(id);
        renderKnowledgeBase();
        updateStats();
        showToast('Entry deleted!', 'info');
    }
}

// ===== ANALYTICS FUNCTIONS =====
function renderAnalytics() {
    const stats = ai.kb.stats;
    const entries = ai.kb.getAll().filter(e => e.category !== 'system');

    // Update stat cards
    document.getElementById('analytics-patterns').textContent = entries.length;
    document.getElementById('analytics-messages').textContent = stats.totalMessages;
    document.getElementById('analytics-accuracy').textContent = ai.kb.getMatchRate() + '%';
    
    const categories = new Set(entries.map(e => e.category));
    document.getElementById('analytics-categories').textContent = categories.size;

    // Category distribution chart
    renderCategoryChart();

    // Recent activity
    renderRecentActivity();

    // Top patterns
    renderTopPatterns();

    // Confidence distribution
    renderConfidenceChart();
}

function renderCategoryChart() {
    const counts = ai.kb.getCategoryCounts();
    delete counts.system;
    const container = document.getElementById('category-chart');
    const maxCount = Math.max(...Object.values(counts), 1);

    if (Object.keys(counts).length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No data yet</p></div>';
        return;
    }

    container.innerHTML = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, count]) => {
            const pct = Math.round((count / maxCount) * 100);
            return `
                <div class="chart-bar-item">
                    <span class="chart-bar-label">${cat}</span>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill" style="width: ${pct}%"></div>
                    </div>
                    <span class="chart-bar-value">${count}</span>
                </div>
            `;
        }).join('');
}

function renderRecentActivity() {
    const container = document.getElementById('recent-activity');
    const activities = ai.kb.activity.slice(-10).reverse();

    if (activities.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No activity yet. Start chatting!</p></div>';
        return;
    }

    container.innerHTML = activities.map(act => {
        const time = new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dotClass = act.type === 'chat' ? 'chat' : act.type === 'train' ? 'train' : 'miss';
        return `
            <div class="activity-item">
                <span class="activity-dot ${dotClass}"></span>
                <span class="activity-text">${escapeHtml(act.message.substring(0, 80))}</span>
                <span class="activity-time">${time}</span>
            </div>
        `;
    }).join('');
}

function renderTopPatterns() {
    const container = document.getElementById('top-patterns');
    const topPatterns = ai.kb.getTopPatterns(5);

    if (topPatterns.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No matched patterns yet</p></div>';
        return;
    }

    container.innerHTML = topPatterns.map((item, i) => `
        <div class="top-pattern-item">
            <span class="top-pattern-rank">#${i + 1}</span>
            <span class="top-pattern-text">${escapeHtml(item.patterns[0])}</span>
            <span class="top-pattern-count">${item.count} hits</span>
        </div>
    `).join('');
}

function renderConfidenceChart() {
    const container = document.getElementById('confidence-chart');
    const dist = ai.kb.getConfidenceDistribution();

    if (dist.high === 0 && dist.medium === 0 && dist.low === 0) {
        container.innerHTML = '<div class="empty-state"><p>No confidence data yet</p></div>';
        return;
    }

    container.innerHTML = `
        <div class="confidence-bar-row">
            <span class="confidence-bar-label high">High</span>
            <div class="confidence-bar-track">
                <div class="confidence-bar-fill-high" style="width: ${dist.high}%"></div>
            </div>
            <span class="confidence-bar-pct">${dist.high}%</span>
        </div>
        <div class="confidence-bar-row">
            <span class="confidence-bar-label medium">Medium</span>
            <div class="confidence-bar-track">
                <div class="confidence-bar-fill-medium" style="width: ${dist.medium}%"></div>
            </div>
            <span class="confidence-bar-pct">${dist.medium}%</span>
        </div>
        <div class="confidence-bar-row">
            <span class="confidence-bar-label low">Low</span>
            <div class="confidence-bar-track">
                <div class="confidence-bar-fill-low" style="width: ${dist.low}%"></div>
            </div>
            <span class="confidence-bar-pct">${dist.low}%</span>
        </div>
    `;
}

// ===== SETTINGS FUNCTIONS =====
function loadSettingsUI() {
    const settings = ai.getSettings();
    
    const nameEl = document.getElementById('setting-name');
    const styleEl = document.getElementById('setting-style');
    const speedEl = document.getElementById('setting-speed');
    const thresholdEl = document.getElementById('setting-threshold');
    const contextEl = document.getElementById('setting-context');
    const autolearnEl = document.getElementById('setting-autolearn');
    const geminiKeyEl = document.getElementById('setting-gemini-key');

    if (nameEl) nameEl.value = settings.name || 'Suku';
    if (styleEl) styleEl.value = settings.style || 'casual';
    if (speedEl) speedEl.value = settings.speed || 'normal';
    if (thresholdEl) {
        thresholdEl.value = settings.threshold || 0.45;
        document.getElementById('threshold-value').textContent = settings.threshold || 0.45;
    }
    if (contextEl) contextEl.value = settings.contextSize || 5;
    if (autolearnEl) autolearnEl.checked = settings.autoLearn !== false;
    if (geminiKeyEl) geminiKeyEl.value = settings.geminiApiKey || '';
}

function updateSettings() {
    const settings = {
        name: document.getElementById('setting-name').value || 'Suku',
        style: document.getElementById('setting-style').value,
        speed: document.getElementById('setting-speed').value,
        threshold: parseFloat(document.getElementById('setting-threshold').value),
        contextSize: parseInt(document.getElementById('setting-context').value),
        autoLearn: document.getElementById('setting-autolearn').checked,
        geminiApiKey: document.getElementById('setting-gemini-key').value || ''
    };

    ai.updateSettings(settings);
    showToast('Settings updated!', 'success');
}

function resetAllData() {
    if (confirm('⚠️ Are you sure you want to reset ALL data?\n\nThis will delete:\n• All training data\n• Chat history\n• Analytics\n• Custom settings\n\nThis cannot be undone!')) {
        ai.kb.resetAll();
        chatHistory = [];
        sessionStorage.removeItem('suku_chat_history');
        localStorage.removeItem('suku_ai_user_memory');
        
        // Re-initialize AI
        ai = new SukuAI();
        loadSettingsUI();
        updateStats();
        renderKnowledgeBase();
        renderAnalytics();
        
        // Reset chat view
        const container = document.getElementById('chat-messages');
        container.innerHTML = getWelcomeHTML();

        showToast('All data has been reset!', 'info');
    }
}

function exportFullBackup() {
    const data = ai.kb.exportFullBackup();
    downloadFile('suku-ai-backup.json', data);
    showToast('Full backup exported!', 'success');
}

function verifyAdmin() {
    const email = document.getElementById('setting-admin-email').value.trim();
    // Simple hash to hide the actual email string in source code
    const hash = email.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    
    if (hash === -660295202) { // Hash for the admin email
        sessionStorage.setItem('suku_admin', 'true');
        showAdminFeatures();
        showToast('Admin access granted!', 'success');
        document.getElementById('setting-admin-email').value = '';
    } else {
        showToast('Invalid admin email', 'error');
    }
}

function showAdminFeatures() {
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = ''; // Reset display to default
    });
}

// ===== STATS UPDATE =====
function updateStats() {
    const entries = ai.kb.getAll().filter(e => e.category !== 'system');
    
    document.getElementById('stat-patterns').textContent = entries.length;
    document.getElementById('stat-convos').textContent = ai.kb.stats.totalMessages;
}

// ===== UTILITY FUNCTIONS =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Remove after animation
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
