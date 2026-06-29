// Custom Node server for Hostinger (Phusion Passenger / CloudLinux Node Selector).
// Passenger runs THIS file as the app startup file and provides the port.
// Run `npm run build` first so `.next` exists, then (re)start the app.
const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`FRYO ready on port ${port}`);
  });
});
