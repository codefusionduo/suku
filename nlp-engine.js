/**
 * NLP Engine for Suku AI
 * Handles text processing, tokenization, fuzzy matching, 
 * sentiment analysis, and intent classification.
 * No external APIs - everything runs client-side.
 */

class NLPEngine {
    constructor() {
        // Common stop words to filter out
        this.stopWords = new Set([
            'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
            'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
            'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
            'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
            'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
            'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
            'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'or',
            'if', 'while', 'about', 'up', 'it', 'its', "it's", 'that', 'this',
            'these', 'those', 'am', 'i', 'me', 'my', 'we', 'our', 'you', 'your'
        ]);

        // Sentiment word lists
        this.positiveWords = new Set([
            'good', 'great', 'awesome', 'amazing', 'wonderful', 'fantastic',
            'excellent', 'love', 'like', 'happy', 'joy', 'beautiful', 'perfect',
            'best', 'brilliant', 'superb', 'nice', 'cool', 'fun', 'thanks',
            'thank', 'appreciate', 'glad', 'pleased', 'excited', 'incredible',
            'outstanding', 'remarkable', 'positive', 'helpful', 'kind', 'sweet',
            'lovely', 'delightful', 'cheerful', 'wonderful', 'terrific', 'fabulous'
        ]);

        this.negativeWords = new Set([
            'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'sad',
            'angry', 'upset', 'annoyed', 'frustrated', 'disappointed', 'wrong',
            'worst', 'ugly', 'stupid', 'dumb', 'boring', 'useless', 'broken',
            'fail', 'failed', 'sucks', 'poor', 'pathetic', 'disgusting',
            'miserable', 'depressed', 'unhappy', 'negative', 'rude', 'mean',
            'cruel', 'painful', 'irritating', 'annoying', 'lousy', 'dreadful'
        ]);

        // Stemming rules (simple suffix stripping)
        this.stemRules = [
            { suffix: 'ies', replacement: 'y' },
            { suffix: 'ied', replacement: 'y' },
            { suffix: 'ing', replacement: '' },
            { suffix: 'tion', replacement: '' },
            { suffix: 'ness', replacement: '' },
            { suffix: 'ment', replacement: '' },
            { suffix: 'able', replacement: '' },
            { suffix: 'ible', replacement: '' },
            { suffix: 'ally', replacement: '' },
            { suffix: 'ful', replacement: '' },
            { suffix: 'ous', replacement: '' },
            { suffix: 'ive', replacement: '' },
            { suffix: 'ly', replacement: '' },
            { suffix: 'er', replacement: '' },
            { suffix: 'ed', replacement: '' },
            { suffix: 'es', replacement: '' },
            { suffix: 's', replacement: '' },
        ];

        // Synonym map for better matching
        this.synonyms = {
            'hello': ['hi', 'hey', 'greetings', 'howdy', 'hola', 'yo', 'sup', "what's up", 'whats up'],
            'goodbye': ['bye', 'farewell', 'see you', 'later', 'cya', 'take care', 'good night', 'goodnight'],
            'thanks': ['thank you', 'thx', 'ty', 'cheers', 'appreciate', 'grateful'],
            'yes': ['yeah', 'yep', 'yup', 'sure', 'ok', 'okay', 'affirmative', 'correct', 'right'],
            'no': ['nah', 'nope', 'negative', 'wrong', 'incorrect', 'never'],
            'help': ['assist', 'support', 'aid', 'guide', 'how to'],
            'what': ['whats', "what's", 'wut', 'wat'],
            'why': ['how come', 'reason'],
            'how': ['in what way', 'by what means'],
            'good': ['great', 'awesome', 'nice', 'cool', 'excellent', 'fine', 'well'],
            'bad': ['terrible', 'awful', 'horrible', 'poor', 'worst'],
            'like': ['enjoy', 'love', 'prefer', 'fond of'],
            'happy': ['glad', 'joyful', 'cheerful', 'pleased', 'delighted'],
            'sad': ['unhappy', 'depressed', 'down', 'upset', 'miserable'],
            'angry': ['mad', 'furious', 'annoyed', 'irritated', 'frustrated'],
            'smart': ['intelligent', 'clever', 'brilliant', 'wise', 'brainy'],
            'funny': ['hilarious', 'humorous', 'comedic', 'amusing', 'comical'],
            'name': ['called', 'named', 'identity', 'who are you'],
            'create': ['make', 'build', 'generate', 'produce', 'construct'],
            'learn': ['study', 'understand', 'train', 'educate', 'teach'],
            'big': ['large', 'huge', 'massive', 'enormous', 'giant', 'vast'],
            'small': ['tiny', 'little', 'miniature', 'minute', 'compact'],
            'fast': ['quick', 'rapid', 'speedy', 'swift', 'hasty'],
            'slow': ['sluggish', 'gradual', 'unhurried', 'leisurely'],
            'important': ['crucial', 'vital', 'essential', 'significant', 'critical'],
            'difficult': ['hard', 'tough', 'challenging', 'complex', 'complicated'],
            'easy': ['simple', 'straightforward', 'effortless', 'basic'],
            'old': ['ancient', 'historic', 'vintage', 'antique', 'aged'],
            'new': ['modern', 'recent', 'latest', 'contemporary', 'current'],
            'beautiful': ['pretty', 'gorgeous', 'stunning', 'attractive', 'lovely'],
            'scary': ['frightening', 'terrifying', 'creepy', 'spooky', 'fearsome'],
            'start': ['begin', 'commence', 'initiate', 'launch', 'kick off'],
            'end': ['finish', 'complete', 'conclude', 'terminate', 'wrap up'],
            'think': ['believe', 'consider', 'ponder', 'reflect', 'contemplate'],
            'talk': ['speak', 'discuss', 'chat', 'converse', 'communicate'],
            'work': ['job', 'career', 'occupation', 'profession', 'employment'],
            'money': ['cash', 'currency', 'funds', 'finance', 'wealth'],
            'doctor': ['physician', 'medical', 'health', 'healthcare'],
            'fix': ['repair', 'solve', 'resolve', 'mend', 'correct'],
            'explain': ['describe', 'clarify', 'elaborate', 'illustrate', 'define'],
            'amazing': ['incredible', 'astonishing', 'phenomenal', 'extraordinary', 'remarkable'],
        };

        // Build reverse synonym map
        this.reverseSynonyms = {};
        for (const [key, syns] of Object.entries(this.synonyms)) {
            for (const syn of syns) {
                if (!this.reverseSynonyms[syn]) {
                    this.reverseSynonyms[syn] = [];
                }
                this.reverseSynonyms[syn].push(key);
            }
        }
    }

