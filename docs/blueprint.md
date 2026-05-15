# **App Name**: CipherFile

## Core Features:

- Intuitive UI: Simple, clean UI for file selection and encryption/decryption.
- Fast Encryption: Symmetric file encryption/decryption with Fernet.
- Easy User Interaction: Simple 'Encrypt File', 'Decrypt File', and 'Generate/Load Key' buttons.
- User Guidance: The app analyzes user interaction with key management (e.g., successful loads, repeated failures, cloud sync) using AI as a tool. Based on this it will give nudges and friendly guidance within the user interface.
- Local Key Storage: Load and save keys locally in a secure format (integration with Firebase is not part of the MVP).
- Feedback Messages: Clear error messages and success notifications.
- Code Quality: Modular code design with comments for easy extension and maintenance.

## Style Guidelines:

- Primary color: A soft sky blue (#87CEEB) evoking trust and security.
- Background color: Very light gray (#F0F0F0), providing a clean, neutral backdrop.
- Accent color: Muted forest green (#6B8E23), drawing the eye with its organic warmth.
- Body and headline font: 'Inter' sans-serif for a modern, neutral look.
- Use minimalist icons for encryption, decryption, and key management actions.
- Clean and simple layout with clear divisions and user guidance.
- Subtle transition animations when a process complete successfully (file selection, encryption/decryption success). Do not animate error displays.