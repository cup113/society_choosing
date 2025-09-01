/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	AltchaChallenges = "altcha_challenges",
	Choosing24b = "choosing_24B",
	Choosing25b = "choosing_25B",
	Dates = "dates",
	Societies = "societies",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type AltchaChallengesRecord = {
	challenge: string
	created?: IsoDateString
	expires: IsoDateString
	hmacKey: string
	id: string
	updated?: IsoDateString
}

export type Choosing24bRecord = {
	answer?: string
	created?: IsoDateString
	first_choice: RecordIdString
	id: string
	ip?: string
	rejects?: RecordIdString[]
	second_choice: RecordIdString
	third_choice: RecordIdString
	updated?: IsoDateString
	user: RecordIdString
}

export type Choosing25bRecord = {
	answers?: string
	choices: RecordIdString[]
	created?: IsoDateString
	id: string
	ip?: string
	rejects?: RecordIdString[]
	updated?: IsoDateString
	user: RecordIdString
}

export type DatesRecord = {
	created?: IsoDateString
	end: IsoDateString
	id: string
	isActive?: boolean
	start: IsoDateString
	updated?: IsoDateString
}

export type SocietiesRecord = {
	adjustThreshold?: number
	cap: number
	coreMembers?: RecordIdString[]
	created?: IsoDateString
	id: string
	limit?: string
	location: string
	name: string
	question?: string
	teacher: string
	updated?: IsoDateString
}

export enum UsersGenderOptions {
	"male" = "male",
	"female" = "female",
}

export enum UsersRoleOptions {
	"student" = "student",
	"teacher" = "teacher",
}
export type UsersRecord = {
	class: string
	created?: IsoDateString
	email?: string
	emailVisibility?: boolean
	gender: UsersGenderOptions
	id: string
	name: string
	password: string
	role: UsersRoleOptions
	tokenKey: string
	updated?: IsoDateString
	username: string
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AltchaChallengesResponse<Texpand = unknown> = Required<AltchaChallengesRecord> & BaseSystemFields<Texpand>
export type Choosing24bResponse<Texpand = unknown> = Required<Choosing24bRecord> & BaseSystemFields<Texpand>
export type Choosing25bResponse<Texpand = unknown> = Required<Choosing25bRecord> & BaseSystemFields<Texpand>
export type DatesResponse<Texpand = unknown> = Required<DatesRecord> & BaseSystemFields<Texpand>
export type SocietiesResponse<Texpand = unknown> = Required<SocietiesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	altcha_challenges: AltchaChallengesRecord
	choosing_24B: Choosing24bRecord
	choosing_25B: Choosing25bRecord
	dates: DatesRecord
	societies: SocietiesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	altcha_challenges: AltchaChallengesResponse
	choosing_24B: Choosing24bResponse
	choosing_25B: Choosing25bResponse
	dates: DatesResponse
	societies: SocietiesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'altcha_challenges'): RecordService<AltchaChallengesResponse>
	collection(idOrName: 'choosing_24B'): RecordService<Choosing24bResponse>
	collection(idOrName: 'choosing_25B'): RecordService<Choosing25bResponse>
	collection(idOrName: 'dates'): RecordService<DatesResponse>
	collection(idOrName: 'societies'): RecordService<SocietiesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
