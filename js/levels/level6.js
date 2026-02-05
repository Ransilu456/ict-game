/**
 * Level 6: SQL Database
 * Mechanic: Visual Query Builder & Joins
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import Feedback from '../components/Feedback.js';
import LevelContainer from '../components/LevelContainer.js';

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

        const content = document.createElement('div');
        content.className = "flex flex-col gap-6 w-full";

        const header = new Card({
            title: `Query Builder: Stage ${this.currentStage + 1}`,
            subtitle: stage.goal,
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        // Workspace
        const layout = document.createElement('div');
        layout.className = "flex flex-col gap-6 w-full";

        // Query Builder Area
        const builderArea = document.createElement('div');
        builderArea.id = "builder-area";
        builderArea.className = "min-h-[80px] sm:min-h-[100px] bg-slate-950/50 rounded-2xl border-2 border-dashed border-slate-800 flex flex-wrap items-center p-4 gap-2 transition-all overflow-hidden";

        this.querySlot.forEach((token, idx) => {
            const chip = document.createElement('div');
            chip.className = "px-3 py-1.5 bg-indigo-500 rounded-lg text-xs sm:text-sm font-mono font-bold text-white cursor-pointer hover:bg-rose-500 transition-all animate-bounce-in shadow-lg shadow-indigo-500/10";
            chip.innerText = token;
            chip.onclick = () => {
                this.querySlot.splice(idx, 1);
                this.render();
            };
            builderArea.appendChild(chip);
        });

        if (this.querySlot.length === 0) {
            builderArea.innerHTML = `<span class="text-slate-700 text-xs sm:text-sm italic w-full text-center pointer-events-none">Tap or drag components here...</span>`;
        }

        builderArea.ondragover = (e) => { e.preventDefault(); builderArea.classList.add('border-indigo-500', 'bg-indigo-500/5'); };
        builderArea.ondragleave = () => { builderArea.classList.remove('border-indigo-500', 'bg-indigo-500/5'); };
        builderArea.ondrop = (e) => {
            e.preventDefault();
            builderArea.classList.remove('border-indigo-500', 'bg-indigo-500/5');
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
                variant: 'primary',
                size: 'lg',
                icon: "solar:play-circle-bold",
                customClass: 'w-full',
                onClick: () => this.checkQuery()
            }).render()
        });

        // Toolbox
        const tbContent = document.createElement('div');
        tbContent.className = "flex flex-col gap-4";

        const sections = [
            { title: "Keywords", items: this.keywords, type: 'keyword' },
            { title: "Schema Objects", items: this.fields, type: 'field' }
        ];

        sections.forEach(sec => {
            const wrap = document.createElement('div');
            wrap.className = "flex flex-col gap-2";
            wrap.innerHTML = `<h5 class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${sec.title}</h5>`;

            const list = document.createElement('div');
            list.className = "flex flex-wrap gap-2";
            sec.items.forEach(item => {
                const el = this.createDraggable(item, sec.type);
                el.onclick = () => {
                    this.querySlot.push(item);
                    this.render();
                };
                list.appendChild(el);
            });
            wrap.appendChild(list);
            tbContent.appendChild(wrap);
        });

        const toolboxCard = new Card({
            title: "Syntax Library",
            content: tbContent,
            variant: 'glass'
        });

        // Schema
        const schemaDiv = document.createElement('div');
        schemaDiv.className = "flex flex-wrap gap-4 w-full justify-center";

        stage.tables.forEach(t => {
            const tEl = document.createElement('div');
            tEl.className = "min-w-[140px] flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl";
            tEl.innerHTML = `
                <div class="font-bold text-indigo-400 border-b border-white/5 mb-2 pb-1 flex items-center gap-2 text-sm">
                    <iconify-icon icon="solar:database-bold"></iconify-icon> ${t}
                </div>
                <div class="text-[10px] text-slate-500 font-mono space-y-1">
                    <div class="flex justify-between"><span>id</span> <span class="text-slate-700">PK</span></div>
                    ${t === 'Users' ? '<div>username</div><div>email</div><div>role</div>' : '<div class="flex justify-between"><span>user_id</span> <span class="text-slate-700">FK</span></div><div>amount</div>'}
                </div>
            `;
            schemaDiv.appendChild(tEl);
        });

        const schemaCard = new Card({
            title: "Database Schema",
            content: schemaDiv,
            variant: 'flat',
            customClass: 'border border-white/5 bg-slate-950/30'
        });

        layout.appendChild(queryCard.render());
        layout.appendChild(toolboxCard.render());
        layout.appendChild(schemaCard.render());
        content.appendChild(layout);

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());
    },

    createDraggable(text, type) {
        const el = document.createElement('div');
        el.className = `px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-grab active:cursor-grabbing border-2 transition-all select-none touch-none ${type === 'keyword'
            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500/20'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/20'
            }`;
        el.innerText = text;
        el.draggable = true;
        el.ondragstart = (e) => {
            e.dataTransfer.setData('text', text);
            el.classList.add('opacity-50');
        };
        el.ondragend = () => el.classList.remove('opacity-50');
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

