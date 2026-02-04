/**
 * Level 4: Python Logic
 * Mechanic: Code Analysis & Optimization
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import QuestionCard from '../components/QuestionCard.js';
import Feedback from '../components/Feedback.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentChallengeIndex = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.userAnswers = [];

        this.challenges = [
            {
                id: 1,
                title: "Efficiency: Loops",
                type: "optimize",
                desc: "Select the most efficient way to sum numbers 0-99.",
                snippets: [
                    { id: 'a', label: 'For Loop', code: "total = 0\nfor i in range(100):\n    total += i", efficient: false },
                    { id: 'b', label: 'Sum Function', code: "total = sum(range(100))", efficient: true }
                ],
                correctId: 'b',
                explanation: "sum() is implemented in C and optimized."
            },
            {
                id: 2,
                title: "Syntax: Conditionals",
                type: "fix",
                desc: "Identify the correct syntax for an 'else if' block.",
                snippets: [
                    { id: 'a', label: 'Else If', code: "if x > 5:\n    print('High')\nelse if x > 2:\n    print('Med')", correct: false },
                    { id: 'b', label: 'Elif', code: "if x > 5:\n    print('High')\nelif x > 2:\n    print('Med')", correct: true }
                ],
                correctId: 'b',
                explanation: "Python uses 'elif', not 'else if'."
            },
            {
                id: 3,
                title: "Efficiency: List Comprehension",
                type: "optimize",
                desc: "Which method creates a list of squares [0, 1, 4...] faster?",
                snippets: [
                    { id: 'a', label: 'Append Loop', code: "res = []\nfor i in range(10):\n    res.append(i**2)", efficient: false },
                    { id: 'b', label: 'List Comp', code: "res = [i**2 for i in range(10)]", efficient: true }
                ],
                correctId: 'b',
                explanation: "List comps are optimized internally."
            },
            {
                id: 4,
                title: "Data Type: Tuples vs Lists",
                type: "optimize",
                desc: "We need an immutable collection of coordinates.",
                snippets: [
                    { id: 'a', label: 'List', code: "coords = [10, 20]\n# Mutable", efficient: false },
                    { id: 'b', label: 'Tuple', code: "coords = (10, 20)\n# Immutable", efficient: true }
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

        // Header using Feedback component for 'Status' context?
        // Or just standard header.
        const header = new Card({
            title: `Python Module: ${challenge.title}`,
            subtitle: "Select the best implementation.",
            variant: 'flat',
            customClass: 'mb-6 text-center'
        });

        // Use QuestionCard for the main interaction
        // We need to format the options text to be HTML with syntax highlighting
        const optionsForCard = challenge.snippets.map(s => ({
            id: s.id,
            text: `
                <div class="flex flex-col gap-2 w-full">
                    <span class="text-xs font-bold uppercase text-slate-500">${s.label}</span>
                    <pre class="bg-slate-950 p-3 rounded-lg text-sm font-mono text-slate-300 w-full overflow-x-auto border border-slate-700"><code>${this.highlightSyntax(s.code)}</code></pre>
                </div>
            `
        }));

        // Add a Feedback hint component
        const hint = new Feedback({
            title: "Task Procedure",
            message: challenge.desc,
            type: "neutral"
        });

        this.qCard = new QuestionCard({
            question: challenge.title, // or use desc
            options: optionsForCard,
            selectedId: this.selectedSnippetId,
            onSelect: (id) => {
                this.selectedSnippetId = id;
                this.render(); // Re-render to show selection state (managed by qCard props? qCard expects us to re-render or update props if we want controlled component behavior)
            }
        });

        const actionBtn = new GameButton({
            text: "Confirm Selection",
            variant: this.selectedSnippetId ? 'primary' : 'disabled',
            icon: "solar:arrow-right-bold",
            onClick: () => this.confirmSelection()
        });

        const wrapper = document.createElement('div');
        wrapper.className = "max-w-3xl mx-auto flex flex-col gap-6";

        wrapper.appendChild(header.render());
        wrapper.appendChild(hint.render());
        wrapper.innerHTML += this.qCard.render();
        wrapper.appendChild(actionBtn.render());

        this.container.appendChild(wrapper);
        this.qCard.attach(this.container);
    },

    highlightSyntax(code) {
        return code
            .replace(/(def|return|if|else|elif|for|in|amount|print|import|from)/g, '<span class="text-purple-400">$1</span>')
            .replace(/(\d+)/g, '<span class="text-emerald-300">$1</span>')
            .replace(/('.*?')/g, '<span class="text-amber-300">$1</span>')
            .replace(/(#.*)/g, '<span class="text-slate-500 italic">$1</span>')
            .replace(/(\(|\)|\[|\]|\{|\})/g, '<span class="text-cyan-300">$1</span>');
    },

    confirmSelection() {
        if (!this.selectedSnippetId) return;

        const challenge = this.challenges[this.currentChallengeIndex];
        const isCorrect = this.selectedSnippetId === challenge.correctId;

        this.userAnswers.push({
            question: challenge.title,
            selectedId: this.selectedSnippetId,
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
