import { useState } from "preact/hooks";

export function LoginForm(
	{ currentUsername }: { currentUsername: string | null },
) {
	const [username, setUsername] = useState(currentUsername ?? "");
	const [password, setPassword] = useState("");

	return (
		<form method="post" class="flex flex-col text-white gap-3">
			<div class="flex flex-col gap-1">
				<label for="username">Username</label>
				<input
					class="bg-[#1F1F1F] px-2.5 py-1.5 placeholder:text-[#818181] rounded-xl border border-[#515151] focus:border-white outline-none"
					name="username"
					id="username"
					placeholder="Enter your username"
					type="text"
					value={username}
					onInput={(input) => setUsername(input.currentTarget.value)}
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label for="password">Password</label>
				<input
					class="bg-[#1F1F1F] px-2.5 py-1.5 placeholder:text-[#818181] rounded-xl border border-[#515151] focus:border-white outline-none"
					name="password"
					id="password"
					placeholder="Enter your username"
					type="password"
					value={password}
					onInput={(input) => setPassword(input.currentTarget.value)}
				/>
			</div>
			<button
				class="flex justify-center items-center gap-1 py-1.5 mt-2 text-[#111111] bg-white hover:bg-[#A7A7A7] disabled:opacity-50 rounded-xl"
				type="submit"
				disabled={username.length < 1 || password.length < 1}
			>
				<p>Continue</p>
			</button>
		</form>
	);
}
