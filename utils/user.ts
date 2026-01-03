import { sql } from "./core.ts";
import { CreateUser, SafeUser, safeUser, User } from "../schemas/user.ts";
import { hash } from "@bronti/bcrypt";

export async function initUserTable() {
	await sql.queryArray`create table if not exists users (
	avatar_url text,
    created_at timestamp not null default now(),
    deleted_at timestamp,
    display_name text,
    id bigint generated always as identity primary key,
    password text not null,
    username text not null
	);`;
	await sql.queryArray`
	create unique index if not exists uniq_username on users (username) where deleted_at is null
	`;
}

export async function createUser(
	{ password, username }: CreateUser,
): Promise<SafeUser> {
	const { rows } = await sql.queryObject<User>(
		`insert into users (password, username) values ($1, $2) returning *`,
		[hash(password), username],
	);
	return safeUser(rows[0]);
}

export async function fetchHashedPassword(username: string) {
	const { rows } = await sql.queryObject<{ password: string; id: bigint }>(
		`select password, id from users where deleted_at is null and username = $1`,
		[username],
	);
	return rows.at(0);
}

export async function fetchUser(id: bigint): Promise<SafeUser | null> {
	const { rows } = await sql.queryObject<User>(
		`select * from users where id = $1`,
		[id],
	);
	const fetchedUser = rows.at(0);

	return fetchedUser && !fetchedUser.deleted_at
		? safeUser(fetchedUser)
		: null;
}
