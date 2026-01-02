import { getCookies } from "@std/http/cookie";
import { define } from "../utils/core.ts";
import { parseToken, TokenType } from "../utils/session.ts";
import { fetchUser } from "../utils/user.ts";

export const handler = define.middleware(async function (ctx) {
	ctx.state.user = null;

	const accessToken = getCookies(ctx.req.headers)["access_token"];

	if (accessToken) {
		const payload = await parseToken(accessToken);

		if (payload.token_type === TokenType.AccessToken) {
			const user = await fetchUser(BigInt(payload.user_id));
			ctx.state.user = user;
		}
	}

	return await ctx.next();
});
