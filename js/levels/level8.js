/**
 * Level 8: Databases
 * Mechanic: SQL Query Builder (Drag and Drop)
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentStage = 0;

        this.stages = [
            {
                id: 1,
                desc: "Get all data from the 'users' table.",
                answer: ["SELECT", "*", "FROM", "users"],
                pool: ["SELECT", "FROM", "*", "users", "WHERE", "DELETE"]
            },
            {
                id: 2,
                desc: "Find names of students who are 18.",
                answer: ["SELECT", "name", "FROM", "students", "WHERE", "age=18"],
                pool: ["SELECT", "name", "FROM", "students", "WHERE", "age=18", "users", "*", "ORDER BY"]
            },
            {
                id: 3,
                desc: "Delete anyone named 'Hacker'.",
                answer: ["DELETE", "FROM", "users", "WHERE", "name='Hacker'"],
                pool: ["DELETE", "FROM", "users", "WHERE", "name='Hacker'", "SELECT", "INSERT", "*"]
            }
        ];

        this.render();
    },

    render() {
        const stage = this.stages[this.currentStage];

        this.container.innerHTML = `
            <h2>${this.game.getText('L8_TITLE')}</h2>
            <p>${this.game.getText('L8_DESC')}</p>

            <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid var(--color-primary);">
                <span style="color:var(--color-secondary);">TASK:</span> ${stage.desc}
            </div>

            <!-- Query Build Area -->
            <div id="query-builder" style="
                min-height: 80px; background: rgba(255,255,255,0.05); border: 2px dashed var(--color-text-muted);
                border-radius: 12px; display: flex; align-items: center; justify-content: flex-start; gap: 10px;
                padding: 1rem; flex-wrap: wrap; margin-bottom: 2rem;
            ">
                <span style="color:var(--color-text-muted); font-size:0.8rem; width:100%;">DRAG BLOCKS HERE</span>
            </div>

            <!-- Blocks Pool -->
            <div id="blocks-pool" style="display:flex; justify-content:center; gap: 1rem; flex-wrap: wrap;">
                ${stage.pool.map((block, i) => `
                    <div class="sql-block" draggable="true" data-val="${block}" style="
                        background: var(--color-bg-secondary); border: 1px solid var(--color-primary); color: var(--color-primary);
                        padding: 0.5rem 1rem; border-radius: 4px; cursor: grab; font-family: var(--font-mono); font-weight: bold;
                    ">
                        ${block}
                    </div>
                `).join('')}
            </div>

            <div style="margin-top:2rem; text-align: center;">
                <button id="btn-run-query" class="btn">${this.game.getText('L8_BTN_RUN')}</button>
            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        const pool = this.container.querySelector('#blocks-pool');
        const builder = this.container.querySelector('#query-builder');

        let draggedItem = null;

        // Drag Handlers
        this.container.querySelectorAll('.sql-block').forEach(block => {
            block.addEventListener('dragstart', (e) => {
                draggedItem = e.target;
                e.target.style.opacity = '0.5';
            });
            block.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
                draggedItem = null;
            });
        });

        // Drop Zone: Builder
        builder.addEventListener('dragover', (e) => e.preventDefault());
        builder.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem && draggedItem.parentElement !== builder) {
                // If moving from pool to builder, remove placeholder text first
                const placeholder = builder.querySelector('span');
                if (placeholder) placeholder.remove();

                builder.appendChild(draggedItem);
            } else if (draggedItem && draggedItem.parentElement === builder) {
                // Reorder
                // Simplified: Append only
                builder.appendChild(draggedItem);
            }
        });

        // Drop Zone: Pool (Return item)
        pool.addEventListener('dragover', (e) => e.preventDefault());
        pool.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem && draggedItem.parentElement !== pool) {
                pool.appendChild(draggedItem);

                // If builder empty, restore placeholder
                if (builder.children.length === 0) {
                    builder.innerHTML = `<span style="color:var(--color-text-muted); font-size:0.8rem; width:100%;">DRAG BLOCKS HERE</span>`;
                }
            }
        });

        this.container.querySelector('#btn-run-query').addEventListener('click', () => this.checkQuery());
    },

    checkQuery() {
        const builder = this.container.querySelector('#query-builder');
        // Extract values from blocks in builder
        const userQuery = Array.from(builder.querySelectorAll('.sql-block')).map(el => el.getAttribute('data-val'));
        const stage = this.stages[this.currentStage];

        if (JSON.stringify(userQuery) === JSON.stringify(stage.answer)) {
            this.game.showFeedback('QUERY EXECUTED', `Rows effected: ${Math.floor(Math.random() * 100) + 1}`);

            setTimeout(() => {
                this.currentStage++;
                if (this.currentStage < this.stages.length) {
                    this.render();
                } else {
                    this.finishLevel();
                }
            }, 1000);
        } else {
            this.game.showFeedback('SYNTAX ERROR', 'Invalid SQL Query. Check your syntax and order.');
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: 2500,
            xp: 2000,
            accuracy: 100,
            timeBonus: 50
        });
    }
};
