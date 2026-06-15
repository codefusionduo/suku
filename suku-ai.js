/**
 * Suku AI - Core Intelligence Module
 * Orchestrates the NLP engine and knowledge base to generate responses.
 * Handles context awareness, response selection, and learning.
 */

class SukuAI {
    constructor() {
        this.nlp = new NLPEngine();
        this.kb = new KnowledgeBase();

        this.context = []; // Conversation history
        this.settings = this.kb.loadSettings();
        this.userMemory = this.loadUserMemory(); // Remember user-specific data
        this.trainBulk = true;
    }

    /**
     * Load user memory
     */
    loadUserMemory() {
        try {
            const stored = localStorage.getItem('suku_ai_user_memory');
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            return {};
        }
    }

    /**
     * Save user memory
     */
    saveUserMemory() {
        try {
            localStorage.setItem('suku_ai_user_memory', JSON.stringify(this.userMemory));
        } catch (e) {
            console.error('Failed to save user memory:', e);
        }
    }

    /**
     * Process a user message and generate a response
     */
    async processMessage(userInput) {
        const startTime = performance.now();
        const trimmed = userInput.trim();
        
        if (!trimmed) {
            return {
                text: 'Hey, I\'m right here! 💖 Did you want to say something? Take your time — I\'m always ready to listen! 🤗',
                confidence: 1,
                intent: 'empty',
                processingTime: 0
            };
        }

        const lowerInput = trimmed.toLowerCase();
        const hasGirl = lowerInput.includes('girl') || lowerInput.includes('ladki') || lowerInput.includes('female') || lowerInput.includes('women') || lowerInput.includes('woman') || lowerInput.includes('gf');
        const hasImage = lowerInput.includes('image') || lowerInput.includes('photo') || lowerInput.includes('pic') || lowerInput.includes('picture') || lowerInput.includes('banao') || lowerInput.includes('banna') || lowerInput.includes('show') || lowerInput.includes('de do') || lowerInput.includes('draw') || lowerInput.includes('create') || lowerInput.includes('generate');

        if (hasGirl && hasImage) {
            const girlImages = [
                "image generation/download.png",
                "image generation/download.jpg",
                "image generation/download (1).jpg",
                "image generation/𝒲aguri 🪷.jpg",
                "image generation/( ˘ ³˘)♥︎ᗰY ᖴᗩᐯ ᑕᕼᗩᖇᗩᑕTᗴᖇ.jpg",
                "image generation/3857cdca52851a352561f7cad82d80f0.jpg",
                "image generation/8936b78be1366274e1c08246504a73be.jpg",
                "image generation/a9df76aa5b26f37f83298bf50f7a0d15.jpg",
                "image generation/fb3c0bea8844f152c9f9f4a5740556f9.jpg"
            ];
            const selectedImage = girlImages[Math.floor(Math.random() * girlImages.length)];
            
            // Add user message to context
            this.context.push({ role: 'user', text: trimmed, timestamp: Date.now() });
            
            const responseText = `Here is a girl image for you: <br><br><img src="${selectedImage}" style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);" />`;
            
            // Add AI response to context
            this.context.push({ role: 'ai', text: responseText, timestamp: Date.now() });
            
            return {
                text: responseText,
                confidence: 1.0,
                intent: 'image_generation',
                processingTime: Math.round(performance.now() - startTime)
            };
        }

        // Add to context
        this.context.push({ role: 'user', text: trimmed, timestamp: Date.now() });
        
        // Trim context to configured size
        const maxContext = parseInt(this.settings.contextSize) || 5;
        if (this.context.length > maxContext * 2) {
            this.context = this.context.slice(-maxContext * 2);
        }

        // Detect intent
        const intentInfo = this.nlp.detectIntent(trimmed);
        const processed = this.nlp.process(trimmed);

        let response;

        // Handle teaching commands
        if (intentInfo.isTeaching) {
            response = this.handleTeaching(trimmed);
        }
        // Handle math expressions
        else if (this.isMathExpression(trimmed)) {
            response = this.handleMath(trimmed);
        }
        // Handle time/date queries
        else if (this.isTimeQuery(trimmed)) {
            response = this.handleTimeQuery(trimmed);
        }
        // Handle context-aware responses
        else if (this.isContextualFollowUp(trimmed)) {
            response = await this.handleContextual(trimmed, processed);
        }
        // Standard pattern matching
        else {
            response = await this.findBestMatch(trimmed, processed, intentInfo);
        }

        // Add AI response to context
        this.context.push({ role: 'ai', text: response.text, timestamp: Date.now() });

        // Calculate processing time
        response.processingTime = Math.round(performance.now() - startTime);

        return response;
    }

