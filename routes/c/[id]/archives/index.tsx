import { page } from "fresh";
import { define } from "../../../../utils/core.ts";
import { fetchArchives } from "../../../../utils/exam.ts";

export const handler = define.handlers({
	async GET(ctx) {
		const classroom = ctx.state.classroom!;
		const archives = await fetchArchives(
			classroom.id,
			classroom.member.user_id,
		);

		return page({ archives });
	},
});

export default define.page<typeof handler>(function (ctx) {
	const { archives } = ctx.data;

	return <p>Ada {archives.length} arsip.</p>;
});
