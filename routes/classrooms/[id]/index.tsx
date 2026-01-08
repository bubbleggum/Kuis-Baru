import { page } from "fresh";
import { define } from "../../../utils/core.ts";

export const handler = define.handlers({
	GET(ctx) {
		const { classroom } = ctx.state;

		if (!classroom) {
			return ctx.redirect("/");
		} else {
			return page({ classroom });
		}
	},
});

export default define.page<typeof handler>(function (ctx) {
	const { classroom } = ctx.data;

	return <p>You've joined classroom {classroom.name}</p>;
});
