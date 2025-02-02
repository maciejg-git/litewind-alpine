const config = {
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    runScripts: "dangerously",
    resources: "usable",
    url: "http://localhost:8080"
  }
}

module.exports = config
