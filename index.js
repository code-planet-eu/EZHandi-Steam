"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consola_1 = __importDefault(require("consola"));
const gradient_string_1 = __importDefault(require("gradient-string"));
const prompts_1 = require("@inquirer/prompts");
const fs_1 = __importDefault(require("fs"));
const generator_1 = require("./lib/generator");
const config_1 = require("./lib/config");
const logoGradient = (0, gradient_string_1.default)('#55ff99', '#fff');
const logo = logoGradient(`

███████╗███████╗██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗
██╔════╝╚══███╔╝██║  ██║██╔══██╗████╗  ██║██╔══██╗██║
█████╗    ███╔╝ ███████║███████║██╔██╗ ██║██║  ██║██║
██╔══╝   ███╔╝  ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║
███████╗███████╗██║  ██║██║  ██║██║ ╚████║██████╔╝██║
╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝

                           by @spitik - ezaltz.com
                           v. ${process.env.npm_package_version}
`);
console.clear();
console.log(logo);
consola_1.default.info(`Welcome to the ${process.env.npm_package_title} generator!`);
const setup = async () => {
    try {
        (0, config_1.checkSetup)();
        const config = JSON.parse(fs_1.default.readFileSync('./config.json', 'utf-8'));
        if (!config.askForContinue)
            return await (0, generator_1.init)();
        const continueSetup = await (0, prompts_1.confirm)({
            message: 'Do you want to continue?',
        });
        if (!continueSetup)
            throw new Error('Generator cancelled. (If you want update config please edit config.json file)');
        consola_1.default.info('Initializing generator...');
        await (0, generator_1.init)();
    }
    catch (e) {
        consola_1.default.error(e.message);
        process.exit(1);
    }
};
setup();
