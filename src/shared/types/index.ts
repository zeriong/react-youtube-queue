// User types
export interface User {
	id: string;
	nickName: string;
	expire: string;
}

export interface TokenData {
	id: string;
	nickName: string;
	expire: string;
	role?: number;
}

// Music types
export interface Music {
	id?: string;
	link: string;
	title?: string;
	thumbnail?: string;
	duration?: number;
	nickName?: string;
}

export interface SavedMusic extends Music {
	id: string;
	savedAt: string;
}

// User Request types
export type UserRequestType = "play" | "pause" | "next" | "volume" | "save";

export interface UserRequest {
	request: UserRequestType;
	name: string;
}

export interface AccessedUserReq {
	type: UserRequestType;
	value?: number;
	timestamp: number;
}

// Content types
export interface Content {
	path: string;
	title: string;
	desc: string;
}

// Validation types
export interface ValidationResult {
	byte: number;
	isValidate: boolean;
}
