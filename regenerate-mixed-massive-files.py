#!/usr/bin/env python3
"""Regenerate multi-domain training datasets (Political History, Science, Math)."""

import json
import sys

# Political History
pol_subjects = [
    "The Magna Carta", "The French Revolution", "The Cold War", "The Roman Senate", "The United Nations",
    "The Treaty of Versailles", "The Declaration of Independence", "The Berlin Wall", "The Ottoman Empire", "The Ming Dynasty",
    "The Industrial Revolution", "The League of Nations", "The Constitution", "The Federalist Papers", "The Emancipation Proclamation",
    "The Cuban Missile Crisis", "The Suffragette Movement", "The Civil Rights Movement", "The Fall of Constantinople", "The Bolshevik Revolution"
]
pol_actions = ["established", "overthrew", "negotiated", "ratified", "destabilized", "unified", "partitioned", "boycotted", "reformed", "abolished"]
pol_objects = ["a new balance of power", "diplomatic relations", "democratic institutions", "authoritarian regimes", "trade embargoes", "constitutional rights", "sovereign borders", "economic sanctions", "peace treaties", "imperial expansion"]
pol_reasons = ["to secure political dominance.", "to guarantee human rights.", "to prevent global conflict.", "to consolidate state power.", "to appease rebellious factions.", "to expand territorial control.", "to regulate international trade.", "to suppress political dissent.", "to enforce ideological purity.", "to establish a republic."]

# Science
sci_subjects = [
    "A quantum dot", "A black hole", "The human genome", "A neural synapse", "A carbon nanotube",
    "A tectonic plate", "A mitochondrial matrix", "A supernova", "The Higgs boson", "A CRISPR sequence",
    "A chloroplast", "A gravitational wave", "A stem cell", "A semiconductor", "An exoplanet",
    "A retrovirus", "A plasma membrane", "A quasar", "A dark matter halo", "An epigenetic marker"
]
sci_actions = ["catalyzes", "synthesizes", "radiates", "mutates", "absorbs", "deflects", "replicates", "transcribes", "polarizes", "modulates"]
sci_objects = ["electromagnetic frequencies", "amino acid chains", "subatomic particles", "seismic waves", "cellular energy", "genetic instructions", "thermal dynamics", "chemical bonds", "gravitational pull", "photonic emissions"]
sci_reasons = ["to reach thermodynamic equilibrium.", "to propagate genetic traits.", "to emit ionizing radiation.", "to sustain biological functions.", "to bend the spacetime continuum.", "to trigger an immune response.", "to conduct electrical currents.", "to maintain cellular homeostasis.", "to fuse atomic nuclei.", "to filter ambient light."]

# Math
math_subjects = [
    "A complex polynomial", "A topological space", "A Fourier series", "An eigenvalue", "A differential manifold",
    "The Riemann hypothesis", "A Fibonacci sequence", "A stochastic matrix", "A Boolean algebra", "A partial derivative",
    "A prime factorization", "A tensor field", "A non-Euclidean geometry", "A continuous function", "A Banach space",
    "A logarithmic spiral", "An elliptic curve", "A vector subspace", "A normal distribution", "A singular value decomposition"
]
math_actions = ["converges to", "differentiates into", "integrates over", "maps onto", "factors out", "approximates", "bounds", "diagonalizes", "orthogonalizes", "transforms"]
math_objects = ["a singular point", "a multidimensional plane", "an infinite series", "a local minimum", "an algebraic structure", "a symmetric tensor", "a boundary condition", "a linear combination", "a scalar field", "an asymptotic limit"]
math_reasons = ["to prove the fundamental theorem.", "to compute the definite integral.", "to minimize the loss function.", "to establish the domain.", "to verify structural isomorphism.", "to find the absolute maximum.", "to solve the boundary problem.", "to reduce the dimensionality.", "to demonstrate logical equivalence.", "to isolate the variable."]

def get_mixed_entry(topic_num):
    cat_type = topic_num % 3
    
    if cat_type == 0:
        # Political History
        sub = pol_subjects[(topic_num * 7) % len(pol_subjects)]
        act = pol_actions[(topic_num * 11) % len(pol_actions)]
        obj = pol_objects[(topic_num * 13) % len(pol_objects)]
        reas = pol_reasons[(topic_num * 17) % len(pol_reasons)]
        
        pattern1 = f"discuss history of {sub.lower()}"
        pattern2 = f"political impact of {sub.lower()} {act}"
        pattern3 = f"history topic {topic_num}"
        
        resp1 = f"Historical Analysis #{topic_num}: {sub} historically {act} {obj} {reas}"
        resp2 = f"In the context of political history, {sub} {act} {obj}. This happened {reas}"
        
        return {
            "category": "political_history",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    elif cat_type == 1:
        # Science
        sub = sci_subjects[(topic_num * 19) % len(sci_subjects)]
        act = sci_actions[(topic_num * 23) % len(sci_actions)]
        obj = sci_objects[(topic_num * 29) % len(sci_objects)]
        reas = sci_reasons[(topic_num * 31) % len(sci_reasons)]
        
        pattern1 = f"scientific explanation of {sub.lower()}"
        pattern2 = f"how {sub.lower()} {act}"
        pattern3 = f"science topic {topic_num}"
        
        resp1 = f"Scientific Observation #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"From a scientific standpoint, {sub} {act} {obj} in order {reas}"
        
        return {
            "category": "science",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    else:
        # Math
        sub = math_subjects[(topic_num * 37) % len(math_subjects)]
        act = math_actions[(topic_num * 41) % len(math_actions)]
        obj = math_objects[(topic_num * 43) % len(math_objects)]
        reas = math_reasons[(topic_num * 47) % len(math_reasons)]
        
        pattern1 = f"mathematical function of {sub.lower()}"
        pattern2 = f"math concept {sub.lower()} {act}"
        pattern3 = f"math topic {topic_num}"
        
        resp1 = f"Mathematical Concept #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"Mathematically speaking, {sub} {act} {obj}. This is done {reas}"
        
        return {
            "category": "mathematics",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }

def generate_part(part_num, start_idx, count):
    filename = f"suku-training-massive-{part_num}.js"
    print(f"Generating Mixed Part {part_num} (topics {start_idx} to {start_idx + count - 1}) -> {filename}...")
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write("/**\n")
        f.write(f" * Suku AI — Extended Mixed Training Data Part {part_num}\n")
        f.write(" * Programmatically generated history, science, and math patterns.\n")
        f.write(" */\n\n")
        f.write("(function() {\n")
        f.write("    'use strict';\n\n")
        f.write(f"    function loadExtendedData{part_num}() {{\n")
        f.write(f"        if (typeof window.KnowledgeBase === 'undefined') {{\n")
        f.write(f"            setTimeout(loadExtendedData{part_num}, 100);\n")
        f.write("            return;\n")
        f.write("        }\n\n")
        f.write(f"        console.log('Loading extended mixed training data part {part_num}...');\n")
        f.write("        const startTime = performance.now();\n")
        f.write("        const kb = new KnowledgeBase();\n")
        f.write("        const extendedData = [\n")
        
        for i in range(count):
            topic_num = start_idx + i
            entry = get_mixed_entry(topic_num)
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
        f.write(f"        console.log(`✅ Extended mixed training data part {part_num} loaded: ${{added}} entries in ${{elapsed}}ms`);\n")
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
        print("Usage: python regenerate-mixed-massive-files.py <part_num> <start_idx> <count>")
        sys.exit(1)
        
    part_num = int(sys.argv[1])
    start_idx = int(sys.argv[2])
    count = int(sys.argv[3])
    generate_part(part_num, start_idx, count)
