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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
require("./App.css");
const RuleGrid_1 = __importDefault(require("./components/RuleGrid"));
const RuleConfig_1 = __importDefault(require("./components/RuleConfig"));
const GridStats_1 = __importDefault(require("./components/GridStats"));
function App() {
    const [currentPage, setCurrentPage] = (0, react_1.useState)('grid');
    const getPageTitle = () => {
        switch (currentPage) {
            case 'grid':
                return 'Rule Tracking Grid';
            case 'config':
                return 'Rule Configuration';
            case 'stats':
                return 'Rule Statistics';
            default:
                return 'Rule Tracking';
        }
    };
    const renderPage = () => {
        switch (currentPage) {
            case 'grid':
                return <RuleGrid_1.default />;
            case 'config':
                return <RuleConfig_1.default />;
            case 'stats':
                return <GridStats_1.default />;
            default:
                return <RuleGrid_1.default />;
        }
    };
    return (<div className="App">
      <nav className="top-nav">
        <div className="nav-menu">
          <button className={`nav-button ${currentPage === 'grid' ? 'active' : ''}`} onClick={() => setCurrentPage('grid')}>
            Grid View
          </button>
          <button className={`nav-button ${currentPage === 'config' ? 'active' : ''}`} onClick={() => setCurrentPage('config')}>
            Configure Rules
          </button>
          <button className={`nav-button ${currentPage === 'stats' ? 'active' : ''}`} onClick={() => setCurrentPage('stats')}>
            Statistics
          </button>
        </div>
      </nav>
      <header className="App-header">
        <h1>{getPageTitle()}</h1>
      </header>
      <main>
        {renderPage()}
      </main>
    </div>);
}
exports.default = App;