    /**
     * Tokenize text into words
     */
    tokenize(text) {
        if (!text || typeof text !== 'string') return [];
        return text
            .toLowerCase()
            .replace(/[^\w\s'-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .filter(word => word.length > 0);
    }

    /**
     * Remove stop words from tokens
     */
    removeStopWords(tokens) {
        return tokens.filter(token => !this.stopWords.has(token));
    }

    /**
     * Simple stemming (suffix stripping)
     */
    stem(word) {
        if (word.length < 4) return word;
        for (const rule of this.stemRules) {
            if (word.endsWith(rule.suffix) && word.length > rule.suffix.length + 2) {
                return word.slice(0, -rule.suffix.length) + rule.replacement;
            }
        }
        return word;
    }

    /**
     * Process text through the NLP pipeline
     */
    process(text) {
        const original = text.toLowerCase().trim();
        const tokens = this.tokenize(text);
        const filtered = this.removeStopWords(tokens);
        const stemmed = filtered.map(t => this.stem(t));
        const sentiment = this.analyzeSentiment(tokens);

        return {
            original,
            tokens,
            filtered,
            stemmed,
            sentiment,
            length: tokens.length
        };
    }

    /**
     * Levenshtein distance between two strings
     */
    levenshteinDistance(a, b) {
        const matrix = [];
        const aLen = a.length;
        const bLen = b.length;

        if (aLen === 0) return bLen;
        if (bLen === 0) return aLen;

        for (let i = 0; i <= bLen; i++) matrix[i] = [i];
        for (let j = 0; j <= aLen; j++) matrix[0][j] = j;

        for (let i = 1; i <= bLen; i++) {
            for (let j = 1; j <= aLen; j++) {
                const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        return matrix[bLen][aLen];
    }

    /**
     * Calculate similarity between two strings (0-1)
     */
    stringSimilarity(a, b) {
        a = a.toLowerCase().trim();
        b = b.toLowerCase().trim();

        if (a === b) return 1;
        if (a.length === 0 || b.length === 0) return 0;

        const distance = this.levenshteinDistance(a, b);
        const maxLen = Math.max(a.length, b.length);
        return 1 - distance / maxLen;
    }

    /**
     * Calculate Jaccard similarity between two sets of tokens
     */
    jaccardSimilarity(tokensA, tokensB) {
        const setA = new Set(tokensA);
        const setB = new Set(tokensB);
        const intersection = new Set([...setA].filter(x => setB.has(x)));
        const union = new Set([...setA, ...setB]);
        
        if (union.size === 0) return 0;
        return intersection.size / union.size;
    }

    /**
     * N-gram generation
     */
    ngrams(tokens, n) {
        const grams = [];
        for (let i = 0; i <= tokens.length - n; i++) {
            grams.push(tokens.slice(i, i + n).join(' '));
        }
        return grams;
    }

    /**
     * Calculate comprehensive similarity between input and a pattern
     */
    calculateSimilarity(input, pattern) {
        const inputLower = input.toLowerCase().trim();
        const patternLower = pattern.toLowerCase().trim();

        // Exact match
        if (inputLower === patternLower) return 1.0;

        // Contains check
        if (inputLower.includes(patternLower) || patternLower.includes(inputLower)) {
            const containScore = Math.min(inputLower.length, patternLower.length) / 
                                  Math.max(inputLower.length, patternLower.length);
            if (containScore > 0.5) return 0.85 + (containScore * 0.1);
        }

        const inputProcessed = this.process(input);
        const patternProcessed = this.process(pattern);

        // String-level similarity
        const strSim = this.stringSimilarity(inputLower, patternLower);

        // Token-level Jaccard with stemming
        const tokenSim = this.jaccardSimilarity(
            inputProcessed.stemmed,
            patternProcessed.stemmed
        );

        // Bigram similarity
        const inputBigrams = this.ngrams(inputProcessed.tokens, 2);
        const patternBigrams = this.ngrams(patternProcessed.tokens, 2);
        const bigramSim = inputBigrams.length > 0 && patternBigrams.length > 0
            ? this.jaccardSimilarity(inputBigrams, patternBigrams)
            : 0;

        // Synonym-expanded matching
        const expandedInput = this.expandWithSynonyms(inputProcessed.tokens);
        const expandedPattern = this.expandWithSynonyms(patternProcessed.tokens);
        const synonymSim = this.jaccardSimilarity(expandedInput, expandedPattern);

        // Weighted combination
        const score = (strSim * 0.25) + (tokenSim * 0.3) + (bigramSim * 0.15) + (synonymSim * 0.3);
        
        return Math.min(score, 1.0);
    }

    /**
     * Expand tokens with their synonyms
     */
    expandWithSynonyms(tokens) {
        const expanded = [...tokens];
        for (const token of tokens) {
            // Add synonyms of the token
            if (this.synonyms[token]) {
                expanded.push(...this.synonyms[token]);
            }
            // Add canonical form if token is a synonym
            if (this.reverseSynonyms[token]) {
                expanded.push(...this.reverseSynonyms[token]);
            }
        }
        return expanded;
    }

    /**
     * Analyze sentiment of tokens
     */
    analyzeSentiment(tokens) {
        let score = 0;
        let positiveCount = 0;
        let negativeCount = 0;

        for (const token of tokens) {
            if (this.positiveWords.has(token)) {
                score += 1;
                positiveCount++;
            }
            if (this.negativeWords.has(token)) {
                score -= 1;
                negativeCount++;
            }
        }

        // Handle negation
        for (let i = 0; i < tokens.length - 1; i++) {
            if (['not', "don't", "doesn't", "didn't", "won't", "can't", "isn't", "aren't", 'never', 'no'].includes(tokens[i])) {
                if (this.positiveWords.has(tokens[i + 1])) {
                    score -= 2; // reverse the positive
                } else if (this.negativeWords.has(tokens[i + 1])) {
                    score += 2; // reverse the negative
                }
            }
        }

        let label = 'neutral';
        if (score > 0) label = 'positive';
        if (score < 0) label = 'negative';
        if (score > 2) label = 'very_positive';
        if (score < -2) label = 'very_negative';

        return { score, label, positiveCount, negativeCount };
    }

    /**
     * Detect intent from text
     */
    detectIntent(text) {
        const lower = text.toLowerCase().trim();
        const tokens = this.tokenize(text);

        // Question detection
        const questionWords = ['what', 'who', 'where', 'when', 'why', 'how', 'which', 'whose', 'whom'];
        const isQuestion = lower.endsWith('?') || questionWords.some(q => tokens[0] === q);

        // Command detection
        const commandWords = ['tell', 'show', 'give', 'find', 'search', 'get', 'list', 'explain', 'describe'];
        const isCommand = commandWords.some(c => tokens[0] === c);

        // Greeting detection
        const greetingWords = ['hello', 'hi', 'hey', 'greetings', 'howdy', 'yo', 'sup', 'hola'];
        const isGreeting = greetingWords.some(g => tokens.includes(g)) || 
                           lower.includes("what's up") || lower.includes('whats up') ||
                           lower.includes('good morning') || lower.includes('good evening') ||
                           lower.includes('good afternoon');

        // Farewell detection
        const farewellWords = ['bye', 'goodbye', 'farewell', 'later', 'cya', 'night'];
        const isFarewell = farewellWords.some(f => tokens.includes(f)) ||
                           lower.includes('see you') || lower.includes('take care') ||
                           lower.includes('good night') || lower.includes('have a good');

        // Teaching detection
        const isTeaching = lower.startsWith('learn that') || lower.startsWith('teach:') ||
                           lower.startsWith('remember that') || lower.startsWith('teach me') ||
                           lower.includes('learn:') || 
                           (lower.includes(' means ') && (lower.startsWith('learn') || lower.startsWith('remember')));

        // Thanks detection
        const isThanks = tokens.includes('thanks') || tokens.includes('thank') || 
                         lower.includes('thank you') || tokens.includes('thx');

        let intent = 'general';
        if (isTeaching) intent = 'teaching';
        else if (isGreeting) intent = 'greeting';
        else if (isFarewell) intent = 'farewell';
        else if (isThanks) intent = 'thanks';
        else if (isQuestion) intent = 'question';
        else if (isCommand) intent = 'command';

        return {
            intent,
            isQuestion,
            isCommand,
            isGreeting,
            isFarewell,
            isTeaching,
            isThanks
        };
    }

    /**
     * Extract key phrases from text
     */
    extractKeyPhrases(text) {
        const tokens = this.tokenize(text);
        const filtered = this.removeStopWords(tokens);
        
        // Return unique meaningful tokens
        return [...new Set(filtered)];
    }

    /**
     * Parse a teaching command
     */
    parseTeachingCommand(text) {
        const lower = text.toLowerCase().trim();

        // Pattern: "learn that X means Y"
        let match = lower.match(/^(?:learn|remember)\s+that\s+(.+?)\s+means\s+(.+)$/i);
        if (match) {
            return { pattern: match[1].trim(), response: match[2].trim() };
        }

        // Pattern: "teach: X | Y"
        match = lower.match(/^teach:\s*(.+?)\s*\|\s*(.+)$/i);
        if (match) {
            return { pattern: match[1].trim(), response: match[2].trim() };
        }

        // Pattern: "learn: X | Y"
        match = lower.match(/^learn:\s*(.+?)\s*\|\s*(.+)$/i);
        if (match) {
            return { pattern: match[1].trim(), response: match[2].trim() };
        }

        // Pattern: "remember that my name is X"
        match = lower.match(/^remember\s+that\s+my\s+name\s+is\s+(.+)$/i);
        if (match) {
            return { pattern: 'what is my name', response: `Your name is ${match[1].trim()}!` };
        }

        return null;
    }
}

// Export for use in other modules
window.NLPEngine = NLPEngine;
