import GameButton from '../components/GameButton.js';
import Card from '../components/Card.js';
import LevelContainer from '../components/LevelContainer.js';
import AnswerCard from '../components/AnswerCard.js';

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
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

        const content = document.createElement('div');
        content.className = "flex flex-col gap-6 w-full max-w-2xl mx-auto";

        const statsBar = document.createElement('div');
        statsBar.className = "flex justify-between items-center px-4";
        statsBar.innerHTML = `
            <div class="flex flex-col">
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress</span>
                <span class="text-sm font-bold text-white">${this.currentQuestion + 1} / ${this.questions.length}</span>
            </div>
            <div class="flex flex-col items-end">
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Exam</span>
                <span class="text-sm font-bold text-indigo-400">ICT Core Module</span>
            </div>
        `;
        content.appendChild(statsBar);

        const timerContainer = document.createElement('div');
        timerContainer.className = "w-full h-1.5 bg-slate-800 rounded-full overflow-hidden";
        timerContainer.innerHTML = `<div id="quiz-timer" class="h-full bg-indigo-500 w-full transition-all duration-1000 ease-linear"></div>`;
        content.appendChild(timerContainer);

        const questionText = document.createElement('h3');
        questionText.className = "text-lg sm:text-2xl font-bold text-white text-center px-4 leading-tight";
        questionText.innerText = qData.q;
        content.appendChild(questionText);

        const optionsGrid = document.createElement('div');
        optionsGrid.className = "grid grid-cols-1 sm:grid-cols-2 gap-4";

        qData.options.forEach((opt, idx) => {
            const answerCard = new AnswerCard({
                id: String(idx),
                text: opt,
                icon: 'solar:square-academic-cap-bold',
                onClick: (id) => this.recordAnswer(parseInt(id))
            });
            optionsGrid.appendChild(answerCard.render());
        });
        content.appendChild(optionsGrid);

        const container_el = new LevelContainer({ content: content });
        this.container.appendChild(container_el.render());

        this.startTimer();
    },

    updateTimerUI() {
        const bar = document.getElementById('quiz-timer');
        if (bar) {
            const pct = (this.timeLeft / 15) * 100;
            bar.style.width = `${pct}%`;
            if (pct < 30) {
                bar.classList.remove('bg-indigo-500');
                bar.classList.add('bg-rose-500');
            }
        }
    },

    recordAnswer(selectedIndex) {
        clearInterval(this.timerInterval);

        const qData = this.questions[this.currentQuestion];
        const isCorrect = selectedIndex === qData.answer;

        this.userAnswers.push({
            question: qData.q,
            selected: selectedIndex === -1 ? "Timeout" : qData.options[selectedIndex],
            correct: qData.options[qData.answer],
            isCorrect: isCorrect,
            explanation: "Review ICT fundamentals."
        });

        if (isCorrect) {
            this.score += 100 + (this.timeLeft * 10);
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
            accuracy: Math.floor((this.userAnswers.filter(a => a.isCorrect).length / this.questions.length) * 100),
            detailedResults: this.userAnswers
        });
    }
};

