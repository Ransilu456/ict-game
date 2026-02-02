/**
 * Level 7: Cryptography (Caesar Cipher)
 * Mechanic: Decrypt messages using a shift cipher tool.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentStage = 0;

        this.stages = [
            {
                id: 1,
                encrypted: "KHOOR ZRUOG",
                shift: 3,
                answer: "HELLO WORLD",
                hint: "Shift -3"
            },
            {
                id: 2,
                encrypted: "VHFXULWB",
                shift: 3,
                answer: "SECURITY",
                hint: "Shift -3"
            },
            {
                id: 3,
                encrypted: "DATA PROTECTION",
                encrypted_display: "GDWD SURWHFWLRQ", // Shift 3
                shift: 3,
                answer: "DATA PROTECTION", // Wait, logic below handles dynamic rendering?
                // Let's keep it simple: We show encrypted text, user adjusts shift to find readable text, then Confirms.
                // Or user types the answer?
                // Let's make it interactive: "Decrypt Tool" where they rotate a dial/slider to find the key, then click "Decrypt".
                // If the key is correct, the text becomes readable.
                targetLimit: 3
            }
        ];

        // Redefine stages for "Find the Key" mechanic
        this.challenges = [
            {
                id: 1,
                text: "SYSTEM",
                shift: 3, // Encrypted: VBVWHP
                hint: "Standard Offset"
            },
            {
                id: 2,
                text: "FIREWALL",
                shift: 5, // KNWJBFQQ
                hint: "High Security"
            },
            {
                id: 3,
                text: "ENCRYPTION",
                shift: 1, // FODSZQUJPO
                hint: "Minimal Shift"
            },
            {
                id: 4,
                text: "PASSWORD",
                shift: 13, // CNFFJBEQ (ROT13)
                hint: "Half Rotation"
            }
        ];

        this.currentChallengeIdx = 0;
        this.currentShift = 0;

        this.render();
    },

    getEncrypted(text, shift) {
        return text.split('').map(char => {
            if (char.match(/[A-Z]/)) {
                const code = char.charCodeAt(0);
                // Shift
                let shifted = ((code - 65 + shift) % 26) + 65;
                if (shifted < 65) shifted += 26; // handle negative wrap helper
                return String.fromCharCode(shifted);
            }
            return char;
        }).join('');
    },

    // Decrypt logic is just shifting back
    // Use ROT(26-shift)

    render() {
        const challenge = this.challenges[this.currentChallengeIdx];
        const encryptedText = this.getEncrypted(challenge.text, challenge.shift);

        // Live preview based on user's current dial setting
        // User "Decrypts" by applying a negative shift (or finding the shift key)
        // Let's say the tool applies a shift of 'N'. 
        // Goal: User sets N such that Encrypted + Shift(N) = Readable.
        // Actually, normally you subtract the shift. 
        // Let's say Tool applies Right Shift.
        // If Encrypted is (Plain + 3), then we need (Encrypted + 23) or (Encrypted - 3).
        // Let's visualize "Shift Key" as just an offset number the user picks.

        const previewText = this.getEncrypted(encryptedText, -this.currentShift); // Decrypt attempt?
        // Wait, javascript negative modulo bug handling:
        // custom mod: ((n % m) + m) % m

        this.container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
                
                <div>
                    <h2 class="text-3xl font-bold text-white tracking-wider mb-2">${this.game.getText('L7_TITLE')}</h2>
                    <p class="text-slate-400 max-w-lg mx-auto">${this.game.getText('L7_DESC')}</p>
                </div>

                <!-- Decryption Interface -->
                <div class="w-full glass-panel p-8 rounded-2xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent left-0"></div>
                    
                    <!-- Screen -->
                    <div class="mb-8">
                        <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">Intercepted Message</div>
                        <div class="font-mono text-4xl md:text-5xl font-bold text-rose-500 tracking-widest break-all">
                            ${encryptedText}
                        </div>
                    </div>

                    <!-- Tool -->
                    <div class="bg-slate-900/50 p-6 rounded-xl border border-slate-700 space-y-4">
                        <div class="flex justify-between items-center text-sm text-slate-400">
                            <span>Decryption Key</span>
                            <span class="font-mono text-indigo-400">ROT <span id="shift-val">${this.currentShift}</span></span>
                        </div>
                        
                        <input type="range" min="0" max="25" value="${this.currentShift}" id="shift-slider" class="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer">
                        
                        <div class="flex justify-between text-xs text-slate-600 font-mono pt-1">
                            <span>0</span>
                            <span>13</span>
                            <span>25</span>
                        </div>
                    </div>

                    <!-- Result Preview -->
                    <div class="mt-8">
                        <div class="text-xs text-slate-500 uppercase tracking-widest mb-2">Decrypted Output</div>
                        <div class="font-mono text-3xl md:text-4xl font-bold text-emerald-400 tracking-widest min-h-[3rem] transition-all" id="preview-text">
                            ${this.getDisplayDecrypted(encryptedText, this.currentShift)}
                        </div>
                    </div>

                </div>

                <!-- Action -->
                <button id="btn-decrypt" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-indigo-900/20 transition-all transform hover:scale-105">
                    ${this.game.getText('L7_BTN_DECRYPT')}
                </button>

                <div class="text-xs text-slate-500">
                    Process ${this.currentChallengeIdx + 1} / ${this.challenges.length}
                </div>

            </div>
        `;

        this.attachEvents();
    },

    getDisplayDecrypted(str, shift) {
        // Javascript modulo fix for negative numbers if we were using them, but slider is 0-25 positive.
        // We want to REVERSE the shift done by the encryption.
        // Encryption: +K
        // Decryption: -K or +(26-K)
        // User selects a number S. We apply -S (or +26-S).

        const offset = (26 - shift) % 26;

        return str.split('').map(char => {
            const code = char.charCodeAt(0);
            const shifted = ((code - 65 + offset) % 26) + 65;
            return String.fromCharCode(shifted);
        }).join('');
    },

    attachEvents() {
        const slider = this.container.querySelector('#shift-slider');
        const display = this.container.querySelector('#shift-val');
        const preview = this.container.querySelector('#preview-text');

        const challenge = this.challenges[this.currentChallengeIdx];
        const encrypted = this.getEncrypted(challenge.text, challenge.shift);

        slider.addEventListener('input', (e) => {
            this.currentShift = parseInt(e.target.value);
            display.innerText = this.currentShift;

            // Update preview logic
            preview.innerText = this.getDisplayDecrypted(encrypted, this.currentShift);
        });

        this.container.querySelector('#btn-decrypt').addEventListener('click', () => {
            // Check if currentShift matches challenge.shift
            if (this.currentShift === challenge.shift) {
                this.game.showFeedback(this.game.getText('RES_SUCCESS'), "Message Decrypted Successfully.");
                setTimeout(() => {
                    this.nextStage();
                }, 1000);
            } else {
                this.game.showFeedback(this.game.getText('RES_FAIL'), "Decryption Failed. Garbled Data.");
            }
        });
    },

    nextStage() {
        this.currentChallengeIdx++;
        this.currentShift = 0; // Reset
        if (this.currentChallengeIdx < this.challenges.length) {
            this.render();
        } else {
            this.game.completeLevel({
                success: true,
                score: 2500,
                xp: 2000,
                accuracy: 100,
                timeBonus: 100
            });
        }
    }
};
