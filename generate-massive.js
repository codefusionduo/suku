const fs = require('fs');

const subjects = [
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
    "A cosmic microwave background photon", "A gravitational lens", "A wormhole throat", "An event horizon", "A singularity point",
    "An artificial general intelligence", "A fusion reactor", "A carbon capture plant", "An autonomous drone"
];

const actions = [
    "processes", "operates through", "interacts with", "stabilizes by", "scales via",
    "secures by", "optimizes through", "adapts by", "evolves through", "analyzes by",
    "transmits", "synthesizes", "accelerates using", "converges via", "interprets",
    "regulates", "harnesses", "modulates", "transforms", "amplifies",
    "deconstructs", "replicates", "filters", "synchronizes", "disrupts",
    "encodes", "decodes", "catalyzes", "balances", "isolates",
    "channels", "conducts", "redirects", "shields", "emits",
    "absorbs", "deflects", "binds to", "expresses", "transcribes",
    "translates", "recombines", "propagates", "bends", "focuses",
    "diffracts", "scatters", "polarizes", "modulates the flow of", "measures",
    "computes", "distributes", "integrates", "compiles"
];

const objects = [
    "complex datasets locally", "high-frequency electromagnetic waves", "atomic structures at sub-zero temperatures", "nucleotide base pairs continuously", "biochemical energy units dynamically",
    "distributed ledger blocks securely", "algorithmic weights systematically", "network packets across routes", "gravitational forces through space", "thermal energy outputs efficiently",
    "quantum states in superposition", "chemical reactions via catalysts", "binary instructions in memory", "software dependencies automatically", "server queries under load",
    "cellular signals across membranes", "synaptic potentials between neurons", "photons within optical fibers", "electric currents through superconductors", "magnetic fluxes in coils",
    "radio waves across planetary distances", "seismic waves through geological layers", "fluid dynamics in microfluidic channels", "gaseous elements under pressure", "plasma fields in confinement",
    "light rays through lenses", "electron beams in vacuum tubes", "protein chains during folding", "enzymatic reactions in substrates", "hormonal messengers in bloodstreams",
    "antigen targets in immune responses", "genetic mutations in population pools", "ecosystem resources in cycles", "carbon inputs in photosynthesis", "thermal dissipation in heatsinks",
    "voltage levels in logic gates", "memory allocations in heaps", "threads in execution pools", "cryptographic hashes in verification", "network sockets in connection states",
    "audio frequencies in signals", "pixel arrays in video frames", "coordinates in spatial maps", "sensor readouts in real-time", "stellar materials in fusion cores",
    "cosmic dust in planetary disks", "solar radiation in atmospheres", "charged particles in magnetic fields", "gravitational waves in spacetime", "dark energy densities in space",
    "tensor matrices rapidly", "cryptographic keys seamlessly"
];

const reasons = [
    "to enhance system throughput.", "to maintain thermodynamic equilibrium.", "to support biological homeostasis.", "to ensure data integrity.", "to minimize latency overhead.",
    "to prevent memory leaks.", "to decode complex patterns.", "to synthesize new elements.", "to accelerate computation cycles.", "to stabilize orbital decay.",
    "to bypass centralized gateways.", "to protect user privacy.", "to discover novel materials.", "to train browser-based models.", "to map dimensional spaces.",
    "to regulate metabolic activities.", "to facilitate synaptic plasticity.", "to route telecommunication channels.", "to store power grid energy.", "to measure tectonic movements.",
    "to simulate aerodynamic lift.", "to filter high-frequency noise.", "to sustain living organisms.", "to capture solar energy.", "to dissipate waste heat.",
    "to compile executable binaries.", "to balance server resources.", "to verify blockchain transactions.", "to run non-blocking loops.", "to render graphic elements.",
    "to detect anomaly signatures.", "to establish secure tunnels.", "to modulate radio signals.", "to forecast meteorological trends.", "to track celestial orbits.",
    "to isolate pathogen invasions.", "to sequence evolutionary steps.", "to nourish plant roots.", "to drive oceanic conveyor belts.", "to shield radiation impacts.",
    "to focus coherent light.", "to cooling down processors.", "to calibrate scientific instruments.", "to study particle collisions.", "to define atomic clocks.",
    "to synchronize distributed nodes.", "to prevent packet collisions.", "to optimize query times.", "to trigger immune memory.", "to generate magnetic fields.",
    "to predict chaotic behavior.", "to model climate change."
];

