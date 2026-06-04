/**
 * Suku AI - Core Intelligence Module
 * Orchestrates the NLP engine and knowledge base to generate responses.
 * Handles context awareness, response selection, and learning.
 */

class SukuAI {
    constructor() {
        this.nlp = new NLPEngine();
        this.kb = new KnowledgeBase();
        
        // Load the massive multi-file data if it exists (Part 3)
        if (window.knowledgeDataPart3) {
            console.log("Loading Knowledge Base Part 3 (10,000,000 lines)...");
            for (const entry of window.knowledgeDataPart3) {
                this.kb.add({
                    ...entry,
                    isUserTrained: false
                });
            }
            console.log("Part 3 Loaded.");
        }

        // Load the massive multi-file data if it exists (Part 4)
        if (window.knowledgeDataPart4) {
            console.log("Loading Knowledge Base Part 4 (10,000,000 lines)...");
            for (const entry of window.knowledgeDataPart4) {
                this.kb.add({
                    ...entry,
                    isUserTrained: false
                });
            }
            console.log("Part 4 Loaded.");
        }

        // Load the massive multi-file data if it exists (Part 5)
        if (window.knowledgeDataPart5) {
            console.log("Loading Knowledge Base Part 5 (10,000,000 lines)...");
            for (const entry of window.knowledgeDataPart5) {
                this.kb.add({
                    ...entry,
                    isUserTrained: false
                });
            }
            console.log("Part 5 Loaded.");
        }

        // Load the massive multi-file data if it exists (Part 6)
        if (window.knowledgeDataPart6) {
            console.log("Loading Knowledge Base Part 6 (10,000,000 lines)...");
            for (const entry of window.knowledgeDataPart6) {
                this.kb.add({
                    ...entry,
                    isUserTrained: false
                });
            }
            console.log("Part 6 Loaded.");
        }

        // Load the massive multi-file data if it exists (Part 7)
        if (window.knowledgeDataPart7) {
            console.log("Loading Knowledge Base Part 7 (10,000,000 lines)...");
            for (const entry of window.knowledgeDataPart7) {
                this.kb.add({
                    ...entry,
                    isUserTrained: false
                });
            }
            console.log("Part 7 Loaded.");
        }

        // Load the massive multi-file data if it exists (Part 8)
        if (window.knowledgeDataPart8) {
            console.log("Loading Knowledge Base Part 8 (10,000,000 lines)...");
            for (const entry of window.knowledgeDataPart8) {
                this.kb.add({
                    ...entry,
                    isUserTrained: false
                });
            }
            console.log("Part 8 Loaded.");
        }

        // Load the massive multi-file data if it exists (Part 9)
        if (window.knowledgeDataPart9) {
            console.log("Loading Knowledge Base Part 9 (10,000,000 lines)...");
            for (const entry of window.knowledgeDataPart9) {
                this.kb.add({
                    ...entry,
                    isUserTrained: false
                });
            }
            console.log("Part 9 Loaded.");
        }

        // Load the massive multi-file data if it exists (Part 10)
        if (window.knowledgeDataPart10) {
            console.log("Loading Knowledge Base Part 10 (10,000,000 lines)...");
            for (const entry of window.knowledgeDataPart10) {
                this.kb.add({
                    ...entry,
                    isUserTrained: false
                });
            }
            console.log("Part 10 Loaded.");
        }

        // Load the massive multi-file data if it exists (Part 11)
        if (window.knowledgeDataPart11) {
            console.log("Loading Knowledge Base Part 11 (10,000,000 lines)...");
            for (const entry of window.knowledgeDataPart11) {
                this.kb.add({
                    ...entry,
                    isUserTrained: false
                });
            }
            console.log("Part 11 Loaded.");
        }

        // Load the massive multi-file data if it exists (Part 12)
        if (window.knowledgeDataPart12) {
            console.log("Loading Knowledge Base Part 12 (10,000,000 lines)...");
            for (const entry of window.knowledgeDataPart12) {
                this.kb.add({
                    ...entry,
                    isUserTrained: false
                });
            }
            console.log("Part 12 Loaded.");
        }

        // Load the massive multi-file data if it exists (Part 13)
        if (window.knowledgeDataPart13) {
            console.log("Loading Knowledge Base Part 13 (10,000,000 lines)...");
            for (const entry of window.knowledgeDataPart13) {
                this.kb.add({
                    ...entry,
                    isUserTrained: false
                });
            }
            console.log("Part 13 Loaded.");
        }

        this.context = []; // Conversation history
        this.settings = this.kb.loadSettings();
        this.userMemory = this.loadUserMemory(); // Remember user-specific data
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
                text: 'Did you mean to send something? I\'m all ears! 👂',
                confidence: 1,
                intent: 'empty',
                processingTime: 0
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
            response = this.handleContextual(trimmed, processed);
        }
        // Standard pattern matching
        else {
            response = this.findBestMatch(trimmed, processed, intentInfo);
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
        return /^[\d\s\+\-\*\/\.\(\)\^%]+$/.test(text.trim()) ||
               /^(?:what\s+is\s+)?(\d+)\s*[\+\-\*\/\^%]\s*(\d+)/.test(text.toLowerCase().trim());
    }

    handleMath(input) {
        try {
            // Extract math expression
            let expr = input.toLowerCase().replace(/^what\s+is\s+/, '').trim();
            expr = expr.replace(/\^/g, '**');
            
            // Safety: only allow math characters
            if (!/^[\d\s\+\-\*\/\.\(\)\%]+$/.test(expr)) {
                throw new Error('Invalid expression');
            }

            // Evaluate
            const result = Function('"use strict"; return (' + expr + ')')();
            
            if (typeof result === 'number' && !isNaN(result)) {
                return {
                    text: `🧮 The answer is **${result}**!`,
                    confidence: 1.0,
                    intent: 'math'
                };
            }
            throw new Error('Invalid result');
        } catch (e) {
            return {
                text: 'Hmm, I had trouble with that math expression. 🤔 Try something simpler like "2 + 2" or "what is 15 * 3".',
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
    handleContextual(text, processed) {
        const lower = text.toLowerCase().trim();
        const lastAI = this.getLastAIMessage();

        // If the last response was a joke, and they want more
        if (['another one', 'one more', 'again', 'more', 'another'].includes(lower)) {
            if (lastAI && (lastAI.includes('joke') || lastAI.includes('😄') || lastAI.includes('😂'))) {
                return this.findBestMatch('tell me another joke', this.nlp.process('tell me another joke'), 
                    this.nlp.detectIntent('tell me another joke'));
            }
            if (lastAI && lastAI.includes('fact')) {
                return this.findBestMatch('tell me a fact', this.nlp.process('tell me a fact'),
                    this.nlp.detectIntent('tell me a fact'));
            }
        }

        // Yes/No responses
        if (['yes', 'yeah', 'sure', 'okay', 'ok', 'yep', 'yup'].includes(lower)) {
            return {
                text: 'Great! 😊 What would you like to know or talk about?',
                confidence: 0.7,
                intent: 'affirmative'
            };
        }

        if (['no', 'nah', 'nope'].includes(lower)) {
            return {
                text: 'No worries! 😊 Let me know if you need anything else.',
                confidence: 0.7,
                intent: 'negative'
            };
        }

        // Default to standard matching
        return this.findBestMatch(text, processed, this.nlp.detectIntent(text));
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
     * Find the best matching response from the knowledge base
     */
    findBestMatch(input, processed, intentInfo) {
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
            text: 'I\'m not sure I understand that yet, but I\'m always learning! 🧠 You can teach me by saying "learn that [question] means [answer]".',
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
