/**
 * Level 8: Final Exam
 * Mechanic: Timed Multiple Choice Quiz
 * Refactored using Component Architecture & Silent Feedback
 */

import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import QuestionCard from '../components/QuestionCard.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];

        // Timer Logic
        this.timeLeft = 15;
        this.timerInterval = null;

        this.questions = [
            { q: "Which component is the 'Brain' of the computer?", options: ["GPU", "RAM", "CPU", "SSD"], answer: 2 },
            { q: "Which protocol secures web traffic?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], answer: 2 },
            { q: "What does 'SSD' stand for?", options: ["Super Speed Drive", "Solid State Drive", "System Storage Disk", "Serial Standard Data"], answer: 1 },
            { q: "In Binary, what is 1 + 1?", options: ["2", "11", "10", "01"], answer: 2 },
            { q: "Which logic gate outputs 1 only if BOTH inputs are 1?", options: ["OR", "XOR", "NAND", "AND"], answer: 3 },
            { q: "What layer of OSI handles Routing?", options: ["Data Link", "Network", "Transport", "Physical"], answer: 1 },
            { q: "Which is a valid Python Variable name?", options: ["2cool", "class", "user_name", "my-var"], answer: 2 },
            { q: "SQL command to fetch data?", options: ["GET", "SELECT", "FETCH", "PULL"], answer: 1 }
        ];

        this.startLevel();
    },

    startLevel() {
        this.render();
    },

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timeLeft = 15;
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();
            if (this.timeLeft <= 0) {
                this.recordAnswer(-1); // Timeout
            }
        }, 1000);
    },

    render() {
        this.container.innerHTML = '';
        const qData = this.questions[this.currentQuestion];

        const headerContent = document.createElement('div');
        headerContent.className = "flex justify-between items-center w-full";
        headerContent.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="text-sm font-bold text-slate-400 uppercase">Question ${this.currentQuestion + 1}/${this.questions.length}</span>
            </div>
            <div class="text-xl font-mono text-indigo-300">Exam Mode</div>
        `;

        const header = new Card({
            content: headerContent,
            variant: 'flat',
            customClass: 'mb-8 border-b border-slate-800 pb-4'
        });

        // Use QuestionCard for standardized MCQ rendering in Exam
        const optionsForCard = qData.options.map((opt, idx) => ({
            id: String(idx),
            text: opt
        }));

        this.qCard = new QuestionCard({
            question: qData.q,
            options: optionsForCard,
            selectedId: null,
            onSelect: (id) => this.recordAnswer(parseInt(id))
        });

        const timerBar = document.createElement('div');
        timerBar.className = "w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden max-w-2xl mx-auto";
        timerBar.innerHTML = `<div id="quiz-timer" class="h-full bg-indigo-500 w-full"></div>`;

        this.container.appendChild(header.render());
        this.container.appendChild(timerBar);
        this.container.innerHTML += this.qCard.render();
        this.qCard.attach(this.container);

        this.startTimer();
    },

    updateTimerUI() {
        const bar = document.getElementById('quiz-timer');
        if (bar) {
            const pct = (this.timeLeft / 15) * 100;
            bar.style.width = `${pct}%`;
            if (pct < 30) bar.className = "h-full bg-rose-500 transition-all duration-1000 ease-linear";
        }
    },

    recordAnswer(selectedIndex) {
        clearInterval(this.timerInterval);

        const qData = this.questions[this.currentQuestion];
        const isCorrect = selectedIndex === qData.answer;

        // Record Answer Silently
        this.userAnswers.push({
            question: qData.q,
            selected: selectedIndex === -1 ? "Timeout" : qData.options[selectedIndex],
            correct: qData.options[qData.answer],
            isCorrect: isCorrect,
            explanation: "Review course material."
        });

        if (isCorrect) {
            const basePoints = 100;
            const timeBonus = this.timeLeft * 10;
            this.score += basePoints + timeBonus;
        }

        this.currentQuestion++;
        if (this.currentQuestion < this.questions.length) {
            this.render();
        } else {
            this.finishLevel();
        }
    },

    finishLevel() {
        const passed = this.score > 800; 
        this.game.completeLevel({
            success: passed,
            score: this.score,
            xp: passed ? 2000 : 500,
            accuracy: Math.floor((this.score / (this.questions.length * 250)) * 100),
            detailedResults: this.userAnswers
        });
    }
};
