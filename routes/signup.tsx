import { page } from "fresh";
import { define } from "../utils/core.ts";
import { createUser } from "../utils/user.ts";
import { createSession } from "../utils/session.ts";
import { LoginForm } from "../islands/LoginForm.tsx";
import { PostgresError } from "@db/postgres";
import { v } from "../utils/valibot.ts";
import { CreateUserSchema } from "../schemas/user.ts";

export const handler = define.handlers({
	GET(_ctx) {
		return page({ username: null });
	},
	async POST(ctx) {
		const data = await ctx.req.formData();

		const username = data.get("username");
		const password = data.get("password");

		try {
			const data = v.parse(CreateUserSchema, { password, username });
			const newUser = await createUser(data);
			return await createSession(newUser.id);
		} catch (error) {
			if (
				error instanceof PostgresError &&
				error.fields.constraint === "uniq_username"
			) {
				return page({ username: null });
			} else {
				throw error;
			}
		}
	},
});

export default define.page<typeof handler>(function (ctx) {
	const { username } = ctx.data;

	return (
		<div class="flex flex-col items-center justify-center h-dvh gap-5 bg-[#111111] font-outfit font-semibold">
			<div class="flex flex-col items-center">
				<p class="text-2xl text-white">Welcome!</p>
				<p class="text-[#9C9C9C]">Please sign up to continue</p>
			</div>
			<LoginForm currentUsername={username} />
		</div>
	);
});
