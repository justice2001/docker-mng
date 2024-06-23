import { response, routerApp } from "../service/router";
import SingleUseToken from "../service/single-use-token";

routerApp.on("auth/single-token", async (ctx, data) => {
    const stringPromise = await SingleUseToken.createToken(data.permission, data.info);
    response(ctx, stringPromise)
})