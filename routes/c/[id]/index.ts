import { define } from "../../../utils/core.ts";

export const handler = define.handlers({
	GET(ctx) {
		const { pathname } = ctx.url;
		return ctx.redirect(pathname + "/members");
	},
});
