/**
 * Localization Dictionary
 * Keys used in the game for English (en) and Sinhala (si).
 */

export const LANG = {
    // UI General
    BTN_START: { en: "Connect to Server", si: "සම්බන්ධ වන්න" },
    BTN_NEXT: { en: "Next Mission", si: "ඊළඟ මෙහෙයුම" },
    BTN_CLOSE: { en: "Close", si: "වසන්න" },

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

    // Results Screen
    RES_TITLE: { en: "Mission Status", si: "මෙහෙයුමේ තත්වය" },
    RES_SUCCESS: { en: "MISSION ACCOMPLISHED", si: "මෙහෙයුම සාර්ථකයි" },
    RES_FAIL: { en: "MISSION FAILED", si: "මෙහෙයුම අසාර්ථකයි" },
    RES_ACCURACY: { en: "Accuracy", si: "නිරවද්‍යතාවය" },
    RES_TIME_BONUS: { en: "Time Bonus", si: "කාල දීමනාව" },
    RES_TOTAL_XP: { en: "Total XP", si: "මුළු XP" },

    // Level 1: Hardware
    L1_TITLE: { en: "MISSION: ASSEMBLE ARCHITECTURE", si: "මෙහෙයුම: පරිගණක එකලස් කිරීම" },
    L1_DESC: { en: "Drag the hardware components to their correct slots on the motherboard.", si: "දෘඩාංග උපාංග මවු පුවරුවේ ඇති නිවැරදි ස්ථාන වෙත ඇද දමන්න." },
    L1_TRAY_TITLE: { en: "COMPONENTS", si: "උපාංග" },
    L1_ITEM_CPU: { en: "⚡ CPU (Processor)", si: "⚡ CPU (සකසනය)" },
    L1_ITEM_RAM: { en: "💾 RAM (Memory)", si: "💾 RAM (මතකය)" },
    L1_ITEM_GPU: { en: "🎮 GPU (Graphics)", si: "🎮 GPU (ග්‍රැෆික් කාඩ්)" },
    L1_ITEM_SSD: { en: "💿 SSD (Storage)", si: "💿 SSD (ආචයනය)" },

    L1_ZONE_SOCKET: { en: "SOCKET", si: "සොකට් එක" },
    L1_ZONE_DIMM: { en: "DIMM", si: " රැම් ස්ලොට්" }, // Transliterated/Common usage
    L1_ZONE_PCIE: { en: "PCIe X16", si: "PCIe X16" },
    L1_ZONE_SATA: { en: "SATA BAY", si: "SATA තොට" },

    L1_MSG_SUCCESS: { en: "Component installed successfully.", si: "උපාංගය සාර්ථකව සවි කරන ලදී." },
    L1_MSG_ERR_TITLE: { en: "COMPATIBILITY ERROR", si: " නොගැලපෙන උපාංගයකි" },
    L1_MSG_ERR_BODY: { en: "Hardware mismatch! Item cannot fit into this slot.", si: "මෙම උපාංගය මෙම ස්ලොට් එකට ගැලපෙන්නේ නැත." },

    // Level 2: Python
    L2_TITLE: { en: "MISSION: CODE REPAIR", si: "මෙහෙයුම: කේත දෝෂ නිවැරදි කිරීම" },
    L2_DESC: { en: "Identify and fix the syntax errors in the Python security scripts.", si: "Python ආරක්ෂක පද්ධතියේ ඇති දෝෂ හඳුනාගෙන නිවැරදි කරන්න." },
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

    // Level 4: Logic Gates
    L4_TITLE: { en: "MISSION: CIRCUIT LOGIC", si: "මෙහෙයුම: තර්ක ද්වාර (Logic Gates)" },
    L4_DESC: { en: "Configure the inputs to activate the final output.", si: "ප්‍රතිදානය සක්‍රීය කිරීම සඳහා ආදාන නිවැරදිව සකසන්න." },
    L4_GATE_AND: { en: "AND GATE", si: "AND ද්වාරය" },
    L4_GATE_OR: { en: "OR GATE", si: "OR ද්වාරය" },
    L4_GATE_NOT: { en: "NOT GATE", si: "NOT ද්වාරය" },
    L4_BTN_CHECK: { en: "VERIFY CIRCUIT", si: "පරීක්ෂා කරන්න" },

    // Persistence & Menus
    BTN_MISSIONS: { en: "Select Mission", si: "මෙහෙයුම් තෝරන්න" },
    BTN_RESET: { en: "Reset Progress", si: "මුල සිට අරඹන්න" },
    BTN_UNLOCK: { en: "Unlock All (Debug)", si: "සියල්ල විවෘත කරන්න (Debug)" },
    MENU_TITLE_SELECT: { en: "MISSION SELECT", si: "මෙහෙයුම් තේරීම" },
    LBL_LOCKED: { en: "LOCKED", si: "අගුළු දමා ඇත" },
    MSG_RESET_CONFIRM: { en: "Are you sure? All progress will be lost.", si: "ඔබට විශ්වාසද? සියලුම දත්ත මැකී යනු ඇත." }
};
