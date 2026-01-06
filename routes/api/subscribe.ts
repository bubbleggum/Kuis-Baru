import { HttpError } from "fresh";
import { define } from "../../utils/core.ts";
import { STATUS_CODE } from "@std/http/status";
import { subscribeEvents } from "../../utils/subscribe.ts";

export const handler = define.handlers({
	GET(ctx) {
		const { user } = ctx.state;

		if (!user) {
			throw new HttpError(STATUS_CODE.Unauthorized);
		} else {
			return subscribeEvents(user.id);
		}
	},
});
