"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSetup = void 0;
const fs_1 = __importDefault(require("fs"));
const consola_1 = __importDefault(require("consola"));
const checkSetup = () => {
    const config = JSON.parse(fs_1.default.readFileSync('./config.json', 'utf-8'));
    if (config.useCapsolver) {
        const extensionConfig = fs_1.default.readFileSync('./extension/assets/config.js', 'utf-8');
        const newExtensionConfig = extensionConfig.replace(/apiKey: '.*'/g, `apiKey: '${config.capsolverToken}'`);
        fs_1.default.writeFileSync('./extension/assets/config.js', newExtensionConfig);
    }
    if (config.discordId)
        return consola_1.default.info(`Using current config: DiscordId: ${config.discordId}, Use Capsolver: ${config.useCapsolver ? 'Yes' : 'No'}`);
    throw new Error('Please setup the config.json file first.');
};
exports.checkSetup = checkSetup;
