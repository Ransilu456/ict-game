/**
 * Level 2: Python Logic
 * Mechanics: Multiple Choice / "Fix the Bug"
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentChallenge = 0;
        this.score = 0;

        // Challenge Data
        this.challenges = [
            {
                id: 1,
                title: "Variables & Types",
                desc_en: "Fix the variable declaration to store an Integer.",
                desc_si: "Integer (පූර්ණ සංඛ්‍යා) අගයක් ගබඩා කිරීම සඳහා විචල්‍යය නිවැරදි කරන්න.",
                code: `
user_age = "twenty"
if user_age > 18:
    print("Access Granted")
                `,
                options: [
                    { text: 'user_age = 20', correct: true },
                    { text: 'user_age = 20.5', correct: false },
                    { text: 'int user_age = 20', correct: false } // Trap for C/Java users
                ]
            },
            {
                id: 2,
                title: "Loops (For)",
                desc_en: "Correct the loop syntax to iterate 5 times.",
                desc_si: "5 වතාවක් ක්‍රියාත්මක වීම සදහා loop එක නිවැරදි කරන්න.",
                code: `
for i in range(5)
    print("Scanning Port", i)
                `,
                options: [
                    { text: 'Add colon (:)', correct: true },
                    { text: 'Use "foreach"', correct: false },
                    { text: 'Change to [0..5]', correct: false }
                ]
            },
            {
                id: 3,
                title: "Conditionals",
                desc_en: "Select the correct operator for 'Not Equal'.",
                desc_si: "'අසමානයි' (Not Equal) යන්න නිරූපණය කිරීමට නිවැරදි සංකේතය තෝරන්න.",
                code: `
secret_key = "1234"
if input_key ____ secret_key:
    print("Access Denied")
                `,
                options: [
                    { text: '<>', correct: false },
                    { text: '!=', correct: true },
                    { text: '!==', correct: false }
                ]
            }
        ];

        this.totalChallenges = this.challenges.length;
        this.render();
    },

    render() {
        const challenge = this.challenges[this.currentChallenge];
        // Determine Description Language
        const desc = this.game.gameState.lang === 'si' ? challenge.desc_si : challenge.desc_en;

        this.container.innerHTML = `
            <h2>${this.game.getText('L2_TITLE')}</h2>
            <div style="display:flex; gap:2rem; align-items:flex-start;">
                
                <!-- Code Editor View -->
                <div style="flex:2; background:#1e1e1e; padding:1.5rem; border-radius:8px; border:1px solid #333; font-family:'Consolas', monospace; color:#d4d4d4;">
                    <h4 style="color:#569cd6; margin-bottom:1rem;">Snippet #${this.currentChallenge + 1}: ${challenge.title}</h4>
                    <p style="color:#6a9955; margin-bottom:1rem;"># ${desc}</p>
                    <pre style="font-size:1.2rem; line-height:1.5;">${this.syntaxHighlight(challenge.code)}</pre>
                </div>

                <!-- Control Panel -->
                <div style="flex:1; display:flex; flex-direction:column; gap:1rem;">
                    <h3>${this.game.getText('L2_TASK_PREFIX')} FIX THE BUG</h3>
                    <div id="options-container" style="display:flex; flex-direction:column; gap:10px;">
                        ${challenge.options.map((opt, idx) => `
                            <button class="btn btn-option" data-idx="${idx}" style="text-align:left; text-transform:none;">
                                > ${opt.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.attachEvents();
    },

    // Simple manual syntax highlighter for visual flair
    syntaxHighlight(code) {
        // Order matters to avoid replacing inside already replaced tags
        // But simply replacing sequentially with simple regex on HTML string is risky.
        // Better approach: Escape HTML first, then wrap known tokens.
        // For this simple prototype, let's just make the regex stricter using word boundaries \b

        let html = code;

        // Keywords
        html = html.replace(/\b(if|else|elif|for|while|in|def|return)\b/g, '<span style="color:#c586c0">$1</span>');

        // Functions (print, range, max, min, int, str)
        html = html.replace(/\b(print|range|input|int|str)\b/g, '<span style="color:#dcdcaa">$1</span>');

        // Strings (double quotes) - This is still risky if it contains keywords, but for our specific snippets it's okay.
        // We do this LAST or separate to avoid coloring inside strings? 
        // Actually, normally you parse properly. But for this hacky highlight:
        html = html.replace(/".*?"/g, '<span style="color:#ce9178">$&</span>');

        // Numbers
        html = html.replace(/\b\d+\b/g, '<span style="color:#b5cea8">$&</span>');

        return html;
    },

    attachEvents() {
        const opts = this.container.querySelectorAll('.btn-option');
        opts.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                this.checkAnswer(idx);
            });
        });
    },

    checkAnswer(idx) {
        const challenge = this.challenges[this.currentChallenge];
        const isCorrect = challenge.options[idx].correct;

        if (isCorrect) {
            this.score += 100;
            this.game.showFeedback('SUCCESS', 'Patch Applied Successfully.');
        } else {
            this.game.showFeedback('ERROR', 'Syntax Error Detected. Compilation Failed.');
        }

        // Move next after small delay
        setTimeout(() => {
            this.currentChallenge++;
            if (this.currentChallenge < this.totalChallenges) {
                this.render();
            } else {
                this.finishLevel();
            }
        }, 1500);
    },

    finishLevel() {
        // Pass results
        this.game.completeLevel({
            success: true,
            score: this.score,
            xp: 750,
            accuracy: Math.round((this.score / (this.totalChallenges * 100)) * 100),
            timeBonus: 0
        });
    }
};
