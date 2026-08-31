// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "",

    frameworks: ["jasmine", "@angular-devkit/build-angular"],

    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
    ],

    client: {
      jasmine: {},
      clearContext: false,
    },

    jasmineHtmlReporter: {
      suppressAll: true,
    },

    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage/app"),
      subdir: ".",
      reporters: [
        { type: "html" },
        { type: "text-summary" },
      ],
    },

    reporters: ["progress", "kjhtml"],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,

    autoWatch: !process.env.CI,

    browsers: process.env.CI
      ? ["ChromeHeadlessNoSandbox"]
      : ["Chrome"],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--no-first-run",
          "--no-zygote",
          "--disable-extensions",
        ],
      },
    },

    singleRun: !!process.env.CI,
    restartOnFileChange: false,
  });
};
