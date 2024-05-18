// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const process = require('process');
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-sonarqube-unit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      subdir: '.',
      reporters: [
        {type: 'html', subdir: './'},
        {type: 'lcovonly', subdir: './'},
        {type: 'text-summary', subdir: './'}
      ],
      fixWebpackSourcePaths: true,
      includeAllSource: true
    },
    preprocessors: {
      '**/!(config/constants/mocks/environments)/**/!(*.module|*.spec).ts' : ['coverage']
    },
    reporters: ['progress','kjhtml','coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      Chrome: {
        base: 'ChromeHeadless',
        chromeDataDir: require('path').resolve(__dirname, '.chrome'),
        flags: [
          '--no-sandbox', 
          '--disable-gpu',
          '--headless',
          '--disable-translate',
          '--disable-extensions',
          '--disable-dev-shm-usage'
        ]
      }
    },
    singleRun: true
  });
};