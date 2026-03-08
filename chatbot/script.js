// AI-Style ChatBot JavaScript

// Chat state
let chatState = {
    messages: [],
    isTyping: false,
    messageCount: 1,
    sessionStartTime: Date.now(),
    responseTimes: [],
    personality: 'friendly',
    responseSpeed: 'normal'
};

// Bot responses database
const botResponses = {
    greetings: {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        responses: [
            "Hello! How can I help you today?",
            "Hi there! What can I do for you?",
            "Hey! Welcome to our chat. How may I assist you?",
            "Good to see you! What brings you here today?"
        ]
    },
    help: {
        keywords: ['help', 'commands', 'what can you do', 'features'],
        responses: [
            "I can help you with:\n• 📦 Product information and recommendations\n• 🛒 Order tracking and support\n• 💰 Pricing plans and billing questions\n• 🔧 Technical assistance and troubleshooting\n• 📞 Contact information and support hours\n• 📚 Documentation and tutorials\n\nTry asking about any of these topics!",
            "Here's what I can assist you with:\n1. Products - Find information about our services\n2. Orders - Track and manage your orders\n3. Support - Get technical help\n4. Billing - Understand pricing and payments\n5. Contact - Reach our human team\n\nJust type what you need help with!"
        ]
    },
    products: {
        keywords: ['product', 'products', 'service', 'services', 'features', 'what do you offer'],
        responses: [
            "We offer a comprehensive suite of digital solutions:\n\n🚀 **Web Development** - Custom websites and web applications\n📱 **Mobile Apps** - iOS and Android development\n☁️ **Cloud Services** - Hosting and infrastructure\n🔒 **Security** - Cybersecurity solutions\n📊 **Analytics** - Data analysis and reporting\n🤖 **AI Solutions** - Machine learning and automation\n\nWhich area interests you most?",
            "Our product catalog includes:\n\n• **Enterprise Solutions** - For large organizations\n• **Small Business Tools** - Affordable and scalable\n• **Developer APIs** - Integration-ready services\n• **Consulting** - Expert guidance and support\n\nWould you like more details about any specific product?"
        ]
    },
    pricing: {
        keywords: ['price', 'pricing', 'cost', 'fee', 'payment', 'billing', 'subscription'],
        responses: [
            "We offer flexible pricing plans:\n\n💰 **Starter** - $29/month\n• Perfect for small teams\n• Up to 10 users\n• Basic features\n\n⭐ **Professional** - $99/month\n• Growing businesses\n• Up to 50 users\n• Advanced features\n• Priority support\n\n🏆 **Enterprise** - Custom pricing\n• Unlimited users\n• Custom features\n• Dedicated support\n• SLA guarantees\n\nWhich plan would you like to know more about?",
            "Our pricing structure:\n\n- **Free Trial**: 14 days, no credit card required\n- **Monthly Plans**: billed monthly, cancel anytime\n- **Annual Plans**: save 20% with yearly billing\n- **Custom Pricing**: available for enterprise needs\n\nAll plans include:\n✅ 24/7 email support\n✅ Regular updates\n✅ Data backup\n✅ SSL certificates\n\nCan I help you choose the right plan?"
        ]
    },
    support: {
        keywords: ['support', 'help', 'issue', 'problem', 'troubleshoot', 'fix', 'broken', 'error'],
        responses: [
            "I'm here to help! For technical support:\n\n🔧 **Common Issues**:\n• Login problems\n• Performance issues\n• Feature questions\n• Error messages\n\n📞 **Support Channels**:\n• Live chat (9 AM - 6 PM EST)\n• Email: support@example.com\n• Phone: 1-800-123-4567\n• Knowledge base: docs.example.com\n\nWhat specific issue are you experiencing?",
            "Let's troubleshoot your issue:\n\n1. **Describe the problem** - What's not working?\n2. **When did it start?** - Recent or ongoing?\n3. **Error messages?** - Share any error text\n4. **Steps to reproduce** - What triggers the issue?\n\nI can help diagnose the problem or connect you with a human specialist if needed. What's happening?"
        ]
    },
    contact: {
        keywords: ['contact', 'phone', 'email', 'address', 'location', 'hours', 'team', 'human'],
        responses: [
            "Here's how to reach us:\n\n📧 **Email**: hello@example.com\n📞 **Phone**: 1-800-123-4567\n💬 **Live Chat**: Available on our website\n📍 **Office**: 123 Tech Street, Silicon Valley, CA 94025\n\n🕐 **Business Hours**:\n• Monday - Friday: 9 AM - 6 PM EST\n• Saturday: 10 AM - 4 PM EST\n• Sunday: Closed\n\n🌐 **24/7 Support**: Available for enterprise customers\n\nHow would you prefer to contact us?",
            "Our contact information:\n\n**General Inquiries**: hello@example.com\n**Sales**: sales@example.com\n**Support**: support@example.com\n**Press**: press@example.com\n\n**Social Media**:\n• Twitter: @examplecompany\n• LinkedIn: example-company\n• Facebook: /examplecompany\n\n**Response Times**:\n• Email: 24-48 hours\n• Live chat: Immediate (during business hours)\n• Phone: Immediate (during business hours)\n\nWhat's the best way for us to help you?"
        ]
    },
    order: {
        keywords: ['order', 'purchase', 'buy', 'transaction', 'tracking', 'delivery', 'shipping'],
        responses: [
            "For order-related questions:\n\n📦 **Track Your Order**:\n• Order number: ORD-XXXXX\n• Tracking link: track.example.com\n• Estimated delivery: 3-5 business days\n\n🛒 **Order Management**:\n• View orders: account.example.com/orders\n• Cancel orders: Within 24 hours\n• Returns: 30-day return policy\n\n💳 **Payment Options**:\n• Credit/Debit cards\n• PayPal\n• Bank transfer\n• Cryptocurrency (Bitcoin, Ethereum)\n\nWhat's your order about?"
        ]
    },
    technical: {
        keywords: ['api', 'integration', 'documentation', 'code', 'developer', 'programming', 'javascript', 'python'],
        responses: [
            "Technical resources:\n\n📚 **Documentation**: docs.example.com\n🔧 **API Reference**: api.example.com\n💻 **SDKs**: Available for JavaScript, Python, Ruby, PHP\n🧪 **Testing**: Sandbox environment at sandbox.example.com\n\n🔑 **Authentication**:\n• API Keys\n• OAuth 2.0\n• JWT tokens\n\n📊 **Rate Limits**:\n• Free: 100 requests/hour\n• Pro: 1,000 requests/hour\n• Enterprise: Unlimited\n\nWhat technical information do you need?"
        ]
    },
    thanks: {
        keywords: ['thank', 'thanks', 'appreciate', 'helpful', 'great', 'awesome'],
        responses: [
            "You're very welcome! I'm glad I could help. Is there anything else you need assistance with?",
            "Happy to help! Don't hesitate to ask if you need anything else.",
            "You're welcome! It's my pleasure to assist you. What else can I help you with today?"
        ]
    },
    goodbye: {
        keywords: ['bye', 'goodbye', 'see you', 'later', 'exit', 'quit'],
        responses: [
            "Goodbye! Feel free to come back anytime if you need help. Have a great day!",
            "See you later! Thanks for chatting with us. We're here whenever you need assistance.",
            "Take care! Don't hesitate to reach out if you need help in the future."
        ]
    },
    unknown: {
        keywords: [],
        responses: [
            "I'm not sure I understand. Could you please rephrase your question or try one of these topics: products, pricing, support, or contact information?",
            "I didn't quite catch that. I can help with product information, pricing plans, technical support, or connecting you with our team. What would you like to know?",
            "I'm still learning! Try asking about our products, pricing, support options, or how to contact us. You can also type 'help' to see all available commands."
        ]
    }
};

