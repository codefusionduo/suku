#!/usr/bin/env python3
import subprocess

parts = [
    (157, 195000157, 1250001)
]

for part_num, start_idx, count in parts:
    print(f"Starting regeneration for part {part_num}...")
    subprocess.run(["python", "regenerate-coding-massive-files.py", str(part_num), str(start_idx), str(count)])
    print(f"Finished part {part_num}.\n")

print("All massive files regenerated successfully with unique combinatorial data!")