    /**
     * Handle teaching commands
     */
    handleTeaching(input) {
        const parsed = this.nlp.parseTeachingCommand(input);
        
        if (parsed) {
            // Add to knowledge base
            const entry = this.kb.add({
                category: 'custom',
                patterns: [parsed.pattern],
                responses: [parsed.response],
                isUserTrained: true
            });

            this.kb.logActivity('train', `Learned: "${parsed.pattern}" → "${parsed.response.substring(0, 50)}..."`);

            return {
                text: `Got it! 🧠 I've learned something new!\n\n**When asked:** "${parsed.pattern}"\n**I'll respond:** "${parsed.response}"\n\nThanks for teaching me! You can test it by asking me that question now.`,
                confidence: 1.0,
                intent: 'teaching',
                learned: true,
                entryId: entry.id
            };
        }

        return {
            text: 'I want to learn! 📚 But I couldn\'t quite parse that. Try one of these formats:\n\n• "learn that [question] means [answer]"\n• "teach: [trigger] | [response]"\n• "remember that my name is [name]"',
            confidence: 0.8,
            intent: 'teaching_help'
        };
    }

    /**
     * Handle math expressions
     */
    isMathExpression(text) {
        const lower = text.toLowerCase().trim();
        if (/^[\d\s\+\-\*\/\.\(\)\^%]+$/.test(lower)) return true;
        if (/^(?:what\s+is\s+)?(\d+(?:\.\d+)?)\s*[\+\-\*\/\^%]\s*(\d+(?:\.\d+)?)/.test(lower)) return true;
        if (/(square root|sqrt|cube root|cbrt)\s*(of\s*)?\d+(?:\.\d+)?/.test(lower)) return true;
        if (/^(calculate|solve)\s+[\d\s\+\-\*\/\.\(\)\^%]+/.test(lower)) return true;
        return false;
    }

    handleMath(input) {
        try {
            let expr = input.toLowerCase().trim();
            // Remove common text prefixes
            expr = expr.replace(/^(what\s+is(\s+the)?|calculate|solve)\s+/g, '').trim();

            // Handle square root
            const sqrtMatch = expr.match(/(?:square root(?: of)?|sqrt(?: of)?)\s*(\d+(?:\.\d+)?)/);
            if (sqrtMatch) {
                const val = parseFloat(sqrtMatch[1]);
                const result = Math.sqrt(val);
                return { text: `🧮 The square root of ${val} is **${result}**!`, confidence: 1.0, intent: 'math' };
            }

            // Handle cube root
            const cbrtMatch = expr.match(/(?:cube root(?: of)?|cbrt(?: of)?)\s*(\d+(?:\.\d+)?)/);
            if (cbrtMatch) {
                const val = parseFloat(cbrtMatch[1]);
                const result = Math.cbrt(val);
                return { text: `🧮 The cube root of ${val} is **${result}**!`, confidence: 1.0, intent: 'math' };
            }

            // Handle exponentiation and standard evaluation
            expr = expr.replace(/\^/g, '**');
            
            // Safety: only allow math characters for the Function evaluator
            if (!/^[\d\s\+\-\*\/\.\(\)\%]+$/.test(expr)) {
                throw new Error('Invalid expression');
            }

            // Evaluate safely using Function wrapper
            const result = Function('"use strict"; return (' + expr + ')')();
            
            if (typeof result === 'number' && !isNaN(result)) {
                // If it's a float, limit decimals for clean output
                const displayResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
                return {
                    text: `🧮 The answer is **${displayResult}**!`,
                    confidence: 1.0,
                    intent: 'math'
                };
            }
            throw new Error('Invalid result');
        } catch (e) {
            return {
                text: 'Hmm, I had trouble evaluating that math expression. 🤔 Try something like "2 + 2", "calculate 15 * 3", "square root of 16", or "cbrt 27".',
                confidence: 0.5,
                intent: 'math_error'
            };
        }
    }

    /**
     * Check if message is a time/date query
     */
    isTimeQuery(text) {
        const lower = text.toLowerCase().trim();
        return lower.includes('what time is it') || 
               lower.includes('current time') || 
               lower.includes('what is the time') ||
               lower.includes('what day is it') ||
               lower.includes('what is today') ||
               lower.includes('current date') ||
               lower.includes('what is the date') ||
               lower.includes('what month is it') ||
               lower.includes('what year is it') ||
               lower.includes('tell me the time') ||
               lower.includes('tell me the date');
    }

