/**
 * Level 16: The Legend's Trial
 * Mechanic: Final Boss Exam + "Cyber Stroke" Visuals.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.currentIndex = 0;
        this.totalQuestions = 15;

        this.questions = [
            { q: 'Which layer of OSI handles IP routing?', a: 'Network', opts: ['Data Link', 'Network', 'Transport', 'Session'] },
            { q: 'In Python, what keyword defines a function?', a: 'def', opts: ['func', 'define', 'def', 'function'] },
            { q: 'Binary 1010 is equal to decimal:', a: '10', opts: ['8', '10', '12', '15'] },
            { q: 'Default Port for HTTPS:', a: '443', opts: ['80', '443', '21', '22'] },
            { q: 'What does VPN stand for?', a: 'Virtual Private Network', opts: ['Virtual Personal Node', 'Virtual Private Network', 'Verified Private Network', 'Visual Peripheral Network'] },
            { q: 'Which CIDR mask represents 255.255.255.192?', a: '/26', opts: ['/24', '/25', '/26', '/28'] },
            { q: 'Standard for secure data transmission in Cloud:', a: 'TLS', opts: ['UDP', 'TLS', 'ICMP', 'IGMP'] },
            { q: 'First point of contact for external traffic:', a: 'Gateway', opts: ['Hub', 'Switch', 'Gateway', 'Repeater'] },
            { q: 'What is the Caesar Cipher shift of A to D?', a: '3', opts: ['1', '2', '3', '4'] },
            { q: 'Main advantage of Redis Cache:', a: 'Low Latency', opts: ['Cheap Storage', 'Durability', 'Low Latency', 'SQL compatibility'] },
            { q: 'Binary 1111 in Decimal:', a: '15', opts: ['14', '15', '16', '17'] },
            { q: 'The most secure Wireless encryption:', a: 'WPA3', opts: ['WEP', 'WPA', 'WPA2', 'WPA3'] },
            { q: 'Port used for SSH:', a: '22', opts: ['21', '22', '23', '25'] },
            { q: 'A 4-bit nibble can represent how many values?', a: '16', opts: ['4', '8', '16', '32'] },
            { q: 'Protocols used to map IP to MAC:', a: 'ARP', opts: ['DNS', 'BGP', 'ARP', 'DHCP'] }
        ];

        this.render();
        this.activateStrokes();
    },

    render() {
        const qData = this.questions[this.currentIndex];

        this.container.innerHTML = `
            <div class="max-w-2xl mx-auto py-8">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-black text-white mb-2 tracking-tighter" id="legend-title">${this.game.getText('L16_TITLE')}</h2>
                    <p class="text-slate-400 font-medium uppercase text-xs tracking-[0.3em]">${this.game.getText('L16_STATUS_LEGEND')}</p>
                </div>

                <div id="legends-card" class="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(244,63,94,0.1)] transition-all duration-500 relative overflow-hidden">
                    <!-- Progress Bar -->
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-slate-950">
                        <div id="legend-progress" class="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] transition-all duration-500" style="width: ${(this.currentIndex / this.totalQuestions) * 100}%"></div>
                    </div>

                    <div class="flex justify-between items-center mb-10">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                                <iconify-icon icon="solar:fire-bold" class="text-2xl animate-pulse"></iconify-icon>
                            </div>
                            <span class="text-[10px] font-black text-rose-500 uppercase tracking-widest">${this.game.getText('L16_STROKE_ACTIVE')}</span>
                        </div>
                        <span class="text-xs font-mono font-bold text-slate-500">${this.currentIndex + 1} // ${this.totalQuestions}</span>
                    </div>

                    <div class="mb-10 min-h-[80px]">
                        <h3 class="text-xl md:text-2xl font-bold text-white leading-tight">${qData.q}</h3>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="options-grid">
                        ${qData.opts.map(opt => `
                            <button class="option-btn p-5 bg-slate-950 border border-slate-800 rounded-2xl text-left text-sm font-bold text-slate-400 hover:text-white hover:border-rose-500/50 hover:bg-rose-500/5 transition-all flex items-center gap-3 group" data-answer="${opt}">
                                <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs group-hover:border-rose-500/30 group-hover:text-rose-500 transition-colors">
                                    <iconify-icon icon="solar:primitive-dot-bold" class="opacity-30 group-hover:opacity-100"></iconify-icon>
                                </div>
                                <span>${opt}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <iconify-icon icon="solar:danger-bold" class="text-rose-500 animate-pulse"></iconify-icon>
                        ${this.game.getText('L16_STATUS_OVERLOAD')}
                    </div>
                </div>
            </div>

            <style>
                .legend-stroke-effect {
                    animation: pulseStrokes 2s infinite ease-in-out;
                    border-color: #f43f5e !important;
                    box-shadow: 0 0 30px rgba(244,63, 94, 0.4) !important;
                }
                
                @keyframes pulseStrokes {
                    0% { box-shadow: 0 0 20px rgba(244,63, 94, 0.2); }
                    50% { box-shadow: 0 0 40px rgba(244,63, 94, 0.5); }
                    100% { box-shadow: 0 0 20px rgba(244,63, 94, 0.2); }
                }

                .legend-flash-correct {
                    animation: flashCorrect 0.5s ease-out;
                }
                @keyframes flashCorrect {
                    0% { background-color: rgba(16, 185, 129, 0.2); }
                    100% { background-color: transparent; }
                }
            </style>
        `;

        this.attachEvents();
    },

    activateStrokes() {
        // Add neon strokes to the card
        const card = document.getElementById('legends-card');
        if (card) card.classList.add('legend-stroke-effect');

        // Add subtle neon pulse to Sidebar
        const sidebar = document.getElementById('main-sidebar');
        if (sidebar) sidebar.style.boxShadow = 'inset -1px 0 20px rgba(244,63,94,0.1)';
    },

    attachEvents() {
        this.container.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => {
                const isCorrect = btn.dataset.answer === this.questions[this.currentIndex].a;

                if (isCorrect) {
                    this.score += 500;
                    this.triggerSuccessEffect();
                    this.nextQuestion();
                } else {
                    this.game.showFeedback('NEURAL COLLAPSE', 'Incorrect response. Mental integrity fading. System stability critical.');
                    this.score = Math.max(0, this.score - 250);
                }
            };
        });
    },

    triggerSuccessEffect() {
        const card = document.getElementById('legends-card');
        card.classList.add('legend-flash-correct');
        setTimeout(() => card.classList.remove('legend-flash-correct'), 500);
    },

    nextQuestion() {
        this.currentIndex++;
        if (this.currentIndex < this.totalQuestions) {
            this.render();
            this.activateStrokes();
        } else {
            this.finishLevel();
        }
    },

    finishLevel() {
        this.game.completeLevel({
            success: true,
            score: this.score,
            xp: 5000,
            accuracy: 100
        });
    }
};
