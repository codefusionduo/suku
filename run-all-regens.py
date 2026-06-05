#!/usr/bin/env python3
import subprocess

parts = [
    (2, 1250002, 1250001),
    (3, 2500003, 1250001),
    (4, 3750004, 1250001),
    (5, 5000005, 1250001),
    (6, 6250006, 1250001)
]

for part_num, start_idx, count in parts:
    print(f"Starting regeneration for part {part_num}...")
    subprocess.run(["python", "regenerate-all-massive-files.py", str(part_num), str(start_idx), str(count)])
    print(f"Finished part {part_num}.\n")

print("All massive files regenerated successfully with unique combinatorial data!")
