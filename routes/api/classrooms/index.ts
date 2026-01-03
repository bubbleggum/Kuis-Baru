import { HttpError } from "fresh";
import { define, stringifyJson } from "../../../utils/core.ts";
import { STATUS_CODE } from "@std/http/status";
import { CreateClassroomSchema } from "../../../schemas/classroom.ts";
import { v } from "../../../utils/valibot.ts";
import { createClassroom } from "../../../utils/classroom.ts";

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
					await ctx.req.json(),
				);
				const newClassroom = await createClassroom(
					payload.name,
					user.id,
				);

				return Response.json(JSON.parse(stringifyJson(newClassroom)));
			} catch (error) {
				throw error;
			}
		}
	},
});
