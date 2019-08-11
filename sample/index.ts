import { Express } from "express";
import http from "http";
import server from "./server";

class App {
  constructor(private app: Express) {}

  start(port?: number | string): void {
    port = this.normalizePort(port || 3333);
    const server = http.createServer(this.app);
    server.listen(port, () => {
      this.onListen(port);
    });
  }

  normalizePort(val: any): number {
    const port = parseInt(val, 10);
    return isNaN(port) ? val : port;
  }

  onListen(port: any): void {
    console.log("\x1b[32mListening on port:", `\x1b[36m${port}\x1b[0m`);
  }
}

const app = new App(server.app);
app.start(process.env.PORT);
