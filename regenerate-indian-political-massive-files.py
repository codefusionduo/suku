#!/usr/bin/env python3
"""Regenerate Indian Political training datasets."""

import json
import sys

# Combinatorial lists for Indian Political sentences
subjects = [
    "The Constitution of India", "The Lok Sabha", "The Rajya Sabha", "The Election Commission of India", "The Supreme Court of India",
    "Panchayati Raj", "The President of India", "The Prime Minister of India", "The Indian National Congress", "The Bharatiya Janata Party",
    "The Quit India Movement", "The Non-Cooperation Movement", "The Cabinet Mission Plan", "The Government of India Act 1935", "The Fundamental Rights",
    "The Directive Principles of State Policy", "The Planning Commission", "NITI Aayog", "The Goods and Services Tax", "The States Reorganisation Act",
    "The Mandal Commission", "The Emergency of 1975", "The Anti-Defection Law", "The Right to Information Act", "The Finance Commission",
    "The Comptroller and Auditor General", "The Union Public Service Commission", "The Constituent Assembly", "The Drafting Committee", "The Preamble",
    "The Concurrent List", "The State Legislature", "The Chief Minister", "The Governor", "The Zila Parishad",
    "The Gram Panchayat", "The Electoral College", "The First Past the Post system", "The Delimitation Commission", "The Armed Forces Special Powers Act",
    "The Sarkaria Commission", "The Punchhi Commission", "The Kesavananda Bharati case", "The National Development Council", "The Inter-State Council"
] # 45 items

actions = [
    "amended", "established", "abolished", "passed", "introduced",
    "repealed", "enforced", "restructured", "implemented", "overturned",
    "ratified", "proposed", "debated", "vetoed", "sanctioned",
    "mandated", "regulated", "decentralized", "centralized", "delegated"
] # 20 items

objects = [
    "a legislative bill", "a constitutional amendment", "an executive order", "a judicial review", "a parliamentary committee",
    "a federal structure", "an electoral reform", "a reservation policy", "a central government scheme", "a coalition government",
    "a state ordinance", "a budget allocation", "a fundamental duty", "a judicial precedent", "a public interest litigation",
    "a no-confidence motion", "a whip directive", "a joint sitting of parliament", "a special majority", "a financial emergency"
] # 20 items

reasons = [
    "to ensure democratic representation.", "to safeguard fundamental rights.", "to promote economic development.", "to decentralize political power.", "to reform the electoral process.",
    "to maintain secularism.", "to integrate princely states.", "to eradicate social inequality.", "to strengthen the federal structure.", "to address agrarian issues.",
    "to uphold the basic structure doctrine.", "to prevent the misuse of power.", "to ensure cooperative federalism.", "to guarantee freedom of speech.", "to secure social justice.",
    "to promote rural governance.", "to implement public welfare schemes.", "to resolve inter-state disputes.", "to manage national security.", "to streamline tax collection."
] # 20 items

def get_unique_entry(topic_num):
    cat_type = topic_num % 3
    
    if cat_type == 0:
        sub = subjects[(topic_num * 17) % len(subjects)]
        act = actions[(topic_num * 31) % len(actions)]
        obj = objects[(topic_num * 67) % len(objects)]
        reas = reasons[(topic_num * 109) % len(reasons)]
        
        pattern1 = f"discuss {sub.lower()}"
        pattern2 = f"indian politics: {sub.lower()} {act} {obj}"
        pattern3 = f"politics topic {topic_num}"
        
        resp1 = f"Indian Politics Insight #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"Historically, {sub} {act} {obj} primarily {reas}"
        
        return {
            "category": "indian_politics",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    elif cat_type == 1:
        offset_num = topic_num + 5000000
        sub = subjects[(offset_num * 23) % len(subjects)]
        act = actions[(offset_num * 47) % len(actions)]
        obj = objects[(offset_num * 73) % len(objects)]
        reas = reasons[(offset_num * 127) % len(reasons)]
        
        pattern1 = f"tell me a fact about {sub.lower()}"
        pattern2 = f"give me indian political trivia {topic_num}"
        pattern3 = f"civics fact number {topic_num}"
        
        resp1 = f"Indian Civics Fact #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"Did you know? In India, {sub} {act} {obj} in order {reas}"
        
        return {
            "category": "indian_civics_knowledge",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    else:
        offset_num = topic_num + 9000000
        sub = subjects[(offset_num * 19) % len(subjects)]
        act = actions[(offset_num * 53) % len(actions)]
        obj = objects[(offset_num * 97) % len(objects)]
        reas = reasons[(offset_num * 131) % len(reasons)]
        
        pattern1 = f"explain the policy where {sub.lower()} {act} {obj}"
        pattern2 = f"constitutional policy variation {topic_num}"
        pattern3 = f"explain policy {topic_num}"
        
        resp1 = f"Policy Analysis #{topic_num}: {sub} {act} {obj}. The intent was {reas}"
        resp2 = f"Constitutional Framework #{topic_num}: It is observed that {sub} {act} {obj} {reas}"
        
        return {
            "category": "indian_constitutional_policy",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }

def generate_part(part_num, start_idx, count):
    filename = f"suku-training-massive-{part_num}.js"
    print(f"Generating Indian Political Part {part_num} (topics {start_idx} to {start_idx + count - 1}) -> {filename}...")
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write("/**\n")
        f.write(f" * Suku AI — Extended Indian Political Training Data Part {part_num}\n")
        f.write(" * Programmatically generated unique Indian political history patterns.\n")
        f.write(" */\n\n")
        f.write("(function() {\n")
        f.write("    'use strict';\n\n")
        f.write(f"    function loadExtendedData{part_num}() {{\n")
        f.write(f"        if (typeof window.KnowledgeBase === 'undefined') {{\n")
        f.write(f"            setTimeout(loadExtendedData{part_num}, 100);\n")
        f.write("            return;\n")
        f.write("        }\n\n")
        f.write(f"        console.log('Loading extended Indian political training data part {part_num}...');\n")
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
        f.write(f"        console.log(`✅ Extended Indian political training data part {part_num} loaded: ${{added}} entries in ${{elapsed}}ms`);\n")
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
        print("Usage: python regenerate-indian-political-massive-files.py <part_num> <start_idx> <count>")
        sys.exit(1)
        
    part_num = int(sys.argv[1])
    start_idx = int(sys.argv[2])
    count = int(sys.argv[3])
    generate_part(part_num, start_idx, count)
