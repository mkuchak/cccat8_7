import Hapi from "@hapi/hapi";
import HttpServer from "./HttpServer";

export default class HapiHttp implements HttpServer {
    server: Hapi.Server;

    constructor () {
        this.server = Hapi.server({});
    }

    convertUrl (url: string) {
        return url.replace(/\{(\w+)\}/g, ":$1");
    }

    async on(method: string, url: string, fn: any): Promise<void> {
        this.server.route({
            method,
            path: this.convertUrl(url),
            handler: async function (request: any, h: any) {
                const data = await fn(request.params, request.payload);
                return data;
            }
        });
    }

    async listen(port: number): Promise<void> {
        this.server.settings.port = port;
        await this.server.start();
    }
}