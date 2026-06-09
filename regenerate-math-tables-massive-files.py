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
    filename = f"suku-training-massive-{part_num}.jsonl"
    print(f"Generating Part {part_num} (topics {start_idx} to {start_idx + count - 1}) -> {filename}...")
    
    with open(filename, "w", encoding="utf-8") as f:
        for i in range(count):
            topic_num = start_idx + i
            entry = get_math_entry(topic_num)
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
        print("Usage: python regenerate-math-tables-massive-files.py <part_num> <start_idx> <count>")
        sys.exit(1)
        
    part_num = int(sys.argv[1])
    start_idx = int(sys.argv[2])
    count = int(sys.argv[3])
    generate_part(part_num, start_idx, count)
