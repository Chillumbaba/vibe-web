"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
require("./GridStats.css");
const CircularDial = ({ value, label, color }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / 100) * circumference;
    const strokeDasharray = `${progress} ${circumference}`;
    return (<div className="dial-container">
            <svg width="85" height="85" viewBox="0 0 85 85">
                <circle cx="42.5" cy="42.5" r={radius} fill="none" stroke="#e0e0e0" strokeWidth="5"/>
                <circle cx="42.5" cy="42.5" r={radius} fill="none" stroke={color} strokeWidth="5" strokeDasharray={strokeDasharray} strokeDashoffset={circumference * 0.25} transform="rotate(-90 42.5 42.5)"/>
                <text x="42.5" y="42.5" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill={color}>
                    {value}%
                </text>
                <text x="42.5" y="58" textAnchor="middle" fontSize="10" fill="#666">
                    {label}
                </text>
            </svg>
        </div>);
};
const GridStats = () => {
    const [timeWindow, setTimeWindow] = (0, react_1.useState)('all');
    // Get grid data from localStorage
    const getGridData = () => {
        try {
            const savedGrid = localStorage.getItem('gridState');
            return savedGrid ? JSON.parse(savedGrid) : [];
        }
        catch (error) {
            console.error('Error loading grid data:', error);
            return [];
        }
    };
    const filterDataByTimeWindow = (data) => {
        if (timeWindow === 'all')
            return data;
        const now = new Date();
        const cutoffDate = new Date();
        switch (timeWindow) {
            case '1w':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case '1m':
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case '3m':
                cutoffDate.setMonth(now.getMonth() - 3);
                break;
            case '6m':
                cutoffDate.setMonth(now.getMonth() - 6);
                break;
            case '1y':
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
        }
        return data.filter(item => new Date(item.date) >= cutoffDate);
    };
    const gridData = filterDataByTimeWindow(getGridData());
    const ruleNames = JSON.parse(localStorage.getItem('ruleNames') || '["Rule 1", "Rule 2", "Rule 3", "Rule 4", "Rule 5"]');
    // Calculate statistics
    const stats = ruleNames.map((ruleName, index) => {
        const columnData = gridData.map(row => row.values[index]);
        const ticks = columnData.filter(value => value === '✓').length;
        const crosses = columnData.filter(value => value === '✗').length;
        const total = columnData.length;
        const filledEntries = ticks + crosses;
        const completion = (filledEntries / total) * 100;
        const successRate = ticks === 0 ? 0 : (ticks / filledEntries) * 100;
        const crossRate = (crosses / total) * 100;
        return {
            ruleName,
            ticks,
            crosses,
            completion: Math.round(completion),
            successRate: Math.round(successRate),
            crossRate: Math.round(crossRate)
        };
    });
    // Calculate overall statistics
    const overallStats = stats.reduce((acc, stat) => {
        return {
            totalTicks: acc.totalTicks + stat.ticks,
            totalCrosses: acc.totalCrosses + stat.crosses,
            overallCompletion: acc.overallCompletion + stat.completion,
            overallSuccessRate: acc.overallSuccessRate + stat.successRate,
            overallCrossRate: acc.overallCrossRate + stat.crossRate
        };
    }, {
        totalTicks: 0,
        totalCrosses: 0,
        overallCompletion: 0,
        overallSuccessRate: 0,
        overallCrossRate: 0
    });
    // Average the percentages
    overallStats.overallCompletion = Math.round(overallStats.overallCompletion / stats.length);
    overallStats.overallSuccessRate = Math.round(overallStats.overallSuccessRate / stats.length);
    overallStats.overallCrossRate = Math.round(overallStats.overallCrossRate / stats.length);
    const timeWindowLabels = {
        '1w': '1 Week',
        '1m': '1 Month',
        '3m': '3 Months',
        '6m': '6 Months',
        '1y': '1 Year',
        'all': 'All Time'
    };
    return (<div className="grid-stats-container">
            <div className="stats-header">
                <h2>Grid Statistics</h2>
                <div className="time-window-selector">
                    {Object.keys(timeWindowLabels).map((window) => (<button key={window} className={`time-window-button ${timeWindow === window ? 'active' : ''}`} onClick={() => setTimeWindow(window)}>
                            {timeWindowLabels[window]}
                        </button>))}
                </div>
            </div>

            {/* Overall Summary Card */}
            <div className="overall-summary-card">
                <h3>Overall Performance</h3>
                <div className="dials-container">
                    <CircularDial value={overallStats.overallCompletion} label="Completion" color="#2196f3"/>
                    <CircularDial value={overallStats.overallSuccessRate} label="Success" color="#4caf50"/>
                    <CircularDial value={overallStats.overallCrossRate} label="Cross" color="#f44336"/>
                </div>
                <div className="overall-counts">
                    <div className="stat-count">
                        <span className="tick-mark">✓</span> {overallStats.totalTicks}
                    </div>
                    <div className="stat-count">
                        <span className="cross-mark">✗</span> {overallStats.totalCrosses}
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (<div key={index} className="stat-card">
                        <h3>{stat.ruleName}</h3>
                        <div className="dials-container">
                            <CircularDial value={stat.completion} label="Completion" color="#2196f3"/>
                            <CircularDial value={stat.successRate} label="Success" color="#4caf50"/>
                            <CircularDial value={stat.crossRate} label="Cross" color="#f44336"/>
                        </div>
                        <div className="stat-counts">
                            <div className="stat-count">
                                <span className="tick-mark">✓</span> {stat.ticks}
                            </div>
                            <div className="stat-count">
                                <span className="cross-mark">✗</span> {stat.crosses}
                            </div>
                        </div>
                    </div>))}
            </div>
        </div>);
};
exports.default = GridStats;
