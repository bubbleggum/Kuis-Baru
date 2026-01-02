import { page } from "fresh";
import { define } from "../utils/core.ts";

export const handler = define.handlers({
	GET(ctx) {
		const { user } = ctx.state;

		if (user) {
			return page({ user });
		} else {
			return ctx.redirect("/signup");
		}
	},
});

export default define.page<typeof handler>(function (ctx) {
	const { user } = ctx.data;

	return (
		<div>
			<p>Your username is {user.username}</p>
		</div>
	);
});
