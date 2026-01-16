import React from 'react';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { TRecentStrategy } from './types';
import './recent-workspace.scss';
import { loadStrategy } from '../../../../../bot-skeleton/src/utils/local-storage';

const BOT_EMOJIS = ['🤖', '👾', '🦾', '🧠', '⚡', '💻', '🔮', '🎮'];
const BOT_DESCRIPTIONS = [
    "Uses moving averages to identify trends and enter trades on crossovers.",
    "Volatility-based bot with Bollinger Bands for entry points and position sizing.",
    "Mean-reversion strategy that trades when prices deviate from averages.",
    "Breakout strategy with volume confirmation for support/resistance levels.",
    "Scalping bot targeting small profits with tight stop losses.",
    "Momentum-based bot following trends with RSI for overbought conditions.",
    "Grid bot placing orders at fixed intervals for market oscillations.",
    "News-based bot reacting to economic events using sentiment analysis."
];

const RecentWorkspace = observer(({ workspace, index }: { workspace: TRecentStrategy, index: number }) => {
    const { dashboard } = useDBotStore();
    const strategyIdRef = React.useRef(workspace.id);
    const strategyNameRef = React.useRef(workspace.name || 'Untitled Bot');
    const perfPercent = React.useMemo(() => {
        const base = String(strategyIdRef.current || strategyNameRef.current);
        let h = 0;
        for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0;
        return 90 + (h % 10); // Performance between 90-99%
    }, []);

    const handleClick = async () => {
        console.log(`[CLICK] Loading bot: ${strategyIdRef.current}, Name: ${strategyNameRef.current}`);
        try {
            // Ensure Bot Builder tab is active so Blockly can mount and initialize the workspace
            dashboard.setActiveTab(1);

            // Wait for Blockly workspace to be ready (poll up to ~5s)
            const waitForWorkspace = () =>
                new Promise<boolean>(resolve => {
                    const start = Date.now();
                    const interval = setInterval(() => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const Blockly: any = (window as unknown as { Blockly?: unknown }).Blockly;
                        const ready = !!(Blockly && (Blockly as any).derivWorkspace);
                        if (ready) {
                            clearInterval(interval);
                            resolve(true);
                        } else if (Date.now() - start > 5000) {
                            clearInterval(interval);
                            resolve(false);
                        }
                    }, 100);
                });

            const workspace_ready = await waitForWorkspace();
            if (!workspace_ready) {
                console.error('[ERROR] Blockly workspace not initialized in time');
                return;
            }

            const success = await loadStrategy(strategyIdRef.current);
            if (success) {
                console.log(`[SUCCESS] Bot loaded successfully: ${strategyNameRef.current}`);
            } else {
                console.error(`[ERROR] Failed to load bot: ${strategyNameRef.current}`);
            }
        } catch (error) {
            console.error(`[ERROR] Exception while loading bot: ${strategyNameRef.current}`, error);
        }
    };

    const randomEmoji = BOT_EMOJIS[index % BOT_EMOJIS.length];
    
    // Generate star rating based on bot name (1-5 stars)
    const starRating = React.useMemo(() => {
        const base = String(strategyIdRef.current || strategyNameRef.current);
        let h = 0;
        for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0;
        return 3 + Math.floor((h % 300) / 100); // Rating between 3-5 stars
    }, []);

    return (
        <div className="dbot-workspace-card" data-bot-id={workspace.id}>
            {/* Premium ribbon */}
            <div className="dbot-workspace-card__premium-badge">PREMIUM</div>
            
            {/* Content */}
            <div className="dbot-workspace-card__top">
                <div className="dbot-workspace-card__emoji">{randomEmoji}</div>
                <div className="dbot-workspace-card__info">
                    <div className="dbot-workspace-card__name">
                        {strategyNameRef.current}
                    </div>
                    <div className="dbot-workspace-card__rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span
                                key={i}
                                className={`dbot-workspace-card__star ${i < starRating ? 'dbot-workspace-card__star--filled' : ''}`}
                            >
                                ★
                            </span>
                        ))}
                        <span className="dbot-workspace-card__rating-text">{starRating}.0</span>
                    </div>
                    <div className="dbot-workspace-card__metrics">
                        <div className="dbot-workspace-card__meter">
                            <div
                                className="dbot-workspace-card__meter-fill"
                                style={{ width: `${perfPercent}%` }}
                            />
                        </div>
                        <div className="dbot-workspace-card__percent">{perfPercent}%</div>
                    </div>
                </div>
            </div>
            
            {/* Load Button at Bottom */}
            <button 
                className="dbot-workspace-card__action" 
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
            >
                <span>Load Bot</span>
                <div className="dbot-workspace-card__arrow">→</div>
            </button>
        </div>
    );
});

export default RecentWorkspace;
