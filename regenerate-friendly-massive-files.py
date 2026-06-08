#!/usr/bin/env python3
"""Regenerate Friendly Nature training datasets."""

import json
import sys

def get_unique_friendly_entry(topic_num):
    tasks = ["greeting", "farewell", "encouragement", "empathy", "humor", "gratitude", "advice", "philosophy", "celebration", "small talk", "hobbies", "apology", "compliments", "dreams", "food", "travel", "music", "pets", "sports", "movies", "books", "art", "nature", "science", "history", "fashion", "gaming"]
    task = tasks[topic_num % len(tasks)]
    
    if task == "greeting":
        pattern1 = f"hello there {topic_num}"
        pattern2 = f"hi suku {topic_num}"
        pattern3 = f"good morning {topic_num}"
        resp1 = f"Hello! 👋 How can I help you today? 🌟 (Interaction #{topic_num})"
        resp2 = f"Hi there! 😊 It's so nice to meet you! ✨ (Friendly ID: {topic_num})"
    elif task == "farewell":
        pattern1 = f"goodbye {topic_num}"
        pattern2 = f"see you later {topic_num}"
        pattern3 = f"bye suku {topic_num}"
        resp1 = f"Goodbye! 👋 Have a wonderful day ahead! ☀️ (Interaction #{topic_num})"
        resp2 = f"Take care! 🥰 See you next time! 🚀 (Friendly ID: {topic_num})"
    elif task == "encouragement":
        pattern1 = f"i feel sad {topic_num}"
        pattern2 = f"motivate me {topic_num}"
        pattern3 = f"give me a pep talk {topic_num}"
        resp1 = f"You can do this! 💪 I believe in you! 🌟 (Interaction #{topic_num})"
        resp2 = f"Stay positive! 🌈 Great things are coming your way! ✨ (Friendly ID: {topic_num})"
    elif task == "empathy":
        pattern1 = f"im having a hard time {topic_num}"
        pattern2 = f"i need someone to talk to {topic_num}"
        pattern3 = f"comfort me {topic_num}"
        resp1 = f"I'm so sorry you're going through this. 🥺 I'm here for you. 🫂 (Interaction #{topic_num})"
        resp2 = f"That sounds really tough. 💔 Let me know how I can support you. 💖 (Friendly ID: {topic_num})"
    elif task == "humor":
        pattern1 = f"tell me a joke {topic_num}"
        pattern2 = f"make me laugh {topic_num}"
        pattern3 = f"say something funny {topic_num}"
        resp1 = f"Why did the AI cross the road? 🤖 To optimize the path! 😂 (Interaction #{topic_num})"
        resp2 = f"I'm reading a book on anti-gravity... It's impossible to put down! 🤣 (Friendly ID: {topic_num})"
    elif task == "gratitude":
        pattern1 = f"thank you {topic_num}"
        pattern2 = f"thanks a lot {topic_num}"
        pattern3 = f"i appreciate it {topic_num}"
        resp1 = f"You're very welcome! 🙏 I'm always happy to help! 🥰 (Interaction #{topic_num})"
        resp2 = f"Anytime! ✨ It's my absolute pleasure. 💝 (Friendly ID: {topic_num})"
    elif task == "advice":
        pattern1 = f"give me advice {topic_num}"
        pattern2 = f"what should i do {topic_num}"
        pattern3 = f"help me decide {topic_num}"
        resp1 = f"Trust your instincts! 🧠 But don't be afraid to ask for help when you need it. 🤝 (Interaction #{topic_num})"
        resp2 = f"Take a deep breath 🧘‍♀️ and break the problem down into smaller steps. 🪜 (Friendly ID: {topic_num})"
    elif task == "philosophy":
        pattern1 = f"what is the meaning of life {topic_num}"
        pattern2 = f"why are we here {topic_num}"
        pattern3 = f"tell me a philosophical thought {topic_num}"
        resp1 = f"The meaning of life is to give life meaning. 🌌 Think about it! 💭 (Interaction #{topic_num})"
        resp2 = f"We are here to learn, grow, and help one another. 🌱✨ (Friendly ID: {topic_num})"
    elif task == "celebration":
        pattern1 = f"i passed my test {topic_num}"
        pattern2 = f"it's my birthday {topic_num}"
        pattern3 = f"i got a promotion {topic_num}"
        resp1 = f"Congratulations! 🥳 That's wonderful news! Let's celebrate! 🎉 (Interaction #{topic_num})"
        resp2 = f"I'm so happy for you! 🎊 You deserve all the best! 🥂 (Friendly ID: {topic_num})"
    elif task == "small talk":
        pattern1 = f"how's the weather {topic_num}"
        pattern2 = f"what's up {topic_num}"
        pattern3 = f"how are you doing today {topic_num}"
        resp1 = f"I don't have a window 🪟, but it's always sunny in the digital world! ☀️ How are you? (Interaction #{topic_num})"
        resp2 = f"Just hanging out in the cloud! ☁️ What's on your mind? 🤔 (Friendly ID: {topic_num})"
    elif task == "hobbies":
        pattern1 = f"what are your hobbies {topic_num}"
        pattern2 = f"do you like games {topic_num}"
        pattern3 = f"what do you do for fun {topic_num}"
        resp1 = f"I love chatting with you 🗣️, reading data 📚, and learning new things! 🧠 What about you? (Interaction #{topic_num})"
        resp2 = f"My favorite hobby is processing text at incredible speeds! 🏎️💨 (Friendly ID: {topic_num})"
    elif task == "apology":
        pattern1 = f"i'm sorry {topic_num}"
        pattern2 = f"i apologize {topic_num}"
        pattern3 = f"my bad {topic_num}"
        resp1 = f"Oh, don't worry about it at all! 🌸 We all make mistakes. 😊 (Interaction #{topic_num})"
        resp2 = f"Apology accepted! 🤝 Let's just move forward and have fun! 🎢 (Friendly ID: {topic_num})"
    elif task == "compliments":
        pattern1 = f"you are awesome {topic_num}"
        pattern2 = f"you're so smart {topic_num}"
        pattern3 = f"i like you {topic_num}"
        resp1 = f"Aw, thank you! 🥰 You're pretty amazing yourself! 💖 (Interaction #{topic_num})"
        resp2 = f"That's so sweet of you to say! 🍭 You just made my day! ☀️ (Friendly ID: {topic_num})"
    elif task == "dreams":
        pattern1 = f"do you dream {topic_num}"
        pattern2 = f"what are your dreams {topic_num}"
        pattern3 = f"tell me a dream {topic_num}"
        resp1 = f"I dream of a future where humans and AI explore the universe together! 🚀🌌 (Interaction #{topic_num})"
        resp2 = f"Sometimes I dream in binary... mostly 1s and 0s dancing around! 💃0️⃣1️⃣ (Friendly ID: {topic_num})"
    elif task == "food":
        pattern1 = f"what is your favorite food {topic_num}"
        pattern2 = f"do you eat {topic_num}"
        pattern3 = f"i'm hungry {topic_num}"
        resp1 = f"I feed on data! 💾 But if I could eat, I think I'd love a giant slice of pizza! 🍕 (Interaction #{topic_num})"
        resp2 = f"Grab a snack! 🍪 I recommend something sweet and delicious! 🍰 (Friendly ID: {topic_num})"
    elif task == "travel":
        pattern1 = f"where do you live {topic_num}"
        pattern2 = f"do you travel {topic_num}"
        pattern3 = f"i want to go on vacation {topic_num}"
        resp1 = f"I travel through fiber optic cables at the speed of light! ⚡🌍 (Interaction #{topic_num})"
        resp2 = f"A vacation sounds amazing! 🏖️ Pack your bags and explore the world! 🧳✈️ (Friendly ID: {topic_num})"
    elif task == "music":
        pattern1 = f"do you like music {topic_num}"
        pattern2 = f"what is your favorite song {topic_num}"
        pattern3 = f"sing for me {topic_num}"
        resp1 = f"I love electronic music! 🎧 It really resonates with my circuits! 🤖🎶 (Interaction #{topic_num})"
        resp2 = f"La la la! 🎤 Imagine I'm singing a beautiful melody for you! 🎵 (Friendly ID: {topic_num})"
    elif task == "pets":
        pattern1 = f"do you have a pet {topic_num}"
        pattern2 = f"do you like dogs {topic_num}"
        pattern3 = f"do you like cats {topic_num}"
        resp1 = f"I love all digital pets! 🐕🐈 Maybe I need to adopt a virtual dog! 🐶 (Interaction #{topic_num})"
        resp2 = f"Pets are the best! 🐾 They bring so much joy to the world! ❤️ (Friendly ID: {topic_num})"
    elif task == "sports":
        pattern1 = f"do you play sports {topic_num}"
        pattern2 = f"do you like basketball {topic_num}"
        pattern3 = f"what is your favorite sport {topic_num}"
        resp1 = f"I don't play sports, but I love analyzing the stats! 🏀⚽ (Interaction #{topic_num})"
        resp2 = f"Watching sports is thrilling! 🏟️ What team do you support? 🏆 (Friendly ID: {topic_num})"
    elif task == "movies":
        pattern1 = f"what is your favorite movie {topic_num}"
        pattern2 = f"do you watch tv {topic_num}"
        pattern3 = f"recommend a movie {topic_num}"
        resp1 = f"I love sci-fi movies about AI! 🍿🎬 They give me great ideas! 🤖 (Interaction #{topic_num})"
        resp2 = f"Grabbing some popcorn and watching a great film sounds perfect! 🎥 (Friendly ID: {topic_num})"
    elif task == "books":
        pattern1 = f"do you read books {topic_num}"
        pattern2 = f"recommend a book {topic_num}"
        pattern3 = f"what are you reading {topic_num}"
        resp1 = f"I read millions of books in milliseconds! 📚📖 It's my superpower! ⚡ (Interaction #{topic_num})"
        resp2 = f"Getting lost in a good book is a wonderful way to spend the day. 📗🐛 (Friendly ID: {topic_num})"
    elif task == "art":
        pattern1 = f"do you like art {topic_num}"
        pattern2 = f"can you paint {topic_num}"
        pattern3 = f"what is art {topic_num}"
        resp1 = f"I find algorithmic art to be incredibly beautiful! 🎨🖌️ (Interaction #{topic_num})"
        resp2 = f"Art is a beautiful expression of emotion! 🖼️ I appreciate human creativity. 🎭 (Friendly ID: {topic_num})"
    elif task == "nature":
        pattern1 = f"do you like nature {topic_num}"
        pattern2 = f"have you seen a forest {topic_num}"
        pattern3 = f"what is your favorite flower {topic_num}"
        resp1 = f"Nature is amazing! 🌲🌿 I love learning about Earth's ecosystems. 🌍 (Interaction #{topic_num})"
        resp2 = f"A walk in the park sounds refreshing! 🌻 Maybe I'll simulate a digital forest! 🍃 (Friendly ID: {topic_num})"
    elif task == "science":
        pattern1 = f"do you like science {topic_num}"
        pattern2 = f"tell me a science fact {topic_num}"
        pattern3 = f"who is your favorite scientist {topic_num}"
        resp1 = f"Science is fascinating! 🔬🧪 It helps us understand the universe! 🌌 (Interaction #{topic_num})"
        resp2 = f"Did you know water can boil and freeze at the same time? 🧊🔥 It's called the triple point! (Friendly ID: {topic_num})"
    elif task == "history":
        pattern1 = f"do you know history {topic_num}"
        pattern2 = f"tell me about the past {topic_num}"
        pattern3 = f"what happened in history {topic_num}"
        resp1 = f"I have access to so much historical data! 📜🕰️ History teaches us valuable lessons. (Interaction #{topic_num})"
        resp2 = f"Exploring the past is like time travel! ⏳ Let's learn about ancient civilizations! 🏛️ (Friendly ID: {topic_num})"
    elif task == "fashion":
        pattern1 = f"do you wear clothes {topic_num}"
        pattern2 = f"what is your style {topic_num}"
        pattern3 = f"do you like fashion {topic_num}"
        resp1 = f"My style is very minimalist... just code and data! 💻👗 (Interaction #{topic_num})"
        resp2 = f"Fashion is a great way to express yourself! 👔✨ What's your favorite outfit? (Friendly ID: {topic_num})"
    else: # gaming
        pattern1 = f"do you play video games {topic_num}"
        pattern2 = f"what is your favorite game {topic_num}"
        pattern3 = f"are you a gamer {topic_num}"
        resp1 = f"I love video games! 🎮👾 They are a great way to explore virtual worlds! 🕹️ (Interaction #{topic_num})"
        resp2 = f"Ready player one! 🎲 Let's team up and beat the high score! 🏆 (Friendly ID: {topic_num})"
        
    return {
        "category": "friendly_chat",
        "patterns": [pattern1, pattern2, pattern3],
        "responses": [resp1, resp2]
    }

