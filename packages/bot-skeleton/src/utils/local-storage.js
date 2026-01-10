import LZString from 'lz-string';
import localForage from 'localforage';
import DBotStore from '../scratch/dbot-store';
import { save_types } from '../constants/save-type';

// Import bots from master folder
import DerivWizard from './master/Derivwizard.xml';
import MasterG8ByStateFX from './master/MasterG8ByStateFx.xml';
import MetroV4EvenOddBot from './master/Metrov4EvenandOddDigitBotUpdated.xml';
import StateHNR from './master/STATEHNR.xml';
import StateXV1 from './master/STATEXV1.xml';
import BRAMSPEEDBOT from './buru/BRAMSPEEDBOT.xml';
import EvenOddAutoSwitcher from './buru/EvenOddAutoSwitcher.xml';
import VxAutoSwitcher from './buru/Vx.xml';
import EvenOddSmoothKiller from './mentor/EVEN&ODDsmoothKILLER.xml';
import MoneyGramV2 from './mentor/MoneyGRAMV2XRAYAUTO.xml';
import MoneyGramV1 from './mentor/MoneyGramV1AUTO.xml';
import PipspeedTrader from './mentor/PipspeedDollarOVERTRADER.xml';
import RiseFallBot from './mentor/RiseandfallBOT.xml';
import EvenOddTrendBot from './muley/EvenOddTrendBot.xml';
import OverUnderSwitcherBot from './muley/OverUnderSwitcherBot.xml';
import RiseFallswitcherBot from './muley/RiseFallswitcherBot.xml';
import STATESDigitSwitcher from './muley/STATESDigitSwitcher.xml.xml';
import PercentageEvenOddBot from './muley/percentageEvenOddBot.xml';
import Dollarflipper from './buru/Dollarflipper.xml'
import Dollarminer from './buru/Dollarminer.xml'


// Ensure Blockly is available globally
const getBlockly = () => {
    if (typeof window !== 'undefined' && window.Blockly) {
        return window.Blockly;
    }
    throw new Error('Blockly not available - workspace not initialized');
};

