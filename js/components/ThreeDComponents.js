export default class ThreeDComponents {
    /**
     * Returns an isometric server rack SVG
     */
    static getServerSVG(color = '#6366f1') {
        return `
            <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                <defs>
                    <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:0.2" />
                        <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
                    </linearGradient>
                </defs>
                <!-- Base / Pedestal -->
                <path d="M60 160 L140 160 L160 180 L40 180 Z" fill="#0f172a" stroke="#1e293b" />
                
                <!-- Main Core Block -->
                <path d="M100 150 L160 120 L160 60 L100 90 Z" fill="#1e293b" />
                <path d="M100 150 L40 120 L40 60 L100 90 Z" fill="#0f172a" />
                <path d="M40 60 L100 30 L160 60 L100 90 Z" fill="#334155" />
                
                <!-- Internal Glowing Rails -->
                <g class="animate-pulse">
                    <path d="M70 75 L100 90 L130 75" fill="none" stroke="${color}" stroke-width="1" opacity="0.5" />
                    <path d="M70 95 L100 110 L130 95" fill="none" stroke="${color}" stroke-width="1" opacity="0.3" />
                </g>

                <!-- Floating Data Rings -->
                <ellipse cx="100" cy="50" rx="40" ry="15" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.2" class="animate-float" />
                <ellipse cx="100" cy="45" rx="30" ry="10" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.4" class="animate-float-delayed" />

                <!-- Power Indicator -->
                <circle cx="100" cy="90" r="15" fill="url(#coreGrad)" class="animate-pulse" />
                <circle cx="100" cy="90" r="5" fill="white" filter="blur(2px)">
                    <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
                </circle>

                <!-- Side Panels / Vents -->
                <g stroke="#334155" stroke-width="0.5">
                    <path d="M50 85 L50 115" />
                    <path d="M150 85 L150 115" />
                </g>
            </svg>
        `;
    }

    /**
     * Returns an isometric CPU/Processor SVG
     */
    static getCPUSVG() {
        return `
            <svg viewBox="0 0 200 200" class="w-full h-full">
                <!-- Substrate -->
                <path d="M100 150 L170 115 L170 85 L100 120 Z" fill="#1e293b" />
                <path d="M100 150 L30 115 L30 85 L100 120 Z" fill="#0f172a" />
                <path d="M30 85 L100 50 L170 85 L100 120 Z" fill="#334155" />
                
                <!-- Die -->
                <path d="M60 85 L100 105 L140 85 L100 65 Z" fill="#6366f1" opacity="0.8">
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
                </path>
                
                <!-- Pins/Traces -->
                <g stroke="#6366f1" stroke-width="0.5" opacity="0.4">
                    <path d="M100 150 L100 170" />
                    <path d="M170 115 L190 125" />
                    <path d="M30 115 L10 125" />
                </g>
            </svg>
        `;
    }

    /**
     * Returns a 3D Floating Data Cube
     */
    static getCubeSVG(color = '#10b981') {
        return `
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                <g class="animate-bounce" style="animation-duration: 4s;">
                    <path d="M50 80 L80 65 L80 35 L50 50 Z" fill="${color}" opacity="0.8" />
                    <path d="M50 80 L20 65 L20 35 L50 50 Z" fill="${color}" opacity="0.6" />
                    <path d="M20 35 L50 20 L80 35 L50 50 Z" fill="${color}" opacity="0.9" />
                </g>
            </svg>
        `;
    }

    /**
     * Returns a 3D Isometric Camera (DSLR) SVG
     */
    static getCameraSVG(color = '#6366f1') {
        return `
            <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-2xl">
                <!-- Body -->
                <path d="M60 70 L140 70 L140 130 L60 130 Z" fill="#1e293b" stroke="#334155" stroke-width="1" />
                <path d="M140 70 L160 80 L160 140 L140 130 Z" fill="#0f172a" />
                <path d="M60 70 L80 60 L160 80 L140 70 Z" fill="#334155" />
                
                <!-- Pentaprism hump -->
                <path d="M85 70 L115 70 L115 55 L85 55 Z" fill="#1e293b" />
                <path d="M115 55 L125 60 L125 75 L115 70 Z" fill="#0f172a" />
                
                <!-- Lens barrel -->
                <g transform="translate(100, 100)">
                    <ellipse cx="0" cy="0" rx="30" ry="40" fill="#0f172a" stroke="#334155" />
                    <ellipse cx="-5" cy="-5" rx="20" ry="30" fill="#1e293b" opacity="0.5" />
                    <circle cx="0" cy="0" r="10" fill="${color}" opacity="0.2" class="animate-pulse" />
                </g>

                <!-- Details -->
                <rect x="125" y="75" width="10" height="5" fill="${color}" opacity="0.5" />
            </svg>
        `;
    }

    /**
     * Returns a 3D Isometric industrial IP Camera SVG
     */
    static getIPCamSVG(color = '#10b981') {
        return `
            <svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-2xl">
                <!-- Housing -->
                <path d="M40 80 L140 80 L140 110 L40 110 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.5" />
                <path d="M140 80 L160 90 L160 120 L140 110 Z" fill="#e2e8f0" />
                <path d="M40 80 L60 70 L160 90 L140 80 Z" fill="#ffffff" />
                
                <!-- Sun shield -->
                <path d="M35 75 L145 75 L165 85 L55 85 Z" fill="#cbd5e1" />
                
                <!-- Front lens -->
                <path d="M40 80 L40 110 L30 100 L30 70 Z" fill="#1e293b" />
                <circle cx="35" cy="90" r="8" fill="#0f172a" stroke="${color}" stroke-width="1" />
                <circle cx="35" cy="90" r="2" fill="${color}" class="animate-pulse" />
                
                <!-- Mount -->
                <path d="M100 110 L100 140 L110 145" stroke="#cbd5e1" stroke-width="10" stroke-linecap="round" />
            </svg>
        `;
    }

    /**
     * Returns a 3D Isometric Workstation SVG
     */
    static getComputerSVG(color = '#6366f1') {
        return `
            <svg viewBox="0 0 200 200" class="w-full h-full">
                <!-- Monitor -->
                <path d="M50 60 L150 60 L150 120 L50 120 Z" fill="#0f172a" stroke="#334155" />
                <path d="M150 60 L160 70 L160 130 L150 120 Z" fill="#1e293b" />
                <path d="M55 65 L145 65 L145 115 L55 115 Z" fill="#1e1b4b" />
                
                <!-- Screen Glow -->
                <rect x="60" y="70" width="80" height="40" fill="${color}" opacity="0.1" class="animate-pulse" />
                <path d="M70 80 H130 M70 90 H110 M70 100 H120" stroke="${color}" stroke-width="2" opacity="0.3" />

                <!-- Stand -->
                <path d="M90 120 L110 120 L120 140 L80 140 Z" fill="#334155" />
                
                <!-- PC Case -->
                <g transform="translate(130, 40) scale(0.6)">
                    <path d="M40 120 L80 100 L80 30 L40 50 Z" fill="#1e293b" />
                    <path d="M40 120 L0 100 L0 30 L40 50 Z" fill="#0f172a" />
                    <path d="M0 30 L40 10 L80 30 L40 50 Z" fill="#475569" />
                    <circle cx="20" cy="50" r="3" fill="${color}" class="animate-pulse" />
                </g>
            </svg>
        `;
    }

    /**
     * Returns a 3D Isometric Router SVG
     */
    static getRouterSVG(color = '#10b981') {
        return `
            <svg viewBox="0 0 200 200" class="w-full h-full">
                <!-- Body -->
                <path d="M40 110 L140 110 L160 130 L60 130 Z" fill="#1e293b" stroke="#334155" />
                <path d="M160 130 L160 110 L140 90 L140 110 Z" fill="#0f172a" />
                <path d="M60 130 L60 110 L140 110 L160 130 Z" fill="#334155" />
                
                <!-- Antennas -->
                <path d="M60 110 L60 60" stroke="#334155" stroke-width="4" stroke-linecap="round" />
                <path d="M100 110 L100 50" stroke="#334155" stroke-width="4" stroke-linecap="round" />
                <path d="M140 110 L140 60" stroke="#334155" stroke-width="4" stroke-linecap="round" />
                
                <!-- Signals -->
                <g class="animate-pulse">
                    <circle cx="60" cy="120" r="2" fill="${color}" />
                    <circle cx="80" cy="120" r="2" fill="${color}" />
                    <circle cx="100" cy="120" r="2" fill="${color}" />
                </g>
                
                <!-- WiFi Waves -->
                <g opacity="0.3" class="animate-ping" style="transform-origin: 100px 50px;">
                    <path d="M80 40 Q100 20 120 40" fill="none" stroke="${color}" stroke-width="2" />
                </g>
            </svg>
        `;
    }

    /**
     * Returns a 3D Isometric Printer SVG
     */
    static getPrinterSVG(color = '#f43f5e') {
        return `
            <svg viewBox="0 0 200 200" class="w-full h-full">
                <!-- Base housing -->
                <path d="M40 100 L140 100 L160 120 L60 120 Z" fill="#e2e8f0" stroke="#cbd5e1" />
                <path d="M160 120 L160 150 L60 150 L60 120 Z" fill="#94a3b8" />
                <path d="M160 150 L140 130 L40 130 L60 150 Z" fill="#cbd5e1" />
                
                <!-- Top part -->
                <path d="M50 100 L50 80 L150 80 L150 100" fill="#f1f5f9" stroke="#cbd5e1" />
                <path d="M150 80 L160 90 L160 110 L150 100 Z" fill="#cbd5e1" />
                
                <!-- Paper tray -->
                <path d="M70 150 L130 150 L120 170 L80 170 Z" fill="#ffffff" stroke="#e2e8f0" />
                
        `;
    }

    /**
     * Returns a 3D Isometric Switch SVG
     */
    static getSwitchSVG(color = '#6366f1') {
        return `
            <svg viewBox="0 0 200 200" class="w-full h-full">
                <!-- Chassis -->
                <path d="M40 100 L160 100 L180 120 L60 120 Z" fill="#1e293b" stroke="#334155" />
                <path d="M180 120 L180 135 L60 135 L60 120 Z" fill="#0f172a" />
                <path d="M180 135 L160 115 L40 115 L60 135 Z" fill="#334155" />
                
                <!-- Ports -->
                <g transform="translate(50, 110)">
                    ${Array.from({ length: 8 }, (_, i) => `
                        <rect x="${i * 12}" y="0" width="8" height="8" rx="1" fill="#0f172a" stroke="#334155" stroke-width="0.5" />
                    `).join('')}
                </g>

                <!-- Status LED -->
                <circle cx="170" cy="110" r="2" fill="${color}" class="animate-pulse" />
            </svg>
        `;
    }

    /**
     * Returns a 3D Isometric Fiber/SDI Cable SVG
     */
    static getCableSVG(color = '#6366f1') {
        return `
            <svg viewBox="0 0 200 200" class="w-full h-full">
                <!-- Outer Jacket -->
                <path d="M20 100 Q100 80 180 100" fill="none" stroke="#1e293b" stroke-width="20" stroke-linecap="round" />
                <!-- Core Layer -->
                <path d="M20 100 Q100 80 180 100" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity="0.5" />
                <!-- Connector Tip -->
                <rect x="175" y="90" width="10" height="20" rx="2" fill="#94a3b8" />
                <path d="M185 95 L195 95 L195 105 L185 105 Z" fill="#cbd5e1" />
            </svg>
        `;
    }

    /**
     * Returns a 3D Isometric Antenna/Transmitter SVG
     */
    static getAntennaSVG(color = '#6366f1') {
        return `
            <svg viewBox="0 0 200 200" class="w-full h-full">
                <!-- Mast -->
                <path d="M100 180 L100 40" stroke="#334155" stroke-width="6" stroke-linecap="round" />
                <path d="M80 180 L100 120 L120 180" fill="none" stroke="#1e293b" stroke-width="4" />
                
                <!-- Cross bars -->
                <path d="M80 80 L120 80 M85 60 L115 60 M90 40 L110 40" stroke="#475569" stroke-width="2" />
                
                <!-- Beacon -->
                <circle cx="100" cy="40" r="4" fill="${color}" class="animate-pulse" />
                
                <!-- Waves -->
                <g class="animate-ping" style="transform-origin: 100px 40px;">
                    <circle cx="100" cy="40" r="20" fill="none" stroke="${color}" stroke-width="1" opacity="0.3" />
                </g>
            </svg>
        `;
    }

    /**
     * Returns a 3D Isometric Rackmount Encoder SVG
     */
    static getEncoderSVG(color = '#6366f1') {
        return `
            <svg viewBox="0 0 200 200" class="w-full h-full">
                <!-- Chassis -->
                <path d="M40 90 L160 90 L175 105 L55 105 Z" fill="#1e293b" stroke="#334155" />
                <path d="M175 105 L175 115 L55 115 L55 105 Z" fill="#0f172a" />
                <path d="M175 115 L160 100 L40 100 L55 115 Z" fill="#334155" />
                
                <!-- Indicators -->
                <g transform="translate(65, 108)">
                    <circle cx="0" cy="0" r="1.5" fill="${color}" class="animate-pulse" />
                    <circle cx="10" cy="0" r="1.5" fill="${color}" opacity="0.5" />
                    <circle cx="20" cy="0" r="1.5" fill="#f43f5e" class="animate-ping" />
                </g>
                
                <!-- Display -->
                <rect x="100" y="106" width="40" height="6" rx="1" fill="#0f172a" stroke="#334155" />
                <rect x="105" y="108" width="20" height="2" rx="0.5" fill="${color}" opacity="0.3" />
            </svg>
        `;
    }
}
