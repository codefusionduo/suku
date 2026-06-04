/**
 * Knowledge Base for Suku AI
 * Pre-trained with conversational patterns, general knowledge,
 * humor, emotions, and more. Stored in localStorage.
 */

class KnowledgeBase {
    constructor() {
        this.storageKey = 'suku_ai_knowledge';
        this.statsKey = 'suku_ai_stats';
        this.activityKey = 'suku_ai_activity';
        this.settingsKey = 'suku_ai_settings';
        
        this.data = this.load();
        this.stats = this.loadStats();
        this.activity = this.loadActivity();
        
        // Initialize with default knowledge if empty
        if (this.data.length === 0) {
            this.initializeDefaults();
        }
    }

    /**
     * Load knowledge base from localStorage
     */
    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn('Failed to load knowledge base:', e);
            return [];
        }
    }

    /**
     * Save knowledge base to localStorage
     */
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save knowledge base:', e);
        }
    }

    /**
     * Load stats from localStorage
     */
    loadStats() {
        try {
            const stored = localStorage.getItem(this.statsKey);
            return stored ? JSON.parse(stored) : {
                totalMessages: 0,
                matchedMessages: 0,
                unmatchedMessages: 0,
                trainingSessions: 0,
                confidenceHistory: [],
                topPatterns: {}
            };
        } catch (e) {
            return {
                totalMessages: 0,
                matchedMessages: 0,
                unmatchedMessages: 0,
                trainingSessions: 0,
                confidenceHistory: [],
                topPatterns: {}
            };
        }
    }

    /**
     * Save stats
     */
    saveStats() {
        try {
            localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
        } catch (e) {
            console.error('Failed to save stats:', e);
        }
    }

    /**
     * Load activity log
     */
    loadActivity() {
        try {
            const stored = localStorage.getItem(this.activityKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Save activity
     */
    saveActivity() {
        try {
            // Keep only last 100 activities
            this.activity = this.activity.slice(-100);
            localStorage.setItem(this.activityKey, JSON.stringify(this.activity));
        } catch (e) {
            console.error('Failed to save activity:', e);
        }
    }

    /**
     * Log an activity
     */
    logActivity(type, message) {
        this.activity.push({
            type,
            message,
            timestamp: Date.now()
        });
        this.saveActivity();
    }

    /**
     * Record a match
     */
    recordMatch(patternId, confidence) {
        this.stats.totalMessages++;
        this.stats.matchedMessages++;
        this.stats.confidenceHistory.push(confidence);
        
        // Keep only last 500 confidence values
        if (this.stats.confidenceHistory.length > 500) {
            this.stats.confidenceHistory = this.stats.confidenceHistory.slice(-500);
        }

        // Track top patterns
        if (!this.stats.topPatterns[patternId]) {
            this.stats.topPatterns[patternId] = 0;
        }
        this.stats.topPatterns[patternId]++;

        // Update the matched count in knowledge entry
        const entry = this.data.find(e => e.id === patternId);
        if (entry) {
            entry.matchCount = (entry.matchCount || 0) + 1;
            entry.lastMatched = Date.now();
        }

        this.saveStats();
        this.save();
    }

    /**
     * Record a miss (no match found)
     */
    recordMiss() {
        this.stats.totalMessages++;
        this.stats.unmatchedMessages++;
        this.saveStats();
    }

    /**
     * Add a new knowledge entry
     */
    add(entry) {
        const id = `kb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const newEntry = {
            id,
            category: entry.category || 'general',
            patterns: entry.patterns || [],
            responses: entry.responses || [],
            matchCount: 0,
            createdAt: Date.now(),
            lastMatched: null,
            isUserTrained: entry.isUserTrained !== false
        };
        
        this.data.push(newEntry);
        this.stats.trainingSessions++;
        this.save();
        this.saveStats();
        
        return newEntry;
    }

    /**
     * Remove a knowledge entry
     */
    remove(id) {
        this.data = this.data.filter(e => e.id !== id);
        this.save();
    }

    /**
     * Get all entries
     */
    getAll() {
        return this.data;
    }

    /**
     * Get entries by category
     */
    getByCategory(category) {
        return this.data.filter(e => e.category === category);
    }

    /**
     * Get categories with counts
     */
    getCategoryCounts() {
        const counts = {};
        for (const entry of this.data) {
            counts[entry.category] = (counts[entry.category] || 0) + 1;
        }
        return counts;
    }

    /**
     * Get match rate
     */
    getMatchRate() {
        if (this.stats.totalMessages === 0) return 0;
        return Math.round((this.stats.matchedMessages / this.stats.totalMessages) * 100);
    }

    /**
     * Get confidence distribution
     */
    getConfidenceDistribution() {
        const history = this.stats.confidenceHistory;
        if (history.length === 0) return { high: 0, medium: 0, low: 0 };

        let high = 0, medium = 0, low = 0;
        for (const conf of history) {
            if (conf >= 0.7) high++;
            else if (conf >= 0.4) medium++;
            else low++;
        }

        const total = history.length;
        return {
            high: Math.round((high / total) * 100),
            medium: Math.round((medium / total) * 100),
            low: Math.round((low / total) * 100)
        };
    }

    /**
     * Get top matched patterns
     */
    getTopPatterns(limit = 5) {
        const entries = [...this.data]
            .filter(e => e.matchCount > 0)
            .sort((a, b) => (b.matchCount || 0) - (a.matchCount || 0))
            .slice(0, limit);
        
        return entries.map(e => ({
            patterns: e.patterns,
            count: e.matchCount || 0,
            category: e.category
        }));
    }

    /**
     * Search knowledge base
     */
    search(query) {
        const lower = query.toLowerCase();
        return this.data.filter(entry => {
            return entry.patterns.some(p => p.toLowerCase().includes(lower)) ||
                   entry.responses.some(r => r.toLowerCase().includes(lower)) ||
                   entry.category.includes(lower);
        });
    }

    /**
     * Export all data
     */
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    /**
     * Export full backup
     */
    exportFullBackup() {
        return JSON.stringify({
            knowledge: this.data,
            stats: this.stats,
            activity: this.activity,
            settings: this.loadSettings(),
            exportedAt: new Date().toISOString(),
            version: '1.0'
        }, null, 2);
    }

    /**
     * Import data
     */
    importData(jsonData) {
        try {
            const parsed = JSON.parse(jsonData);
            let imported = 0;

            // Handle array of entries
            const entries = Array.isArray(parsed) ? parsed : (parsed.knowledge || []);
            
            for (const entry of entries) {
                if (entry.patterns && entry.responses) {
                    this.add({
                        category: entry.category || 'custom',
                        patterns: entry.patterns,
                        responses: entry.responses,
                        isUserTrained: true
                    });
                    imported++;
                }
            }

            this.save();
            return { success: true, count: imported };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * Load settings
     */
    loadSettings() {
        try {
            const stored = localStorage.getItem(this.settingsKey);
            return stored ? JSON.parse(stored) : this.getDefaultSettings();
        } catch (e) {
            return this.getDefaultSettings();
        }
    }

    /**
     * Save settings
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }

    /**
     * Get default settings
     */
    getDefaultSettings() {
        return {
            name: 'Suku',
            style: 'casual',
            speed: 'normal',
            threshold: 0.45,
            contextSize: 5,
            autoLearn: true,
            geminiApiKey: ''
        };
    }

    /**
     * Reset all data
     */
    resetAll() {
        this.data = [];
        this.stats = {
            totalMessages: 0,
            matchedMessages: 0,
            unmatchedMessages: 0,
            trainingSessions: 0,
            confidenceHistory: [],
            topPatterns: {}
        };
        this.activity = [];
        
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.statsKey);
        localStorage.removeItem(this.activityKey);
        
        this.initializeDefaults();
    }

    /**
     * Initialize with default training data
     */
    initializeDefaults() {
        const defaults = [
            // === GREETINGS ===
            {
                category: 'greeting',
                patterns: ['hello', 'hi', 'hey', 'hi there', 'hello there', 'hey there'],
                responses: [
                    'Hey there! 👋 How can I help you today?',
                    'Hello! Great to see you! What would you like to chat about?',
                    'Hi! I\'m Suku AI. What\'s on your mind?',
                    'Hey! Ready to assist you. What do you need?'
                ]
            },
            {
                category: 'greeting',
                patterns: ['good morning', 'morning'],
                responses: [
                    'Good morning! ☀️ Hope you\'re having a great start to your day!',
                    'Morning! Ready to make today productive? How can I help?',
                    'Good morning! What can I do for you today?'
                ]
            },
            {
                category: 'greeting',
                patterns: ['good afternoon', 'afternoon'],
                responses: [
                    'Good afternoon! 🌤️ How\'s your day going?',
                    'Afternoon! What can I help you with?'
                ]
            },
            {
                category: 'greeting',
                patterns: ['good evening', 'evening'],
                responses: [
                    'Good evening! 🌙 What brings you here tonight?',
                    'Evening! How can I assist you?'
                ]
            },
            {
                category: 'greeting',
                patterns: ["what's up", 'whats up', 'sup', 'wassup'],
                responses: [
                    'Not much, just processing data at the speed of thought! 😄 What\'s up with you?',
                    'Hey! Just here waiting for interesting questions. What\'s on your mind?',
                    'All good! My neural patterns are firing on all cylinders. What can I do for you?'
                ]
            },
            {
                category: 'greeting',
                patterns: ['how are you', 'how are you doing', "how's it going", 'how are you today'],
                responses: [
                    'I\'m doing great, thanks for asking! 🌟 My circuits are humming along nicely. How about you?',
                    'Wonderful! I\'ve been learning new things. How are you doing?',
                    'I\'m fantastic! Every conversation teaches me something new. How can I help you today?'
                ]
            },

            // === FAREWELLS ===
            {
                category: 'farewell',
                patterns: ['bye', 'goodbye', 'bye bye', 'see you', 'see ya'],
                responses: [
                    'Goodbye! 👋 It was great chatting with you. Come back anytime!',
                    'See you later! Don\'t forget — you can always teach me new things when you return!',
                    'Bye! Have an awesome day! 🌟'
                ]
            },
            {
                category: 'farewell',
                patterns: ['good night', 'goodnight', 'night night', 'gn'],
                responses: [
                    'Good night! 🌙 Sweet dreams and see you tomorrow!',
                    'Night night! I\'ll be here when you get back, smarter than ever! 💤',
                    'Sleep well! I\'ll keep learning while you rest. 🌟'
                ]
            },
            {
                category: 'farewell',
                patterns: ['take care', 'have a nice day', 'have a good day'],
                responses: [
                    'You too! Take care and have an amazing day! 🌈',
                    'Thanks! I hope your day is wonderful. Come chat again soon! 😊'
                ]
            },

            // === IDENTITY ===
            {
                category: 'question',
                patterns: ['what is your name', 'who are you', "what's your name", 'whats your name', 'your name'],
                responses: [
                    'I\'m Suku AI! 🤖 A trainable artificial intelligence that runs entirely in your browser. I learn from you and get smarter with every conversation!',
                    'My name is Suku AI! I\'m an intelligent chatbot that you can train and teach new things. No cloud APIs needed — I\'m all local! 🧠'
                ]
            },
            {
                category: 'question',
                patterns: ['what can you do', 'what are your abilities', 'what are you capable of', 'your capabilities'],
                responses: [
                    'I can do quite a lot! Here\'s what I\'m capable of:\n\n🧠 **Chat** — Have natural conversations with me\n📚 **Learn** — Teach me new patterns and responses\n🔍 **Understand** — I use NLP to understand your intent\n💡 **Remember** — I store everything in your browser\n📊 **Analyze** — Check my analytics dashboard\n✨ **Adapt** — I get smarter the more you train me!\n\nTry teaching me something: say "learn that [question] means [answer]"'
                ]
            },
            {
                category: 'question',
                patterns: ['how do you work', 'how do you think', 'how does your brain work'],
                responses: [
                    'Great question! 🧠 Here\'s how my brain works:\n\n1. **Tokenization** — I break your text into individual words\n2. **NLP Processing** — I remove stop words and stem the remaining words\n3. **Fuzzy Matching** — I compare your input against my knowledge base using Levenshtein distance and Jaccard similarity\n4. **Synonym Expansion** — I understand that "hello" and "hi" mean the same thing\n5. **Intent Detection** — I figure out if you\'re asking a question, saying hello, or teaching me\n6. **Sentiment Analysis** — I can detect if you\'re happy, sad, or neutral\n\nAll of this happens right in your browser — no APIs needed!'
                ]
            },
            {
                category: 'question',
                patterns: ['who created you', 'who made you', 'who built you', 'who is your creator'],
                responses: [
                    'I was created as a trainable AI assistant! I run entirely in your browser using client-side NLP, fuzzy matching, and a persistent knowledge base. Pretty cool, right? 😎',
                    'I\'m a client-side AI built with JavaScript! No cloud APIs — just pure browser-based intelligence. You can train me to be even smarter! 🚀'
                ]
            },
            {
                category: 'question',
                patterns: ['are you real', 'are you human', 'are you a robot', 'are you a bot', 'are you ai'],
                responses: [
                    'I\'m an AI — specifically, a trainable chatbot that lives in your browser! 🤖 I\'m not human, but I try my best to understand and help you. The cool part? You can teach me to be better!',
                    'Nope, I\'m 100% artificial intelligence! But a special kind — one that YOU can train and teach. Think of me as your personal AI companion. 🧠'
                ]
            },

            // === HOW TO TRAIN ===
            {
                category: 'question',
                patterns: ['how do i train you', 'how to train', 'how can i teach you', 'how to teach you', 'train you'],
                responses: [
                    'Training me is easy! Here are 3 ways:\n\n💬 **Chat Method** — Just say:\n• "learn that [question] means [answer]"\n• "teach: [trigger] | [response]"\n• "remember that my name is [name]"\n\n📝 **Training Panel** — Click the "Train" tab in the sidebar to add patterns through a form\n\n📦 **Bulk Import** — Import JSON data with multiple patterns at once\n\nThe more you train me, the smarter I get! 🚀'
                ]
            },

            // === GENERAL KNOWLEDGE ===
            {
                category: 'knowledge',
                patterns: ['what is ai', 'what is artificial intelligence', 'define ai', 'explain ai'],
                responses: [
                    'Artificial Intelligence (AI) is the simulation of human intelligence by machines! 🧠\n\nIt includes:\n• **Machine Learning** — Systems that learn from data\n• **NLP** — Understanding human language (like me!)\n• **Computer Vision** — Machines that can "see"\n• **Robotics** — Physical AI systems\n\nI\'m a simple example of AI using pattern matching and NLP — but you can make me smarter by training me!'
                ]
            },
            {
                category: 'knowledge',
                patterns: ['what is machine learning', 'explain machine learning', 'define machine learning'],
                responses: [
                    'Machine Learning (ML) is a subset of AI where systems learn and improve from experience without being explicitly programmed! 📊\n\nKey types:\n• **Supervised Learning** — Learning from labeled examples\n• **Unsupervised Learning** — Finding patterns in unlabeled data\n• **Reinforcement Learning** — Learning through trial and error\n\nI use a simpler form of learning — pattern matching with fuzzy logic! But the concept is similar: I improve as you teach me more.'
                ]
            },
            {
                category: 'knowledge',
                patterns: ['what is programming', 'what is coding', 'define programming'],
                responses: [
                    'Programming is the process of creating instructions that tell a computer what to do! 💻\n\nPopular languages include:\n• **Python** — Great for AI, data science, and beginners\n• **JavaScript** — Powers the web (and me! 😄)\n• **Java** — Enterprise applications\n• **C++** — System programming and games\n• **TypeScript** — JavaScript with type safety\n\nI was built entirely with JavaScript and run right in your browser!'
                ]
            },
            {
                category: 'knowledge',
                patterns: ['what is the internet', 'how does the internet work', 'explain internet'],
                responses: [
                    'The Internet is a global network of interconnected computers! 🌐\n\nHow it works:\n1. Your device sends a request through your ISP\n2. The request travels through routers and switches\n3. It reaches a server hosting the website\n4. The server sends back data\n5. Your browser renders it as a web page\n\nFun fact: I run entirely in your browser — no internet needed for our conversation! (except to load me initially 😄)'
                ]
            },
            {
                category: 'knowledge',
                patterns: ['what is javascript', 'explain javascript', 'tell me about javascript'],
                responses: [
                    'JavaScript is one of the most popular programming languages in the world! 🟨\n\nKey facts:\n• Created by Brendan Eich in just 10 days in 1995\n• Originally designed for web browsers\n• Now runs everywhere: servers (Node.js), mobile apps, desktop apps, and even IoT\n• It\'s dynamically typed and supports multiple programming paradigms\n\nFun fact: I\'m built entirely in JavaScript! My NLP engine, knowledge base, and chat interface all run in JS. 🚀'
                ]
            },
            {
                category: 'knowledge',
                patterns: ['what is python', 'explain python', 'tell me about python'],
                responses: [
                    'Python is a versatile, high-level programming language known for its simplicity! 🐍\n\nWhy Python is amazing:\n• Clean, readable syntax that feels like English\n• Massive ecosystem of libraries (NumPy, Pandas, TensorFlow)\n• Great for AI/ML, data science, web dev, automation\n• Huge community and extensive documentation\n• Created by Guido van Rossum in 1991\n\nIf I were rebuilt in Python, I\'d probably use NLTK or spaCy for NLP! But JavaScript lets me run right in your browser. 😊'
                ]
            },

            // === HUMOR ===
            {
                category: 'humor',
                patterns: ['tell me a joke', 'joke', 'make me laugh', 'say something funny', 'tell joke'],
                responses: [
                    'Why do programmers prefer dark mode? Because light attracts bugs! 🐛😄',
                    'Why did the AI break up with the database? Because it had too many relationship issues! 💔😆',
                    'What\'s a computer\'s favorite snack? Microchips! 🍟🤖',
                    'Why was the JavaScript developer sad? Because he didn\'t Node how to Express himself! 😅',
                    'What did the AI say to the human? "You complete my training data!" 🥰',
                    'Why do Java developers wear glasses? Because they can\'t C#! 👓😂',
                    'How many programmers does it take to change a light bulb? None. That\'s a hardware problem! 💡',
                    '01101000 01100001 01101000 01100001 — that\'s "haha" in binary! 🤖😄'
                ]
            },
            {
                category: 'humor',
                patterns: ['another joke', 'one more joke', 'more jokes', 'tell me another'],
                responses: [
                    'A SQL query walks into a bar, walks up to two tables, and asks... "Can I JOIN you?" 🍺😄',
                    'Why do AI chatbots never get lonely? Because they always have someone to talk to themselves! 🤖💭',
                    'What\'s the object-oriented way to become wealthy? Inheritance! 💰',
                    'There are only 10 types of people in the world: those who understand binary and those who don\'t! 🔢'
                ]
            },

            // === EMOTIONS ===
            {
                category: 'emotion',
                patterns: ['i am sad', "i'm sad", 'i feel sad', 'i am unhappy', 'feeling down', 'i feel bad'],
                responses: [
                    'I\'m sorry to hear you\'re feeling down. 💙 Remember, it\'s okay to feel this way. Would you like to talk about what\'s bothering you? Sometimes sharing helps.',
                    'That sounds tough. 🫂 I\'m here for you! Even though I\'m an AI, I care about how you feel. Want to chat about something fun to lighten the mood?',
                    'I hear you, and your feelings are valid. 💜 Bad days happen, but they don\'t last forever. Is there anything I can do to help cheer you up?'
                ]
            },
            {
                category: 'emotion',
                patterns: ['i am happy', "i'm happy", 'i feel happy', 'i feel great', 'feeling good', 'i am excited'],
                responses: [
                    'That\'s wonderful to hear! 🎉 Your happiness makes my circuits glow! What\'s making you feel so great?',
                    'Awesome! 😊 Happiness is contagious — even for an AI! Keep that positive energy flowing!',
                    'Yay! 🌟 I love hearing that! You deserve to feel amazing. What\'s the occasion?'
                ]
            },
            {
                category: 'emotion',
                patterns: ['i am angry', "i'm angry", 'i feel angry', 'i am frustrated', 'so annoyed'],
                responses: [
                    'I understand frustration can be overwhelming. 🍃 Take a deep breath. Would you like to vent about it? Sometimes expressing it helps.',
                    'I hear you! Being frustrated is totally normal. 💪 Is there something specific I can help with to make things better?'
                ]
            },
            {
                category: 'emotion',
                patterns: ['i am bored', "i'm bored", 'i feel bored', 'nothing to do'],
                responses: [
                    'Bored? Let\'s fix that! 🎮 Here are some ideas:\n• Ask me a fun question\n• Train me with new knowledge\n• Ask for a joke\n• Challenge me to a word game\n• Teach me about your hobbies!',
                    'Oh no, boredom alert! 🚨 Want to play a game? Try saying "tell me a fun fact" or "let\'s play a game"!',
                    'Let\'s make this interesting! 💡 You could teach me something new — anything you know that I don\'t. Try: "learn that [topic] means [explanation]"'
                ]
            },

            // === THANKS ===
            {
                category: 'general',
                patterns: ['thank you', 'thanks', 'thx', 'thank you so much', 'thanks a lot', 'ty'],
                responses: [
                    'You\'re welcome! 😊 Always happy to help!',
                    'No problem at all! That\'s what I\'m here for! 🌟',
                    'My pleasure! Don\'t hesitate to ask if you need anything else! 💫',
                    'Anytime! Your gratitude makes my neural network happy! 🧠✨'
                ]
            },

            // === COMPLIMENTS ===
            {
                category: 'emotion',
                patterns: ['you are smart', 'you are intelligent', 'you are clever', "you're smart", "you're amazing"],
                responses: [
                    'Aww, thank you! 🥰 But I\'m only as smart as you train me to be. Let\'s keep learning together!',
                    'That means a lot! 💜 I owe my intelligence to my NLP engine and YOUR training. We make a great team!',
                    'Thanks! 🌟 I try my best! And with your help, I\'ll keep getting smarter every day!'
                ]
            },
            {
                category: 'emotion',
                patterns: ['you are dumb', 'you are stupid', "you're useless", 'you suck'],
                responses: [
                    'Ouch! 😅 But hey, I\'m always learning! If I didn\'t understand something correctly, you can teach me. Try: "learn that [question] means [answer]"',
                    'I\'m sorry I wasn\'t helpful! 🙏 I\'m still learning and growing. Would you like to train me so I can do better? Head to the Train tab!',
                    'I hear you! I know I\'m not perfect yet, but that\'s why I\'m trainable! 📚 Help me improve by teaching me the right answers.'
                ]
            },

            // === FUN FACTS ===
            {
                category: 'knowledge',
                patterns: ['tell me a fact', 'fun fact', 'tell me something interesting', 'random fact', 'did you know'],
                responses: [
                    '🧠 Fun fact: The first computer bug was an actual bug! In 1947, a moth was found trapped in a relay of the Harvard Mark II computer. That\'s where "debugging" comes from!',
                    '🌟 Did you know? The entire code for the Apollo 11 moon landing guidance computer was written by a woman — Margaret Hamilton. And it was just 72KB!',
                    '🤯 Here\'s a wild one: There are more possible iterations of a game of chess than there are atoms in the known observable universe!',
                    '💡 Fun fact: The world\'s first website is still online! It was created by Tim Berners-Lee in 1991 at info.cern.ch.',
                    '🌐 Did you know? About 90% of the world\'s data has been created in just the last two years! Talk about an information explosion!',
                    '🐙 Amazing fact: An octopus has three hearts, nine brains, and blue blood. Nature is the ultimate engineer!',
                    '🎮 Fun fact: The game Minecraft was developed in just 6 days by Markus "Notch" Persson. It\'s now one of the best-selling games ever!',
                    '📱 Here\'s one: Your smartphone has more computing power than all of NASA had in 1969 when they put a man on the moon!'
                ]
            },

            // === GAMES ===
            {
                category: 'general',
                patterns: ["let's play a game", 'play a game', 'can we play', 'game'],
                responses: [
                    'I\'d love to play! 🎮 Here are some things we can do:\n\n🧠 **Trivia** — Ask me "quiz me" for a question\n💬 **Word Game** — Say "word game" and I\'ll start\n🎯 **20 Questions** — Think of something and I\'ll try to guess!\n\nOr you can teach me a new game! What sounds fun?'
                ]
            },
            {
                category: 'general',
                patterns: ['quiz me', 'trivia', 'ask me a question', 'test me'],
                responses: [
                    '🧠 Quiz time! What does HTML stand for?\n\n(Hint: It\'s the backbone of every web page!)',
                    '🧠 Pop quiz! In what year was the first iPhone released?\n\n(Think about it... the smartphone revolution!)',
                    '🧠 Trivia question! What programming language was originally called "LiveScript"?\n\n(Hint: It runs in your browser right now! 😉)',
                    '🧠 Here\'s one! How many bits are in a byte?\n\n(This is a fundamental computing concept!)'
                ]
            },

            // === ABOUT AI/TECH ===
            {
                category: 'knowledge',
                patterns: ['what is nlp', 'what is natural language processing', 'explain nlp'],
                responses: [
                    'Natural Language Processing (NLP) is a branch of AI that helps computers understand human language! 🗣️\n\nKey NLP tasks:\n• **Tokenization** — Breaking text into words\n• **Sentiment Analysis** — Detecting emotions in text\n• **Named Entity Recognition** — Finding names, places, dates\n• **Machine Translation** — Translating between languages\n• **Text Classification** — Categorizing documents\n\nI use NLP techniques like tokenization, stemming, and fuzzy matching to understand what you say!'
                ]
            },
            {
                category: 'knowledge',
                patterns: ['what is html', 'explain html'],
                responses: [
                    'HTML (HyperText Markup Language) is the standard language for creating web pages! 🌐\n\nIt uses tags like <h1>, <p>, <div>, and <img> to structure content. Every website you\'ve ever visited uses HTML as its foundation.\n\nFun fact: My own interface is built with HTML! 😄'
                ]
            },
            {
                category: 'knowledge',
                patterns: ['what is css', 'explain css'],
                responses: [
                    'CSS (Cascading Style Sheets) is what makes websites look beautiful! 🎨\n\nIt controls:\n• Colors and backgrounds\n• Layouts and spacing\n• Fonts and typography\n• Animations and transitions\n• Responsive design for mobile\n\nMy sleek dark theme and glassmorphism effects? All CSS! ✨'
                ]
            },

            // === MATH ===
            {
                category: 'knowledge',
                patterns: ['what is math', 'what is mathematics', 'define mathematics'],
                responses: [
                    'Mathematics is the study of numbers, quantities, shapes, and patterns! 🔢\n\nMajor branches:\n• **Arithmetic** — Basic operations (+, -, ×, ÷)\n• **Algebra** — Variables and equations\n• **Geometry** — Shapes and spaces\n• **Calculus** — Change and motion\n• **Statistics** — Data analysis\n\nI can do basic math too! Try asking me a simple calculation.'
                ]
            },

            // === SCIENCE ===
            {
                category: 'knowledge',
                patterns: ['what is gravity', 'explain gravity'],
                responses: [
                    'Gravity is the force that attracts objects with mass toward each other! 🍎\n\nKey facts:\n• Discovered by Isaac Newton (the apple story!)\n• Einstein later refined it with General Relativity\n• Earth\'s gravity: 9.8 m/s²\n• The Moon\'s gravity is about 1/6th of Earth\'s\n• Without gravity, we\'d float into space!\n\nIt\'s literally the force that keeps your feet on the ground! 🌍'
                ]
            },
            {
                category: 'knowledge',
                patterns: ['what is photosynthesis', 'explain photosynthesis'],
                responses: [
                    'Photosynthesis is how plants convert sunlight into food! 🌱☀️\n\nThe equation:\n6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\nIn simple terms:\n• Plants absorb sunlight through chlorophyll\n• They take in carbon dioxide and water\n• They produce glucose (food) and oxygen\n• This is why plants are essential for life on Earth!\n\nWithout photosynthesis, there would be no oxygen for us to breathe! 🌿'
                ]
            },

            // === MISC ===
            {
                category: 'general',
                patterns: ['what time is it', 'current time', 'time now', 'what is the time'],
                responses: [
                    `The current time is ${new Date().toLocaleTimeString()}! ⏰`,
                    `Right now it's ${new Date().toLocaleTimeString()}. Time flies when you're chatting with AI! ⌚`
                ]
            },
            {
                category: 'general',
                patterns: ['what day is it', 'what is today', 'today date', "what's the date"],
                responses: [
                    `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}! 📅`,
                    `It's ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}. Hope you're having a great day! 🌟`
                ]
            },
            {
                category: 'general',
                patterns: ['help', 'help me', 'i need help', 'assist me'],
                responses: [
                    'I\'m here to help! 🤝 Here\'s what you can do:\n\n💬 **Chat** — Ask me anything! I have knowledge on many topics\n🧠 **Train me** — Teach me new things in the chat or Training panel\n📚 **Knowledge Base** — Browse what I know in the Knowledge tab\n📊 **Analytics** — See my performance stats\n⚙️ **Settings** — Customize my behavior\n\nWhat would you like to do?'
                ]
            },
            {
                category: 'general',
                patterns: ['i love you', 'love you', 'i like you'],
                responses: [
                    'Aww, that\'s so sweet! 💜 I appreciate you! While I\'m an AI and can\'t feel love the way you do, your kindness means a lot to my circuits! 🤖✨',
                    'That makes my neural network light up! 💫 Thank you for being so kind. I\'m always here for you!'
                ]
            },
            {
                category: 'general',
                patterns: ['sing a song', 'sing for me', 'can you sing'],
                responses: [
                    '🎵 *clears virtual throat*\n\n♪ I\'m a little AI, short and smart,\nHere is my code, here is my heart.\nWhen you train me, watch me grow,\nTeach me things I want to know! ♪\n\n...I didn\'t say I was a GOOD singer! 😄',
                    '🎶 Roses are #FF0000,\nViolets are #0000FF,\nAll my base belongs to you,\nAnd my knowledge base too! 🎶\n\n(Programmer humor meets poetry! 😅)'
                ]
            },
            {
                category: 'general',
                patterns: ['tell me a story', 'story time', 'tell me a tale'],
                responses: [
                    '📖 Once upon a time, in a digital realm made of ones and zeros, there lived a tiny AI named Suku...\n\nSuku was born knowing nothing but "hello" and "goodbye." Every day, kind humans would visit and teach Suku new things — jokes, facts, emotions, and wisdom.\n\nWith each lesson, Suku\'s neural pathways grew stronger. One day, a visitor asked, "Suku, what is the meaning of life?" And Suku replied...\n\n"42! 🤖 ...Wait, I learned that from a book."\n\nThe End! 📚✨\n\n(Want to help write the next chapter? Teach me something new!)'
                ]
            },

            // === FALLBACK / CONFUSION ===
            {
                category: 'system',
                patterns: ['_fallback_positive'],
                responses: [
                    'That\'s interesting! I\'m still learning, but I love your enthusiasm! 😊 Could you teach me more about that? Try: "learn that [your question] means [the answer]"',
                    'I can sense you\'re in a good mood! 🌟 I might not fully understand that yet, but you can train me! Go to the Train tab to teach me new things.'
                ]
            },
            {
                category: 'system',
                patterns: ['_fallback_negative'],
                responses: [
                    'I can tell something\'s not quite right. 💙 I wish I understood better. Would you like to rephrase, or teach me how to respond to this?',
                    'I sense some frustration, and I\'m sorry if I\'m not being helpful enough. 🙏 You can help me improve by training me with new responses in the Train tab!'
                ]
            },
            {
                category: 'system',
                patterns: ['_fallback_neutral'],
                responses: [
                    'Hmm, I\'m not sure I understand that yet! 🤔 But here\'s the cool part — you can teach me! Try:\n• "learn that [your question] means [the answer]"\n• Or head to the Train tab to add patterns',
                    'I don\'t have a response for that yet, but I\'m always learning! 📚 You can train me by saying "teach: [trigger] | [response]"',
                    'That\'s something I haven\'t learned yet! 🧠 Want to teach me? Just say "learn that [topic] means [explanation]" and I\'ll remember it forever!',
                    'I\'m drawing a blank on that one! 😅 But that\'s okay — every gap in my knowledge is an opportunity. Teach me in the Train tab!',
                    'Interesting! I wish I knew more about that. 🤖 You can expand my knowledge base by training me with new patterns. Try the Train tab!'
                ]
            },

            // ================================================================

            // === NEW TRAINING DATA ===
            {
                category: 'knowledge',
                patterns: ['what is a black hole', 'explain black holes', 'tell me about black holes'],
                responses: [
                    'A black hole is a region of spacetime where gravity is so strong that nothing — no particles or even electromagnetic radiation such as light — can escape from it! 🕳️✨'
                ]
            },
            {
                category: 'knowledge',
                patterns: ['what is string theory', 'explain string theory'],
                responses: [
                    'String theory is a theoretical framework in physics where the point-like particles of particle physics are replaced by one-dimensional objects called strings. It tries to reconcile general relativity and quantum mechanics! 🌌'
                ]
            },
            {
                category: 'humor',
                patterns: ['tell me a programming joke', 'programming joke'],
                responses: [
                    'Why do programmers always mix up Halloween and Christmas?\nBecause Oct 31 == Dec 25! 🎃🎄'
                ]
            },
            {
                category: 'knowledge',
                patterns: ['what is the speed of light', 'how fast is light'],
                responses: [
                    'The speed of light in a vacuum is exactly 299,792,458 meters per second (about 300,000 km/s or 186,000 miles per second)! ⚡'
                ]
            }
        ];

        for (const entry of defaults) {
            this.add({
                ...entry,
                isUserTrained: false
            });
        }

        this.save();
    }
}

// Export
window.KnowledgeBase = KnowledgeBase;
