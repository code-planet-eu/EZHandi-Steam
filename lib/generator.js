"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const playwright_extra_1 = require("playwright-extra");
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const consola_1 = __importDefault(require("consola"));
const helper_1 = require("./helper");
const init = async () => {
    const accountInformation = await (0, helper_1.getAccountInformation)();
    const pathToExtension = path_1.default.join(__dirname, './../extension');
    const config = JSON.parse(fs_1.default.readFileSync('./config.json', 'utf-8'));
    const galaxy = playwright_extra_1.devices['Galaxy S5'];
    const extensionArgs = [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
    ];
    const defaultArgs = ['--no-sandbox', '--disable-setuid-sandbox'];
    const args = config.useCapsolver ? extensionArgs : defaultArgs;
    const proxySettings = {
        server: config.proxy.server,
        username: config.proxy.username,
        password: config.proxy.password,
    };
    const proxy = config.proxy.enabled ? proxySettings : undefined;
    playwright_extra_1.chromium.use((0, puppeteer_extra_plugin_stealth_1.default)());
    const browser = await playwright_extra_1.chromium.launchPersistentContext('./browser', {
        headless: false,
        slowMo: 75,
        args,
        userAgent: galaxy.userAgent,
        viewport: galaxy.viewport,
        proxy,
    });
    const page = await browser.newPage();
    consola_1.default.info('Opening Steam join page...');
    await page.goto('https://store.steampowered.com/join/');
    page.on('response', async (response) => {
        if (response.url().includes('ajaxverifyemail')) {
            const responseBody = await response.json();
            const { success, details } = responseBody;
            if (success !== 1) {
                consola_1.default.error(details);
                browser.close();
                process.exit(1);
            }
        }
    });
    if (!accountInformation)
        throw new Error('Account information not found');
    await page.waitForResponse((response) => response.url().includes('enterprise/bframe'), { timeout: 60000 });
    const iframe = page.frames().find((frame) => frame.url().includes('enterprise/anchor'));
    if (!iframe)
        throw new Error('Iframe not found');
    consola_1.default.info('Solving captcha...');
    if (!config.useCapsolver) {
        await iframe.click('#recaptcha-anchor');
        consola_1.default.box('Please solve the captcha');
    }
    await iframe.waitForSelector('#recaptcha-anchor[aria-checked="true"]', { timeout: 100000 });
    consola_1.default.success('Captcha solved');
    const email = page.locator('#email');
    const reenterEmail = page.locator('#reenter_email');
    consola_1.default.info('Entering email (#email');
    await email.pressSequentially(accountInformation.email);
    consola_1.default.info('Entering email (#reenter_email');
    await reenterEmail.pressSequentially(accountInformation.email);
    consola_1.default.info('Checking "I agree" checkbox');
    await page.check('#i_agree_check');
    consola_1.default.info('Clicking "Create Account" button');
    await page.click('#createAccountButton');
    consola_1.default.info('Checking "I am over 13" checkbox if visible');
    if (await page.isVisible('#overAgeButton'))
        await page.click('#overAgeButton');
    consola_1.default.info('Waiting for verify email page');
    const verifyUrl = await (0, helper_1.waitForVerifyUrl)(accountInformation.email);
    const verifyPage = await browser.newPage();
    consola_1.default.info('Opening verify email page...');
    await verifyPage.goto(verifyUrl.link);
    await verifyPage.waitForLoadState('networkidle');
    await verifyPage.close();
    consola_1.default.info('Waiting for complete signup page');
    await page.waitForURL(/completesignup/, { timeout: 600000 });
    const username = page.locator('#accountname');
    const password = page.locator('#password');
    const reenterPassword = page.locator('#reenter_password');
    consola_1.default.info('Entering username (#accountname)');
    await username.fill(accountInformation.username);
    consola_1.default.info('Entering password (#password)');
    await password.pressSequentially(accountInformation.password);
    consola_1.default.info('Entering password (#reenter_password)');
    await reenterPassword.pressSequentially(accountInformation.password);
    await page.waitForTimeout(1000);
    consola_1.default.info('Clicking "Create Account" button');
    await page.click('#createAccountButton');
    await (0, helper_1.saveAccountInformation)(accountInformation);
    consola_1.default.success('Account created successfully');
    consola_1.default.info('Account information saved to dashboard');
    consola_1.default.success(`Account Url: https://beta.ezaltz.com/accounts/${accountInformation.id}`);
    await browser.close();
};
exports.init = init;
