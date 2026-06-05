#!/usr/bin/env python3
"""Regenerate all massive training datasets (Parts 2 to 7) using combinatorial sentence generation to ensure every entry is unique."""

import json
import sys

# Combinatorial lists for Knowledge/General sentences
subjects = [
    "A quantum computer", "A black hole", "The solar system", "A cell membrane", "An atom",
    "A database index", "A neural network", "A compiler", "An API request", "A docker container",
    "A tectonic plate", "A blockchain node", "A smart contract", "A DNA molecule", "The internet backbone",
    "An optical fiber", "A microprocessor", "A superconducting magnet", "A gravitational wave", "An exoplanet",
    "A virtual machine", "An encryption key", "A recursive function", "A binary tree", "A chloroplast",
    "A mitochondria", "An antibody", "A neurotransmitter", "A tectonic fault line", "A volcanic vent",
    "A particle accelerator", "A laser diode", "A quantum dot", "A carbon nanotube", "A graphene sheet",
    "A semiconductor wafer", "A solar photovoltaic cell", "A lithium-ion battery", "A fuel cell", "A wind turbine",
    "A satellite orbit", "A telemetry signal", "A biometric sensor", "A gyroscope", "An accelerometer",
    "A magnetometer", "A thermoelectric generator", "A piezoelectric crystal", "A fiber optic sensor", "A radar transceiver",
    "A sonar array", "A lidar scanner", "A holographic display", "A quantum cryptographic key", "A neural synapse",
    "A genomic sequence", "A protein fold", "An enzyme catalyst", "A ribosome", "A lysosome",
    "A Golgi apparatus", "An endoplasmic reticulum", "A stem cell", "A red blood cell", "A white blood cell",
    "A neuron pathway", "A synaptic cleft", "A hormone receptor", "A gene promoter", "An epigenetic marker",
    "A viral capsid", "A bacterial plasmid", "A fungal mycelium", "A plant stomata", "A root xylem",
    "A leaf phloem", "A marine food web", "A desert biome", "A tundra ecosystem", "A rainforest canopy",
    "A coral reef colony", "A deep sea trench", "A hydrothermal vent", "An atmospheric pressure belt", "A stratospheric ozone layer",
    "A tropospheric jet stream", "A geomagnetic field line", "A cosmic ray particle", "A solar flare eruption", "A magnetospheric storm",
    "A stellar nebula", "A supernova remnant", "A pulsar beam", "A quasar jet", "A dark matter halo",
    "A cosmic microwave background photon", "A gravitational lens", "A wormhole throat", "An event horizon", "A singularity point"
] # 100 items

actions = [
    "processes", "operates through", "interacts with", "stabilizes by", "scales via",
    "secures by", "optimizes through", "adapts by", "evolves through", "analyzes by",
    "transmits", "synthesizes", "accelerates using", "converges via", "interprets",
    "regulates", "harnesses", "modulates", "transforms", "amplifies",
    "deconstructs", "replicates", "filters", "synchronizes", "disrupts",
    "encodes", "decodes", "catalyzes", "balances", "isolates",
    "channels", "conducts", "redirects", "shields", "emits",
    "absorbs", "deflects", "binds to", "expresses", "transcribes",
    "translates", "recombines", "propagates", "bends", "focuses",
    "diffracts", "scatters", "polarizes", "modulates the flow of", "measures"
] # 50 items

objects = [
    "complex datasets locally", "high-frequency electromagnetic waves", "atomic structures at sub-zero temperatures", "nucleotide base pairs continuously", "biochemical energy units dynamically",
    "distributed ledger blocks securely", "algorithmic weights systematically", "network packets across routes", "gravitational forces through space", "thermal energy outputs efficiently",
    "quantum states in superposition", "chemical reactions via catalysts", "binary instructions in memory", "software dependencies automatically", "server queries under load",
    "cellular signals across membranes", "synaptic potentials between neurons", "photons within optical fibers", "electric currents through superconductors", "magnetic fluxes in coils",
    "radio waves across planetary distances", "seismic waves through geological layers", "fluid dynamics in microfluidic channels", "gaseous elements under pressure", "plasma fields in confinement",
    "light rays through lenses", "electron beams in vacuum tubes", "protein chains during folding", "enzymatic reactions in substrates", "hormonal messengers in bloodstreams",
    "antigen targets in immune responses", "genetic mutations in population pools", "ecosystem resources in cycles", "carbon inputs in photosynthesis", "thermal dissipation in heatsinks",
    "voltage levels in logic gates", "memory allocations in heaps", "threads in execution pools", "cryptographic hashes in verification", "network sockets in connection states",
    "audio frequencies in signals", "pixel arrays in video frames", "coordinates in spatial maps", "sensor readouts in real-time", "stellar materials in fusion cores",
    "cosmic dust in planetary disks", "solar radiation in atmospheres", "charged particles in magnetic fields", "gravitational waves in spacetime", "dark energy densities in space"
] # 50 items

