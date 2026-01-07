import { v } from "../utils/valibot.ts";

export const CreateUserSchema = v.object({
	password: v.pipe(
		v.string(),
		v.minLength(8, "Panjang karakter kata sandi minimal 8 karakter"),
		v.maxLength(40, "Panjang karakter kata sandi maksimal 40 karakter"),
	),
	username: v.pipe(
		v.string(),
		v.regex(
			/^[a-z0-9]{3,20}$/,
			"Nama pengguna hanya bisa mengandung huruf kecil, angka, dan memiliki panjang 3 sampai 20 karakter",
		),
	),
});
export type CreateUser = v.InferOutput<typeof CreateUserSchema>;

export interface User extends Pick<CreateUser, "username"> {
	avatar_url: string | null;
	created_at: Date;
	display_name: string | null;
	id: bigint;
}

export interface HashedPassword extends Pick<User, "id"> {
	password: string;
}
