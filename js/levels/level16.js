/**
 * Level 16: The Legend's Trial
 * Mechanic: Final Boss Exam + "Neural Link" Cinematic UI.
 */

export default {
    init(container, gameEngine) {
        this.container = container;
        this.game = gameEngine;
        this.score = 0;
        this.currentIndex = 0;
        this.totalQuestions = 15;
        this.integrity = 100;

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
    },

    render() {
        const qData = this.questions[this.currentIndex];
        const progress = (this.currentIndex / this.totalQuestions) * 100;

        this.container.innerHTML = `
            <div class="h-full w-full flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden bg-slate-950/20">
                
                <div class="flex flex-col h-full gap-8 animate-fade-in max-w-7xl mx-auto p-4 md:p-8 relative noise-overlay">
                
                <!-- HUD Sidebar -->
                <div class="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-10 pointer-events-none opacity-40">
                    <div class="flex flex-col items-end">
                        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Integrity</span>
                        <div class="w-32 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div id="integrity-bar" class="h-full bg-rose-500 transition-all duration-500" style="width: ${this.integrity}%"></div>
                        </div>
                    </div>
                </div>

                <!-- Main Viewport -->
                <div class="flex-1 flex flex-col glass-panel rounded-[3rem] border border-white/5 relative overflow-hidden group/link bg-slate-950/20" id="link-viewport">
                    
                    <!-- Header -->
                    <div class="p-8 border-b border-white/5 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400">
                                <iconify-icon icon="solar:shield-warning-bold" class="text-2xl"></iconify-icon>
                            </div>
                            <div>
                                <h3 class="text-xl font-black text-white tracking-tight uppercase">${this.game.getText('L16_TITLE')}</h3>
                                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Master Protocol 016 // Secure Channel</p>
                            </div>
                        </div>
                        <div class="text-right">
                             <span class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Node Link Active</span>
                        </div>
                    </div>
      <!-- Question Card -->
                        <div class="glass-panel p-10 md:p-12 rounded-[3rem] border border-rose-500/10 shadow-3xl relative overflow-hidden">
                            <div class="absolute top-0 left-0 w-full h-1 bg-slate-950">
                                <div class="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)] transition-all duration-700" style="width: ${progress}%"></div>
                            </div>

                            <div class="flex justify-between items-center mb-10">
                                <div class="flex items-center gap-3">
                                    <span class="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 text-[10px] font-black tracking-widest uppercase">Query ${this.currentIndex + 1}</span>
                                </div>
                                <div class="text-[10px] font-mono text-slate-500 uppercase tracking-widest">LEGENDS_TRIAL_V3.HEX</div>
                            </div>

                            <h3 class="text-2xl md:text-3xl font-black text-white mb-12 tracking-tight leading-snug">
                                ${qData.q}
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="options-grid">
                                ${qData.opts.map((opt, i) => `
                                    <button class="option-btn group p-6 bg-slate-950 border border-slate-800 rounded-3xl text-left transition-all hover:bg-rose-500/5 hover:border-rose-500/50 active:scale-[0.98] relative overflow-hidden" data-answer="${opt}">
                                        <div class="absolute inset-y-0 left-0 w-1 bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div class="flex items-center gap-4 relative z-10">
                                            <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-rose-400 group-hover:border-rose-500/30 transition-all">
                                                <span class="text-xs font-black">${String.fromCharCode(65 + i)}</span>
                                            </div>
                                            <span class="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">${opt}</span>
                                        </div>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                </div>

                <!-- HUD Ticker Bottom -->
                <div class="absolute bottom-10 inset-x-0 px-12 flex items-center justify-between pointer-events-none opacity-40">
                    <div class="text-[9px] font-mono text-slate-500 uppercase tracking-[0.5em]">SYSTEM_STABILITY: CALIBRATING...</div>
                    <div class="text-[9px] font-mono text-slate-500 uppercase tracking-[0.5em]">SECURE_STORAGE_ACTIVE</div>
                </div>

            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        this.container.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => {
                const isCorrect = btn.dataset.answer === this.questions[this.currentIndex].a;

                if (isCorrect) {
                    this.triggerSuccess(btn);
                } else {
                    this.triggerFailure();
                }
            };
        });
    },

    triggerSuccess(btn) {
        this.score += 500;
        btn.classList.add('bg-emerald-500/20', 'border-emerald-500');

        setTimeout(() => {
            this.currentIndex++;
            if (this.currentIndex < this.totalQuestions) {
                this.render();
            } else {
                this.finishLevel();
            }
        }, 800);
    },

    triggerFailure() {
        this.integrity = Math.max(0, this.integrity - 15);
        this.score = Math.max(0, this.score - 250);

        // Shake & Glitch Effect
        const viewport = document.getElementById('neural-viewport');
        const speech = document.getElementById('boss-speech');

        viewport.classList.add('animate-glitch-cinematic', 'animate-shake');
        if (speech) speech.innerText = this.game.getText('L16_BOSS_FAIL');

        this.updateIntegrityUI();

        if (this.integrity <= 0) {
            this.finishLevel(false);
        }

        setTimeout(() => {
            viewport.classList.remove('animate-glitch-cinematic', 'animate-shake');
        }, 1000);
    },

    updateIntegrityUI() {
        const bar = document.getElementById('integrity-bar');
        const val = document.getElementById('integrity-value');
        if (bar) bar.style.width = `${this.integrity}%`;
        if (val) val.innerText = `${this.integrity}%`;
    },

    finishLevel(success = true) {
        this.game.completeLevel({
            success: success,
            score: this.score,
            xp: success ? 5000 : 500,
            accuracy: Math.round((this.integrity / 100) * 100)
        });
    }
};
