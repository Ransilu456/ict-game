/**
 * Localization Dictionary
 * Keys used in the game for English (en) and Sinhala (si).
 */

export const LANG = {
    // UI General
    BTN_START: { en: "Connect to Server", si: "සම්බන්ධ වන්න" },
    BTN_NEXT: { en: "Next Mission", si: "ඊළඟ මෙහෙයුම" },
    BTN_CLOSE: { en: "Close", si: "වසන්න" },
    BTN_RESUME: { en: "RESUME", si: "නැවත අරඹන්න" },
    BTN_RESTART: { en: "RESTART LEVEL", si: "නැවත මුලසිට අරඹන්න" },
    BTN_QUIT: { en: "QUIT TO MENU", si: "ප්‍රධාන මෙනුවට" },
    PAUSE_TITLE: { en: "GAME PAUSED", si: "තාවකාලිකව නවතා ඇත" },
    // Navigation
    MENU_TITLE_SELECT: { en: "Campaign Map", si: "මෙහෙයුම් සිතියම" },
    MENU_TITLE_PROFILE: { en: "Profile / Login", si: "ප්‍රෝෆයිලය / ඇතුල්වීම" },
    MENU_TITLE_TECH_LAB: { en: "Tech Lab", si: "තාක්ෂණික පර්යේෂණාගාරය" },

    // Intro Screen
    INTRO_TITLE_TOP: { en: "ICT QUEST", si: "ICT QUEST" }, // Keep English or transliterate? Keeping English for "Brand"
    INTRO_TITLE_SUB: { en: "CYBER CITY", si: "සයිබර් නගරය" },
    INTRO_DESC: { en: "Initialize your avatar to enter the simulation.", si: "නිවැරදි නම ඇතුලත් කර පද්ධතියට පිවිසෙන්න." },
    PLACEHOLDER_NAME: { en: "ENTER AGENT NAME", si: "නම ඇතුලත් කරන්න" },
    ERROR_NO_NAME_TITLE: { en: "Access Denied", si: "පිවිසුම ප්‍රතික්ෂේප විය" },
    ERROR_NO_NAME_MSG: { en: "Please enter your Agent Name to proceed.", si: "කරුණාකර ඉදිරියට යාමට ඔබේ නම ඇතුළත් කරන්න." },
    SYSTEM_LOG_LOGIN: { en: "logged in.", si: "පද්ධතියට ඇතුළු විය." },

    // Game HUD
    LBL_LEVEL: { en: "LEVEL", si: "අදියර" },
    LBL_SCORE: { en: "SCORE", si: "ලකුණු" },
    LBL_TIME: { en: "TIME", si: "කාලය" },
    LBL_LANGUAGE: { en: "Language", si: "භාෂාව" },

    // Results Screen
    RES_TITLE: { en: "Mission Status", si: "මෙහෙයුමේ තත්වය" },
    RES_SUCCESS: { en: "MISSION ACCOMPLISHED", si: "මෙහෙයුම සාර්ථකයි" },
    RES_FAIL: { en: "MISSION FAILED", si: "මෙහෙයුම අසාර්ථකයි" },
    RES_ACCURACY: { en: "Accuracy", si: "නිරවද්‍යතාවය" },
    RES_TIME_BONUS: { en: "Time Bonus", si: "කාල දීමනාව" },
    RES_TOTAL_XP: { en: "Total XP", si: "මුළු XP" },

    // Level 1: Hardware
    L1_TITLE: { en: "MISSION: ASSEMBLE ARCHITECTURE", si: "මෙහෙයුම: පරිගණක එකලස් කිරීම" },
    L1_DESC: { en: "CRITICAL: Deploy hardware components immediately. Sub-optimal cooling or missing nodes will cause a system meltdown.", si: "දැඩි විධානය: වහාම උපාංග සවි කරන්න. දෝෂ සහිත එකලස් කිරීම් පද්ධතිය බිඳ වැටීමට හේතු වේ." },
    L1_TRAY_TITLE: { en: "COMPONENTS", si: "උපාංග" },
    L1_ITEM_CPU: { en: "⚡ CPU (Processor)", si: "⚡ CPU (සකසනය)" },
    L1_ITEM_RAM: { en: "💾 RAM (Memory)", si: "💾 RAM (මතකය)" },
    L1_ITEM_GPU: { en: "🎮 GPU (Graphics)", si: "🎮 GPU (ග්‍රැෆික් කාඩ්)" },
    L1_ITEM_SSD: { en: "💿 SSD (Storage)", si: "💿 SSD (ආචයනය)" },
    L1_ITEM_PSU: { en: "🔋 PSU (Power)", si: "🔋 PSU (බල සැපයුම)" },
    L1_ITEM_FAN: { en: "❄️ FAN (Cooling)", si: "❄️ FAN (සිසිලකය)" },

    L1_ZONE_SOCKET: { en: "SOCKET", si: "සොකට් එක" },
    L1_ZONE_DIMM: { en: "DIMM", si: " රැම් ස්ලොට්" }, // Transliterated/Common usage
    L1_ZONE_PCIE: { en: "PCIe X16", si: "PCIe X16" },
    L1_ZONE_SATA: { en: "SATA BAY", si: "SATA තොට" },
    L1_ZONE_PSU: { en: "PSU BAY", si: "බල සැපයුම් කුටිය" },
    L1_ZONE_FAN: { en: "FAN MOUNT", si: "සිසිලක රඳවනය" },

    L1_MSG_SUCCESS: { en: "Component installed successfully.", si: "උපාංගය සාර්ථකව සවි කරන ලදී." },
    L1_MSG_ERR_TITLE: { en: "COMPATIBILITY ERROR", si: " නොගැලපෙන උපාංගයකි" },
    L1_MSG_ERR_BODY: { en: "Hardware mismatch! Item cannot fit into this slot.", si: "මෙම උපාංගය මෙම ස්ලොට් එකට ගැලපෙන්නේ නැත." },

    // Level 2: Binary (Old L5)
    L2_TITLE: { en: "MISSION: BINARY TRANSLATION", si: "මෙහෙයුම: ද්වීමය පරිවර්තනය" },
    L2_DESC: { en: "INTENSE: Decrypt high-capacity 12-bit sequences to maintain neural synchronization.", si: "දැඩි පීඩනය: 12-බිටු දත්ත පේළි කේතනය කර පද්ධතිය සමතුලිත කරන්න." },
    L2_TARGET_LBL: { en: "TARGET DECIMAL:", si: "ඉලක්කගත දශම අංකය:" },
    L2_CURRENT_LBL: { en: "CURRENT VALUE:", si: "වත්මන් අගය:" },
    L2_BTN_CHECK: { en: "VERIFY SYSTEM", si: "පද්ධතිය පරීක්ෂා කරන්න" },

    // Level 3: Logic Gates (Old L4)
    L3_TITLE: { en: "MISSION: CIRCUIT LOGIC", si: "මෙහෙයුම: තර්ක ද්වාර (Logic Gates)" },
    L3_DESC: { en: "Configure the inputs to activate the final output.", si: "ප්‍රතිදානය සක්‍රීය කිරීම සඳහා ආදාන නිවැරදිව සකසන්න." },
    L3_GATE_AND: { en: "AND GATE", si: "AND ද්වාරය" },
    L3_GATE_OR: { en: "OR GATE", si: "OR ද්වාරය" },
    L3_GATE_NOT: { en: "NOT GATE", si: "NOT ද්වාරය" },
    L3_GATE_XOR: { en: "XOR GATE", si: "XOR ද්වාරය" },
    L3_GATE_COMBO: { en: "COMBO LOGIC", si: "මිශ්‍ර තර්ක" },
    L3_BTN_CHECK: { en: "VERIFY CIRCUIT", si: "පරීක්ෂා කරන්න" },

    // Level 4: Python (Old L2)
    L4_TITLE: { en: "MISSION: CODE REPAIR", si: "මෙහෙයුම: කේත දෝෂ නිවැරදි කිරීම" },
    L4_DESC: { en: "WARNING: Security breach detected! Identify and patch Python syntax errors before the mainframe is compromised.", si: "අවවාදයයි: ආරක්ෂක දෝෂ සහිතයි! දත්ත සොරකම් කිරීමට පෙර Python කේත දෝෂ නිවැරදි කරන්න." },
    L4_TASK_PREFIX: { en: "TASK: ", si: "කාර්යය: " },
    L4_BTN_RUN: { en: "EXECUTE FIX", si: "ධාවනය කරන්න" },

    // Level 5: Networking (Old L3)
    L5_TITLE: { en: "MISSION: OSI STACK", si: "මෙහෙයුම: OSI ආකෘතිය" },
    L5_DESC: { en: "Arrange the 7 Layers of the OSI Model in the correct order (Physical to Application).", si: "OSI ආකෘතියේ ස්ථර 7 නිවැරදි අනුපිළිවෙලට සකසන්න." },
    L5_LAYER_7: { en: "7. Application", si: "7. යෙදුම් (Application)" },
    L5_LAYER_6: { en: "6. Presentation", si: "6. ඉදිරිපත් කිරීමේ (Presentation)" },
    L5_LAYER_5: { en: "5. Session", si: "5. සැසි (Session)" },
    L5_LAYER_4: { en: "4. Transport", si: "4. ප්‍රවාහන (Transport)" },
    L5_LAYER_3: { en: "3. Network", si: "3. ජාල (Network)" },
    L5_LAYER_2: { en: "2. Data Link", si: "2. දත්ත සබැඳි (Data Link)" },
    L5_LAYER_1: { en: "1. Physical", si: "1. භෞතික (Physical)" },
    L5_PROTO_TITLE: { en: "PHASE 2: PROTOCOLS", si: "අදියර 2: ප්‍රොටෝකෝල" },
    L5_PROTO_DESC: { en: "Match the protocols to their correct OSI Layer.", si: "ප්‍රොටෝකෝල ඒවාට අදාළ OSI ස්ථරයට ගැලපෙන්න." },

    // Level 6: SQL (Old L8)
    L6_TITLE: { en: "MISSION: DATABASE QUERY", si: "මෙහෙයුම: දත්ත සමුදාය" },
    L6_DESC: { en: "Construct the correct SQL query to retrieve data.", si: "දත්ත ලබා ගැනීම සඳහා නිවැරදි SQL විධානය සකසන්න." },
    L6_BTN_RUN: { en: "RUN QUERY", si: "විධානය ක්‍රියාත්මක කරන්න" },

    // Level 7: Cryptography
    L7_TITLE: { en: "MISSION: DECRYPTION", si: "මෙහෙයුම: රහස් කේත අගුළු හැරීම" },
    L7_DESC: { en: "Decrypt the message using the Caesar Cipher shift.", si: "Caesar Cipher ක්‍රමය භාවිතයෙන් පණිවිඩය කියවන්න." },
    L7_BTN_DECRYPT: { en: "DECRYPT", si: "විශේධනය කරන්න" },
    L7_HINT_TITLE: { en: "HOW TO PLAY", si: "ක්‍රීඩා කරන ආකාරය" },
    L7_HINT_BODY: { en: "1. The 'Intercepted Data' is scrambled.\n2. Use the slider to shift letters back (e.g. A->B is Shift 1).\n3. Find the key where the text makes sense.\n4. Click Decrypt.", si: "1. දත්ත වෙනස් කර ඇත.\n2. ස්ලයිඩරය භාවිතයෙන් අකුරු මාරු කරන්න.\n3. අර්ථවත් වචනයක් ලැබෙන පරිදි සකසන්න.\n4. විශේධනය ක්ලික් කරන්න." },

    // Level 8: MCQ (Old L6)
    L8_TITLE: { en: "MISSION: FINAL EXAM", si: "මෙහෙයුම: අවසාන පරීක්ෂණය" },
    L8_DESC: { en: "Prove your mastery. Answer all questions correctly to secure the network.", si: "ඔබේ දැනුම තහවුරු කරන්න. ජාලය ආරක්ෂා කිරීමට සියලු ප්‍රශ්නවලට නිවැරදිව පිළිතුරු දෙන්න." },
    L8_Q_PREFIX: { en: "QUESTION", si: "ප්‍රශ්නය" },
    L8_BTN_NEXT: { en: "CONFIRM ANSWER", si: "පිළිතුර තහවුරු කරන්න" },


    // Level 9: Cloud
    L9_TITLE: { en: "MISSION: CLOUD INFRASTRUCTURE", si: "මෙහෙයුම: ක්ලවුඩ් යටිතල පහසුකම්" },
    L9_DESC: { en: "Deploy the server nodes to their optimal cloud environments.", si: "නිවැරදි ක්ලවුඩ් පරිසරයන් වෙත සේවාදායකයන් ස්ථාපනය කරන්න." },
    L9_NODE_WEB: { en: "Web Server", si: "වෙබ් සේවාදායකය" },
    L9_NODE_DB: { en: "Database", si: "දත්ත සමුදාය" },
    L9_NODE_CACHE: { en: "Redis Cache", si: "Redis Cache" },
    L9_ENV_PUBLIC: { en: "Public Edge", si: "Public Edge" },
    L9_ENV_PRIVATE: { en: "Private Cloud", si: "Private Cloud" },
    L9_ENV_ONPREM: { en: "On-Premises", si: "On-Premises" },

    // Level 10: Cyber Security
    L10_TITLE: { en: "MISSION: FIREWALL PROTOCOL", si: "මෙහෙයුම: ගිනි පවුර (Firewall)" },
    L10_DESC: { en: "Filter incoming packets based on the security policy index.", si: "ආරක්ෂක නීති වලට අනුව පැකට් පෙරීම සිදු කරන්න." },
    L10_POLICY_HEADER: { en: "ACTIVE POLICY", si: "ක්‍රියාකාරී නීති" },
    L10_ALLOW: { en: "ALLOW", si: "අවසර දෙන්න" },
    L10_DROP: { en: "DROP", si: "ප්‍රතික්ෂේප කරන්න" },

    // Level 11: IoT
    L11_TITLE: { en: "MISSION: SMART NETWORK", si: "මෙහෙයුම: ස්මාර්ට් ජාලය (IoT)" },
    L11_DESC: { en: "Link the sensors to the central gateway to activate the smart system.", si: "ස්මාර්ට් පද්ධතිය සක්‍රීය කිරීම සඳහා සංවේදක මධ්‍යම ඒකකය වෙත සම්බන්ධ කරන්න." },
    L11_HUB: { en: "IoT Gateway", si: "IoT ද්වාරය" },
    L11_SENSOR_TEMP: { en: "Temp Sensor", si: "උෂ්ණත්ව සංවේදකය" },
    L11_SENSOR_LIGHT: { en: "Light Sensor", si: "ආලෝක සංවේදකය" },
    L11_SENSOR_MOTION: { en: "Motion Sensor", si: "චලන සංවේදකය" },

    // Level 12: AI
    L12_TITLE: { en: "MISSION: NEURAL TRAINING", si: "මෙහෙයුම: කෘතිම බුද්ධිය (AI)" },
    L12_DESC: { en: "Classify incoming data packets as Signal or Noise for the AI model.", si: "කෘතිම බුද්ධි ආකෘතිය සඳහා දත්ත 'සංඥා' (Signal) හෝ 'ශබ්ද' (Noise) ලෙස වර්ගීකරණය කරන්න." },
    L12_SIGNAL: { en: "SIGNAL", si: "සංඥාව (Signal)" },
    L12_NOISE: { en: "NOISE", si: "ශබ්දය (Noise)" },

    // Level 13: Subnetting
    L13_TITLE: { en: "MISSION: ADVANCED SUBNETTING", si: "මෙහෙයුම: උප-ජාලකරණය (Subnetting)" },
    L13_DESC: { en: "Analyze the CIDR notation to identify the Network and Broadcast IDs.", si: "CIDR ක්‍රමය භාවිතයෙන් ජාල සහ විකාශන අංක හඳුනාගන්න." },
    L13_IP_LBL: { en: "ASSIGNED IP:", si: "ලැබුණු IP ලිපිනය:" },
    L13_MASK_LBL: { en: "SUBNET MASK:", si: "උප-ජාල ආවරණය:" },
    L13_NETID_LBL: { en: "NETWORK ID:", si: "ජාල අංකය (Network ID):" },
    L13_BC_LBL: { en: "BROADCAST:", si: "විකාශන අංකය (Broadcast):" },

    // Level 14: History & Ports
    L14_TITLE: { en: "MISSION: TRANSMISSION HISTORY", si: "මෙහෙයුම: සන්නිවේදන ඉතිහාසය" },
    L14_DESC: { en: "Sequence the evolution of networking and match standard service ports.", si: "ජාලකරණ ඉතිහාසය පෙළගස්වා සේවා තොටවල් (Ports) ගැලපෙන්න." },
    L14_PORT_LBL: { en: "CORE PORTS", si: "ප්‍රධාන පෝට් අංක" },
    L14_HIST_LBL: { en: "TIMELINE", si: "කාලරාමුව" },

    // Level 15: Media Hardware
    L15_TITLE: { en: "MISSION: MULTIMEDIA ARCHITECTURE", si: "මෙහෙයුම: බහුමාධ්‍ය දෘඩාංග" },
    L15_DESC: { en: "Assemble the digital imaging system and classify media compression codecs.", si: "ඩිජිටල් රූප පද්ධතිය එකලස් කර මාධ්‍ය කේතක (Codecs) වර්ගීකරණය කරන්න." },
    L15_ITEM_SENSOR: { en: "Image Sensor", si: "රූප සංවේදකය" },
    L15_ITEM_DSP: { en: "Processor (DSP)", si: "සකසනය (DSP)" },
    L15_ITEM_STORAGE: { en: "Flash Storage", si: "ෆ්ලෑෂ් මතකය" },
    L15_CODEC_LBL: { en: "CODEC BANK", si: "කේතක බැංකුව" },

    // Level 16: Legend's Trial
    L16_TITLE: { en: "FINAL MISSION: THE LEGEND'S TRIAL", si: "අවසාන මෙහෙයුම: ජයග්‍රාහී විභාගය" },
    L16_DESC: { en: "The ultimate examination. Prove your mastery across all cyber disciplines under high-intensity strokes.", si: "අවසාන පරීක්ෂණය. දැඩි පීඩනය යටතේ සියලුම සයිබර් විෂයයන් පිළිබඳ ඔබේ ප්‍රවීණත්වය ඔප්පු කරන්න." },
    L16_STATUS_LEGEND: { en: "LEGENDARY STATUS", si: "ප්‍රවීණ තත්ත්වය" },
    L16_STATUS_OVERLOAD: { en: "SYSTEM OVERLOAD", si: "පද්ධතිය අධික ලෙස පටවා ඇත" },
    L16_STROKE_ACTIVE: { en: "CYBER STROKE ACTIVE", si: "සයිබර් ස්ට්‍රෝක් ක්‍රියාත්මකයි" },
    L16_BOSS_INTRO: { en: '"Your ascent ends here, Agent. Prove your technical worth or be purged from the architecture."', si: '"ඔබේ ගමන මෙතැනින් අවසන්, නියෝජිතය. ඔබේ තාක්ෂණික දක්ෂතාවය ඔප්පු කරන්න, නැතහොත් පද්ධතියෙන් ඉවත් වන්න."' },
    L16_BOSS_FAIL: { en: '"Weak. Your logic falters under pressure."', si: '"දුර්වලයි. පීඩනය හමුවේ ඔබේ තර්කනය බිඳ වැටේ."' },

    // Sidebar & Menus
    BTN_MISSIONS: { en: "Select Mission", si: "මෙහෙයුම් තෝරන්න" },
    BTN_RESET: { en: "Reset Progress", si: "මුල සිට අරඹන්න" },
    BTN_UNLOCK: { en: "Unlock All (Debug)", si: "සියල්ල විවෘත කරන්න (Debug)" },
    MENU_TITLE_SELECT: { en: "CAMPAIGN MAP", si: "මෙහෙයුම් සිතියම" },
    MENU_TITLE_PROFILE: { en: "PROFILE / LOGIN", si: "ගිණුම / පිවිසුම" },
    LBL_LOCKED: { en: "LOCKED", si: "අගුළු දමා ඇත" },
    MSG_RESET_CONFIRM: { en: "Are you sure? All progress will be lost.", si: "ඔබට විශ්වාසද? සියලුම දත්ත මැකී යනු ඇත." },

    // Sidebar Labels
    SB_ID: { en: "ID", si: "හඳුනාගැනීම" },
    SB_XP: { en: "XP", si: "ප්‍රවීණතාව" },
    SB_SCORE: { en: "Score", si: "ලකුණු" },

    // Tech Lab Specifics
    TL_CAT_ALL: { en: "All Devices", si: "සියලුම උපාංග" },
    TL_CAT_OPTICS: { en: "Optics & Vision", si: "ප්‍රකාශ විද්‍යාව සහ දර්ශනය" },
    TL_CAT_COMMS: { en: "Streaming & Comms", si: "සන්නිවේදනය" },
    TL_CAT_PRINT: { en: "Output Devices", si: "ප්‍රතිදාන උපාංග" },
    TL_CAT_NET: { en: "Networking", si: "ජාලකරණය" },
    TL_CAT_CABLES: { en: "Connectivity", si: "සම්බන්ධතාවය" },

    // Device Titles
    TL_DEV_DSLR: { en: "Digital SLR Camera", si: "ඩිජිටල් SLR කැමරාව" },
    TL_DEV_IP: { en: "Industrial IP Cam", si: "කාර්මික IP කැමරාව" },
    TL_DEV_ROUTER: { en: "Enterprise Router", si: "ව්යවසාය රවුටරය" },
    TL_DEV_SWITCH: { en: "Managed Switch", si: "කළමනාකරණය කළ ස්විචය" },
    TL_DEV_STREAMER: { en: "Live Streamer", si: "සජීවී විකාශකය" },
    TL_DEV_FIBER: { en: "Fiber Optic Cable", si: "ඔප්ටිකල් ෆයිබර් කේබලය" },
    TL_DEV_THERMAL: { en: "Thermal Scanner", si: "තාප ස්කෑනරය" },

    // Simulation Labels
    TL_SIM_STATUS: { en: "STATUS", si: "තත්වය" },
    TL_SIM_LIVE: { en: "LIVE LINK VALID", si: "සජීවී සම්බන්ධතාවය ක්‍රියාකාරීයි" },
    TL_SIM_DIAG: { en: "DIAGNOSTICS OUTPUT", si: "රෝග විනිශ්චය ප්‍රතිදානය" },
    TL_SIM_RETURN: { en: "Return to Terminal", si: "ප්‍රධාන මෙනුවට" },
    TL_SIM_INTERFACE: { en: "Interface Node", si: "අතුරු මුහුණත් නෝඩය" },

    // Header & Global Labels
    HDR_LINK: { en: "Link Established", si: "සම්බන්ධතාවය ස්ථාපිතයි" },
    HDR_SECTOR: { en: "Active Sector", si: "ක්‍රියාකාරී අංශය" },
    HDR_TIME: { en: "Local Node Time", si: "පද්ධති වේලාව" },
    HDR_PAUSE_HINT: { en: "INTERRUPT SESSION", si: "මෙහෙයුම නවත්වන්න" },
    HDR_BOOTING: { en: "BOOTING...", si: "පද්ධතිය සක්‍රීය වේ..." },

    // Sidebar Specifics
    SB_NAV_TITLE: { en: "Navigation Modules", si: "යාත්‍රා මෙනුව" },
    SB_LANG_TITLE: { en: "System Lang", si: "භාෂාව" },
    SB_AGENT_LBL: { en: "Authenticated Agent", si: "සත්‍යාපිත බලධාරියා" },
    SB_XP_LBL: { en: "Core XP", si: "ප්‍රධාන ප්‍රවීණතාව" },

    // Landing Page
    LP_SYS_STATUS: { en: "System Online", si: "පද්ධතිය සක්‍රීයයි" },
    LP_DESC: { en: "Deep Dive into Cyber Architecture", si: "සයිබර් ලෝකයේ ගැඹුරටම යන්න" },
    LP_BTN_BOOT: { en: "INITIATE BOOT", si: "පද්ධතිය අරඹන්න" },
    LP_BTN_CONFIG: { en: "CORE CONFIG", si: "මූලික සැකසුම්" },
    LP_STAT_SATELLITE: { en: "Satellite: Active", si: "සැටලයිට්: සක්‍රීයයි" },
    LP_STAT_UPLINK: { en: "Uplink: Secure", si: "සම්බන්ධතාවය: විවෘතයි" },

    // Level 9 Specific Nodes/Envs
    L9_NODE_WEB1: { en: "Web Server Alpha", si: "වෙබ් සේවාදායකය ඇල්ෆා" },
    L9_NODE_WEB2: { en: "Web Server Beta", si: "වෙබ් සේවාදායකය බීටා" },
    L9_NODE_DB_SECURE: { en: "Secure DB Cluster", si: "ආරක්ෂිත දත්ත සමුදාය" },
    L9_NODE_CACHE_GLOBAL: { en: "Global Cache", si: "ගෝලීය පූර්වාපේක්ෂකය" },
    L9_NODE_PROXY: { en: "Traffic Proxy", si: "ප්‍රොක්සි සේවාදායකය" },
    L9_NODE_CDN: { en: "CDN Node", si: "CDN නෝඩය" },
    L9_ENV_PUBLIC_NAME: { en: "Public Cloud", si: "පොදු ක්ලවුඩ්" },
    L9_ENV_PRIVATE_NAME: { en: "Private VNET", si: "පෞද්ගලික ජාලය" },
    L9_ENV_ONPREM_NAME: { en: "Local Datacenter", si: "ප්‍රාදේශීය දත්ත මධ්‍යස්ථානය" },
    L9_ENV_EDGE_NAME: { en: "Edge Gateway", si: "එජ් ද්වාරය" },

    // Level 10 Packet Details
    L10_PKT_HTTP: { en: "Web Request", si: "වෙබ් ඉල්ලීම" },
    L10_PKT_SSH: { en: "Remote Login", si: "දුරස්ථ පිවිසුම" },
    L10_PKT_HTTPS: { en: "Secure Sub", si: "ආරක්ෂිත වෙබ් සම්බන්ධතාවය" },
    L10_PKT_MYSQL: { en: "DB Query", si: "දත්ත විමසුම" },
    L10_PKT_DNS: { en: "Name Lookup", si: "නාම සෙවීම" },
    L10_PKT_TROJAN: { en: "Backdoor", si: "අනිෂ්ට මෘදුකාංග" },
    L10_PKT_PROXY: { en: "Traffic Forward", si: "ගමනාගමන යොමු කිරීම" },
    L10_PKT_TELNET: { en: "Insecure Shell", si: "අනාරක්ෂිත ශෙල්" },
    L10_PKT_SMB: { en: "File Share", si: "ගොනු හුවමාරුව" },
    L10_PKT_NTP: { en: "Time Sync", si: "වේලාව සමමුහුර්ත කිරීම" },

    // Level 12 AI Signals
    L12_DATA_PATTERN: { en: "Pattern Detected: 0xAF32", si: "රටාව හඳුනා ගන්නා ලදී: 0xAF32" },
    L12_DATA_STATIC: { en: "Static Interruption: RRRR", si: "ස්ථිතික බාධාව: RRRR" },
    L12_DATA_SYNC: { en: "Neural Sync: Stable", si: "සනායුක සමමුහුර්තකරණය: ස්ථාවරයි" },
    L12_DATA_BINARY: { en: "Binary Cluster: Alpha", si: "ද්වීමය පොකුර: ඇල්ෆා" },
    L12_DATA_RADIATION: { en: "Background Radiation", si: "පසුබිම් විකිරණය" },
    L12_DATA_CORRUPT: { en: "Corrupted Packet: NULL", si: "පළුදු වූ පැකට්ටුව: NULL" },
    L12_DATA_CONSISTENT: { en: "Data Stream: Consistent", si: "දත්ත ප්‍රවාහය: අනුකූලයි" },
    L12_DATA_FRAGMENT: { en: "Unidentified Fragment", si: "හඳුනා නොගත් කොටස" },

    // Level 14 History
    L14_HIST_1969: { en: "ARPANET Protocol (1969)", si: "ARPANET ප්‍රොටෝකෝලය (1969)" },
    L14_HIST_1989: { en: "Creation of WWW (1989)", si: "WWW නිර්මාණය (1989)" },
    L14_HIST_2012: { en: "IPv6 Launch (2012)", si: "IPv6 දියත් කිරීම (2012)" },

    // Level 16 HUD
    L16_HUD_INTEGRITY: { en: "Neural Link Integrity", si: "සනායුක සම්බන්ධතා අඛණ්ඩතාව" },
    L16_HUD_OVERRIDE: { en: "Master Protocol Active // Terminal Security Override Engagement.", si: "ප්‍රධාන ප්‍රොටෝකෝලය ක්‍රියාත්මකයි // ටර්මිනල් ආරක්ෂක පාලනය." },

    // Level 16 Questions (Sampling - I will use a few to demonstrate and then generalize)
    L16_Q1: { en: "Which layer of OSI handles IP routing?", si: "IP රවුටින් භාරව කටයුතු කරන්නේ OSI හි කුමන ස්ථරයද?" },
    L16_Q2: { en: "In Python, what keyword defines a function?", si: "පයිතන් හි ශ්‍රිතයක් (Function) අර්ථ දැක්වීමට භාවිතා කරන වචනය කුමක්ද?" },
    L16_Q3: { en: "Binary 1010 is equal to decimal:", si: "ද්වීමය 1010 දශමය අගයකට හැරවූ විට:" },
    L16_Q4: { en: "Default Port for HTTPS:", si: "HTTPS සඳහා පෙරනිමි තොට (Default Port):" },
    L16_Q5: { en: "What does VPN stand for?", si: "VPN යන්නෙහි සම්පූර්ණ නම:" },
    L16_Q6: { en: "Which CIDR mask represents 255.255.255.192?", si: "255.255.255.192 නියෝජනය කරන CIDR අගය:" },
    L16_Q7: { en: "Standard for secure data transmission in Cloud:", si: "ක්ලවුඩ් හි දත්ත හුවමාරුව සඳහා වන ආරක්ෂක ප්‍රමිතිය:" },
    L16_Q8: { en: "First point of contact for external traffic:", si: "බාහිර ජාල සම්බන්ධතාවයක පළමු සම්බන්ධතා ලක්ෂ්‍යය:" },
    L16_Q9: { en: "What is the Caesar Cipher shift of A to D?", si: "Caesar Cipher මගින් A සිට D දක්වා මාරුව (Shift):" },
    L16_Q10: { en: "Main advantage of Redis Cache:", si: "Redis Cache හි ප්‍රධාන වාසිය:" },
    L16_Q11: { en: "Binary 1111 in Decimal:", si: "ද්වීමය 1111 දශමය අගයකට හැරවූ විට:" },
    L16_Q12: { en: "The most secure Wireless encryption:", si: "වඩාත්ම ආරක්ෂිත රැහැන් රහිත (Wireless) සංකේතන ක්‍රමය:" },
    L16_Q13: { en: "Port used for SSH:", si: "SSH සඳහා භාවිතා කරන තොට (Port):" },
    L16_Q14: { en: "A 4-bit nibble can represent how many values?", si: "බිටු 4කින් සමන්විත nibble එකකින් නියෝජනය කළ හැකි අගයන් ගණන:" },
    L16_Q15: { en: "Protocols used to map IP to MAC:", si: "IP ලිපින MAC ලිපින වලට ගැලපීමට භාවිතා කරන ප්‍රොටෝකෝලය:" }
};
