import { hash } from "@bronti/bcrypt";
import { User } from "../schemas/user.ts";
import { CreateUser, HashedPassword } from "../schemas/user_new.ts";
import { sql } from "./core.ts";

export async function initUserTable() {
	await sql.query(`
    create table if not exists users (
    avatar_url text,
    created_at timestamp not null default now(),
    deleted_at timestamp,
    display_name text,
    id bigint generated always as identity primary key,
    password text not null,
    username text not null
	)
    `);
	await sql.query(`
    create unique index if not exists uniq_username on users (username) where deleted_at is null
	`);
}

export async function createUser(data: CreateUser) {
	const rows = await sql.query(
		`insert into users (password, username) values ($1, $2) returning avatar_url, created_at, deleted_at, display_name, id, username`,
		[hash(data.password), data.username],
	) as User[];
	return rows.at(0)!;
}

export async function fetchHashedPassword(username: string) {
	const rows = await sql.query(
		`select id, password from users where username = $1 and deleted_at is null`,
		[username],
	) as HashedPassword[];
	return rows.at(0) ?? null;
}

export async function fetchUser(id: bigint): Promise<User | null> {
	const rows = await sql.query(
		`select avatar_url, created_at, deleted_at, display_name, id, username from users where id = $1`,
		[id],
	) as User[];
	return rows.at(0) ?? null;
}
