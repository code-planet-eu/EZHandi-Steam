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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAccountInformation = exports.waitForVerifyUrl = exports.getAccountInformation = void 0;
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const fs = __importStar(require("fs"));
const getAccountInformation = async () => {
    try {
        const url = 'https://beta.ezaltz.com/api/account';
        const response = await (0, request_promise_native_1.default)({
            url,
            method: 'GET',
            json: true,
            headers: {
                'discord-id': discord(),
            },
        });
        return response;
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
exports.getAccountInformation = getAccountInformation;
const waitForVerifyUrl = async (email) => {
    try {
        const url = 'https://beta.ezaltz.com/api/mail';
        const response = await (0, request_promise_native_1.default)({
            url,
            method: 'GET',
            json: true,
            headers: {
                'discord-id': discord(),
            },
            qs: {
                mail: email,
            },
        });
        if (!response)
            throw new Error('Email not found');
        return response;
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
exports.waitForVerifyUrl = waitForVerifyUrl;
const saveAccountInformation = async (accountInformation) => {
    try {
        const url = 'https://beta.ezaltz.com/api/account';
        const response = await (0, request_promise_native_1.default)({
            url,
            method: 'POST',
            json: true,
            headers: {
                'discord-id': discord(),
            },
            body: accountInformation,
        });
        if (!response)
            throw new Error('Error saving account information');
        return response;
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
exports.saveAccountInformation = saveAccountInformation;
const discord = () => {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
    if (!config.discordId)
        throw new Error('Please setup the config.json file first.');
    return config.discordId;
};
