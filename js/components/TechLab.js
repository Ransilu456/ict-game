/**
 * Tech Lab: Knowledge Base Component
 * Displays interactive info about hardware devices and signals.
 */

import LabSimulation from './techlab/LabSimulation.js';
import OpticsLab from './techlab/OpticsLab.js';
import SignalLab from './techlab/SignalLab.js';
import NetworkLab from './techlab/NetworkLab.js';
import PrinterLab from './techlab/PrinterLab.js';
import FiberLab from './techlab/FiberLab.js';
import ThermalLab from './techlab/ThermalLab.js';
import HDMILab from './techlab/HDMILab.js';
import CameraSwitcher from './techlab/CameraSwitcher.js';
import WiFiLab from './techlab/WiFiLab.js';
import StreamingLab from './techlab/StreamingLab.js';
import ThreeDComponents from './ThreeDComponents.js';

export default class TechLab {
    constructor(game) {
        this.game = game;
        this.currentCategory = 'all';
        this.inSimulation = false;
        this.currentSimId = null;
        this.activeSim = null;

        this.categories = [
            { id: 'all', label: 'TL_CAT_ALL', icon: 'solar:widget-bold' },
            { id: 'optics', label: 'TL_CAT_OPTICS', icon: 'solar:camera-bold' },
            { id: 'comms', label: 'TL_CAT_COMMS', icon: 'solar:transmission-bold' },
            { id: 'print', label: 'TL_CAT_PRINT', icon: 'solar:printer-bold' },
            { id: 'net', label: 'TL_CAT_NET', icon: 'solar:server-bold' },
            { id: 'cables', label: 'TL_CAT_CABLES', icon: 'solar:linear-bold' }
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
            },
            {
                id: 'switch',
                category: 'net',
                title: 'Managed Network Switch',
                icon: 'solar:server-square-bold',
                desc: 'A smart networking device that connects multiple computers and uses MAC addresses to forward data.',
                how: 'Maintains a MAC Address Table; when a packet arrives, it looks up the destination and sends it only to the specific port.',
                extra: 'Features VLAN support for logical network segmentation.'
            },
            {
                id: 'switcher',
                category: 'comms',
                title: 'Production Switcher',
                icon: 'solar:clapperboard-edit-bold',
                desc: 'The core of a live broadcast studio for switching between multiple video sources.',
                how: 'Mixes multiple SDI/HDMI inputs and manages Preview/Program buses for seamless live cuts.',
                extra: 'Supports hardware-accelerated transitions and upstream keyers.'
            },
            {
                id: 'wifi-router',
                category: 'net',
                title: 'MIMO WiFi 6 Router',
                icon: 'solar:wi-fi-bold',
                desc: 'A wireless access point that broadcasts internet data via radio waves.',
                how: 'Converts wired Ethernet data into RF signals; uses Multiple Input Multiple Output (MIMO) to serve many devices at once.',
                extra: 'Operates on 2.4GHz for distance and 5GHz for short-range speed.'
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
                            ${this.game.getText(cat.label)}
                        </button>
                    `).join('')}
                </div>

                <!-- Device Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${filtered.map(device => {
                    let modelSVG = `<iconify-icon icon="${device.icon}"></iconify-icon>`;
                    if (device.id === 'dslr') modelSVG = ThreeDComponents.getCameraSVG();
                    else if (device.id === 'ip-cam') modelSVG = ThreeDComponents.getIPCamSVG();
                    else if (device.id === 'laser-printer') modelSVG = ThreeDComponents.getPrinterSVG();
                    else if (device.id === 'wifi-router') modelSVG = ThreeDComponents.getRouterSVG();
                    else if (device.id === 'switch') modelSVG = ThreeDComponents.getComputerSVG();
                    else if (device.id === 'fiber-optic') modelSVG = ThreeDComponents.getCubeSVG('#6366f1');

                    return `
                        <div class="glass-panel p-6 rounded-[2rem] border border-slate-800/50 bg-slate-900/30 flex flex-col gap-6 hover:border-indigo-500/30 hover:bg-slate-900/40 transition-all group isometric-card">
                            <div class="flex items-start justify-between">
                                <div class="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800/50 flex items-center justify-center text-indigo-400 text-3xl group-hover:scale-110 transition-transform shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
                                     <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                     <div class="w-16 h-16 relative z-10">
                                        ${modelSVG}
                                     </div>
                                </div>
                                <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border border-slate-800 px-3 py-1 rounded-full group-hover:border-indigo-500/50 transition-colors">${device.category}</span>
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
                                <div class="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 text-center">
                                    <div class="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Lab Note</div>
                                    <p class="text-[11px] text-emerald-400/80">${device.extra}</p>
                                </div>
                                <button class="sim-btn w-full mt-2 py-3 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-400 text-indigo-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2" data-id="${device.id}">
                                    <iconify-icon icon="solar:play-bold"></iconify-icon>
                                    Start Practical Lab
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
                </div>
            </div>
        `;
    }

    renderSimulation() {
        const device = this.devices.find(d => d.id === this.currentSimId);
        return `
            <div class="animate-fade-in p-6 md:p-10 max-w-7xl mx-auto flex flex-col h-full bg-slate-950/50 backdrop-blur-xl rounded-[3rem] border border-slate-800/50 my-10 relative overflow-y-auto scrollbar-hide">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none"></div>

                <div class="flex items-center justify-between mb-10 relative z-10">
                    <button id="exit-sim" class="flex items-center gap-3 text-slate-400 hover:text-white transition-all text-xs font-black uppercase tracking-[0.3em] group">
                        <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-indigo-500/50">
                            <iconify-icon icon="solar:arrow-left-bold"></iconify-icon>
                        </div>
                        <span>${this.game.getText('TL_SIM_RETURN')}</span>
                    </button>
                    <div class="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] animate-pulse">
                        SIM: ${device.title}
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 relative z-10">
                    <!-- Left Aspect: Visualization -->
                    <div class="lg:col-span-8 flex flex-col gap-6">
                        <div class="flex-1 bg-slate-950 rounded-[3rem] border-4 border-slate-900/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group/viewport">
                             <div class="absolute inset-0 scanlines opacity-5 pointer-events-none z-10"></div>
                             <div id="sim-viewport" class="w-full h-full flex items-center justify-center p-12 transition-transform duration-700 group-hover/viewport:scale-105"></div>
                             
                             <!-- UI Overlays for Viewport -->
                             <div class="absolute top-6 left-6 flex flex-col gap-1">
                                <span class="text-[9px] font-black text-slate-600 tracking-[0.2em] uppercase">Status</span>
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span class="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">${this.game.getText('TL_SIM_LIVE')}</span>
                                </div>
                             </div>
                        </div>
                        
                        <div class="glass-panel p-6 rounded-3xl border border-slate-800/50 bg-slate-900/20">
                            <h4 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">${this.game.getText('TL_SIM_DIAG')}</h4>
                            <div id="sim-stats" class="grid grid-cols-2 md:grid-cols-3 gap-6 font-mono text-[10px]">
                                <!-- Dynamically filled -->
                            </div>
                        </div>
                    </div>

                    <!-- Right Aspect: Controls -->
                    <div class="lg:col-span-4 flex flex-col gap-6">
                        <div class="glass-panel p-8 rounded-[3rem] border border-slate-800 bg-slate-900/40 flex-1">
                            <div class="flex items-center gap-4 mb-8">
                                <div class="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-inner text-2xl">
                                    <iconify-icon icon="${device.icon}"></iconify-icon>
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-black text-white uppercase tracking-wider text-sm">${device.title}</h3>
                                    <span class="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Interface Node</span>
                                </div>
                            </div>
                            
                            <div id="sim-controls" class="space-y-8">
                                <!-- Dynamically filled -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents(container) {
        if (this.inSimulation) {
            container.querySelector('#exit-sim').onclick = () => {
                this.inSimulation = false;
                this.currentSimId = null;
                this.activeSim = null;
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
                this.attachEvents(container);
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
        const root = container.querySelector('#sim-viewport');
        const stats = container.querySelector('#sim-stats');
        const controls = container.querySelector('#sim-controls');
        const device = this.devices.find(d => d.id === id);

        // Map device IDs to lab classes
        const labMap = {
            'dslr': OpticsLab,
            'ip-cam': OpticsLab,
            'cmos-sensor': OpticsLab,
            'transmitter': SignalLab,
            'streamer': SignalLab,
            'wireless-link': SignalLab,
            'laser-printer': PrinterLab,
            'fiber-optic': FiberLab,
            'sdi-cable': FiberLab,
            'switch': NetworkLab,
            'thermal-cam': ThermalLab,
            'hdmi': HDMILab,
            'switcher': CameraSwitcher,
            'wifi-router': WiFiLab,
            'streamer': StreamingLab
        };

        const LabClass = labMap[id];
        if (LabClass) {
            this.activeSim = new LabClass(root, stats, device);
            controls.innerHTML = this.activeSim.renderControls();
            this.activeSim.init();
        } else {
            controls.innerHTML = `<p class="text-xs text-slate-500 italic">Practical module starting soon...</p>`;
            root.innerHTML = `<div class="text-slate-700 font-black text-2xl uppercase tracking-widest opacity-20">No Simulation Data</div>`;
        }
    }
}
