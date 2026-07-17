<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=34&duration=3000&pause=1000&color=00F5FF&center=true&vCenter=true&width=900&lines=CipherFile;AES-256+File+Encryption;Secure+Fast+Privacy+Focused;Protect+Your+Sensitive+Files" />

# 🔐 CipherFile

### ⚡ Advanced Web-Based File Encryption & Decryption Platform

**Secure • Private • AES-256 • Cyber Security**

[![Stars](https://img.shields.io/github/stars/om-3/CipherFile?style=for-the-badge&logo=github&color=00F0FF)](https://github.com/om-3/CipherFile/stargazers)
[![Forks](https://img.shields.io/github/forks/om-3/CipherFile?style=for-the-badge&logo=github&color=7000FF)](https://github.com/om-3/CipherFile/network/members)
[![Repo Size](https://img.shields.io/github/repo-size/om-3/CipherFile?style=for-the-badge&color=00FFB3)](https://github.com/om-3/CipherFile)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&color=ff0055)](LICENSE)


<img src="https://komarev.com/ghpvc/?username=om-3&label=PROFILE+VIEWS&color=00F0FF&style=for-the-badge" />

</div>

---

## 🌌 About CipherFile

**CipherFile** is a futuristic web-based file encryption and decryption platform built to provide powerful, military-grade protection for sensitive files.

In a world where digital privacy matters more than ever, CipherFile helps users securely encrypt files before storing or sharing them, preventing unauthorized access and keeping confidential information protected. 

Built using the browser’s native **Web Crypto API**, CipherFile delivers high-performance encryption while ensuring maximum privacy—your files stay on your device and are never uploaded to external servers.

> 🔒 **Your files. Your privacy. Your control.**

---

## ⚡ Core Features

- **🔐 AES-256 Encryption:** Protect files using **AES-GCM (256-bit)**, an industry-standard cryptographic algorithm trusted for strong security.
- **🔓 Secure File Decryption:** Decrypt files safely with secure authentication to ensure file integrity.
- **⚡ Lightning Fast Performance:** Optimized encryption and decryption processes for smooth and rapid execution.
- **🛡️ Privacy Focused:** Everything runs locally in your browser. **No cloud uploads. No tracking. No data storage.**
- **📂 Multiple File Support:** Easily encrypt and decrypt important files of various formats.

---

## 🔒 Encryption Architecture

CipherFile uses **AES-256 GCM (Galois/Counter Mode)** powered by the browser's native **Web Crypto API**.

### Security Specifications

| Feature | Details |
|----------|----------|
| **Algorithm** | AES-GCM |
| **Key Length** | 256-bit |
| **Encryption Type** | Symmetric Encryption |
| **Integrity Check** | Yes |
| **Browser API** | Web Crypto API |
| **Security Level** | Enterprise Grade |

### Why AES-GCM?
CipherFile utilizes AES-GCM because it provides:
- ✅ **Confidentiality:** Protects file contents from unauthorized access.
- ✅ **Authentication:** Detects any tampering attempts.
- ✅ **High Performance:** Faster execution compared to older methods.
- ✅ **Modern Security Standard:** More secure than CBC mode.

**Example implementation:**
```ts
async function generateKey() {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  return key;
}
```

---

## 🖥️ Tech Stack

<div align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,ts,tailwind,nodejs,vscode,vercel" />
</div>

- ⚡ **Next.js** - React framework for production
- 📘 **TypeScript** - Static typing for robust code
- 🎨 **Tailwind CSS** - Utility-first styling
- 🛡️ **Web Crypto API** - Native browser cryptography
- 🟢 **Node.js** - Runtime environment

---

## 📸 Project Preview

<details>
<summary><b>Click to view screenshots</b></summary>

### 🏠 Home Screen
<img src="./docs/home.png" width="900" alt="Home Screen"/>

### ⚙️ Choose Action
<img src="./docs/choose-action.png" width="900" alt="Choose Action"/>

### 🔐 Encryption Success
<img src="./docs/encrypt-success.png" width="900" alt="Encryption Success"/>

### 🔓 Decryption Interface
<img src="./docs/decrypt-screen.png" width="900" alt="Decryption Interface"/>

### ✅ Decryption Success
<img src="./docs/decrypt-success.png" width="900" alt="Decryption Success"/>

</details>

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [Git](https://git-scm.com/)

### Installation

```bash
# 1. Clone Repository
git clone [https://github.com/om-3/CipherFile.git](https://github.com/om-3/CipherFile.git)

# 2. Navigate to Project
cd CipherFile

# 3. Install Dependencies
npm install

# 4. Run Development Server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🎯 How To Use

### 🔐 Encrypt File
1. Upload the file you want to secure.
2. Select the **Encrypt** option.
3. Generate and save your secure AES-256 key.
4. Download the newly encrypted file.

### 🔓 Decrypt File
1. Upload the encrypted file.
2. Select the **Decrypt** option.
3. Enter the exact key used during encryption.
4. Download and restore your original file.

---

## 📂 Folder Structure

```text
📦 CipherFile
┣ 📂 docs               # Project screenshots
┣ 📂 src
┃ ┣ 📂 app              # Next.js app router pages
┃ ┣ 📂 components       # Reusable UI components
┃ ┣ 📂 lib              # Cryptography and utility functions
┃ ┗ 📂 styles           # Global stylesheets
┣ 📂 public             # Static assets
┣ 📜 package.json
┣ 📜 next.config.ts
┣ 📜 tailwind.config.ts
┣ 📜 tsconfig.json
┗ 📜 README.md
```

---

## 🚀 Future Enhancements
- [ ] Multi-file bulk encryption
- [ ] Password-based encryption (PBKDF2)
- [ ] Optional cloud backup integration
- [ ] Local encryption history logs
- [ ] Enhanced mobile responsiveness

---

## 🤝 Contribution
Contributions make the open-source community a great place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**OM YERPUDE**

[![GitHub](https://img.shields.io/badge/GitHub-om--3-181717?style=for-the-badge&logo=github)](https://github.com/om-3)
[![Instagram](https://img.shields.io/badge/Instagram-@_om__3.y-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/_om_3.y?igsh=MTA1aWYyYzRpczJueA==)

---

<div align="center">
  <img width="100%" src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" />
  
  ### ⚡ Securing Your Digital World with AES-256 Encryption ⚡
</div>
