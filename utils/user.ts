import { sql } from "./core.ts";
import { CreateUser, User } from "../schemas/user.ts";
import { hash } from "@bronti/bcrypt";

await sql.queryArray`create table if not exists users (
    avatar_url text,
    created_at timestamp,
    deleted_at timestamp,
    display_name text,
    id serial primary key,
    password text not null,
    username text not null
)`;
await sql.queryArray`
create unique index if not exists uniq_username on users (username) where deleted_at is null
`;

export async function createUser(
	{ password, username }: CreateUser,
): Promise<User> {
	const { rows } = await sql.queryObject<User>(
		`insert into users (created_at, password, username) values (now(),$1, $2) returning *`,
		[hash(password), username],
	);
	return rows[0];
}

Deno.test({
	name: "create user",
	async fn() {
		const newUser = await createUser({
			password: "Owlieee",
			username: "Owli",
		});
		console.log(newUser);
	},
});