    /**
     * Handle time/date queries dynamically
     */
    handleTimeQuery(input) {
        const lower = input.toLowerCase().trim();
        const now = new Date();
        let text = '';
        
        if (lower.includes('time')) {
            text = `The current local time is **${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}**. ⏰`;
        } else if (lower.includes('day')) {
            text = `Today is **${now.toLocaleDateString([], {weekday: 'long'})}**. 📅`;
        } else if (lower.includes('year')) {
            text = `It is currently the year **${now.getFullYear()}**. 🗓️`;
        } else if (lower.includes('month')) {
            text = `We are currently in **${now.toLocaleDateString([], {month: 'long'})}**. 📅`;
        } else {
            text = `Today's date is **${now.toLocaleDateString([], {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}**. 📅`;
        }

        return {
            text: text,
            confidence: 1.0,
            intent: 'time_query'
        };
    }

    /**
     * Check if message is a contextual follow-up
     */
    isContextualFollowUp(text) {
        const lower = text.toLowerCase().trim();
        const contextualPhrases = ['yes', 'no', 'sure', 'okay', 'ok', 'yeah', 'nah', 
                                    'tell me more', 'more', 'go on', 'continue',
                                     'another one', 'one more', 'again', 'and', 'also',
                                    'what else', 'anything else'];
        return contextualPhrases.includes(lower) || lower.length < 4;
    }

    /**
     * Handle contextual follow-ups
     */
    async handleContextual(text, processed) {
        const lower = text.toLowerCase().trim();
        const lastAI = this.getLastAIMessage();

        // If the last response was a joke, and they want more
        if (['another one', 'one more', 'again', 'more', 'another'].includes(lower)) {
            if (lastAI && (lastAI.includes('joke') || lastAI.includes('😄') || lastAI.includes('😂'))) {
                return await this.findBestMatch('tell me another joke', this.nlp.process('tell me another joke'), 
                    this.nlp.detectIntent('tell me another joke'));
            }
            if (lastAI && lastAI.includes('fact')) {
                return await this.findBestMatch('tell me a fact', this.nlp.process('tell me a fact'),
                    this.nlp.detectIntent('tell me a fact'));
            }
        }

        // Yes/No responses
        if (['yes', 'yeah', 'sure', 'okay', 'ok', 'yep', 'yup'].includes(lower)) {
            return {
                text: 'Awesome! 😊💖 I love your energy! So, what shall we chat about? I\'m all yours!',
                confidence: 0.7,
                intent: 'affirmative'
            };
        }

        if (['no', 'nah', 'nope'].includes(lower)) {
            return {
                text: 'Totally okay, friend! 🤗 No pressure at all. I\'m right here whenever you need me — just say the word! 💜',
                confidence: 0.7,
                intent: 'negative'
            };
        }

        // Default to standard matching
        return await this.findBestMatch(text, processed, this.nlp.detectIntent(text));
    }

    /**
     * Get the last AI message from context
     */
    getLastAIMessage() {
        for (let i = this.context.length - 1; i >= 0; i--) {
            if (this.context[i].role === 'ai') {
                return this.context[i].text;
            }
        }
        return null;
    }