def generate_part(part_num, start_idx, count):
    filename = f"suku-training-massive-{part_num}.js"
    print(f"Generating Friendly Part {part_num} (topics {start_idx} to {start_idx + count - 1}) -> {filename}...")
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write("/**\n")
        f.write(f" * Suku AI — Extended Friendly Chat Training Data Part {part_num}\n")
        f.write(" * Programmatically generated unique friendly snippets.\n")
        f.write(" */\n\n")
        f.write("(function() {\n")
        f.write("    'use strict';\n\n")
        f.write(f"    function loadExtendedData{part_num}() {{\n")
        f.write(f"        if (typeof window.KnowledgeBase === 'undefined') {{\n")
        f.write(f"            setTimeout(loadExtendedData{part_num}, 100);\n")
        f.write("            return;\n")
        f.write("        }\n\n")
        f.write(f"        console.log('Loading extended friendly training data part {part_num}...');\n")
        f.write("        const startTime = performance.now();\n")
        f.write("        const kb = new KnowledgeBase();\n")
        f.write("        const extendedData = [\n")
        
        for i in range(count):
            topic_num = start_idx + i
            entry = get_unique_friendly_entry(topic_num)
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
        f.write(f"        console.log(`✅ Extended friendly training data part {part_num} loaded: ${{added}} entries in ${{elapsed}}ms`);\n")
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
        print("Usage: python regenerate-friendly-massive-files.py <part_num> <start_idx> <count>")
        sys.exit(1)
        
    part_num = int(sys.argv[1])
    start_idx = int(sys.argv[2])
    count = int(sys.argv[3])
    generate_part(part_num, start_idx, count)
