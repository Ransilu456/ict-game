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

    // Level 2: Python
    L2_TITLE: { en: "MISSION: CODE REPAIR", si: "මෙහෙයුම: කේත දෝෂ නිවැරදි කිරීම" },
    L2_DESC: { en: "WARNING: Security breach detected! Identify and patch Python syntax errors before the mainframe is compromised.", si: "අවවාදයයි: ආරක්ෂක දෝෂ සහිතයි! දත්ත සොරකම් කිරීමට පෙර Python කේත දෝෂ නිවැරදි කරන්න." },
    L2_TASK_PREFIX: { en: "TASK: ", si: "කාර්යය: " },
    L2_BTN_RUN: { en: "EXECUTE SCRIPT", si: "ධාවනය කරන්න" },

    // Level 3: Networking
    L3_TITLE: { en: "MISSION: OSI STACK", si: "මෙහෙයුම: OSI ආකෘතිය" },
    L3_DESC: { en: "Arrange the 7 Layers of the OSI Model in the correct order (Physical to Application).", si: "OSI ආකෘතියේ ස්ථර 7 නිවැරදි අනුපිළිවෙලට සකසන්න." },
    L3_LAYER_7: { en: "7. Application", si: "7. යෙදුම් (Application)" },
    L3_LAYER_6: { en: "6. Presentation", si: "6. ඉදිරිපත් කිරීමේ (Presentation)" },
    L3_LAYER_5: { en: "5. Session", si: "5. සැසි (Session)" },
    L3_LAYER_4: { en: "4. Transport", si: "4. ප්‍රවාහන (Transport)" },
    L3_LAYER_3: { en: "3. Network", si: "3. ජාල (Network)" },
    L3_LAYER_2: { en: "2. Data Link", si: "2. දත්ත සබැඳි (Data Link)" },
    L3_LAYER_1: { en: "1. Physical", si: "1. භෞතික (Physical)" },
    L3_PROTO_TITLE: { en: "PHASE 2: PROTOCOLS", si: "අදියර 2: ප්‍රොටෝකෝල" },
    L3_PROTO_DESC: { en: "Match the protocols to their correct OSI Layer.", si: "ප්‍රොටෝකෝල ඒවාට අදාළ OSI ස්ථරයට ගැලපෙන්න." },

    // Level 4: Logic Gates
    L4_TITLE: { en: "MISSION: CIRCUIT LOGIC", si: "මෙහෙයුම: තර්ක ද්වාර (Logic Gates)" },
    L4_DESC: { en: "Configure the inputs to activate the final output.", si: "ප්‍රතිදානය සක්‍රීය කිරීම සඳහා ආදාන නිවැරදිව සකසන්න." },
    L4_GATE_AND: { en: "AND GATE", si: "AND ද්වාරය" },
    L4_GATE_OR: { en: "OR GATE", si: "OR ද්වාරය" },
    L4_GATE_NOT: { en: "NOT GATE", si: "NOT ද්වාරය" },
    L4_GATE_XOR: { en: "XOR GATE", si: "XOR ද්වාරය" },
    L4_GATE_COMBO: { en: "COMBO LOGIC", si: "මිශ්‍ර තර්ක" },
    L4_BTN_CHECK: { en: "VERIFY CIRCUIT", si: "පරීක්ෂා කරන්න" },

    // Level 5: Binary
    L5_TITLE: { en: "MISSION: BINARY TRANSLATION", si: "මෙහෙයුම: ද්වීමය පරිවර්තනය" },
    L5_DESC: { en: "INTENSE: Decrypt high-capacity 12-bit sequences to maintain neural synchronization.", si: "දැඩි පීඩනය: 12-බිටු දත්ත පේළි කේතනය කර පද්ධතිය සමතුලිත කරන්න." },
    L5_TARGET_LBL: { en: "TARGET DECIMAL:", si: "ඉලක්කගත දශම අංකය:" },
    L5_CURRENT_LBL: { en: "CURRENT VALUE:", si: "වත්මන් අගය:" },
    L5_BTN_CHECK: { en: "VERIFY SYSTEM", si: "පද්ධතිය පරීක්ෂා කරන්න" },

    // Level 6: MCQ
    L6_TITLE: { en: "MISSION: FINAL EXAM", si: "මෙහෙයුම: අවසාන පරීක්ෂණය" },
    L6_DESC: { en: "Prove your mastery. Answer all questions correctly to secure the network.", si: "ඔබේ දැනුම තහවුරු කරන්න. ජාලය ආරක්ෂා කිරීමට සියලු ප්‍රශ්නවලට නිවැරදිව පිළිතුරු දෙන්න." },
    L6_Q_PREFIX: { en: "QUESTION", si: "ප්‍රශ්නය" },
    L6_BTN_NEXT: { en: "CONFIRM ANSWER", si: "පිළිතුර තහවුරු කරන්න" },

    // Level 7: Cryptography
    L7_TITLE: { en: "MISSION: DECRYPTION", si: "මෙහෙයුම: රහස් කේත අගුළු හැරීම" },
    L7_DESC: { en: "Decrypt the message using the Caesar Cipher shift.", si: "Caesar Cipher ක්‍රමය භාවිතයෙන් පණිවිඩය කියවන්න." },
    L7_BTN_DECRYPT: { en: "DECRYPT", si: "විශේධනය කරන්න" },
    L7_HINT_TITLE: { en: "HOW TO PLAY", si: "ක්‍රීඩා කරන ආකාරය" },
    L7_HINT_BODY: { en: "1. The 'Intercepted Data' is scrambled.\n2. Use the slider to shift letters back (e.g. A->B is Shift 1).\n3. Find the key where the text makes sense.\n4. Click Decrypt.", si: "1. දත්ත වෙනස් කර ඇත.\n2. ස්ලයිඩරය භාවිතයෙන් අකුරු මාරු කරන්න.\n3. අර්ථවත් වචනයක් ලැබෙන පරිදි සකසන්න.\n4. විශේධනය ක්ලික් කරන්න." },

    // Level 8: SQL
    L8_TITLE: { en: "MISSION: DATABASE QUERY", si: "මෙහෙයුම: දත්ත සමුදාය" },
    L8_DESC: { en: "Construct the correct SQL query to retrieve data.", si: "දත්ත ලබා ගැනීම සඳහා නිවැරදි SQL විධානය සකසන්න." },
    L8_BTN_RUN: { en: "RUN QUERY", si: "විධානය ක්‍රියාත්මක කරන්න" },

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

    // Sidebar & Menus
    BTN_MISSIONS: { en: "Select Mission", si: "මෙහෙයුම් තෝරන්න" },
    BTN_RESET: { en: "Reset Progress", si: "මුල සිට අරඹන්න" },
    BTN_UNLOCK: { en: "Unlock All (Debug)", si: "සියල්ල විවෘත කරන්න (Debug)" },
    MENU_TITLE_SELECT: { en: "CAMPAIGN MAP", si: "මෙහෙයුම් සිතියම" },
    MENU_TITLE_PROFILE: { en: "PROFILE / LOGIN", si: "ගිණුම / පිවිසුම" },
    LBL_LOCKED: { en: "LOCKED", si: "අගුළු දමා ඇත" },
    MSG_RESET_CONFIRM: { en: "Are you sure? All progress will be lost.", si: "ඔබට විශ්වාසද? සියලුම දත්ත මැකී යනු ඇත." },

    // Sidebar Labels
    SB_ID: { en: "ID", si: "අංකය" },
    SB_XP: { en: "XP", si: "XP" },
    SB_SCORE: { en: "Score", si: "ලකුණු" }
};
