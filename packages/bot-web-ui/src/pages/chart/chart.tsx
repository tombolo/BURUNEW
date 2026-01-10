import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { localize } from '@deriv/translations';
import ToolbarWidgets from './toolbar-widgets';
import { ChartTitle, SmartChart } from './v1';
import './chart.scss';

const Chart = observer(({ show_digits_stats }: { show_digits_stats: boolean }) => {
    const barriers: [] = [];
    const { common, ui } = useStore();
    const { chart_store, run_panel, dashboard } = useDBotStore();
    const [isTradingViewActive, setIsTradingViewActive] = React.useState(false);

    const {
        chart_type,
        getMarketsOrder,
        granularity,
        onSymbolChange,
        setChartStatus,
        symbol,
        updateChartType,
        updateGranularity,
        wsForget,
        wsForgetStream,
        wsSendRequest,
        wsSubscribe,
    } = chart_store;
    const {
        ui: { is_desktop, is_mobile },
    } = useStore();
    const { is_drawer_open } = run_panel;
    const { is_chart_modal_visible } = dashboard;
    const is_socket_opened = common.is_socket_opened;
    const settings = {
        assetInformation: false, // ui.is_chart_asset_info_visible,
        countdown: true,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: common.current_language.toLowerCase(),
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    };

    const toggleTradingView = () => {
        setIsTradingViewActive(!isTradingViewActive);
    };

    const TopWidgetsWithToggle = () => (
        <div className="chart__top-widgets-wrapper">
            {/* @ts-ignore - ChartTitle is from external library without proper types */}
            <ChartTitle onChange={onSymbolChange} />
            <button
                className="chart__trading-view-toggle"
                onClick={toggleTradingView}
                type="button"
            >
                {isTradingViewActive ? localize('Charts') : localize('Trading View')}
            </button>
        </div>
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SmartChartComponent = SmartChart as any;

    const smartChartProps = {
        id: 'dbot',
        barriers: barriers,
        showLastDigitStats: show_digits_stats,
        chartControlsWidgets: null,
        enabledChartFooter: false,
        chartStatusListener: (v: boolean) => setChartStatus(!v),
        toolbarWidget: () => (
            <ToolbarWidgets
                updateChartType={updateChartType}
                updateGranularity={updateGranularity}
                position={is_desktop ? null : 'bottom'}
            />
        ),
        chartType: chart_type,
        isMobile: is_mobile,
        enabledNavigationWidget: is_desktop,
        granularity: granularity,
        requestAPI: wsSendRequest,
        requestForget: wsForget,
        requestForgetStream: wsForgetStream,
        requestSubscribe: wsSubscribe,
        settings: settings,
        symbol: symbol,
        topWidgets: () => <TopWidgetsWithToggle />,
        isConnectionOpened: is_socket_opened,
        getMarketsOrder: getMarketsOrder,
        isLive: true,
        leftMargin: 80,
    };

    return (
        <div
            className={classNames('dashboard__chart-wrapper', {
                'dashboard__chart-wrapper--expanded': is_drawer_open && is_desktop,
                'dashboard__chart-wrapper--modal': is_chart_modal_visible && is_desktop,
            })}
            dir='ltr'
        >
            {isTradingViewActive ? (
                <div className="chart__trading-view-container">
                    <button
                        className="chart__trading-view-toggle chart__trading-view-toggle--absolute"
                        onClick={toggleTradingView}
                        type="button"
                    >
                        {localize('Charts')}
                    </button>
                    <iframe
                        id="trading-view-iframe"
                        src="https://charts.deriv.com/deriv"
                        className="chart__trading-view-iframe"
                        title="TradingView Chart"
                        allow="fullscreen"
                    />
                </div>
            ) : (
                <SmartChartComponent {...smartChartProps} />
            )}
        </div>
    );
});

export default Chart;
