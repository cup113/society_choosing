/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Choosing24b = "choosing_24B",
	Societies = "societies",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type Choosing24bRecord = {
	answer?: string
	first_choice: RecordIdString
	ip?: string
	rejects?: RecordIdString[]
	second_choice: RecordIdString
	third_choice: RecordIdString
	user: RecordIdString
}

export type SocietiesRecord = {
	adjustThreshold?: number
	cap: number
	coreMembers?: RecordIdString[]
	description: string
	limit?: string
	name: string
	question?: string
	teacher: string
}

export type UsersRecord = {
	class: string
	name: string
	role: string
}

// Response types include system fields and match responses from the PocketBase API
export type Choosing24bResponse<Texpand = unknown> = Required<Choosing24bRecord> & BaseSystemFields<Texpand>
export type SocietiesResponse<Texpand = unknown> = Required<SocietiesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	choosing_24B: Choosing24bRecord
	societies: SocietiesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	choosing_24B: Choosing24bResponse
	societies: SocietiesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'choosing_24B'): RecordService<Choosing24bResponse>
	collection(idOrName: 'societies'): RecordService<SocietiesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
