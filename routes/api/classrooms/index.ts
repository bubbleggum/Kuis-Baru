import { HttpError } from "fresh";
import { define, stringifyJson } from "../../../utils/core.ts";
import { STATUS_CODE } from "@std/http/status";
import { CreateClassroomSchema } from "../../../schemas/classroom_new.ts";
import { v } from "../../../utils/valibot.ts";
import { createClassroom } from "../../../utils/classroom_new.ts";

export type APICreateClassroomResult = Awaited<
	ReturnType<typeof createClassroom>
>;

export const handler = define.handlers({
	async POST(ctx) {
		const { user } = ctx.state;

		if (!user) {
			throw new HttpError(STATUS_CODE.Unauthorized);
		} else {
			try {
				const payload = v.parse(
					CreateClassroomSchema,
					{ ...(await ctx.req.json()), homeroom_id: user.id },
				);
				const newClassroom = await createClassroom(payload);

				return Response.json(JSON.parse(stringifyJson(newClassroom)));
			} catch (error) {
				throw error;
			}
		}
	},
});
