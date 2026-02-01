/**
 * Level 2: Python Logic
 * Mechanics: Multiple Choice / "Fix the Bug"
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentChallengeIndex = 0;

        // Define Challenges (Python Syntax & Logic)
        this.challenges = [
            {
                id: 1,
                title: "Variables & Types",
                // Pre-highlighted HTML to avoid regex issues
                codeHTML: `user_age = <span class="str">"twenty"</span>\n<span class="kw">if</span> user_age > <span class="num">18</span>:\n    <span class="func">print</span>(<span class="str">"Access Granted"</span>)`,
                rawCode: `user_age = "twenty"\nif user_age > 18:\n    print("Access Granted")`,
                options: [
                    { id: 'a', text: 'user_age = 20', correct: true },
                    { id: 'b', text: 'user_age = "20"', correct: false }, // Still string
                    { id: 'c', text: 'int user_age = 20', correct: false } // Java style
                ],
                feedback: {
                    correct: "Correct! Ages must be integers (numbers) to be compared with > 18.",
                    incorrect: "Strings cannot be compared numerically. Remove quotes to make it an Integer."
                }
            },
            {
                id: 2,
                title: "Loops",
                codeHTML: `<span class="kw">for</span> i <span class="kw">in</span> <span class="func">range</span>(<span class="num">5</span>)\n    <span class="func">print</span>(i)`,
                rawCode: `for i in range(5)\n    print(i)`,
                options: [
                    { id: 'a', text: 'Add colon (:)', correct: true },
                    { id: 'b', text: 'Change to while', correct: false },
                    { id: 'c', text: 'i++', correct: false }
                ],
                feedback: {
                    correct: "Syntax Fixed! Python loops (and if/def) require a colon at the end.",
                    incorrect: "Look closely at the end of the 'for' line. Something is missing."
                }
            },
            {
                id: 3,
                title: "Conditionals",
                codeHTML: `password = <span class="str">"secret"</span>\n<span class="kw">if</span> password = <span class="str">"admin"</span>:\n    <span class="func">print</span>(<span class="str">"Welcome"</span>)`,
                rawCode: `password = "secret"\nif password = "admin":\n    print("Welcome")`,
                options: [
                    { id: 'a', text: 'Change = to ==', correct: true },
                    { id: 'b', text: 'Change "admin" to "secret"', correct: false }, // Logic change, but we want syntax fix? Actually = is assignment.
                    { id: 'c', text: 'Remove :', correct: false }
                ],
                feedback: {
                    correct: "Bug Squashed! '=' is assignment. '==' is comparison.",
                    incorrect: "A single '=' assigns a value. We need to COMPARE."
                }
            }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = `
            <h2>${this.game.getText('L2_TITLE')}</h2>
            <p>${this.game.getText('L2_DESC')}</p>
            
            <div class="code-challenge-container">
                <!-- List -->
                <div class="challenge-list" style="width:200px; display:flex; flex-direction:column; gap:0.5rem;">
                    ${this.challenges.map((c, i) => `
                        <button class="btn btn-sm ${i === this.currentChallengeIndex ? 'btn-primary' : 'btn-secondary'}" 
                                onclick="document.dispatchEvent(new CustomEvent('l2-select', {detail:${i}}))">
                            ${this.game.getText('L2_TASK_PREFIX')} ${i + 1}
                        </button>
                    `).join('')}
                </div>

                <!-- Editor Area -->
                <div class="code-editor-area" style="flex:1;">
                    <h3 id="c-title"></h3>
                    <div class="code-editor" id="c-code" style="min-height:150px; font-size:1.1rem; line-height:1.5;"></div>
                    
                    <div id="c-options" style="margin-top:1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
                        <!-- Options go here -->
                    </div>
                    
                    <div style="margin-top:1.5rem; text-align:right;">
                        <button id="btn-run-code" class="btn">${this.game.getText('L2_BTN_RUN')}</button>
                    </div>
                </div>
            </div>
            
            <style>
                .kw { color: #c586c0; font-weight:bold; }
                .func { color: #dcdcaa; }
                .str { color: #ce9178; }
                .num { color: #b5cea8; }
            </style>
        `;

        // Re-attach listeners safely
        // We use a document listener for the button clicks (delegated or custom event)
        // But to be safe vs memory leaks, let's just grab the buttons directly now that they exist
        const buttons = this.container.querySelectorAll('.challenge-list button');
        buttons.forEach((btn, idx) => {
            btn.onclick = (e) => {
                e.stopPropagation(); // Prevent bubbling if needed
                this.currentChallengeIndex = idx;
                this.render();
            };
        });

        this.container.querySelector('#btn-run-code').onclick = () => this.checkAnswer();

        this.loadChallenge();
    },

    loadChallenge() {
        const challenge = this.challenges[this.currentChallengeIndex];

        this.container.querySelector('#c-title').innerText = challenge.title;
        this.container.querySelector('#c-code').innerHTML = challenge.codeHTML; // Safe HTML

        const optsContainer = this.container.querySelector('#c-options');
        optsContainer.innerHTML = '';

        challenge.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-option btn-secondary';
            btn.style.textAlign = 'left';
            btn.style.width = '100%';
            btn.innerText = `> ${opt.text}`;
            btn.onclick = () => this.selectOption(btn, opt);
            optsContainer.appendChild(btn);
        });

        this.selectedOption = null;
    },

    selectOption(btnElement, optionData) {
        this.container.querySelectorAll('.btn-option').forEach(b => {
            b.classList.remove('selected');
            b.style.borderColor = 'var(--color-secondary)';
            b.style.background = 'transparent';
        });

        btnElement.classList.add('selected');
        btnElement.style.borderColor = 'var(--color-primary)';
        btnElement.style.background = 'rgba(0, 243, 255, 0.1)';

        this.selectedOption = optionData;
    },

    checkAnswer() {
        if (!this.selectedOption) {
            this.game.showFeedback('No Selection', 'Please select a fix before executing the script.');
            return;
        }

        const challenge = this.challenges[this.currentChallengeIndex];

        if (this.selectedOption.correct) {
            this.game.showFeedback('COMPILATION SUCCESS', challenge.feedback.correct);

            setTimeout(() => {
                if (this.currentChallengeIndex < this.challenges.length - 1) {
                    this.currentChallengeIndex++;
                    this.render();
                } else {
                    this.finishLevel();
                }
            }, 1500);
        } else {
            this.game.showFeedback('RUNTIME ERROR', challenge.feedback.incorrect);
        }
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
