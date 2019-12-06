const os = require('os');

module.exports = {
  getIpv4Address() {
    const ifaces = os.networkInterfaces();
    for (const dev of Object.keys(ifaces)) {
      for (const details of ifaces[dev]) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          return details.address;
        }
      }
    }
    return '127.0.0.1';
  }
};