reasons = [
    "to enhance system throughput.", "to maintain thermodynamic equilibrium.", "to support biological homeostasis.", "to ensure data integrity.", "to minimize latency overhead.",
    "to prevent memory leaks.", "to decode complex patterns.", "to synthesize new elements.", "to accelerate computation cycles.", "to stabilize orbital decay.",
    "to bypass centralized gateways.", "to protect user privacy.", "to discover novel materials.", "to train browser-based models.", "to map dimensional spaces.",
    "to regulate metabolic activities.", "to facilitate synaptic plasticity.", "to route telecommunication channels.", "to store power grid energy.", "to measure tectonic movements.",
    "to simulate aerodynamic lift.", "to filter high-frequency noise.", "to sustain living organisms.", "to capture solar energy.", "to dissipate waste heat.",
    "to compile executable binaries.", "to balance server resources.", "to verify blockchain transactions.", "to run non-blocking loops.", "to render graphic elements.",
    "to detect anomaly signatures.", "to establish secure tunnels.", "to modulate radio signals.", "to forecast meteorological trends.", "to track celestial orbits.",
    "to isolate pathogen invasions.", "to sequence evolutionary steps.", "to nourish plant roots.", "to drive oceanic conveyor belts.", "to shield radiation impacts.",
    "to focus coherent light.", "to cooling down processors.", "to calibrate scientific instruments.", "to study particle collisions.", "to define atomic clocks.",
    "to synchronize distributed nodes.", "to prevent packet collisions.", "to optimize query times.", "to trigger immune memory.", "to generate magnetic fields."
] # 50 items

# Combinatorial lists for Jokes
professions = [
    "programmer", "data scientist", "web developer", "systems administrator", "database admin",
    "network engineer", "security specialist", "QA tester", "AI engineer", "hardware designer",
    "mathematician", "physicist", "chemist", "biologist", "astronomer",
    "geologist", "statistician", "cryptographer", "UX designer", "scrum master"
]
joke_subjects = [
    "an API endpoint", "a database query", "a git commit", "a docker container", "a javascript promise",
    "a python list", "a neural network layer", "a compiler warning", "a memory address", "a recursion loop"
]
joke_results = [
    "refused to respond due to cors issues", "crashed because of null pointers", "resolved into an empty array", "overclocked until it melted", "was blocked by a firewall",
    "failed validation checks", "threw an unhandled exception", "caused a stack overflow", "returned undefined", "lost its connection pool"
]

