import React, { useState, useEffect } from 'react';
import './RuleConfig.css';

const RuleConfig: React.FC = () => {
    const [ruleNames, setRuleNames] = useState<string[]>(() => {
        const savedNames = localStorage.getItem('ruleNames');
        return savedNames ? JSON.parse(savedNames) : ['Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5'];
    });

    useEffect(() => {
        localStorage.setItem('ruleNames', JSON.stringify(ruleNames));
    }, [ruleNames]);

    const handleRuleNameChange = (index: number, value: string) => {
        const newNames = [...ruleNames];
        newNames[index] = value;
        setRuleNames(newNames);
    };

    return (
        <div className="rule-config-container">
            <h2>Configure Rule Names</h2>
            <div className="rule-config-grid">
                {ruleNames.map((name, index) => (
                    <div key={index} className="rule-input-group">
                        <label htmlFor={`rule-${index + 1}`}>Rule {index + 1}</label>
                        <input
                            id={`rule-${index + 1}`}
                            type="text"
                            value={name}
                            onChange={(e) => handleRuleNameChange(index, e.target.value)}
                            placeholder={`Enter name for Rule ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
            <p className="help-text">Names will be automatically saved and used in the grid view.</p>
        </div>
    );
};

export default RuleConfig; 