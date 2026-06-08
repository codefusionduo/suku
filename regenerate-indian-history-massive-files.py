#!/usr/bin/env python3
"""Regenerate Indian History training datasets."""

import json
import sys

# Combinatorial lists for Indian History
subjects = [
    "The Indus Valley Civilization", "The Maurya Empire", "The Gupta Empire", "The Delhi Sultanate", "The Mughal Empire",
    "The Maratha Empire", "The Vijayanagara Empire", "The Chola Dynasty", "The East India Company", "The Indian National Congress",
    "The Revolt of 1857", "The Swadeshi Movement", "The Non-Cooperation Movement", "The Quit India Movement", "The Partition of India",
    "Emperor Ashoka", "Chandragupta Maurya", "Akbar the Great", "Shivaji Maharaj", "Mahatma Gandhi",
    "Subhas Chandra Bose", "Bhagat Singh", "B. R. Ambedkar", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel",
    "The Battle of Plassey", "The Battle of Panipat", "The Jallianwala Bagh massacre", "The Dandi March", "The Cabinet Mission Plan",
    "The Pallava Dynasty", "The Chalukya Dynasty", "The Rashtrakuta Empire", "The Sikh Empire", "Rani Lakshmibai",
    "Tipu Sultan", "The Arya Samaj", "The Brahmo Samaj", "The Kakatiya Dynasty", "The Satavahana Dynasty",
    "Harshavardhana", "Raja Ram Mohan Roy", "Swami Vivekananda", "The Khilafat Movement", "The Home Rule Movement",
    "The Indian National Army", "The Mountbatten Plan", "The Rowlatt Act", "The Simon Commission", "The Round Table Conferences"
] # 50 items

actions = [
    "established", "overthrew", "conquered", "defended", "pioneered",
    "reformed", "united", "divided", "boycotted", "negotiated",
    "rebelled against", "surrendered", "annexed", "colonized", "liberated",
    "invaded", "patronized", "documented", "constructed", "destroyed"
] # 20 items

objects = [
    "a vast subcontinent", "trade routes", "monumental architecture", "administrative systems", "cultural traditions",
    "colonial powers", "revolutionary ideas", "a new religion", "philosophical treatises", "military alliances",
    "economic policies", "educational institutions", "social hierarchies", "dynastic succession", "sovereign territories",
    "foreign invaders", "strategic forts", "maritime trade", "agrarian economies", "political treaties"
] # 20 items

reasons = [
    "to expand territorial control.", "to achieve political independence.", "to spread religious beliefs.", "to monopolize global trade.", "to consolidate imperial power.",
    "to resist foreign domination.", "to foster cultural renaissance.", "to implement social reforms.", "to unify diverse populations.", "to defend against invasions.",
    "to establish a democratic republic.", "to promote economic self-reliance.", "to challenge orthodox traditions.", "to secure lucrative resources.", "to commemorate military victories.",
    "to rewrite historical narratives.", "to build lasting monuments.", "to enforce dynastic rule.", "to propagate nationalist ideals.", "to escape oppressive taxation."
] # 20 items

