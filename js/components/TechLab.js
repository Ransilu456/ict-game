/**
 * Tech Lab: Knowledge Base Component
 * Displays interactive info about hardware devices and signals.
 */

export default class TechLab {
    constructor(game) {
        this.game = game;
        this.currentCategory = 'all';
        this.inSimulation = false;
        this.currentSimId = null;
        this.categories = [
            { id: 'all', label: 'All Devices', icon: 'solar:widget-bold' },
            { id: 'optics', label: 'Optics & Vision', icon: 'solar:camera-bold' },
            { id: 'comms', label: 'Streaming & Comms', icon: 'solar:transmission-bold' },
            { id: 'print', label: 'Output Devices', icon: 'solar:printer-bold' },
            { id: 'cables', label: 'Connectivity', icon: 'solar:linear-bold' }
        ];

        this.devices = [
            {
                id: 'dslr',
                category: 'optics',
                title: 'Digital SLR Camera',
                icon: 'solar:camera-bold',
                desc: 'Captures high-resolution images using a mechanical mirror system and a digital sensor.',
                how: 'Light enters the lens, reflects off a mirror into the viewfinder, then hits the CMOS sensor when the shutter opens.',
                extra: 'Uses Prism optics to flip the image correctly for the eye.'
            },
            {
                id: 'streamer',
                category: 'comms',
                title: 'Live Streaming Encoder',
                icon: 'solar:videocamera-record-bold',
                desc: 'Converts raw video signals into compressed digital data for internet transmission.',
                how: 'Uses H.264 or HEVC protocols to shrink data size while maintaining quality during uplink.',
                extra: 'Essential for real-time platforms like YouTube and Twitch.'
            },
            {
                id: 'laser-printer',
                category: 'print',
                title: 'Laser Printer',
                icon: 'solar:printer-bold',
                desc: 'Uses electrostatic charges and toner to produce high-speed text and graphics.',
                how: 'A laser "draws" the image on a drum, toner sticks to charged areas, then heat fuses it to paper.',
                extra: 'Optical precision allows for 1200+ DPI resolution.'
            },
            {
                id: 'fiber-optic',
                category: 'cables',
                title: 'Fiber Optic Cable',
                icon: 'solar:link-bold',
                desc: 'Transmits data as light pulses through thin glass or plastic fibers.',
                how: 'Uses Total Internal Reflection to bounce photons down the core at near light-speed.',
                extra: 'Immune to electromagnetic interference (EMI).'
            },
            {
                id: 'transmitter',
                category: 'comms',
                title: 'Signal Transmitter',
                icon: 'solar:tower-bold',
                desc: 'Broadcasts radio or microwave signals over long distances.',
                how: 'Modulates electrical currents into electromagnetic waves via an antenna array.',
                extra: 'Supports satellite links and mobile networks (5G/LTE).'
            },
            {
                id: 'hdmi',
                category: 'cables',
                title: 'HDMI 2.1',
                icon: 'solar:plug-bold',
                desc: 'The standard for high-bandwidth audio and video transmission.',
                how: 'Uses TMDS (Transition Minimized Differential Signaling) to send uncompressed digital data.',
                extra: 'Supports 8K resolution and Dynamic HDR.'
            },
            {
                id: 'ip-cam',
                category: 'optics',
                title: 'Industrial IP Camera',
                icon: 'solar:videocamera-bold-duotone',
                desc: 'A digital camera that sends image data and receives control data via an Ethernet network.',
                how: 'Processes video locally and streams it over RTSP/ONVIF protocols using Power over Ethernet (PoE).',
                extra: 'Eliminates the need for separate power cables.'
            },
            {
                id: 'wireless-link',
                category: 'comms',
                title: 'Wireless Video Link',
                icon: 'solar:wireless-charge-bold',
                desc: 'Provides zero-latency wireless transmission for professional film monitoring.',
                how: 'Uses 5GHz OFDM (Orthogonal Frequency Division Multiplexing) to broadcast uncompressed SDI/HDMI signals.',
                extra: 'Essential for Steadicam operators and remote monitoring.'
            },
            {
                id: 'cmos-sensor',
                category: 'optics',
                title: 'CMOS Image Sensor',
                icon: 'solar:eye-bold',
                desc: 'The heart of modern cameras that converts photons into electrical signals.',
                how: 'Millions of photodiodes capture light; each pixel has its own amplifier and ADC (Analog-to-Digital Converter).',
                extra: 'Lower power consumption compared to older CCD sensors.'
            },
            {
                id: 'sdi-cable',
                category: 'cables',
                title: 'SDI (Serial Digital Interface)',
                icon: 'solar:link-circle-bold',
                desc: 'The professional standard for camera-to-switcher connections.',
                how: 'Transmits uncompressed, unencrypted digital video signals over 75-ohm coaxial cables.',
                extra: 'Supports long cable runs up to 300 meters without signal loss.'
            },
            {
                id: 'thermal-cam',
                category: 'optics',
                title: 'Thermal Imaging Unit',
                icon: 'solar:fire-bold',
                desc: 'Visualizes heat radiation instead of visible light.',
                how: 'Uses a Bolometer to detect Long-wave Infrared (LWIR) energy and converts it into a thermogram.',
                extra: 'Used in firefighting, search & rescue, and electrical inspections.'
            }
        ];
    }

