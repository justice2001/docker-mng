import Koa from 'koa';
import bodyParser from 'koa-body';
import router from "./router";
import { initializePanel } from "./core/panel-initial";
import RemoteManage from "./services/remote-manage";
import * as process from "node:process";

async function main() {
    const app: Koa = new Koa();

    app.use(bodyParser());

    app.use(router.routes());

    await RemoteManage.initialize();

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`DOCKER MANAGER`)
        console.log("App listening on port " + port);
    });
}

main().catch(err => {
    console.log(err)
    process.exit(1);
})