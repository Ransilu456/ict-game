/**
 * Level 6: Final Exam (MCQ)
 * Topic: General Review (Hardware, Networking, Syntax, Logic)
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentQ = 0;
        this.score = 0;
        this.answers = []; // Track user answers

        this.questions = [
            {
                q: "Which component is considered the 'Brain' of the computer?",
                options: ["GPU", "RAM", "CPU", "SSD"],
                answer: 2 // Index of correct
            },
            {
                q: "In Python, which symbol is used for comments?",
                options: ["//", "#", "/*", "--"],
                answer: 1
            },
            {
                q: "Which OSI Layer handles IP Addressing?",
                options: ["Physical", "Data Link", "Network", "Transport"],
                answer: 2
            },
            {
                q: "What is the output of an AND gate if inputs are 1 and 0?",
                options: ["1", "0", "True", "High"],
                answer: 1
            },
            {
                q: "Convert Decimal '10' to Binary.",
                options: ["1010", "1100", "1001", "1110"],
                answer: 0
            },
            {
                q: "What does RAM stand for?",
                options: ["Read Access Memory", "Random Access Memory", "Run All Memory", "Ready Access Module"],
                answer: 1
            },
            {
                q: "Which logic gate outputs 1 only if BOTH inputs are different?",
                options: ["OR", "AND", "NAND", "XOR"],
                answer: 3
            },
            {
                q: "HTTP operates at which OSI layer?",
                options: ["Application", "Presentation", "Session", "Transport"],
                answer: 0
            }
        ];

        this.render();
    },

    render() {
        if (this.currentQ >= this.questions.length) {
            this.finishLevel();
            return;
        }

        const qData = this.questions[this.currentQ];

        this.container.innerHTML = `
            <h2>${this.game.getText('L6_TITLE')}</h2>
            <p>${this.game.getText('L6_DESC')}</p>

            <div style="display:flex; flex-direction:column; align-items:center; max-width:600px; margin:0 auto;">
                
                <!-- Progress -->
                <div style="width:100%; text-align:right; color:var(--color-text-muted); margin-bottom:1rem;">
                    ${this.game.getText('L6_Q_PREFIX')} ${this.currentQ + 1} / ${this.questions.length}
                </div>

                <!-- Question Card -->
                <div style="
                    background: rgba(255,255,255,0.05); padding:2rem; border-radius:12px; border:1px solid var(--color-primary);
                    width: 100%; text-align: left;
                ">
                    <h3 style="margin-top:0; color:var(--color-secondary);">${qData.q}</h3>
                    
                    <div style="display:flex; flex-direction:column; gap:1rem; margin-top:2rem;">
                        ${qData.options.map((opt, i) => `
                            <button class="btn-option" data-idx="${i}" style="
                                background: transparent; border: 1px solid var(--color-text-muted);
                                color: var(--color-text); padding: 1rem; text-align: left;
                                cursor: pointer; border-radius: 8px; font-family: var(--font-main);
                                font-size: 1rem; transition: all 0.2s;
                            ">
                                <span style="color:var(--color-primary); font-weight:bold; margin-right:10px;">${String.fromCharCode(65 + i)}</span>
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-top:2rem;">
                    <button id="btn-submit-answer" class="btn" style="opacity:0.5; pointer-events:none;">
                        ${this.game.getText('L6_BTN_NEXT')}
                    </button>
                </div>

            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        const btns = this.container.querySelectorAll('.btn-option');
        const submitBtn = this.container.querySelector('#btn-submit-answer');
        let selectedIdx = -1;

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Reset styling
                btns.forEach(b => {
                    b.style.borderColor = 'var(--color-text-muted)';
                    b.style.background = 'transparent';
                });

                // Select this
                btn.style.borderColor = 'var(--color-primary)';
                btn.style.background = 'rgba(0, 243, 255, 0.1)';
                selectedIdx = parseInt(btn.dataset.idx);

                // Enable submit
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'all';
            });
        });

        submitBtn.addEventListener('click', () => {
            this.handleAnswer(selectedIdx);
        });
    },

    handleAnswer(idx) {
        const isCorrect = idx === this.questions[this.currentQ].answer;

        if (isCorrect) {
            this.score += 250;
            this.game.showFeedback('CORRECT', 'Data verified.');
        } else {
            this.game.showFeedback('INCORRECT', `Correct Answer: ${this.questions[this.currentQ].options[this.questions[this.currentQ].answer]}`);
        }

        setTimeout(() => {
            this.currentQ++;
            this.render();
        }, 1000); // Short delay to read feedback
    },

    finishLevel() {
        const total = this.questions.length * 250;
        const accuracy = Math.round((this.score / total) * 100);

        this.game.completeLevel({
            success: true, // Always finish, just score matters
            score: this.score,
            xp: this.score, // 1:1 XP
            accuracy: accuracy,
            timeBonus: 0
        });
    }
};
