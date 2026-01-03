import { page } from "fresh";
import { define } from "../utils/core.ts";
import { fetchHashedPassword } from "../utils/user.ts";
import { createSession } from "../utils/session.ts";
import { LoginForm } from "../islands/LoginForm.tsx";
import { v } from "../utils/valibot.ts";
import { CreateUserSchema } from "../schemas/user.ts";
import { verify } from "@bronti/bcrypt";

export const handler = define.handlers({
	GET(ctx) {
		if (ctx.state.user) {
			return ctx.redirect("/");
		} else {
			return page({ username: null });
		}
	},
	async POST(ctx) {
		if (ctx.state.user) {
			return ctx.redirect("/");
		} else {
			const data = await ctx.req.formData();

			const username = data.get("username");
			const password = data.get("password");

			try {
				const data = v.parse(CreateUserSchema, { password, username });
				const credential = await fetchHashedPassword(data.username);

				if (credential) {
					const valid = verify(data.password, credential.password);

					if (valid) {
						return await createSession(credential.id);
					}
				}
				return page({ username: data.username });
			} catch (error) {
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
				<p class="text-2xl text-white">Selamat Datang!</p>
				<p class="text-[#9C9C9C]">Silahkan login untuk lanjut</p>
			</div>
			<LoginForm currentUsername={username} />
		</div>
	);
});
