#!/usr/bin/env python3
"""Regenerate mathematical tables (multiplication, square roots, cube roots) training datasets."""

import json
import sys
import math

def get_math_entry(topic_num):
    # topic_num drives the generation to ensure uniqueness
    # cycle through 3 types: multiplication, sqrt, cbrt
    cat_type = topic_num % 3
    
    if cat_type == 0:
        # Multiplication
        # We need two numbers A and B. We can use topic_num to derive them.
        # Let's say A is topic_num % 1000 + 1, and B is topic_num // 1000 + 1
        a = (topic_num % 1000) + 1
        b = (topic_num // 1000) + 1
        c = a * b
        
        pattern1 = f"what is {a} times {b}"
        pattern2 = f"{a} * {b}"
        pattern3 = f"multiply {a} and {b}"
        
        resp1 = f"The product of {a} and {b} is {c}."
        resp2 = f"{a} * {b} = {c}"
        
        return {
            "category": "math_multiplication",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    elif cat_type == 1:
        # Square Root
        n = topic_num * 7  # just to get varying numbers
        sqrt_val = math.sqrt(n)
        
        pattern1 = f"what is the square root of {n}"
        pattern2 = f"sqrt {n}"
        pattern3 = f"square root {n}"
        
        # If it's a perfect square
        if sqrt_val.is_integer():
            resp1 = f"The square root of {n} is exactly {int(sqrt_val)}."
            resp2 = f"√{n} = {int(sqrt_val)}"
        else:
            resp1 = f"The square root of {n} is approximately {sqrt_val:.6f}."
            resp2 = f"√{n} ≈ {sqrt_val:.6f}"
            
        return {
            "category": "math_sqrt",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    else:
        # Cube Root
        n = topic_num * 11
        cbrt_val = n ** (1./3.)
        
        pattern1 = f"what is the cube root of {n}"
        pattern2 = f"cbrt {n}"
        pattern3 = f"cube root {n}"
        
        # Check if perfect cube (rough check)
        rounded_cbrt = round(cbrt_val)
        if rounded_cbrt**3 == n:
            resp1 = f"The cube root of {n} is exactly {rounded_cbrt}."
            resp2 = f"∛{n} = {rounded_cbrt}"
        else:
            resp1 = f"The cube root of {n} is approximately {cbrt_val:.6f}."
            resp2 = f"∛{n} ≈ {cbrt_val:.6f}"
            
        return {
            "category": "math_cbrt",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }

def generate_part(part_num, start_idx, count):
    filename = f"suku-training-massive-{part_num}.js"
    print(f"Generating Math Tables Part {part_num} (topics {start_idx} to {start_idx + count - 1}) -> {filename}...")
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write("/**\n")
        f.write(f" * Suku AI — Extended Math Tables Training Data Part {part_num}\n")
        f.write(" * Programmatically generated multiplication, square root, and cube root training patterns.\n")
        f.write(" */\n\n")
        f.write("(function() {\n")
        f.write("    'use strict';\n\n")
        f.write(f"    function loadExtendedData{part_num}() {{\n")
        f.write(f"        if (typeof window.KnowledgeBase === 'undefined') {{\n")
        f.write(f"            setTimeout(loadExtendedData{part_num}, 100);\n")
        f.write("            return;\n")
        f.write("        }\n\n")
        f.write(f"        console.log('Loading extended math tables training data part {part_num}...');\n")
        f.write("        const startTime = performance.now();\n")
        f.write("        const kb = new KnowledgeBase();\n")
        f.write("        const extendedData = [\n")
        
        for i in range(count):
            topic_num = start_idx + i
            entry = get_math_entry(topic_num)
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
        f.write(f"        console.log(`✅ Extended math tables training data part {part_num} loaded: ${{added}} entries in ${{elapsed}}ms`);\n")
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
        print("Usage: python regenerate-math-tables-massive-files.py <part_num> <start_idx> <count>")
        sys.exit(1)
        
    part_num = int(sys.argv[1])
    start_idx = int(sys.argv[2])
    count = int(sys.argv[3])
    generate_part(part_num, start_idx, count)