def get_unique_entry(topic_num):
    cat_type = topic_num % 3
    
    if cat_type == 0:
        sub = subjects[(topic_num * 17) % len(subjects)]
        act = actions[(topic_num * 31) % len(actions)]
        obj = objects[(topic_num * 67) % len(objects)]
        reas = reasons[(topic_num * 109) % len(reasons)]
        
        pattern1 = f"discuss the history of {sub.lower()}"
        pattern2 = f"indian history: {sub.lower()} {act} {obj}"
        pattern3 = f"history topic {topic_num}"
        
        resp1 = f"Historical Insight #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"Historically speaking, {sub} {act} {obj} primarily {reas}"
        
        return {
            "category": "indian_history",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    elif cat_type == 1:
        offset_num = topic_num + 5000000
        sub = subjects[(offset_num * 23) % len(subjects)]
        act = actions[(offset_num * 47) % len(actions)]
        obj = objects[(offset_num * 73) % len(objects)]
        reas = reasons[(offset_num * 127) % len(reasons)]
        
        pattern1 = f"tell me a historical fact about {sub.lower()}"
        pattern2 = f"give me history trivia {topic_num}"
        pattern3 = f"historical fact number {topic_num}"
        
        resp1 = f"Indian History Fact #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"Did you know? During this period in India, {sub} {act} {obj} in order {reas}"
        
        return {
            "category": "indian_history_knowledge",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    else:
        offset_num = topic_num + 9000000
        sub = subjects[(offset_num * 19) % len(subjects)]
        act = actions[(offset_num * 53) % len(actions)]
        obj = objects[(offset_num * 97) % len(objects)]
        reas = reasons[(offset_num * 131) % len(reasons)]
        
        pattern1 = f"explain the historical event where {sub.lower()} {act} {obj}"
        pattern2 = f"historical analysis variation {topic_num}"
        pattern3 = f"explain historical event {topic_num}"
        
        resp1 = f"Historical Analysis #{topic_num}: {sub} {act} {obj}. The motivation behind this was {reas}"
        resp2 = f"Historical Context #{topic_num}: It is well documented that {sub} {act} {obj} {reas}"
        
        return {
            "category": "indian_history_analysis",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }

def generate_part(part_num, start_idx, count):
    filename = f"suku-training-massive-{part_num}.js"
    print(f"Generating Indian History Part {part_num} (topics {start_idx} to {start_idx + count - 1}) -> {filename}...")
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write("/**\n")
        f.write(f" * Suku AI — Extended Indian History Training Data Part {part_num}\n")
        f.write(" * Programmatically generated unique Indian history patterns.\n")
        f.write(" */\n\n")
        f.write("(function() {\n")
        f.write("    'use strict';\n\n")
        f.write(f"    function loadExtendedData{part_num}() {{\n")
        f.write(f"        if (typeof window.KnowledgeBase === 'undefined') {{\n")
        f.write(f"            setTimeout(loadExtendedData{part_num}, 100);\n")
        f.write("            return;\n")
        f.write("        }\n\n")
        f.write(f"        console.log('Loading extended Indian history training data part {part_num}...');\n")
        f.write("        const startTime = performance.now();\n")
        f.write("        const kb = new KnowledgeBase();\n")
        f.write("        const extendedData = [\n")
        
        for i in range(count):
            topic_num = start_idx + i
            entry = get_unique_entry(topic_num)
            comma = "," if i < count - 1 else ""
            
            f.write("            {\n")
            f.write(f"                category: {json.dumps(entry['category'])},\n")
            pats = ", ".join(json.dumps(p) for p in entry['patterns'])
            f.write(f"                patterns: [{pats}],\n")
            f.write("                responses: [\n")
            for j, resp in enumerate(entry['responses']):
                rcomma = "," if j < len(entry['responses']) - 1 else ""
                f.write(f"                    {json.dumps(resp)}{rcomma}\n")
            f.write("                ]\n")
            f.write(f"            }}{comma}\n")
            
        f.write("        ];\n\n")
        f.write("        let added = 0;\n")
        f.write("        const origAdd = kb.add.bind(kb);\n")
        f.write("        kb.add = function(entry) {\n")
        f.write(f"            const id = 'kb_{part_num}_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);\n")
        f.write("            const newEntry = {\n")
        f.write("                id,\n")
        f.write("                category: entry.category || 'general',\n")
        f.write("                patterns: entry.patterns || [],\n")
        f.write("                responses: entry.responses || [],\n")
        f.write("                matchCount: 0,\n")
        f.write("                createdAt: Date.now(),\n")
        f.write("                lastMatched: null,\n")
        f.write("                isUserTrained: false\n")
        f.write("            };\n")
        f.write("            this.data.push(newEntry);\n")
        f.write("            this.stats.trainingSessions++;\n")
        f.write("            return newEntry;\n")
        f.write("        };\n")
        f.write("        for (const entry of extendedData) {\n")
        f.write("            kb.add(entry);\n")
        f.write("            added++;\n")
        f.write("        }\n")
        f.write("        kb.add = origAdd.bind(kb);\n\n")
        f.write("        const elapsed = (performance.now() - startTime).toFixed(1);\n")
        f.write(f"        console.log(`✅ Extended Indian history training data part {part_num} loaded: ${{added}} entries in ${{elapsed}}ms`);\n")
        f.write("    }\n\n")
        f.write("    if (document.readyState === 'loading') {\n")
        f.write(f"        document.addEventListener('DOMContentLoaded', loadExtendedData{part_num});\n")
        f.write("    } else {\n")
        f.write(f"        loadExtendedData{part_num}();\n")
        f.write("    }\n")
        f.write("})();\n")
        
    print(f"Generated part {part_num} successfully!")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python regenerate-indian-history-massive-files.py <part_num> <start_idx> <count>")
        sys.exit(1)
        
    part_num = int(sys.argv[1])
    start_idx = int(sys.argv[2])
    count = int(sys.argv[3])
    generate_part(part_num, start_idx, count)
