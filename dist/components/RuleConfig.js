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
require("./RuleConfig.css");
const RuleConfig = () => {
    const [ruleNames, setRuleNames] = (0, react_1.useState)(() => {
        const savedNames = localStorage.getItem('ruleNames');
        return savedNames ? JSON.parse(savedNames) : ['Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5'];
    });
    (0, react_1.useEffect)(() => {
        localStorage.setItem('ruleNames', JSON.stringify(ruleNames));
    }, [ruleNames]);
    const handleRuleNameChange = (index, value) => {
        const newNames = [...ruleNames];
        newNames[index] = value;
        setRuleNames(newNames);
    };
    return (<div className="rule-config-container">
            <h2>Configure Rule Names</h2>
            <div className="rule-config-grid">
                {ruleNames.map((name, index) => (<div key={index} className="rule-input-group">
                        <label htmlFor={`rule-${index + 1}`}>Rule {index + 1}</label>
                        <input id={`rule-${index + 1}`} type="text" value={name} onChange={(e) => handleRuleNameChange(index, e.target.value)} placeholder={`Enter name for Rule ${index + 1}`}/>
                    </div>))}
            </div>
            <p className="help-text">Names will be automatically saved and used in the grid view.</p>
        </div>);
};
exports.default = RuleConfig;
