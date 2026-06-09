#!/usr/bin/env python3
"""Regenerate Coding examples training datasets."""

import json
import sys

languages = ["Python", "JavaScript", "Java", "C++", "Ruby", "Go", "Rust", "PHP", "Swift", "Kotlin", "C#"]
tasks = ["print hello world", "create a loop", "define a function", "declare a variable", "create a class", "handle exceptions", "import a module", "read a file", "write a file"]

def get_unique_coding_entry(topic_num):
    lang_idx = topic_num % len(languages)
    task_idx = (topic_num // len(languages)) % len(tasks)
    
    lang = languages[lang_idx]
    task = tasks[task_idx]
    
    if task == "print hello world":
        pattern1 = f"how to print hello world in {lang.lower()}"
        pattern2 = f"{lang.lower()} hello world example {topic_num}"
        pattern3 = f"coding snippet {topic_num} hello world"
        
        if lang == "Python": code = f"print('Hello World {topic_num}')"
        elif lang == "JavaScript": code = f"console.log('Hello World {topic_num}');"
        elif lang == "Java": code = f"System.out.println(\"Hello World {topic_num}\");"
        elif lang == "C++": code = f"std::cout << \"Hello World {topic_num}\" << std::endl;"
        elif lang == "Ruby": code = f"puts 'Hello World {topic_num}'"
        elif lang == "Go": code = f"fmt.Println(\"Hello World {topic_num}\")"
        elif lang == "Rust": code = f"println!(\"Hello World {topic_num}\");"
        elif lang == "PHP": code = f"echo 'Hello World {topic_num}';"
        elif lang == "Swift": code = f"print(\"Hello World {topic_num}\")"
        elif lang == "Kotlin": code = f"println(\"Hello World {topic_num}\")"
        elif lang == "C#": code = f"Console.WriteLine(\"Hello World {topic_num}\");"
        
        resp1 = f"Here is how to print Hello World in {lang}:\n```\n{code}\n```"
        resp2 = f"Code snippet #{topic_num} for {lang}:\n```\n{code}\n```"
        
    elif task == "create a loop":
        pattern1 = f"how to create a loop in {lang.lower()}"
        pattern2 = f"{lang.lower()} loop example {topic_num}"
        pattern3 = f"coding snippet {topic_num} for loop"
        
        if lang == "Python": code = f"for i in range({topic_num % 100}):\n    print(i)"
        elif lang == "JavaScript": code = f"for(let i=0; i<{topic_num % 100}; i++) {{\n    console.log(i);\n}}"
        elif lang == "Java": code = f"for(int i=0; i<{topic_num % 100}; i++) {{\n    System.out.println(i);\n}}"
        elif lang == "C++": code = f"for(int i=0; i<{topic_num % 100}; i++) {{\n    std::cout << i << std::endl;\n}}"
        elif lang == "Ruby": code = f"({topic_num % 100}).times do |i|\n  puts i\nend"
        elif lang == "Go": code = f"for i := 0; i < {topic_num % 100}; i++ {{\n    fmt.Println(i)\n}}"
        elif lang == "Rust": code = f"for i in 0..{topic_num % 100} {{\n    println!(\"{{}}\", i);\n}}"
        elif lang == "PHP": code = f"for($i=0; $i<{topic_num % 100}; $i++) {{\n    echo $i;\n}}"
        elif lang == "Swift": code = f"for i in 0..<{topic_num % 100} {{\n    print(i)\n}}"
        elif lang == "Kotlin": code = f"for (i in 0 until {topic_num % 100}) {{\n    println(i)\n}}"
        elif lang == "C#": code = f"for(int i=0; i<{topic_num % 100}; i++) {{\n    Console.WriteLine(i);\n}}"
        
        resp1 = f"Here is a loop example in {lang}:\n```\n{code}\n```"
        resp2 = f"Loop iteration code #{topic_num}:\n```\n{code}\n```"
        
    elif task == "define a function":
        pattern1 = f"how to define a function in {lang.lower()}"
        pattern2 = f"{lang.lower()} function example {topic_num}"
        pattern3 = f"coding snippet {topic_num} function"
        
        func_name = f"myFunction_{topic_num}"
        if lang == "Python": code = f"def {func_name}(x):\n    return x * 2"
        elif lang == "JavaScript": code = f"function {func_name}(x) {{\n    return x * 2;\n}}"
        elif lang == "Java": code = f"public int {func_name}(int x) {{\n    return x * 2;\n}}"
        elif lang == "C++": code = f"int {func_name}(int x) {{\n    return x * 2;\n}}"
        elif lang == "Ruby": code = f"def {func_name}(x)\n  x * 2\nend"
        elif lang == "Go": code = f"func {func_name}(x int) int {{\n    return x * 2\n}}"
        elif lang == "Rust": code = f"fn {func_name}(x: i32) -> i32 {{\n    x * 2\n}}"
        elif lang == "PHP": code = f"function {func_name}($x) {{\n    return $x * 2;\n}}"
        elif lang == "Swift": code = f"func {func_name}(x: Int) -> Int {{\n    return x * 2\n}}"
        elif lang == "Kotlin": code = f"fun {func_name}(x: Int): Int {{\n    return x * 2\n}}"
        elif lang == "C#": code = f"public int {func_name}(int x) {{\n    return x * 2;\n}}"
        
        resp1 = f"Here is how to declare a function in {lang}:\n```\n{code}\n```"
        resp2 = f"Function definition #{topic_num}:\n```\n{code}\n```"
        
    elif task == "create a class":
        pattern1 = f"how to create a class in {lang.lower()}"
        pattern2 = f"{lang.lower()} class example {topic_num}"
        pattern3 = f"coding snippet {topic_num} class"
        
        class_name = f"MyClass_{topic_num}"
        if lang == "Python": code = f"class {class_name}:\n    pass"
        elif lang in ["JavaScript", "Java", "C++", "PHP", "Swift", "C#"]: code = f"class {class_name} {{\n}}"
        elif lang == "Ruby": code = f"class {class_name}\nend"
        elif lang == "Go": code = f"type {class_name} struct {{\n}}"
        elif lang == "Rust": code = f"struct {class_name} {{\n}}"
        elif lang == "Kotlin": code = f"class {class_name}"
        else: code = f"class {class_name} {{}}"
        
        resp1 = f"Here is how to create a class in {lang}:\n```\n{code}\n```"
        resp2 = f"Class definition #{topic_num}:\n```\n{code}\n```"
        
    elif task == "handle exceptions":
        pattern1 = f"how to handle exceptions in {lang.lower()}"
        pattern2 = f"{lang.lower()} try catch example {topic_num}"
        pattern3 = f"coding snippet {topic_num} error handling"
        
        if lang == "Python": code = "try:\n    pass\nexcept Exception as e:\n    print(e)"
        elif lang in ["JavaScript", "Java", "C++", "C#", "PHP"]: code = "try {\n} catch(e) {\n}"
        elif lang == "Ruby": code = "begin\nrescue => e\nend"
        elif lang == "Go": code = "if err != nil {\n    fmt.Println(err)\n}"
        elif lang == "Rust": code = "match result {\n    Ok(_) => (),\n    Err(e) => println!(\"{}\", e),\n}"
        elif lang == "Swift": code = "do {\n} catch {\n}"
        elif lang == "Kotlin": code = "try {\n} catch (e: Exception) {\n}"
        else: code = "try {} catch(e) {}"
        
        resp1 = f"Here is how to handle errors in {lang}:\n```\n{code}\n```"
        resp2 = f"Exception handling #{topic_num}:\n```\n{code}\n```"
        
    elif task == "import a module":
        pattern1 = f"how to import a module in {lang.lower()}"
        pattern2 = f"{lang.lower()} import example {topic_num}"
        pattern3 = f"coding snippet {topic_num} imports"
        
        mod_name = f"Module_{topic_num}"
        if lang == "Python": code = f"import {mod_name}"
        elif lang == "JavaScript": code = f"import {{ stuff }} from '{mod_name}';"
        elif lang == "Java": code = f"import com.example.{mod_name};"
        elif lang == "C++": code = f"#include <{mod_name}>"
        elif lang == "Ruby": code = f"require '{mod_name}'"
        elif lang == "Go": code = f"import \"{mod_name}\""
        elif lang == "Rust": code = f"use std::{mod_name};"
        elif lang == "PHP": code = f"require_once '{mod_name}.php';"
        elif lang == "Swift": code = f"import {mod_name}"
        elif lang == "Kotlin": code = f"import org.example.{mod_name}"
        elif lang == "C#": code = f"using {mod_name};"
        else: code = f"import {mod_name};"
        
        resp1 = f"Here is how to import modules in {lang}:\n```\n{code}\n```"
        resp2 = f"Import statement #{topic_num}:\n```\n{code}\n```"

    elif task == "read a file":
        pattern1 = f"how to read a file in {lang.lower()}"
        pattern2 = f"{lang.lower()} read file example {topic_num}"
        pattern3 = f"coding snippet {topic_num} file read"
        
        file_name = f"data_{topic_num}.txt"
        if lang == "Python": code = f"with open('{file_name}', 'r') as f:\n    data = f.read()"
        elif lang == "JavaScript": code = f"const fs = require('fs');\nconst data = fs.readFileSync('{file_name}', 'utf8');"
        elif lang == "Java": code = f"String data = new String(Files.readAllBytes(Paths.get(\"{file_name}\")));"
        elif lang == "C++": code = f"std::ifstream file(\"{file_name}\");\nstd::string str;\nwhile (std::getline(file, str)) {{ /* process */ }}"
        elif lang == "Ruby": code = f"data = File.read('{file_name}')"
        elif lang == "Go": code = f"data, err := os.ReadFile(\"{file_name}\")"
        elif lang == "Rust": code = f"let data = fs::read_to_string(\"{file_name}\").expect(\"Unable to read file\");"
        elif lang == "PHP": code = f"$data = file_get_contents('{file_name}');"
        elif lang == "Swift": code = f"let data = try String(contentsOfFile: \"{file_name}\")"
        elif lang == "Kotlin": code = f"val data = File(\"{file_name}\").readText()"
        elif lang == "C#": code = f"string data = File.ReadAllText(\"{file_name}\");"
        else: code = f"// read {file_name}"
        
        resp1 = f"Here is how to read files in {lang}:\n```\n{code}\n```"
        resp2 = f"File reading snippet #{topic_num}:\n```\n{code}\n```"
        
    elif task == "write a file":
        pattern1 = f"how to write to a file in {lang.lower()}"
        pattern2 = f"{lang.lower()} write file example {topic_num}"
        pattern3 = f"coding snippet {topic_num} file write"
        
        file_name = f"output_{topic_num}.txt"
        if lang == "Python": code = f"with open('{file_name}', 'w') as f:\n    f.write('hello')"
        elif lang == "JavaScript": code = f"const fs = require('fs');\nfs.writeFileSync('{file_name}', 'hello');"
        elif lang == "Java": code = f"Files.write(Paths.get(\"{file_name}\"), \"hello\".getBytes());"
        elif lang == "C++": code = f"std::ofstream file(\"{file_name}\");\nfile << \"hello\";"
        elif lang == "Ruby": code = f"File.write('{file_name}', 'hello')"
        elif lang == "Go": code = f"err := os.WriteFile(\"{file_name}\", []byte(\"hello\"), 0644)"
        elif lang == "Rust": code = f"fs::write(\"{file_name}\", \"hello\").expect(\"Unable to write file\");"
        elif lang == "PHP": code = f"file_put_contents('{file_name}', 'hello');"
        elif lang == "Swift": code = f"try \"hello\".write(toFile: \"{file_name}\", atomically: true, encoding: .utf8)"
        elif lang == "Kotlin": code = f"File(\"{file_name}\").writeText(\"hello\")"
        elif lang == "C#": code = f"File.WriteAllText(\"{file_name}\", \"hello\");"
        else: code = f"// write {file_name}"
        
        resp1 = f"Here is how to write files in {lang}:\n```\n{code}\n```"
        resp2 = f"File writing snippet #{topic_num}:\n```\n{code}\n```"

    else: # declare a variable
        pattern1 = f"how to declare a variable in {lang.lower()}"
        pattern2 = f"{lang.lower()} variable example {topic_num}"
        pattern3 = f"coding snippet {topic_num} variable"
        
        var_name = f"myVar_{topic_num}"
        if lang == "Python": code = f"{var_name} = {topic_num}"
        elif lang == "JavaScript": code = f"let {var_name} = {topic_num};"
        elif lang == "Java": code = f"int {var_name} = {topic_num};"
        elif lang == "C++": code = f"int {var_name} = {topic_num};"
        elif lang == "Ruby": code = f"{var_name} = {topic_num}"
        elif lang == "Go": code = f"{var_name} := {topic_num}"
        elif lang == "Rust": code = f"let {var_name} = {topic_num};"
        elif lang == "PHP": code = f"${var_name} = {topic_num};"
        elif lang == "Swift": code = f"var {var_name} = {topic_num}"
        elif lang == "Kotlin": code = f"var {var_name} = {topic_num}"
        elif lang == "C#": code = f"int {var_name} = {topic_num};"
        
        resp1 = f"Variable declaration in {lang}:\n```\n{code}\n```"
        resp2 = f"Variable example #{topic_num}:\n```\n{code}\n```"
        
    return {
        "category": "coding_examples",
        "patterns": [pattern1, pattern2, pattern3],
        "responses": [resp1, resp2]
    }

def generate_part(part_num, start_idx, count):
    filename = f"suku-training-massive-{part_num}.jsonl"
    print(f"Generating Part {part_num} (topics {start_idx} to {start_idx + count - 1}) -> {filename}...")
    
    with open(filename, "w", encoding="utf-8") as f:
        for i in range(count):
            topic_num = start_idx + i
            entry = get_unique_coding_entry(topic_num)
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
        print("Usage: python regenerate-coding-massive-files.py <part_num> <start_idx> <count>")
        sys.exit(1)
        
    part_num = int(sys.argv[1])
    start_idx = int(sys.argv[2])
    count = int(sys.argv[3])
    generate_part(part_num, start_idx, count)
