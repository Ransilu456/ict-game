/**
 * Level 4: Python Logic
 * Mechanic: Code Analysis & Optimization
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import LevelContainer from '../components/LevelContainer.js';
import AnswerCard from '../components/AnswerCard.js';
import Feedback from '../components/Feedback.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentChallengeIndex = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.userAnswers = [];
        this.selectedSnippetId = null;

        this.challenges = [
            {
                id: 1,
                title: "Efficiency: Loops",
                desc: "Select the most efficient way to sum numbers 0-99.",
                snippets: [
                    { id: 'a', label: 'For Loop', code: "total = 0\nfor i in range(100):\n    total += i" },
                    { id: 'b', label: 'Sum Function', code: "total = sum(range(100))" }
                ],
                correctId: 'b',
                explanation: "sum() is implemented in C and optimized."
            },
            {
                id: 2,
                title: "Syntax: Conditionals",
                desc: "Identify the correct syntax for an 'else if' block.",
                snippets: [
                    { id: 'a', label: 'Else If', code: "if x > 5:\n    print('High')\nelse if x > 2:\n    print('Med')" },
                    { id: 'b', label: 'Elif', code: "if x > 5:\n    print('High')\nelif x > 2:\n    print('Med')" }
                ],
                correctId: 'b',
                explanation: "Python uses 'elif', not 'else if'."
            },
            {
                id: 3,
                title: "Efficiency: List Comp",
                desc: "Which method creates a squares list [0, 1, 4...] faster?",
                snippets: [
                    { id: 'a', label: 'Append Loop', code: "res = []\nfor i in range(10):\n    res.append(i**2)" },
                    { id: 'b', label: 'List Comp', code: "res = [i**2 for i in range(10)]" }
                ],
                correctId: 'b',
                explanation: "List comps are optimized internally."
            },
            {
                id: 4,
                title: "Data Type: Tuples",
                desc: "We need an immutable collection of coordinates.",
                snippets: [
                    { id: 'a', label: 'List', code: "coords = [10, 20]\n# Mutable" },
                    { id: 'b', label: 'Tuple', code: "coords = (10, 20)\n# Immutable" }
                ],
                correctId: 'b',
                explanation: "Tuples are immutable and lighter."
            }
        ];

        this.render();
    },

    render() {
        this.container.innerHTML = '';
        const challenge = this.challenges[this.currentChallengeIndex];

        const content = document.createElement('div');
        content.className = "flex flex-col gap-6 w-full max-w-2xl mx-auto";

        const header = new Card({
            title: challenge.title,
            subtitle: "Select the best implementation.",
            variant: 'flat',
            customClass: 'text-center'
        });
        content.appendChild(header.render());

        const hint = new Feedback({
            title: "Challenge",
            message: challenge.desc,
            type: "neutral"
        });
        content.appendChild(hint.render());

        const optionsContainer = document.createElement('div');
        optionsContainer.className = "flex flex-col gap-4";

        challenge.snippets.forEach(s => {
            const cardContent = `
                <div class="flex flex-col gap-2 w-full overflow-hidden">
                    <span class="text-[10px] font-black uppercase text-slate-500 tracking-widest">${s.label}</span>
                    <pre class="bg-slate-950/80 p-3 rounded-xl text-xs font-mono text-slate-300 w-full overflow-x-auto border border-white/5 leading-relaxed"><code>${this.highlightSyntax(s.code)}</code></pre>
                </div>
            `;

            const answerCard = new AnswerCard({
                id: s.id,
                text: cardContent,
                isSelected: this.selectedSnippetId === s.id,
                onClick: (id) => {
                    this.selectedSnippetId = id;
                    this.render();
                }
            });
            optionsContainer.appendChild(answerCard.render());
        });
        content.appendChild(optionsContainer);

        const confirmBtn = new GameButton({
            text: "Confirm Selection",
            variant: this.selectedSnippetId ? 'primary' : 'disabled',
            size: 'lg',
            icon: "solar:check-read-bold",
            customClass: 'w-full',
            onClick: () => this.confirmSelection()
        });
        content.appendChild(confirmBtn.render());

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());
    },

    highlightSyntax(code) {
        return code
            .replace(/(def|return|if|else|elif|for|in|amount|print|import|from)/g, '<span class="text-indigo-400">$1</span>')
            .replace(/(\d+)/g, '<span class="text-emerald-400">$1</span>')
            .replace(/('.*?')/g, '<span class="text-amber-300">$1</span>')
            .replace(/(#.*)/g, '<span class="text-slate-500 italic">$1</span>')
            .replace(/(\(|\)|\[|\]|\{|\})/g, '<span class="text-cyan-400">$1</span>');
    },

    confirmSelection() {
        if (!this.selectedSnippetId) return;

        const challenge = this.challenges[this.currentChallengeIndex];
        const isCorrect = this.selectedSnippetId === challenge.correctId;

        this.userAnswers.push({
            question: challenge.title,
            selected: challenge.snippets.find(s => s.id === this.selectedSnippetId).label,
            correct: challenge.snippets.find(s => s.id === challenge.correctId).label,
            isCorrect: isCorrect,
            explanation: challenge.explanation
        });

        this.currentChallengeIndex++;
        this.selectedSnippetId = null;

        if (this.currentChallengeIndex < this.challenges.length) {
            this.render();
        } else {
            this.finishLevel();
        }
    },

    finishLevel() {
        const correctCount = this.userAnswers.filter(a => a.isCorrect).length;
        this.game.completeLevel({
            success: correctCount >= 3,
            score: correctCount * 500,
            xp: correctCount * 100,
            detailedResults: this.userAnswers
        });
    }
};

