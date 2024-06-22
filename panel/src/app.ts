import Koa from 'koa';
import bodyParser from 'koa-body';
import RemoteManage from "./services/remote-manage";
import * as process from "node:process";
import { mountRouters } from "./router";

async function main() {
    const app: Koa = new Koa();

    app.use(bodyParser());

    mountRouters(app);

    await RemoteManage.initialize();

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`DOCKER MANAGER`)
        console.log("App listening on port " + port);
    });
}

console.log("Docker Manager version 1.0.0")
console.log("Daemon Version 1.0.0")

main().catch(err => {
    console.log(err)
    process.exit(1);
})