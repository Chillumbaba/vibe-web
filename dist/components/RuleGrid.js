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
require("./RuleGrid.css");
const CommentPopup = ({ onSave, onClose, initialComment = '' }) => {
    const [comment, setComment] = (0, react_1.useState)(initialComment);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(comment);
    };
    return (<div className="comment-popup-overlay" onClick={onClose}>
            <div className="comment-popup" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Why couldn't you complete this task?" autoFocus/>
                    <div className="comment-popup-buttons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>);
};
const RuleGrid = () => {
    // Initialize grid state from localStorage or create empty grid
    const [gridState, setGridState] = (0, react_1.useState)(() => {
        try {
            const savedGrid = localStorage.getItem('gridState');
            if (savedGrid) {
                const parsed = JSON.parse(savedGrid);
                // Add comments field if it doesn't exist in saved data
                return parsed.map((item) => (Object.assign(Object.assign({}, item), { comments: item.comments || {} })));
            }
        }
        catch (error) {
            console.error('Error loading grid state:', error);
        }
        // Create initial grid with dates
        const today = new Date();
        const grid = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            grid.push({
                date: date.toISOString().split('T')[0],
                values: Array(5).fill(''),
                comments: {}
            });
        }
        return grid;
    });
    const [commentPopup, setCommentPopup] = (0, react_1.useState)(null);
    // Initialize rule names from localStorage or use defaults
    const [ruleNames] = (0, react_1.useState)(() => {
        try {
            const savedNames = localStorage.getItem('ruleNames');
            return savedNames ? JSON.parse(savedNames) : [
                'no weekday alcohol except workrelated',
                'no food after 7:30pm',
                'Meditate 30 mins before bed',
                'Morning exercise/yoga',
                'Check actions/next day before the yoga'
            ];
        }
        catch (error) {
            console.error('Error loading rule names:', error);
            return ['Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5'];
        }
    });
    // Save grid state to localStorage whenever it changes
    (0, react_1.useEffect)(() => {
        try {
            localStorage.setItem('gridState', JSON.stringify(gridState));
        }
        catch (error) {
            console.error('Error saving grid state:', error);
        }
    }, [gridState]);
    // Function to format date label
    const getDateLabel = (date, index) => {
        if (index === 0)
            return 'Today';
        if (index === 1)
            return 'Yesterday';
        return new Date(date).toLocaleDateString();
    };
    // Function to handle cell click
    const handleCellClick = (rowIndex, colIndex) => {
        const newGrid = [...gridState];
        const currentValue = newGrid[rowIndex].values[colIndex];
        const commentKey = `${rowIndex}-${colIndex}`;
        if (currentValue === '') {
            newGrid[rowIndex].values[colIndex] = '✓';
        }
        else if (currentValue === '✓') {
            newGrid[rowIndex].values[colIndex] = '✗';
            // Show comment popup when setting a cross
            setCommentPopup({
                show: true,
                rowIndex,
                colIndex,
                initialComment: ''
            });
        }
        else if (currentValue === '✗') {
            // Change back to tick and remove any existing comment
            newGrid[rowIndex].values[colIndex] = '✓';
            delete newGrid[rowIndex].comments[commentKey];
        }
        setGridState(newGrid);
    };
    // Function to handle comment icon click
    const handleCommentIconClick = (e, rowIndex, colIndex) => {
        e.stopPropagation(); // Prevent cell click from triggering
        const comment = gridState[rowIndex].comments[`${rowIndex}-${colIndex}`];
        setCommentPopup({
            show: true,
            rowIndex,
            colIndex,
            initialComment: comment || ''
        });
    };
    // Function to handle comment save
    const handleCommentSave = (comment) => {
        if (commentPopup) {
            const newGrid = [...gridState];
            const { rowIndex, colIndex } = commentPopup;
            if (comment.trim()) {
                newGrid[rowIndex].comments[`${rowIndex}-${colIndex}`] = comment;
            }
            else {
                delete newGrid[rowIndex].comments[`${rowIndex}-${colIndex}`];
            }
            setGridState(newGrid);
            setCommentPopup(null);
        }
    };
    // Function to fill entire row with ticks
    const handleFillRow = (rowIndex) => {
        const newGrid = [...gridState];
        newGrid[rowIndex].values = newGrid[rowIndex].values.map(() => '✓');
        // Remove all comments for the row
        Object.keys(newGrid[rowIndex].comments).forEach(key => {
            if (key.startsWith(`${rowIndex}-`)) {
                delete newGrid[rowIndex].comments[key];
            }
        });
        setGridState(newGrid);
    };
    return (<div className="rule-grid-container">
            <div className="grid">
                <div className="header-row">
                    <div className="label-cell"></div>
                    {ruleNames.map((name, index) => (<div key={index} className="header-cell">
                            {name}
                        </div>))}
                    <div className="action-cell"></div>
                </div>
                {gridState.map((row, rowIndex) => (<div key={rowIndex} className="grid-row">
                        <div className="label-cell">{getDateLabel(row.date, rowIndex)}</div>
                        {row.values.map((cell, colIndex) => {
                const hasComment = cell === '✗' && row.comments[`${rowIndex}-${colIndex}`];
                return (<div key={colIndex} className={`grid-cell${cell === '✗' ? ' cell-cross' : ''}`} onClick={() => handleCellClick(rowIndex, colIndex)}>
                                    {cell}
                                    {cell === '✗' && (<>
                                            <span className="comment-indicator" onClick={(e) => handleCommentIconClick(e, rowIndex, colIndex)}>
                                                📝
                                            </span>
                                            {hasComment && (<div className="hover-comment">
                                                    {row.comments[`${rowIndex}-${colIndex}`]}
                                                </div>)}
                                        </>)}
                                </div>);
            })}
                        <div className="action-cell">
                            <button className="fill-row-button" onClick={() => handleFillRow(rowIndex)} title="Fill row with ticks">
                                ✓
                            </button>
                        </div>
                    </div>))}
            </div>
            {(commentPopup === null || commentPopup === void 0 ? void 0 : commentPopup.show) && (<CommentPopup onSave={handleCommentSave} onClose={() => setCommentPopup(null)} initialComment={commentPopup.initialComment}/>)}
        </div>);
};
exports.default = RuleGrid;
