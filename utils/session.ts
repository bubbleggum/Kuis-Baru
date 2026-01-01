import { encode, JWTPayload } from "@gz/jwt";
import { envOrThrow } from "@dudasaus/env-or-throw";
import { setCookie, STATUS_CODE } from "@std/http";

const TOKEN_EXPIRATION = {
	AccessToken: 24 * 60 * 60,
	RefreshToken: 3 * 24 * 60 * 60,
};

async function createToken(userId: bigint, tokenType: TokenType) {
	const expireIn = tokenType === TokenType.AccessToken
		? TOKEN_EXPIRATION.AccessToken
		: TOKEN_EXPIRATION.RefreshToken;
	return await encode(
		{
			user_id: userId.toString(),
			token_type: tokenType,
			exp: expireIn,
		} satisfies Token,
		envOrThrow("JWT_SECRET"),
	);
}

export async function createSession(userId: bigint) {
	const accessToken = await createToken(userId, TokenType.AccessToken);
	const refreshToken = await createToken(userId, TokenType.RefreshToken);

	const headers = new Headers({
		location: "/",
	});
	setCookie(headers, {
		name: "access_token",
		value: accessToken,
		path: "/",
		expires: TOKEN_EXPIRATION.AccessToken * 1_000,
		httpOnly: true,
	});
	setCookie(headers, {
		name: "refresh_token",
		value: refreshToken,
		path: "/refresh_token",
		expires: TOKEN_EXPIRATION.RefreshToken * 1_000,
		httpOnly: true,
	});

	return new Response(null, {
		headers,
		status: STATUS_CODE.Found,
	});
}

enum TokenType {
	AccessToken,
	RefreshToken,
}

interface Token extends JWTPayload {
	user_id: string;
	token_type: TokenType;
}
