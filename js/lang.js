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
    L1_MSG_ERR_BODY: { en: "Hardware mismatch! Item cannot fit into this slot.", si: "මෙම උපාංගය මෙම ස්ලොට් එකට ගැලපෙන්නේ නැත." }
};