const professions = [
    "programmer", "data scientist", "web developer", "systems administrator", "database admin",
    "network engineer", "security specialist", "QA tester", "AI engineer", "hardware designer",
    "mathematician", "physicist", "chemist", "biologist", "astronomer",
    "geologist", "statistician", "cryptographer", "UX designer", "scrum master",
    "cloud architect", "machine learning researcher"
];

const joke_subjects = [
    "an API endpoint", "a database query", "a git commit", "a docker container", "a javascript promise",
    "a python list", "a neural network layer", "a compiler warning", "a memory address", "a recursion loop",
    "a segmentation fault", "a null pointer exception"
];

const joke_results = [
    "refused to respond due to cors issues", "crashed because of null pointers", "resolved into an empty array", "overclocked until it melted", "was blocked by a firewall",
    "failed validation checks", "threw an unhandled exception", "caused a stack overflow", "returned undefined", "lost its connection pool",
    "timed out indefinitely", "leaked all its memory"
];

function getUniqueEntry(topic_num) {
    const cat_type = topic_num % 3;
    
    if (cat_type === 0) {
        const sub = subjects[topic_num % subjects.length];
        const act = actions[Math.floor(topic_num / subjects.length) % actions.length];
        const obj = objects[Math.floor(topic_num / (subjects.length * actions.length)) % objects.length];
        const reas = reasons[Math.floor(topic_num / (subjects.length * actions.length * objects.length)) % reasons.length];
        
        return {
            category: "general",
            patterns: ["let's talk about how " + sub.toLowerCase() + " " + act + " " + obj, "explain details on " + sub.toLowerCase() + " " + act + " " + obj, "topic " + topic_num],
            responses: ["Discussion point #" + topic_num + ": " + sub + " " + act + " " + obj + " " + reas, "Analyzing " + sub.toLowerCase() + " shows that it " + act + " " + obj + " specifically " + reas]
        };
    } else if (cat_type === 1) {
        const offset_num = topic_num + 5000000;
        const sub = subjects[offset_num % subjects.length];
        const act = actions[Math.floor(offset_num / subjects.length) % actions.length];
        const obj = objects[Math.floor(offset_num / (subjects.length * actions.length)) % objects.length];
        const reas = reasons[Math.floor(offset_num / (subjects.length * actions.length * objects.length)) % reasons.length];
        
        return {
            category: "knowledge",
            patterns: ["tell me a fact about " + sub.toLowerCase(), "give me trivia " + topic_num, "fact number " + topic_num],
            responses: ["Fascinating science snippet #" + topic_num + ": " + sub + " " + act + " " + obj + " " + reas, "Did you know? " + sub + " " + act + " " + obj + " in order " + reas]
        };
    } else {
        const prof = professions[topic_num % professions.length];
        const subj = joke_subjects[Math.floor(topic_num / professions.length) % joke_subjects.length];
        const res = joke_results[Math.floor(topic_num / (professions.length * joke_subjects.length)) % joke_results.length];
        
        return {
            category: "humor",
            patterns: ["tell me a joke about " + prof + "s", "joke variation " + topic_num, "tell joke " + topic_num],
            responses: ["Why did the " + prof + " fail to run the code? Because " + subj + " " + res + "! 😄 (Joke #" + topic_num + ")", "What happens when a " + prof + " tries to compile? " + subj + " " + res + "! 😅 (Joke #" + topic_num + ")"]
        };
    }
}

