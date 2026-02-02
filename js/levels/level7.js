/**
 * Level 7: Cryptography (Caesar Cipher)
 * Mechanic: Decrypt messages using a shift cipher tool.
 * Refined for smoother interaction, consistent UI, and Added Tutorial.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentStage = 0;
        this.startTime = Date.now();

        // Define Challenges
        this.challenges = [
            {
                id: 1,
                text: "SYSTEM",
                shift: 3,
                hint: "Standard Offset +3"
            },
            {
                id: 2,
                text: "FIREWALL",
                shift: 5,
                hint: "Level 5 Encryption"
            },
            {
                id: 3,
                text: "ENCRYPTION",
                shift: 1,
                hint: "Minimal Shift"
            },
            {
                id: 4,
                text: "PASSWORD",
                shift: 13,
                hint: "Half Rotation"
            }
        ];

        this.currentShift = 0;
        this.render();
    },

    getEncrypted(text, shift) {
        return text.split('').map(char => {
            if (char.match(/[A-Z]/)) {
                const code = char.charCodeAt(0);
                const shifted = ((code - 65 + shift) % 26) + 65;
                return String.fromCharCode(shifted);
            }
            return char;
        }).join('');
    },

    getDecrypted(text, shift) {
        const offset = (26 - (shift % 26)) % 26;
        return this.getEncrypted(text, offset);
    },

    render() {
        const challenge = this.challenges[this.currentStage];
        const encryptedText = this.getEncrypted(challenge.text, challenge.shift);

        // Fix: Use flex-col and overflow-y-auto to allow scrolling on small screens if needed.
        // Add Tutorial Section visible on first stage or via toggle? 
        // Let's just put it plainly visible for the first level or always visible in a compact way.

        this.container.innerHTML = `
            <div class="flex flex-col items-center h-full w-full max-w-5xl mx-auto space-y-6 animate-fade-in py-4 md:py-8 overflow-y-auto px-4">
                
                <div class="space-y-2 text-center shrink-0">
                    <h2 class="text-2xl md:text-3xl font-bold text-white tracking-wider">${this.game.getText('L7_TITLE')}</h2>
                    <p class="text-sm md:text-base text-slate-400 max-w-lg mx-auto">${this.game.getText('L7_DESC')}</p>
                </div>

                <!-- Tutorial / Hint Box (Visible predominantly on Stage 1) -->
                ${this.currentStage === 0 ? `
                <div class="w-full max-w-3xl glass-panel bg-indigo-900/20 border border-indigo-500/40 p-4 rounded-xl flex items-start gap-4">
                    <iconify-icon icon="solar:info-circle-bold" class="text-2xl text-indigo-400 shrink-0 mt-0.5"></iconify-icon>
                    <div>
                        <h4 class="font-bold text-indigo-300 text-sm mb-1">${this.game.getText('L7_HINT_TITLE') || 'Instructions'}</h4>
                        <p class="text-xs md:text-sm text-slate-300 whitespace-pre-line leading-relaxed">${this.game.getText('L7_HINT_BODY') || 'Shift the letters.'}</p>
                    </div>
                </div>` : ''}

                <!-- Decryption Tool -->
                <div class="w-full glass-panel p-6 md:p-10 rounded-2xl border border-indigo-500/30 shadow-2xl relative overflow-hidden bg-slate-900/40 shrink-0">
                    <div class="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent left-0 opacity-50"></div>
                    
                    <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
                        
                        <!-- Screen: Encrypted -->
                        <div class="flex-1 space-y-2 w-full text-center md:text-left">
                            <div class="text-xs text-rose-400 font-bold uppercase tracking-widest">Intercepted</div>
                            <div class="glass-panel bg-slate-950 border-rose-500/30 p-4 md:p-6 rounded-xl relative flex justify-center md:justify-start">
                                <iconify-icon icon="solar:lock-keyhole-bold-duotone" class="text-rose-500 absolute top-2 right-2 text-xl opacity-50"></iconify-icon>
                                <div class="font-mono text-2xl md:text-4xl font-bold text-rose-500 tracking-[0.2em] break-all drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                                    ${encryptedText}
                                </div>
                            </div>
                        </div>

                        <!-- Arrow -->
                        <div class="text-slate-600 shrink-0">
                             <iconify-icon icon="solar:arrow-right-broken" class="text-3xl md:text-4xl md:rotate-0 rotate-90"></iconify-icon>
                        </div>

                        <!-- Screen: Decrypted -->
                        <div class="flex-1 space-y-2 w-full text-center md:text-left">
                            <div class="text-xs text-emerald-400 font-bold uppercase tracking-widest">Result</div>
                            <div class="glass-panel bg-slate-950 border-emerald-500/30 p-4 md:p-6 rounded-xl relative flex justify-center md:justify-start">
                                <iconify-icon icon="solar:shield-check-bold-duotone" class="text-emerald-500 absolute top-2 right-2 text-xl opacity-50"></iconify-icon>
                                <div class="font-mono text-2xl md:text-4xl font-bold text-emerald-400 tracking-[0.2em] break-all transition-all" id="preview-text">
                                    ${this.getDecrypted(encryptedText, this.currentShift)}
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Controls -->
                    <div class="mt-8 bg-slate-800/50 p-4 md:p-6 rounded-xl border border-slate-700 space-y-4 max-w-lg mx-auto">
                        <div class="flex justify-between items-center text-sm text-slate-300 font-bold">
                            <span>Shift Key</span>
                            <span class="font-mono text-xl text-indigo-400 bg-slate-900 px-3 py-1 rounded border border-slate-700 w-12 text-center" id="shift-val-display">${this.currentShift}</span>
                        </div>
                        
                        <input type="range" min="0" max="25" value="${this.currentShift}" id="shift-slider" 
                            class="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all">
                        
                        <div class="flex justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                            <span>0</span>
                            <span class="hidden md:inline">ROT13</span>
                            <span>25</span>
                        </div>
                    </div>

                </div>

                <!-- Action Button -->
                <button id="btn-decrypt" class="shrink-0 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-indigo-900/30 transition-all transform hover:scale-105 flex items-center gap-3 text-lg">
                    <iconify-icon icon="solar:unlock-keyhole-bold"></iconify-icon>
                    ${this.game.getText('L7_BTN_DECRYPT')}
                </button>

                <div class="text-xs text-slate-500 font-mono pb-4">
                    Progress: ${this.currentStage + 1} / ${this.challenges.length}
                </div>

            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        const slider = this.container.querySelector('#shift-slider');
        const display = this.container.querySelector('#shift-val-display');
        const preview = this.container.querySelector('#preview-text');
        const btn = this.container.querySelector('#btn-decrypt');

        const challenge = this.challenges[this.currentStage];
        const encrypted = this.getEncrypted(challenge.text, challenge.shift);

        slider.addEventListener('input', (e) => {
            this.currentShift = parseInt(e.target.value);
            display.innerText = this.currentShift;
            preview.innerText = this.getDecrypted(encrypted, this.currentShift);
        });

        btn.addEventListener('click', () => {
            if (this.currentShift === challenge.shift) {
                this.game.showFeedback(this.game.getText('RES_SUCCESS'), "Message Decrypted. Access Granted.");
                setTimeout(() => {
                    this.nextStage();
                }, 1000);
            } else {
                this.game.showFeedback(this.game.getText('RES_FAIL'), "Encryption Mismatch. Key invalid.");
                this.game.gameState.score -= 25; // Penalty
                this.game.updateHUD();
            }
        });
    },

    nextStage() {
        this.currentStage++;
        this.currentShift = 0; // Reset
        if (this.currentStage < this.challenges.length) {
            this.render();
        } else {
            const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
            const timeBonus = Math.max(0, (120 - elapsedSec) * 5);

            this.game.completeLevel({
                success: true,
                score: 2500 + timeBonus,
                xp: 2000,
                accuracy: 100,
                timeBonus: timeBonus
            });
        }
    }
};