// Initialize chat
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
    startSessionTimer();
    initializeSettings();
});

function initializeChat() {
    // Focus input
    document.getElementById('message-input').focus();
    
    // Add enter key handler
    document.getElementById('message-input').addEventListener('keypress', handleKeyPress);
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', function(e) {
        const emojiPicker = document.getElementById('emoji-picker');
        const emojiButton = e.target.closest('[onclick*="toggleEmojiPicker"]');
        
        if (!emojiPicker.contains(e.target) && !emojiButton) {
            emojiPicker.style.display = 'none';
        }
    });
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Process message
    processMessage(message);
    
    // Update stats
    updateMessageCount();
}

function sendQuickMessage(message) {
    document.getElementById('message-input').value = message;
    sendMessage();
}

function processMessage(message) {
    // Show typing indicator if enabled
    if (document.getElementById('typing-indicator-enabled').checked) {
        showTypingIndicator();
    }
    
    // Calculate response time
    const startTime = Date.now();
    
    // Get response based on keywords
    const response = getBotResponse(message);
    
    // Simulate processing delay based on speed setting
    const delays = { fast: 500, normal: 1000, slow: 2000 };
    const delay = delays[chatState.responseSpeed] || 1000;
    
    setTimeout(() => {
        hideTypingIndicator();
        addMessage(response, 'bot');
        
        // Update response time stats
        const responseTime = Date.now() - startTime;
        chatState.responseTimes.push(responseTime);
        updateResponseTime();
        
        // Play sound if enabled
        if (document.getElementById('sound-enabled').checked) {
            playMessageSound();
        }
    }, delay);
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check each response category
    for (const [category, data] of Object.entries(botResponses)) {
        if (category === 'unknown') continue; // Skip unknown for now
        
        const hasKeyword = data.keywords.some(keyword => 
            lowerMessage.includes(keyword.toLowerCase())
        );
        
        if (hasKeyword) {
            // Return random response from category
            const responses = data.responses;
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    
    // Return unknown response
    const unknownResponses = botResponses.unknown.responses;
    return unknownResponses[Math.floor(Math.random() * unknownResponses.length)];
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Process message content (handle code blocks, links, etc.)
    const processedText = processMessageContent(text);
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
        </div>
        <div class="message-content">
            <div class="message-bubble">${processedText}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to state
    chatState.messages.push({ text, sender, time });
}

function processMessageContent(text) {
    // Convert newlines to <br>
    let processed = text.replace(/\n/g, '<br>');
    
    // Convert markdown-style formatting
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert bullet points
    processed = processed.replace(/• (.*?)(<br>|$)/g, '<li>$1</li>');
    processed = processed.replace(/<li>/g, '<ul><li>').replace(/<\/li>(?!<li>)/g, '</li></ul>');
    
    // Convert numbered lists
    processed = processed.replace(/^\d\. (.*?)(<br>|$)/gm, '<li>$1</li>');
    
    // Highlight code
    processed = processed.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Convert URLs to links
    processed = processed.replace(
        /(https?:\/\/[^\s<]+)/g,
        '<a href="$1" target="_blank" rel="noopener">$1</a>'
    );
    
    return processed;
}

function showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'block';
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
}

function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        const messagesContainer = document.getElementById('chat-messages');
        
        // Keep only welcome message
        messagesContainer.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        <p>Hello! I'm your AI assistant. I can help you with:</p>
                        <ul>
                            <li>📚 Product information</li>
                            <li>🛒 Order status and support</li>
                            <li>💰 Pricing and billing</li>
                            <li>🔧 Technical assistance</li>
                            <li>📞 Contact information</li>
                        </ul>
                        <p>Type "help" to see all available commands or just ask me anything!</p>
                    </div>
                    <div class="message-time">Just now</div>
                </div>
            </div>
        `;
        
        // Reset state
        chatState.messages = [];
        chatState.messageCount = 1;
        updateMessageCount();
    }
}

function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function initializeSettings() {
    // Response speed
    document.getElementById('response-speed').addEventListener('change', function() {
        chatState.responseSpeed = this.value;
    });
    
    // Bot personality
    document.getElementById('bot-personality').addEventListener('change', function() {
        chatState.personality = this.value;
        // In a real implementation, this would change response styles
    });
}

function toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
}

function insertEmoji(emoji) {
    const input = document.getElementById('message-input');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    
    input.value = input.value.substring(0, start) + emoji + input.value.substring(end);
    input.selectionStart = input.selectionEnd = start + emoji.length;
    
    // Hide picker
    document.getElementById('emoji-picker').style.display = 'none';
    
    // Focus input
    input.focus();
}

function attachFile() {
    // Simulate file attachment
    alert('File attachment would open a file picker in a real implementation. For this demo, you can describe what you want to share.');
    document.getElementById('message-input').focus();
}

function playMessageSound() {
    // Create a simple notification sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function updateMessageCount() {
    chatState.messageCount++;
    document.getElementById('message-count').textContent = chatState.messageCount;
}

function updateResponseTime() {
    if (chatState.responseTimes.length === 0) return;
    
    const avgTime = chatState.responseTimes.reduce((a, b) => a + b, 0) / chatState.responseTimes.length;
    document.getElementById('response-time').textContent = Math.round(avgTime) + 'ms';
}

function startSessionTimer() {
    setInterval(() => {
        const elapsed = Date.now() - chatState.sessionStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        document.getElementById('session-time').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('message-input').focus();
    }
    
    // Escape to close emoji picker
    if (e.key === 'Escape') {
        document.getElementById('emoji-picker').style.display = 'none';
        document.getElementById('settings-panel').style.display = 'none';
    }
    
    // Ctrl/Cmd + / to show help
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        sendQuickMessage('help');
    }
});

// Auto-resize chat container based on viewport
function adjustChatHeight() {
    const container = document.querySelector('.chat-container');
    const viewportHeight = window.innerHeight;
    const headerHeight = 200; // Approximate header + margins
    
    if (viewportHeight < 800) {
        container.style.height = (viewportHeight - headerHeight) + 'px';
    }
}

window.addEventListener('resize', adjustChatHeight);
adjustChatHeight();

// Export functions for global access
window.sendMessage = sendMessage;
window.sendQuickMessage = sendQuickMessage;
window.clearChat = clearChat;
window.toggleSettings = toggleSettings;
window.toggleEmojiPicker = toggleEmojiPicker;
window.insertEmoji = insertEmoji;
window.attachFile = attachFile;
window.handleKeyPress = handleKeyPress;