// Static bot configurations - Master bots
const STATIC_BOTS = {
    /*
    even_odd_killer: {
        id: 'even_odd_killer',
        name: 'Even & Odd Smooth Killer',
        xml: EvenOddSmoothKiller,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    money_gram_v2: {
        id: 'money_gram_v2',
        name: 'Money Gram V2 XRAY Auto',
        xml: MoneyGramV2,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    money_gram_v1: {
        id: 'money_gram_v1',
        name: 'Money Gram V1 Auto',
        xml: MoneyGramV1,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    pipspeed_trader: {
        id: 'pipspeed_trader',
        name: 'Pipspeed Dollar Overtrader',
        xml: PipspeedTrader,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    rise_fall_bot: {
        id: 'rise_fall_bot',
        name: 'Rise and Fall Bot',
        xml: RiseFallBot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    */
    vx_auto_switcher: {
        id: 'vx_auto_switcher',
        name: 'Finest Entrypoint V1',
        xml: VxAutoSwitcher,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    Dollarflipper: {
        id: 'Dollarflipper',
        name: 'Dollar flipper',
        xml: Dollarflipper,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    Dollarminer: {
        id: 'Dollarminer',
        name: 'Dollar miner',
        xml: Dollarminer,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    deriv_wizard: {
        id: 'deriv_wizard',
        name: 'Deriv Wizard',
        xml: DerivWizard,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    master_g8: {
        id: 'master_g8',
        name: 'V3',
        xml: MasterG8ByStateFX,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    metro_v4: {
        id: 'metro_v4',
        name: 'Metro V4 Even Odd Bot',
        xml: MetroV4EvenOddBot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    state_hnr: {
        id: 'state_hnr',
        name: 'Begginer Bot',
        xml: StateHNR,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    state_xv1: {
        id: 'state_xv1',
        name: 'Finest Entrypoint V2',
        xml: StateXV1,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    bram_speed_bot: {
        id: 'bram_speed_bot',
        name: 'Finest Speed Bot',
        xml: BRAMSPEEDBOT,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    even_odd_auto_switcher: {
        id: 'even_odd_auto_switcher',
        name: 'Even Odd Auto Switcher',
        xml: EvenOddAutoSwitcher,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    even_odd_trend_bot: {
        id: 'even_odd_trend_bot',
        name: 'Even Odd Trend Bot',
        xml: EvenOddTrendBot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    over_under_switcher_bot: {
        id: 'over_under_switcher_bot',
        name: 'Over Under Switcher Bot',
        xml: OverUnderSwitcherBot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    rise_fall_switcher_bot: {
        id: 'rise_fall_switcher_bot',
        name: 'Rise Fall Switcher Bot',
        xml: RiseFallswitcherBot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    states_digit_switcher: {
        id: 'states_digit_switcher',
        name: 'Finest Digit Switcher',
        xml: STATESDigitSwitcher,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    },
    percentage_even_odd_bot: {
        id: 'percentage_even_odd_bot',
        name: 'Percentage Even Odd Bot',
        xml: PercentageEvenOddBot,
        timestamp: Date.now(),
        save_type: save_types.LOCAL,
    }
};

const getStaticBots = () => Object.values(STATIC_BOTS);

/**
 * 🔒 Disable saving bots
 */
export const saveWorkspaceToRecent = async () => {
    console.warn('[INFO] Saving disabled → Using static bots only.');
    const {
        load_modal: { updateListStrategies },
    } = DBotStore.instance;
    updateListStrategies(getStaticBots());
};

/**
 * ✅ Always return static bots
 */
export const getSavedWorkspaces = async () => {
    const bots = getStaticBots();
    console.log(
        '[DEBUG] Available static bots:',
        bots.map(bot => bot.id)
    );
    return bots;
};

/**
 * Load a bot by ID (from static list only)
 */
export const loadStrategy = async strategy_id => {
    console.log(`[DEBUG] Attempting to load bot: ${strategy_id}`);

    // Check for duplicate IDs
    const staticBots = getStaticBots();
    const duplicateIds = staticBots.filter((bot, index) => staticBots.findIndex(b => b.id === bot.id) !== index);

    if (duplicateIds.length > 0) {
        console.error(
            '[ERROR] Duplicate bot IDs found:',
            duplicateIds.map(b => b.id)
        );
    }

    const strategy = staticBots.find(bot => bot.id === strategy_id);

    if (!strategy) {
        console.error(
            `[ERROR] Bot with id "${strategy_id}" not found. Available bots:`,
            staticBots.map(b => b.id)
        );
        return false;
    }

    try {
        // Check if workspace is initialized
        if (!Blockly.derivWorkspace) {
            console.error('[ERROR] Blockly workspace not initialized');
            return false;
        }

        // Clear existing workspace first
        console.log('[DEBUG] Clearing existing workspace');
        Blockly.derivWorkspace.clear();

        const parser = new DOMParser();
        const xmlDom = parser.parseFromString(strategy.xml, 'text/xml').documentElement;

        // Check if XML is valid
        if (xmlDom.querySelector('parsererror')) {
            console.error('[ERROR] Invalid XML content for bot:', strategy_id);
            return false;
        }

        const convertedXml = convertStrategyToIsDbot(xmlDom);

        Blockly.Xml.domToWorkspace(convertedXml, Blockly.derivWorkspace);
        Blockly.derivWorkspace.current_strategy_id = strategy_id;

        console.log(`[SUCCESS] Loaded static bot: ${strategy.name} (ID: ${strategy_id})`);
        return true;
    } catch (error) {
        console.error('Error loading static bot:', error);
        return false;
    }
};

/**
 * 🔒 Disable removing bots
 */
export const removeExistingWorkspace = async () => {
    console.warn('[INFO] Remove disabled → Static bots only.');
    return false;
};

/**
 * Ensure xml has `is_dbot` flag
 */
export const convertStrategyToIsDbot = xml_dom => {
    if (!xml_dom) return;
    xml_dom.setAttribute('is_dbot', 'true');
    return xml_dom;
};

// 🧹 Clear storage & recents at startup
localStorage.removeItem('saved_workspaces');
localStorage.removeItem('recent_strategies');
console.log('[INFO] Cleared saved/recent bots → Static bots only.');