function generatePart(partNum, startIdx, count) {
    console.log("Generating Part " + partNum + " (topics " + startIdx + " to " + (startIdx + count - 1) + ")...");
    
    const filename = "c:/Users/yabhi/OneDrive/Desktop/suku ai/suku-training-massive-" + partNum + ".js";
    const stream = fs.createWriteStream(filename, { encoding: 'utf-8' });
    
    stream.write("/**\n");
    stream.write(" * Suku AI — Extended Training Data Part " + partNum + "\n");
    stream.write(" * Programmatically generated completely unique, combinatorial training patterns.\n");
    stream.write(" */\n\n");
    stream.write("(function() {\n");
    stream.write("    'use strict';\n\n");
    stream.write("    // Wait for KnowledgeBase to be available\n");
    stream.write("    function loadExtendedData" + partNum + "() {\n");
    stream.write("        if (typeof window.KnowledgeBase === 'undefined') {\n");
    stream.write("            setTimeout(loadExtendedData" + partNum + ", 100);\n");
    stream.write("            return;\n");
    stream.write("        }\n\n");
    stream.write("        console.log('Loading extended training data part " + partNum + "...');\n");
    stream.write("        const startTime = performance.now();\n\n");
    stream.write("        const kb = new KnowledgeBase();\n\n");
    stream.write("        const extendedData = [\n");
    
    for (let i = 0; i < count; i++) {
        const topic_num = startIdx + i;
        const entry = getUniqueEntry(topic_num);
        const comma = (i < count - 1) ? "," : "";
        
        stream.write("            {\n");
        stream.write("                category: " + JSON.stringify(entry.category) + ",\n");
        const pats = entry.patterns.map(p => JSON.stringify(p)).join(", ");
        stream.write("                patterns: [" + pats + "],\n");
        stream.write("                responses: [\n");
        for (let j = 0; j < entry.responses.length; j++) {
            const rcomma = (j < entry.responses.length - 1) ? "," : "";
            stream.write("                    " + JSON.stringify(entry.responses[j]) + rcomma + "\n");
        }
        stream.write("                ]\n");
        stream.write("            }" + comma + "\n");
        
        if (i % 50000 === 0) {
            console.log("Progress: " + i + " / " + count);
        }
    }
    
    stream.write("        ];\n\n");
    stream.write("        let added = 0;\n");
    stream.write("        const origAdd = kb.add.bind(kb);\n");
    stream.write("        kb.add = function(entry) {\n");
    stream.write("            const id = 'kb_" + partNum + "_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);\n");
    stream.write("            const newEntry = {\n");
    stream.write("                id,\n");
    stream.write("                category: entry.category || 'general',\n");
    stream.write("                patterns: entry.patterns || [],\n");
    stream.write("                responses: entry.responses || [],\n");
    stream.write("                matchCount: 0,\n");
    stream.write("                createdAt: Date.now(),\n");
    stream.write("                lastMatched: null,\n");
    stream.write("                isUserTrained: false\n");
    stream.write("            };\n");
    stream.write("            this.data.push(newEntry);\n");
    stream.write("            this.stats.trainingSessions++;\n");
    stream.write("            return newEntry;\n");
    stream.write("        };\n");
    stream.write("        for (const entry of extendedData) {\n");
    stream.write("            kb.add(entry);\n");
    stream.write("            added++;\n");
    stream.write("        }\n");
    stream.write("        kb.add = origAdd.bind(kb);\n\n");
    stream.write("        const elapsed = (performance.now() - startTime).toFixed(1);\n");
    stream.write("        console.log(`✅ Extended training data part " + partNum + " loaded: ${added} entries in ${elapsed}ms`);\n");
    stream.write("    }\n\n");
    stream.write("    if (document.readyState === 'loading') {\n");
    stream.write("        document.addEventListener('DOMContentLoaded', loadExtendedData" + partNum + ");\n");
    stream.write("    } else {\n");
    stream.write("        loadExtendedData" + partNum + "();\n");
    stream.write("    }\n");
    stream.write("})();\n");
    
    stream.end(() => {
        console.log("Generated part " + partNum + " successfully! Count: " + count);
    });
}

// Generate part 10 with 1,250,001 entries starting from index 11250010
generatePart(10, 11250010, 1250001);
