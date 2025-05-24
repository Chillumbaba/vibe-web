import React, { useState } from 'react';
import './GridStats.css';

interface GridData {
    date: string;
    values: string[];
}

interface StatData {
    ruleName: string;
    ticks: number;
    crosses: number;
    completion: number;
    successRate: number;
    crossRate: number;
}

interface OverallStats {
    totalTicks: number;
    totalCrosses: number;
    overallCompletion: number;
    overallSuccessRate: number;
    overallCrossRate: number;
}

type TimeWindow = '1w' | '1m' | '3m' | '6m' | '1y' | 'all';

const CircularDial: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / 100) * circumference;
    const strokeDasharray = `${progress} ${circumference}`;

    return (
        <div className="dial-container">
            <svg width="85" height="85" viewBox="0 0 85 85">
                <circle
                    cx="42.5"
                    cy="42.5"
                    r={radius}
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="5"
                />
                <circle
                    cx="42.5"
                    cy="42.5"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="5"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={circumference * 0.25}
                    transform="rotate(-90 42.5 42.5)"
                />
                <text
                    x="42.5"
                    y="42.5"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="16"
                    fontWeight="bold"
                    fill={color}
                >
                    {value}%
                </text>
                <text
                    x="42.5"
                    y="58"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#666"
                >
                    {label}
                </text>
            </svg>
        </div>
    );
};

const GridStats: React.FC = () => {
    const [timeWindow, setTimeWindow] = useState<TimeWindow>('all');

    // Get grid data from localStorage
    const getGridData = (): GridData[] => {
        try {
            const savedGrid = localStorage.getItem('gridState');
            return savedGrid ? JSON.parse(savedGrid) : [];
        } catch (error) {
            console.error('Error loading grid data:', error);
            return [];
        }
    };

    const filterDataByTimeWindow = (data: GridData[]): GridData[] => {
        if (timeWindow === 'all') return data;

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
    const stats: StatData[] = ruleNames.map((ruleName: string, index: number) => {
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
    const overallStats: OverallStats = stats.reduce((acc, stat) => {
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

    const timeWindowLabels: Record<TimeWindow, string> = {
        '1w': '1 Week',
        '1m': '1 Month',
        '3m': '3 Months',
        '6m': '6 Months',
        '1y': '1 Year',
        'all': 'All Time'
    };

    return (
        <div className="grid-stats-container">
            <div className="stats-header">
                <h2>Grid Statistics</h2>
                <div className="time-window-selector">
                    {(Object.keys(timeWindowLabels) as TimeWindow[]).map((window) => (
                        <button
                            key={window}
                            className={`time-window-button ${timeWindow === window ? 'active' : ''}`}
                            onClick={() => setTimeWindow(window)}
                        >
                            {timeWindowLabels[window]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overall Summary Card */}
            <div className="overall-summary-card">
                <h3>Overall Performance</h3>
                <div className="dials-container">
                    <CircularDial value={overallStats.overallCompletion} label="Completion" color="#2196f3" />
                    <CircularDial value={overallStats.overallSuccessRate} label="Success" color="#4caf50" />
                    <CircularDial value={overallStats.overallCrossRate} label="Cross" color="#f44336" />
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
                {stats.map((stat: StatData, index: number) => (
                    <div key={index} className="stat-card">
                        <h3>{stat.ruleName}</h3>
                        <div className="dials-container">
                            <CircularDial value={stat.completion} label="Completion" color="#2196f3" />
                            <CircularDial value={stat.successRate} label="Success" color="#4caf50" />
                            <CircularDial value={stat.crossRate} label="Cross" color="#f44336" />
                        </div>
                        <div className="stat-counts">
                            <div className="stat-count">
                                <span className="tick-mark">✓</span> {stat.ticks}
                            </div>
                            <div className="stat-count">
                                <span className="cross-mark">✗</span> {stat.crosses}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GridStats; 