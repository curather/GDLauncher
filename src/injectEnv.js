const nodeEnv = process.argv.find(v => v.includes('--node-env=')).split('=')[1];
const reactAppReleaseType = process.argv
  .find(v => v.includes('--react-app-release-type='))
  .split('=')[1];
window.env = {};
window.env.REACT_APP_RELEASE_TYPE = reactAppReleaseType;
window.env.NODE_ENV = nodeEnv;
