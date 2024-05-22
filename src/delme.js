const axios = require('axios');
const https = require('https');
const fs = require('fs');
const { ConfigGenerator } = require('../src/config-generator');  // Adjust the path accordingly

jest.mock('axios');
jest.mock('fs');
jest.mock('https');
jest.mock('../src/utils/logger-utils', () => ({
    getInstance: () => ({
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    }),
}));

describe('ConfigGenerator', () => {
    let configGenerator;

    beforeEach(() => {
        configGenerator = new ConfigGenerator();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize axios instance with custom https agent', () => {
        expect(configGenerator.axiosInstance.defaults.httpsAgent).toBeInstanceOf(https.Agent);
        expect(configGenerator.axiosInstance.defaults.httpsAgent.options.rejectUnauthorized).toBe(false);
    });

    describe('generateConfig', () => {
        it('should call generateNPMConfig for NPM build tool', async () => {
            const generateNPMConfigSpy = jest.spyOn(configGenerator, 'generateNPMConfig').mockResolvedValue();
            await configGenerator.generateConfig({}, 'NPM', 'scope');
            expect(generateNPMConfigSpy).toHaveBeenCalledWith({}, 'scope');
        });

        it('should log warning for unknown build tool', async () => {
            const logger = require('../src/utils/logger-utils').getInstance();
            await configGenerator.generateConfig({}, 'UNKNOWN', 'scope');
            expect(logger.warn).toHaveBeenCalledWith("Some text here..");
        });
    });

    describe('generateNPMConfig', () => {
        it('should create .npmrc file and call update functions', async () => {
            fs.open.mockImplementation((path, flags, callback) => callback(null));
            const updateBasicAuthSpy = jest.spyOn(configGenerator, 'updateNPMConfigWithBasicAuthString').mockResolvedValue();
            const updateScopeAuthSpy = jest.spyOn(configGenerator, 'updateNPMConfigWithScopeAuthString').mockResolvedValue();
            const updateProxySettingsSpy = jest.spyOn(configGenerator, 'updateNPMConfigWithProxySettings');

            await configGenerator.generateNPMConfig({ tools_info: { ARTI: {} } }, 'scope1:repo1;scope2:repo2');

            expect(fs.open).toHaveBeenCalledWith('.npmrc', 'w', expect.any(Function));
            expect(updateBasicAuthSpy).toHaveBeenCalledWith({});
            expect(updateScopeAuthSpy).toHaveBeenCalledWith({}, 'scope1:repo1;scope2:repo2');
            expect(updateProxySettingsSpy).toHaveBeenCalledWith({});
        });

        it('should handle file open error gracefully', async () => {
            fs.open.mockImplementation((path, flags, callback) => callback(new Error('Failed to open file')));
            const logger = require('../src/utils/logger-utils').getInstance();
            await configGenerator.generateNPMConfig({ tools_info: { ARTI: {} } }, 'scope');
            expect(logger.error).toHaveBeenCalledWith("Some info here");
        });
    });

    describe('updateNPMConfigWithBasicAuthString', () => {
        it('should update .npmrc with basic auth string', async () => {
            axios.get.mockResolvedValue({
                data: '_auth = existingAuthValue\n'
            });
            fs.appendFile.mockImplementation((path, data, callback) => callback(null));

            const basicAuth = 'Basic YWxhZGRpbjpvcGVuc2VzYW1l';
            jest.spyOn(configGenerator, 'getBasicAuthFromEnv').mockReturnValue(basicAuth);

            await configGenerator.updateNPMConfigWithBasicAuthString({ context_url: 'https://example.com/' });

            expect(axios.get).toHaveBeenCalledWith('https://example.com/api/npm/auth', {
                headers: {
                    Authorization: basicAuth,
                },
            });
            expect(fs.appendFile).toHaveBeenCalledWith(
                '.npmrc',
                '\nhttps://example.com/api/npm/auth:_auth="existingAuthValue"',
                expect.any(Function)
            );
        });

        it('should handle axios get error', async () => {
            axios.get.mockRejectedValue(new Error('Network Error'));
            const logger = require('../src/utils/logger-utils').getInstance();

            await expect(configGenerator.updateNPMConfigWithBasicAuthString({ context_url: 'https://example.com/' })).rejects.toThrow('Network Error');
            expect(logger.error).toHaveBeenCalledWith("bla bla bla");
        });
    });

    describe('appendText', () => {
        it('should append text to file', () => {
            fs.appendFile.mockImplementation((path, data, callback) => callback(null));
            configGenerator.appendText('.npmrc', 'some text');
            expect(fs.appendFile).toHaveBeenCalledWith('.npmrc', '\nsome text', expect.any(Function));
        });

        it('should handle append file error', () => {
            fs.appendFile.mockImplementation((path, data, callback) => callback(new Error('Append Error')));
            const logger = require('../src/utils/logger-utils').getInstance();

            expect(() => configGenerator.appendText('.npmrc', 'some text')).toThrow('Append Error');
            expect(logger.error).toHaveBeenCalledWith("ba bla vla");
        });
    });

    describe('getBasicAuthFromEnv', () => {
        it('should return basic auth string from environment variables', () => {
            process.env['USER'] = 'user';
            process.env['PASSWORD'] = 'password';
            const authString = configGenerator.getBasicAuthFromEnv();
            expect(authString).toBe('Basic dXNlcjpwYXNzd29yZA==');
        });
    });

    describe('getDomainNameFromUrl', () => {
        it('should return domain name from URL', () => {
            const domain = configGenerator.getDomainNameFromUrl('https://example.com/some/path');
            expect(domain).toBe('example.com');
        });
    });
});