    render() {
        if (this.inSimulation) return this.renderSimulation();

        const filtered = this.currentCategory === 'all'
            ? this.devices
            : this.devices.filter(d => d.category === this.currentCategory);

        return `
            <div class="animate-fade-in p-6 md:p-10 max-w-7xl mx-auto">
                <!-- Header -->
                <div class="mb-12 text-center">
                    <h2 class="text-4xl font-black text-white mb-4 tracking-tighter">TECH LAB <span class="text-indigo-500">KNOWLEDGE BASE</span></h2>
                    <p class="text-slate-400 max-w-2xl mx-auto">Analyze real-world devices, signal protocols, and hardware optics in our high-fidelity simulation lab.</p>
                </div>

                <!-- Category Tabs -->
                <div class="flex flex-wrap justify-center gap-3 mb-10">
                    ${this.categories.map(cat => `
                        <button class="cat-btn px-5 py-2.5 rounded-2xl border transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest
                            ${this.currentCategory === cat.id
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'}"
                            data-cat="${cat.id}">
                            <iconify-icon icon="${cat.icon}"></iconify-icon>
                            ${cat.label}
                        </button>
                    `).join('')}
                </div>

                <!-- Device Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${filtered.map(device => `
                        <div class="glass-panel p-6 rounded-[2rem] border border-slate-800/50 bg-slate-900/30 flex flex-col gap-5 hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all group">
                            <div class="flex items-start justify-between">
                                <div class="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 text-2xl group-hover:scale-110 transition-transform shadow-inner">
                                    <iconify-icon icon="${device.icon}"></iconify-icon>
                                </div>
                                <span class="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] border border-slate-800 px-3 py-1 rounded-full">${device.category}</span>
                            </div>

                            <div>
                                <h3 class="text-xl font-bold text-white mb-2">${device.title}</h3>
                                <p class="text-sm text-slate-400 leading-relaxed">${device.desc}</p>
                            </div>

                            <div class="space-y-4 pt-4 border-t border-slate-800/50">
                                <div>
                                    <div class="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">How it Works</div>
                                    <p class="text-xs text-slate-300 italic opacity-80 leading-relaxed">${device.how}</p>
                                </div>
                                <div class="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                    <div class="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Lab Note</div>
                                    <p class="text-[11px] text-emerald-400/80">${device.extra}</p>
                                </div>
                                <button class="sim-btn w-full mt-2 py-3 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-400 text-indigo-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2" data-id="${device.id}">
                                    <iconify-icon icon="solar:play-bold"></iconify-icon>
                                    Start Practical Lab
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderSimulation() {
        const device = this.devices.find(d => d.id === this.currentSimId);
        return `
            <div class="animate-fade-in p-6 md:p-10 max-w-5xl mx-auto">
                <button id="exit-sim" class="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                    <iconify-icon icon="solar:arrow-left-outline"></iconify-icon>
                    Back to Lab
                </button>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Control Panel -->
                    <div class="lg:col-span-1 space-y-6">
                        <div class="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/50">
                            <div class="flex items-center gap-3 mb-6">
                                <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                                    <iconify-icon icon="${device.icon}" class="text-xl"></iconify-icon>
                                </div>
                                <h3 class="font-bold text-white">${device.title}</h3>
                            </div>
                            
                            <div id="sim-controls" class="space-y-6">
                                <!-- Controls injected here -->
                                ${this.getSimControls(device.id)}
                            </div>
                        </div>

                        <div class="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 border-dashed">
                            <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Live Analysis</h4>
                            <div id="sim-stats" class="space-y-2 font-mono text-[10px]">
                                <!-- Stats injected here -->
                            </div>
                        </div>
                    </div>

                    <!-- Simulation Viewport -->
                    <div class="lg:col-span-2 relative">
                        <div class="aspect-video bg-slate-950 rounded-[2.5rem] border-4 border-slate-900 shadow-2xl relative overflow-hidden flex items-center justify-center" id="sim-viewport">
                             <!-- Visuals injected here -->
                             ${this.getSimVisuals(device.id)}
                        </div>
                        
                        <div class="absolute -bottom-4 right-8 bg-indigo-600 px-4 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                            Active Simulation
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSimControls(id) {
        if (id === 'dslr' || id === 'ip-cam' || id === 'cmos-sensor') {
            return `
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Lens Aperture</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-aperture" min="1" max="100" value="50">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Sensor Gain (ISO)</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-iso" min="100" max="6400" step="100" value="400">
                </div>
            `;
        }
        if (id === 'transmitter' || id === 'streamer' || id === 'wireless-link') {
            return `
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Frequency (GHz)</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-freq" min="2" max="60" value="5">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Packet Density</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-bits" min="10" max="1000" value="200">
                </div>
            `;
        }
        if (id === 'laser-printer' || id === 'print') {
            return `
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Drum Voltage</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-charge" min="10" max="100" value="70">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Fuser Temp (°C)</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-temp" min="150" max="220" value="180">
                </div>
            `;
        }
        if (id === 'fiber-optic' || id === 'sdi-cable' || id === 'cables') {
            return `
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Incident Angle</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-angle" min="10" max="80" value="30">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-500 uppercase mb-3">Light Intensity</label>
                    <input type="range" class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" id="ctrl-lux" min="0" max="100" value="80">
                </div>
            `;
        }
        return `
            <p class="text-xs text-slate-500 italic">Practical module starting soon...</p>
        `;
    }

    getSimVisuals(id) {
        // SVG containers for animation
        return `<div id="canvas-root" class="w-full h-full flex items-center justify-center"></div>`;
    }

    attachEvents(container) {
        if (this.inSimulation) {
            container.querySelector('#exit-sim').onclick = () => {
                this.inSimulation = false;
                this.currentSimId = null;
                container.innerHTML = this.render();
                this.attachEvents(container);
            };
            this.initSimulationLogic(container);
            return;
        }

        container.querySelectorAll('.cat-btn').forEach(btn => {
            btn.onclick = () => {
                this.currentCategory = btn.dataset.cat;
                container.innerHTML = this.render();
                this.attachEvents(container); // Re-attach
            };
        });

        container.querySelectorAll('.sim-btn').forEach(btn => {
            btn.onclick = () => {
                this.inSimulation = true;
                this.currentSimId = btn.dataset.id;
                container.innerHTML = this.render();
                this.attachEvents(container);
            };
        });
    }

    initSimulationLogic(container) {
        const id = this.currentSimId;
        const root = container.querySelector('#canvas-root');
        const stats = container.querySelector('#sim-stats');

        if (id === 'dslr' || id === 'ip-cam' || id === 'cmos-sensor') {
            this.runOpticsSim(root, stats, container);
        } else if (id === 'transmitter' || id === 'streamer' || id === 'wireless-link') {
            this.runSignalSim(root, stats, container);
        } else if (id === 'laser-printer') {
            this.runPrinterSim(root, stats, container);
        } else if (id === 'fiber-optic' || id === 'sdi-cable') {
            this.runFiberSim(root, stats, container);
        }
    }

    runOpticsSim(root, stats, container) {
        const aperture = container.querySelector('#ctrl-aperture');
        const iso = container.querySelector('#ctrl-iso');

        const update = () => {
            const v = aperture.value;
            const i = iso.value;
            root.innerHTML = `
                <svg viewBox="0 0 400 200" class="w-full max-w-sm">
                    <!-- Light Rays -->
                    <path d="M 0 50 L 150 100 L 250 100 L 400 100" stroke="yellow" stroke-width="${v / 10}" fill="none" class="animate-pulse">
                         <animate attributeName="stroke-opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
                    </path>
                    <!-- Lens -->
                    <ellipse cx="150" cy="100" rx="10" ry="${v}" fill="cyan" fill-opacity="0.3" stroke="white" />
                    <!-- Mirror -->
                    <line x1="200" y1="50" x2="250" y2="150" stroke="white" stroke-width="4" stroke-opacity="0.5" />
                    <!-- Sensor -->
                    <rect x="350" y="50" width="10" height="100" fill="#333" stroke="white" />
                    <rect x="350" y="50" width="10" height="100" fill="emerald" fill-opacity="${i / 10000}" />
                </svg>
            `;
            stats.innerHTML = `
                <div class="flex justify-between text-slate-400"><span>PHOTON COUNT:</span> <span class="text-white">${v * 1000} LUX</span></div>
                <div class="flex justify-between text-slate-400"><span>SIGNAL NOISE:</span> <span class="text-rose-400">${Math.floor(i / 100)} dB</span></div>
                <div class="flex justify-between text-slate-400"><span>SENSOR STATUS:</span> <span class="text-emerald-400">STABLE</span></div>
            `;
        };

        aperture.oninput = update;
        iso.oninput = update;
        update();
    }

    runSignalSim(root, stats, container) {
        const freq = container.querySelector('#ctrl-freq');
        const bits = container.querySelector('#ctrl-bits');

        const update = () => {
            const f = freq.value;
            const b = bits.value;
            root.innerHTML = `
                <svg viewBox="0 0 400 200" class="w-full">
                    <path d="M 0 100 ${Array.from({ length: 40 }, (_, i) => `Q ${i * 10 + 5} ${100 - (b / 20) * (i % 2 ? 1 : -1)} ${i * 10 + 10} 100`).join(' ')}" 
                        stroke="indigo" stroke-width="2" fill="none">
                         <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="${20 / f}s" repeatCount="indefinite" />
                    </path>
                    <!-- Transmitter -->
                    <circle cx="20" cy="100" r="10" fill="indigo" />
                </svg>
            `;
            stats.innerHTML = `
                <div class="flex justify-between text-slate-400"><span>BANDWIDTH:</span> <span class="text-white">${f * 10} MHz</span></div>
                <div class="flex justify-between text-slate-400"><span>DATA RATE:</span> <span class="text-indigo-400">${b} Mbps</span></div>
                <div class="flex justify-between text-slate-400"><span>LINK STATUS:</span> <span class="text-emerald-400">BROADCASTING</span></div>
            `;
        };

        freq.oninput = update;
        bits.oninput = update;
        update();
    }

    runPrinterSim(root, stats, container) {
        const charge = container.querySelector('#ctrl-charge');
        const temp = container.querySelector('#ctrl-temp');

        const update = () => {
            const c = charge.value;
            const t = temp.value;
            root.innerHTML = `
                <svg viewBox="0 0 400 200" class="w-full">
                    <!-- Rotating Drum -->
                    <circle cx="200" cy="100" r="60" fill="none" stroke="#444" stroke-width="4" stroke-dasharray="10,5">
                         <animateTransform attributeName="transform" type="rotate" from="0 200 100" to="360 200 100" dur="5s" repeatCount="indefinite" />
                    </circle>
                    <!-- Laser Charge -->
                    <path d="M 200 0 L 200 40" stroke="cyan" stroke-width="2" class="animate-pulse" />
                    <!-- Toner particles -->
                    ${Array.from({ length: 20 }, (_, i) => `
                        <circle cx="${200 + 70 * Math.cos(i)}" cy="${100 + 70 * Math.sin(i)}" r="2" fill="black" opacity="${c / 100}">
                            <animateTransform attributeName="transform" type="rotate" from="0 200 100" to="360 200 100" dur="3s" repeatCount="indefinite" />
                        </circle>
                    `).join('')}
                    <!-- Heating Unit -->
                    <rect x="280" y="80" width="40" height="40" fill="${t > 200 ? 'rose' : 'orange'}" fill-opacity="0.5" />
                </svg>
            `;
            stats.innerHTML = `
                <div class="flex justify-between text-slate-400"><span>TONER ADHESION:</span> <span class="text-white">${c}%</span></div>
                <div class="flex justify-between text-slate-400"><span>FUSION QUALITY:</span> <span class="${t > 190 ? 'text-emerald-400' : 'text-amber-400'}">${t > 190 ? 'PERFECT' : 'LOW TEMP'}</span></div>
                <div class="flex justify-between text-slate-400"><span>PAGES/MIN:</span> <span class="text-indigo-400">45 PPM</span></div>
            `;
        };

        charge.oninput = update;
        temp.oninput = update;
        update();
    }

    runFiberSim(root, stats, container) {
        const angle = container.querySelector('#ctrl-angle');
        const lux = container.querySelector('#ctrl-lux');

        const update = () => {
            const a = angle.value;
            const l = lux.value;
            const reflected = a < 42; // Critical angle for glass/air approx 42

            root.innerHTML = `
                <svg viewBox="0 0 400 200" class="w-full">
                    <!-- Cladding -->
                    <rect x="0" y="70" width="400" height="60" fill="indigo" fill-opacity="0.1" stroke="indigo" stroke-opacity="0.3" />
                    <!-- Core -->
                    <rect x="0" y="85" width="400" height="30" fill="white" fill-opacity="0.05" />
                    <!-- Light Path -->
                    <path d="M 0 100 L 100 ${100 - a} L 200 100 L 300 ${100 + a} L 400 100" 
                        stroke="cyan" stroke-width="3" fill="none" class="${reflected ? '' : 'opacity-20'}">
                        <animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="2s" repeatCount="indefinite" />
                    </path>
                    ${!reflected ? `<path d="M 100 ${100 - a} L 150 0" stroke="rose" stroke-width="2" stroke-dasharray="5,5" />` : ''}
                </svg>
            `;
            stats.innerHTML = `
                <div class="flex justify-between text-slate-400"><span>REFRACTION:</span> <span class="${reflected ? 'text-emerald-400' : 'text-rose-400'}">${reflected ? 'INTERNAL REFLECTION' : 'SIGNAL LOSS'}</span></div>
                <div class="flex justify-between text-slate-400"><span>ATTENUATION:</span> <span class="text-white">${reflected ? '0.2 dB/km' : 'INFINITY'}</span></div>
                <div class="flex justify-between text-slate-400"><span>LIGHT POWER:</span> <span class="text-indigo-400">${l} mW</span></div>
            `;
        };

        angle.oninput = update;
        lux.oninput = update;
        update();
    }
}
