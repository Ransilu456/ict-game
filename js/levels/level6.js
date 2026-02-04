/**
 * Level 6: SQL Database
 * Mechanic: Visual Query Builder & Joins
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentStage = 0;
        this.results = [];

        this.stages = [
            {
                id: 1,
                goal: "Fetch all 'username' and 'email' from 'Users' table.",
                required: ['SELECT', 'username', 'email', 'FROM', 'Users'],
                tables: ['Users', 'Orders']
            },
            {
                id: 2,
                goal: "Find 'Users' where 'role' is 'admin'.",
                required: ['SELECT', '*', 'FROM', 'Users', 'WHERE', 'role', '=', "'admin'"],
                tables: ['Users']
            },
            {
                id: 3,
                goal: "Join 'Users' with 'Orders' on user_id.",
                required: ['SELECT', '*', 'FROM', 'Users', 'JOIN', 'Orders', 'ON', 'Users.id', '=', 'Orders.user_id'],
                tables: ['Users', 'Orders']
            }
        ];

        this.keywords = ["SELECT", "FROM", "WHERE", "JOIN", "ON", "=", "*", "AND"];
        this.fields = [
            "username", "email", "role", "'admin'", "Users", "Orders", "Users.id", "Orders.user_id"
        ];

        this.querySlot = [];
        this.render();
    },

    render() {
        this.container.innerHTML = '';
        const stage = this.stages[this.currentStage];

        const header = new Card({
            title: `Query Builder: Stage ${this.currentStage + 1}`,
            subtitle: `Mission: ${stage.goal}`,
            variant: 'flat',
            customClass: 'text-center mb-6'
        });

        // Use Feedback for persistent instruction/status
        const statusFeedback = new Feedback({
            title: "System Status",
            message: "Waiting for query execution...",
            type: "neutral"
        });

        // Workspace
        const layout = document.createElement('div');
        layout.className = "flex flex-col gap-6 h-full";

        // Query Builder Area
        const builderArea = document.createElement('div');
        builderArea.id = "builder-area";
        builderArea.className = "min-h-[120px] bg-slate-900 rounded-xl border-2 border-dashed border-slate-700 flex flex-wrap items-center p-4 gap-2 transition-colors";

        this.querySlot.forEach((token, idx) => {
            const chip = document.createElement('div');
            chip.className = "px-3 py-1.5 bg-indigo-600 rounded text-sm font-mono font-bold text-white cursor-pointer hover:bg-rose-500 transition-colors animate-fade-in";
            chip.innerText = token;
            chip.onclick = () => {
                this.querySlot.splice(idx, 1);
                this.render();
            };
            builderArea.appendChild(chip);
        });

        if (this.querySlot.length === 0) {
            builderArea.innerHTML = `<span class="text-slate-600 italic w-full text-center pointer-events-none">Drag keywords and fields here...</span>`;
        }

        builderArea.ondragover = (e) => { e.preventDefault(); builderArea.classList.add('border-indigo-500', 'bg-slate-800'); };
        builderArea.ondragleave = () => { builderArea.classList.remove('border-indigo-500', 'bg-slate-800'); };
        builderArea.ondrop = (e) => {
            e.preventDefault();
            builderArea.classList.remove('border-indigo-500', 'bg-slate-800');
            const val = e.dataTransfer.getData('text');
            if (val) {
                this.querySlot.push(val);
                this.render();
            }
        };

        const queryCard = new Card({
            title: "SQL Terminal",
            content: builderArea,
            variant: 'glass',
            footer: new GameButton({
                text: "Execute Query",
                icon: "solar:play-circle-bold",
                onClick: () => this.checkQuery()
            }).render()
        });

        // Toolbox
        const keysDiv = document.createElement('div');
        keysDiv.className = "flex flex-wrap gap-2";
        this.keywords.forEach(k => keysDiv.appendChild(this.createDraggable(k, 'keyword')));

        const fieldsDiv = document.createElement('div');
        fieldsDiv.className = "flex flex-wrap gap-2";
        this.fields.forEach(f => fieldsDiv.appendChild(this.createDraggable(f, 'field')));

        const tbContent = document.createElement('div');
        const h1 = document.createElement('h5'); h1.className = "text-xs font-bold text-slate-500 uppercase mb-2"; h1.innerText = "Keywords";
        tbContent.appendChild(h1);
        tbContent.appendChild(keysDiv);
        const h2 = document.createElement('h5'); h2.className = "text-xs font-bold text-slate-500 uppercase mb-2 mt-4"; h2.innerText = "Schema Objects";
        tbContent.appendChild(h2);
        tbContent.appendChild(fieldsDiv);

        const toolboxCard = new Card({
            title: "Syntax Library",
            content: tbContent,
            variant: 'glass'
        });

        // Schema
        const schemaDiv = document.createElement('div');
        schemaDiv.className = "flex gap-4 overflow-auto pb-2";

        stage.tables.forEach(t => {
            const tEl = document.createElement('div');
            tEl.className = "min-w-[120px] bg-slate-800 border border-slate-700 rounded-lg p-3";
            tEl.innerHTML = `
                <div class="font-bold text-indigo-400 border-b border-slate-600 mb-2 pb-1 flex items-center gap-2">
                    <iconify-icon icon="solar:database-bold"></iconify-icon> ${t}
                </div>
                <div class="text-xs text-slate-400 font-mono space-y-1">
                    <div>id <span class="text-slate-600">PK</span></div>
                    ${t === 'Users' ? '<div>username</div><div>email</div><div>role</div>' : '<div>user_id <span class="text-slate-600">FK</span></div><div>amount</div>'}
                </div>
            `;
            schemaDiv.appendChild(tEl);
        });

        const schemaCard = new Card({
            title: "Database Schema",
            content: schemaDiv,
            variant: 'flat',
            customClass: 'border border-slate-700 bg-slate-900/50'
        });

        layout.appendChild(queryCard.render());
        layout.appendChild(toolboxCard.render());
        layout.appendChild(schemaCard.render());

        this.container.appendChild(header.render());
        this.container.appendChild(statusFeedback.render()); // Insert Feedback
        this.container.appendChild(layout);
    },

    createDraggable(text, type) {
        const el = document.createElement('div');
        el.className = `px-3 py-1.5 rounded text-sm font-mono font-bold cursor-grab active:cursor-grabbing border select-none ${type === 'keyword'
            ? 'bg-indigo-900/50 border-indigo-500/50 text-indigo-300'
            : 'bg-emerald-900/50 border-emerald-500/50 text-emerald-300'
            }`;
        el.innerText = text;
        el.draggable = true;
        el.ondragstart = (e) => {
            e.dataTransfer.setData('text', text);
        };
        return el;
    },

    checkQuery() {
        const stage = this.stages[this.currentStage];
        const currentStr = this.querySlot.join(' ');
        const requiredStr = stage.required.join(' ');
        const isMatch = currentStr === requiredStr;

        if (isMatch) {
            this.results.push({
                question: `SQL Stage ${this.currentStage + 1}`,
                selected: "Query Validated",
                correct: "Query Validated",
                isCorrect: true
            });
            this.nextStage();
        } else {
            const area = document.getElementById('builder-area');
            area.classList.add('animate-shake', 'border-rose-500');
            setTimeout(() => area.classList.remove('animate-shake', 'border-rose-500'), 500);
        }
    },

    nextStage() {
        this.currentStage++;
        this.querySlot = [];

        if (this.currentStage < this.stages.length) {
            this.render();
        } else {
            this.finishLevel();
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: 2500,
            xp: 3000,
            accuracy: 100,
            detailedResults: this.results
        });
    }
};