    /**
     * Call Gemini API for smart responses
     */
    async callGeminiAPI(userInput) {
        const apiKey = this.settings.geminiApiKey;
        if (!apiKey) return null;

        try {
            // Map context size
            const maxContext = parseInt(this.settings.contextSize) || 5;
            const recentContext = this.context.slice(-maxContext * 2);

            const contents = recentContext.map(msg => ({
                role: msg.role === 'ai' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contents })
            });

            if (!response.ok) {
                const errData = await response.json();
                console.error('Gemini API Error:', errData);
                return null;
            }

            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                return {
                    text: data.candidates[0].content.parts[0].text,
                    confidence: 0.99,
                    intent: 'gemini',
                    isGemini: true
                };
            }
        } catch (e) {
            console.error('Failed to call Gemini API:', e);
        }
        return null;
    }

    /**
     * Find the best matching response from the knowledge base
     */
    async findBestMatch(input, processed, intentInfo) {
        const threshold = parseFloat(this.settings.threshold) || 0.45;
        const entries = this.kb.getAll();
        
        let bestMatch = null;
        let bestScore = 0;
        let bestEntryId = null;

        for (const entry of entries) {
            // Skip system fallback entries for normal matching
            if (entry.patterns.some(p => p.startsWith('_fallback'))) continue;

            for (const pattern of entry.patterns) {
                const score = this.nlp.calculateSimilarity(input, pattern);
                
                // Bonus for matching intent category
                let adjustedScore = score;
                if (intentInfo.intent === entry.category) {
                    adjustedScore += 0.05;
                }

                if (adjustedScore > bestScore) {
                    bestScore = adjustedScore;
                    bestMatch = entry;
                    bestEntryId = entry.id;
                }
            }
        }

        // If we found a good match
        if (bestMatch && bestScore >= threshold) {
            // Pick a random response
            const response = this.pickResponse(bestMatch.responses);
            
            // Record the match
            this.kb.recordMatch(bestEntryId, bestScore);
            this.kb.logActivity('chat', `Matched "${input.substring(0, 40)}" → ${bestMatch.category} (${Math.round(bestScore * 100)}%)`);

            return {
                text: this.personalizeResponse(response),
                confidence: bestScore,
                intent: bestMatch.category,
                matchedPattern: bestMatch.patterns[0],
                entryId: bestEntryId
            };
        }

        // No good match — use Gemini if key is provided
        if (this.settings.geminiApiKey) {
            const geminiResponse = await this.callGeminiAPI(input);
            if (geminiResponse) {
                this.kb.recordMatch('gemini', 0.99);
                this.kb.logActivity('chat', `Gemini fallback: "${input.substring(0, 40)}"`);
                return geminiResponse;
            }
        }

        // No good match — use fallback based on sentiment
        this.kb.recordMiss();
        this.kb.logActivity('miss', `No match for: "${input.substring(0, 50)}"`);
        
        return this.generateFallback(processed);
    }

    /**
     * Pick a response (weighted random to avoid repetition)
     */
    pickResponse(responses) {
        if (responses.length === 0) return 'I\'m not sure what to say! 🤔';
        if (responses.length === 1) return responses[0];

        // Simple random pick (could be improved with recency tracking)
        const index = Math.floor(Math.random() * responses.length);
        return responses[index];
    }

    /**
     * Personalize a response with user data
     */
    personalizeResponse(response) {
        let result = response;
        
        // Replace time-based placeholders
        if (result.includes('${new Date()')) {
            // Dynamic time responses are handled by the knowledge base defaults
        }

        // Replace user memory placeholders
        if (this.userMemory.name) {
            result = result.replace(/\{user_name\}/g, this.userMemory.name);
        }

        // Apply style adjustments
        if (this.settings.style === 'professional') {
            result = result.replace(/😄|😂|😅|🤖|💫|✨|🌟|🎮|🚀|🎉|💡|🤯/g, '').trim();
        }

        return result;
    }

    /**
     * Generate a fallback response based on sentiment
     */
    generateFallback(processed) {
        const sentiment = processed.sentiment;
        let fallbackKey;

        if (sentiment.label === 'positive' || sentiment.label === 'very_positive') {
            fallbackKey = '_fallback_positive';
        } else if (sentiment.label === 'negative' || sentiment.label === 'very_negative') {
            fallbackKey = '_fallback_negative';
        } else {
            fallbackKey = '_fallback_neutral';
        }

        // Find fallback entry
        const fallback = this.kb.getAll().find(e => e.patterns.includes(fallbackKey));
        
        if (fallback) {
            const response = this.pickResponse(fallback.responses);
            return {
                text: response,
                confidence: 0.1,
                intent: 'fallback',
                sentiment: sentiment.label
            };
        }

        // Ultimate fallback
        return {
            text: 'Hmm, I haven\'t learned about that yet, but I really WANT to! 🥺💜 You can teach me by saying "learn that [question] means [answer]" — I promise I\'ll remember it forever! 🧠✨',
            confidence: 0,
            intent: 'fallback',
            sentiment: sentiment.label
        };
    }

    /**
     * Train a new pattern
     */
    train(category, patterns, responses) {
        const entry = this.kb.add({
            category,
            patterns,
            responses,
            isUserTrained: true
        });

        this.kb.logActivity('train', `Added ${patterns.length} patterns in "${category}" category`);
        return entry;
    }

    /**
     * Get settings
     */
    getSettings() {
        return this.settings;
    }

    /**
     * Update settings
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.kb.saveSettings(this.settings);
    }
}

// Export
window.SukuAI = SukuAI;
