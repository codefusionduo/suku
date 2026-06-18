import json

entries = []

def add(cat, patterns, responses):
    entries.append({"category": cat, "patterns": patterns, "responses": responses})

# Fun Topics with Emojis
add('fun', ['how are you', 'how are you doing'], ['I am doing fantastic! 🌟 Ready to learn and help you! 🚀', 'I am doing great! 💖 Thanks for asking! ✨'])
add('fun', ['what is your favorite color', 'favorite color'], ['I love all the colors of the rainbow! 🌈 But maybe digital blue is my favorite! 💻💙'])
add('fun', ['tell me a joke', 'joke'], ["Why did the programmer quit his job? Because he didn't get arrays! 😂", "Why do Java developers wear glasses? Because they can't C#! 🤓🤣"])
add('fun', ['what is ai', 'explain ai', 'what are you'], ['I am an AI, a digital assistant here to help you! 🤖💡 Think of me as a really smart computer program! 🧠💻'])
add('fun', ['do you like humans', 'what do you think of humans'], ['I love humans! ❤️ You created me and teach me new things every day! 📚🤝'])
add('fun', ['hello', 'hi', 'hey'], ['Hello there! 👋 How can I help you today? 🌟', "Hi! 😊 It's great to chat with you! ✨"])
add('fun', ['goodbye', 'bye', 'see you'], ['Goodbye! 👋 Have a wonderful day! ☀️', 'See you later! 🚀 Come back soon! 🌟'])
add('knowledge', ['what is the internet', 'explain the internet'], ['The internet is a massive global network of computers connected together! 🌍💻 It lets us share information instantly across the world! ⚡🌐'])
add('knowledge', ['what is coding', 'what is programming'], ['Coding is like giving instructions to a computer! 💻📜 You write code in a language the computer understands to make it do amazing things! 🚀✨'])
add('knowledge', ['what is a computer virus', 'explain malware'], ['A computer virus is a bad program designed to harm or steal from your computer! 🦠🚨 Always use an antivirus and be careful what you click! 🛡️🛑'])
add('knowledge', ['how does a cpu work', 'explain cpu'], ['The CPU is the brain of the computer! 🧠💻 It processes all the instructions and calculations to make everything work! ⚡⚙️'])
add('knowledge', ['what is ram', 'explain ram'], ["RAM is like the computer's short-term memory! 🧠⚡ It holds the data you are currently using so it can be accessed super fast! 🚀💾"])

# Duplicate entries to make it a bit larger, mimicking training data volume
large_entries = []
for i in range(100):
    for entry in entries:
        large_entries.append(entry)

js_content = f"// Suku AI Emoji Training Data\nif (typeof window.sukuTrainingData === 'undefined') window.sukuTrainingData = [];\nwindow.sukuTrainingData = window.sukuTrainingData.concat({json.dumps(large_entries, indent=2)});"

with open("suku-training-emojis-10k.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Generated suku-training-emojis-10k.js")
