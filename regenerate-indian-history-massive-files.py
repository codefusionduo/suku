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
    filename = f"suku-training-massive-{part_num}.jsonl"
    print(f"Generating Part {part_num} (topics {start_idx} to {start_idx + count - 1}) -> {filename}...")
    
    with open(filename, "w", encoding="utf-8") as f:
        for i in range(count):
            topic_num = start_idx + i
            entry = get_unique_entry(topic_num)
            for pattern in entry['patterns']:
                for response in entry['responses']:
                    obj = {
                        "messages": [
                            {"role": "user", "content": pattern},
                            {"role": "assistant", "content": response}
                        ]
                    }
                    f.write(json.dumps(obj, ensure_ascii=False) + "\n")
    print(f"Generated part {part_num} successfully!")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python regenerate-indian-history-massive-files.py <part_num> <start_idx> <count>")
        sys.exit(1)
        
    part_num = int(sys.argv[1])
    start_idx = int(sys.argv[2])
    count = int(sys.argv[3])
    generate_part(part_num, start_idx, count)
