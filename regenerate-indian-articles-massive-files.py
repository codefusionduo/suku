#!/usr/bin/env python3
"""Regenerate Indian Political Articles training datasets."""

import json
import sys

# Combinatorial lists for Indian Constitutional Articles
subjects = [
    "Article 14 (Equality before law)", "Article 15 (Prohibition of discrimination)", "Article 16 (Equality of opportunity)", "Article 17 (Abolition of Untouchability)", "Article 19 (Freedom of speech)",
    "Article 21 (Protection of life and liberty)", "Article 21A (Right to education)", "Article 22 (Protection against arrest)", "Article 23 (Prohibition of traffic in human beings)", "Article 24 (Prohibition of child labor)",
    "Article 25 (Freedom of religion)", "Article 29 (Protection of minority interests)", "Article 32 (Constitutional remedies)", "Article 38 (State to secure a social order)", "Article 39A (Equal justice and free legal aid)",
    "Article 40 (Organization of village panchayats)", "Article 44 (Uniform civil code)", "Article 45 (Early childhood care)", "Article 50 (Separation of judiciary from executive)", "Article 51 (Promotion of international peace)",
    "Article 51A (Fundamental duties)", "Article 72 (Pardoning power of President)", "Article 74 (Council of Ministers)", "Article 110 (Money Bills)", "Article 112 (Annual financial statement)",
    "Article 123 (Power of President to promulgate Ordinances)", "Article 131 (Original jurisdiction of Supreme Court)", "Article 136 (Special leave to appeal)", "Article 143 (Power of President to consult Supreme Court)", "Article 148 (Comptroller and Auditor-General)",
    "Article 155 (Appointment of Governor)", "Article 161 (Pardoning power of Governor)", "Article 163 (Council of Ministers to aid Governor)", "Article 213 (Power of Governor to promulgate Ordinances)", "Article 226 (Power of High Courts to issue certain writs)",
    "Article 239AA (Special provisions for Delhi)", "Article 243G (Powers of Panchayats)", "Article 246 (Subject-matter of laws made by Parliament)", "Article 262 (Adjudication of disputes relating to waters)", "Article 280 (Finance Commission)",
    "Article 300A (Persons not to be deprived of property)", "Article 312 (All-India services)", "Article 324 (Election Commission)", "Article 352 (Proclamation of Emergency)", "Article 356 (President's Rule)",
    "Article 360 (Financial Emergency)", "Article 368 (Power of Parliament to amend the Constitution)", "Article 370 (Temporary provisions with respect to J&K)", "Article 371A (Special provision with respect to Nagaland)", "Article 395 (Repeals)"
] # 50 items

actions = [
    "guarantees", "enforces", "mandates", "prescribes", "outlines",
    "establishes", "restricts", "protects", "regulates", "defines",
    "stipulates", "empowers", "prohibits", "safeguards", "authorizes",
    "directs", "enumerates", "interprets", "amends", "repeals"
] # 20 items

objects = [
    "fundamental freedoms", "right to life and personal liberty", "emergency provisions", "constitutional remedies", "uniform civil code",
    "fundamental duties", "pardoning power of the President", "money bills", "annual financial statement", "writ jurisdiction",
    "electoral machinery", "federal distribution of powers", "judicial review powers", "minority educational rights", "directive principles",
    "parliamentary privileges", "executive actions", "state legislative procedures", "panchayati raj institutions", "amendment procedures"
] # 20 items

reasons = [
    "to protect citizens from arbitrary state action.", "to ensure equality before the law.", "to promote social and economic justice.", "to provide constitutional safeguards.", "to maintain public order and morality.",
    "to uphold the basic structure of the Constitution.", "to empower marginalized communities.", "to secure judicial independence.", "to facilitate democratic governance.", "to balance fundamental rights and duties.",
    "to foster national integration.", "to establish cooperative federalism.", "to preserve the secular fabric of the nation.", "to ensure free and fair elections.", "to decentralize administrative power.",
    "to protect the sovereignty of India.", "to resolve inter-state disputes amicably.", "to guarantee freedom of conscience.", "to prohibit exploitation of labor.", "to streamline the legislative process."
] # 20 items

def get_unique_entry(topic_num):
    cat_type = topic_num % 3
    
    if cat_type == 0:
        sub = subjects[(topic_num * 17) % len(subjects)]
        act = actions[(topic_num * 31) % len(actions)]
        obj = objects[(topic_num * 67) % len(objects)]
        reas = reasons[(topic_num * 109) % len(reasons)]
        
        pattern1 = f"explain {sub.lower()}"
        pattern2 = f"indian constitution: {sub.lower()} {act} {obj}"
        pattern3 = f"article topic {topic_num}"
        
        resp1 = f"Constitutional Insight #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"According to the Constitution, {sub} {act} {obj} primarily {reas}"
        
        return {
            "category": "indian_articles",
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
        pattern2 = f"give me constitutional trivia {topic_num}"
        pattern3 = f"article fact number {topic_num}"
        
        resp1 = f"Indian Civics Fact #{topic_num}: {sub} {act} {obj} {reas}"
        resp2 = f"Did you know? In the Indian legal framework, {sub} {act} {obj} in order {reas}"
        
        return {
            "category": "indian_articles_knowledge",
            "patterns": [pattern1, pattern2, pattern3],
            "responses": [resp1, resp2]
        }
        
    else:
        offset_num = topic_num + 9000000
        sub = subjects[(offset_num * 19) % len(subjects)]
        act = actions[(offset_num * 53) % len(actions)]
        obj = objects[(offset_num * 97) % len(objects)]
        reas = reasons[(offset_num * 131) % len(reasons)]
        
        pattern1 = f"explain the interpretation where {sub.lower()} {act} {obj}"
        pattern2 = f"supreme court interpretation variation {topic_num}"
        pattern3 = f"explain clause {topic_num}"
        
        resp1 = f"Legal Analysis #{topic_num}: {sub} {act} {obj}. The jurisprudence behind this was {reas}"
        resp2 = f"Constitutional Framework #{topic_num}: It is observed legally that {sub} {act} {obj} {reas}"
        
        return {
            "category": "indian_articles_interpretation",
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
        print("Usage: python regenerate-indian-articles-massive-files.py <part_num> <start_idx> <count>")
        sys.exit(1)
        
    part_num = int(sys.argv[1])
    start_idx = int(sys.argv[2])
    count = int(sys.argv[3])
    generate_part(part_num, start_idx, count)
