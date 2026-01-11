import { page } from "fresh";
import { define } from "../../../utils/core.ts";
import { fetchMembers } from "../../../utils/member_new.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const { classroom } = ctx.state;

		if (!classroom) {
			return ctx.redirect("/");
		} else {
			const members = await fetchMembers(classroom.id);
			console.log(members);
			return page({ members });
		}
	},
});

export default define.page(function (_ctx) {
	return <p>Hello world!</p>;
});
