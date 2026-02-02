/**
 * Level 7: Cryptography
 * Mechanic: Caesar Cipher Decryption
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentStage = 0;

        this.stages = [
            { id: 1, original: "HELLO", shift: 1, cipher: "IFMMP" },
            { id: 2, original: "SECURE", shift: 3, cipher: "VHFXUH" },
            { id: 3, original: "PYTHON", shift: -1, cipher: "OXSGNM" }
        ];

        this.render();
    },

    render() {
        const stage = this.stages[this.currentStage];

        this.container.innerHTML = `
            <h2>${this.game.getText('L7_TITLE')}</h2>
            <p>${this.game.getText('L7_DESC')}</p>

            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap: 2rem; margin-top:2rem;">
                
                <div style="font-size: 1.2rem; color: var(--color-text-muted);">
                    SHIFT: <span style="color:var(--color-secondary); font-weight:bold;">${stage.shift > 0 ? '+' : ''}${stage.shift}</span>
                </div>

                <div style="
                    background: rgba(0,0,0,0.5); padding: 2rem; border-radius: 12px; border: 2px dashed var(--color-error);
                    font-size: 3rem; font-family: var(--font-mono); letter-spacing: 10px; color: var(--color-error);
                    text-shadow: 0 0 10px var(--color-error);
                ">
                    ${stage.cipher}
                </div>

                <div style="font-size: 2rem;">⬇️</div>

                <input type="text" id="cipher-input" placeholder="ENTER DECRYPTED TEXT" style="
                    font-size: 2rem; padding: 1rem; width: 300px; text-align: center; letter-spacing: 5px; text-transform: uppercase;
                ">

                <button id="btn-decrypt" class="btn" style="width: 200px;">
                    ${this.game.getText('L7_BTN_DECRYPT')}
                </button>

            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        const input = this.container.querySelector('#cipher-input');
        const btn = this.container.querySelector('#btn-decrypt');

        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });

        btn.addEventListener('click', () => {
            this.checkAnswer();
        });
    },

    checkAnswer() {
        const stage = this.stages[this.currentStage];
        const input = this.container.querySelector('#cipher-input');
        const val = input.value.toUpperCase().trim();

        if (val === stage.original) {
            this.game.showFeedback('ACCESS GRANTED', 'Decryption Successful.');

            setTimeout(() => {
                this.currentStage++;
                if (this.currentStage < this.stages.length) {
                    this.render();
                } else {
                    this.finishLevel();
                }
            }, 1000);
        } else {
            this.game.showFeedback('ACCESS DENIED', 'Incorrect Passphrase.');
            input.value = '';
            input.classList.add('shake'); // We don't have this class, but maybe visual cue later
            setTimeout(() => input.classList.remove('shake'), 500);
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: 2000,
            xp: 1500,
            accuracy: 100,
            timeBonus: 100
        });
    }
};