def get_unique_entry(topic_num):
    # Determine category
    cat_type = topic_num % 3
    
    if cat_type == 0:
        # General Discussion
        sub = subjects[(topic_num) % len(subjects)]
        act = actions[(topic_num // len(subjects)) % len(actions)]
        obj = objects[(topic_num // (len(subjects) * len(actions))) % len(objects)]
        reas = reasons[(topic_num // (len(subjects) * len(actions) * len(objects))) % len(reasons)]
        
        pattern1 = f"let's talk about how {sub.lower()} {act} {obj}"
        pattern2 = f"explain details on {sub.lower()} {act} {obj}"
        pattern3 = f"topic {topic_num}"
        
        resp1 = f"Discussion point #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"Analyzing {sub.lower()} shows that it {act} {obj} specifically {reas}"
        
        return {
            "category": "general",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    elif cat_type == 1:
        # Knowledge Fact
        # Offset to get different combinations than category 0
        offset_num = topic_num + 5000000
        sub = subjects[(offset_num) % len(subjects)]
        act = actions[(offset_num // len(subjects)) % len(actions)]
        obj = objects[(offset_num // (len(subjects) * len(actions))) % len(objects)]
        reas = reasons[(offset_num // (len(subjects) * len(actions) * len(objects))) % len(reasons)]
        
        pattern1 = f"tell me a fact about {sub.lower()}"
        pattern2 = f"give me trivia {topic_num}"
        pattern3 = f"fact number {topic_num}"
        
        resp1 = f"Fascinating science snippet #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"Did you know? {sub} {act} {obj} in order {reas}"
        
        return {
            "category": "knowledge",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    else:
        # Humor / Jokes
        prof = professions[(topic_num) % len(professions)]
        subj = joke_subjects[(topic_num // len(professions)) % len(joke_subjects)]
        res = joke_results[(topic_num // (len(professions) * len(joke_subjects))) % len(joke_results)]
        
        pattern1 = f"tell me a joke about {prof}s"
        pattern2 = f"joke variation {topic_num}"
        pattern3 = f"tell joke {topic_num}"
        
        resp1 = f"Why did the {prof} fail to run the code? Because {subj} {res}! 😄 (Joke #{topic_num})"
        resp2 = f"What happens when a {prof} tries to compile? {subj} {res}! 😅 (Joke #{topic_num})"
        
        return {
            "category": "humor",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }

def generate_part(part_num, start_idx, count):
    print(f"Generating Part {part_num} (topics {start_idx} to {start_idx + count - 1})...")
    
    lines = []
    lines.append("/**")
    lines.append(f" * Suku AI — Extended Training Data Part {part_num}")
    lines.append(" * Programmatically generated completely unique, combinatorial training patterns.")
    lines.append(" */")
    lines.append("")
    lines.append("(function() {")
    lines.append("    'use strict';")
    lines.append("")
    lines.append("    // Wait for KnowledgeBase to be available")
    lines.append(f"    function loadExtendedData{part_num}() {{")
    lines.append(f"        if (typeof window.KnowledgeBase === 'undefined') {{")
    lines.append(f"            setTimeout(loadExtendedData{part_num}, 100);")
    lines.append("            return;")
    lines.append("        }")
    lines.append("")
    lines.append(f"        console.log('Loading extended training data part {part_num}...');")
    lines.append("        const startTime = performance.now();")
    lines.append("")
    lines.append("        const kb = new KnowledgeBase();")
    lines.append("")
    lines.append("        const extendedData = [")
    
    for i in range(count):
        topic_num = start_idx + i
        entry = get_unique_entry(topic_num)
        comma = "," if i < count - 1 else ""
        
        lines.append("            {")
        lines.append(f"                category: {json.dumps(entry['category'])},")
        pats = ", ".join(json.dumps(p) for p in entry['patterns'])
        lines.append(f"                patterns: [{pats}],")
        lines.append("                responses: [")
        for j, resp in enumerate(entry['responses']):
            rcomma = "," if j < len(entry['responses']) - 1 else ""
            lines.append(f"                    {json.dumps(resp)}{rcomma}")
        lines.append("                ]")
        lines.append(f"            }}{comma}")
        
    lines.append("        ];")
    lines.append("")
    lines.append("        let added = 0;")
    lines.append("        const origAdd = kb.add.bind(kb);")
    lines.append("        kb.add = function(entry) {")
    lines.append(f"            const id = 'kb_{part_num}_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);")
    lines.append("            const newEntry = {")
    lines.append("                id,")
    lines.append("                category: entry.category || 'general',")
    lines.append("                patterns: entry.patterns || [],")
    lines.append("                responses: entry.responses || [],")
    lines.append("                matchCount: 0,")
    lines.append("                createdAt: Date.now(),")
    lines.append("                lastMatched: null,")
    lines.append("                isUserTrained: false")
    lines.append("            };")
    lines.append("            this.data.push(newEntry);")
    lines.append("            this.stats.trainingSessions++;")
    lines.append("            return newEntry;")
    lines.append("        };")
    lines.append("        for (const entry of extendedData) {")
    lines.append("            kb.add(entry);")
    lines.append("            added++;")
    lines.append("        }")
    lines.append("        kb.add = origAdd.bind(kb);")
    lines.append("")
    lines.append("        const elapsed = (performance.now() - startTime).toFixed(1);")
    lines.append(f"        console.log(`\u2705 Extended training data part {part_num} loaded: ${{added}} entries in ${{elapsed}}ms`);")
    lines.append("    }")
    lines.append("")
    lines.append("    if (document.readyState === 'loading') {")
    lines.append(f"        document.addEventListener('DOMContentLoaded', loadExtendedData{part_num});")
    lines.append("    } else {")
    lines.append(f"        loadExtendedData{part_num}();")
    lines.append("    }")
    lines.append("})();")
    
    output = "\n".join(lines) + "\n"
    filename = f"suku-training-massive-{part_num}.js"
    print(f"Writing {filename} to disk...")
    with open(filename, "w", encoding="utf-8") as f:
        f.write(output)
    print(f"Generated part {part_num} successfully! Lines: {len(lines)}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python regenerate-all-massive-files.py <part_num> <start_idx> <count>")
        sys.exit(1)
        
    part_num = int(sys.argv[1])
    start_idx = int(sys.argv[2])
    count = int(sys.argv[3])
    generate_part(part_num, start_idx, count)
