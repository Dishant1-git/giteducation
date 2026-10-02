import type { BaseEntity, Event } from '../../types'
import { createHttpResource } from '../http/resource'

export type EventCreate = Omit<Event, keyof BaseEntity>
export type EventUpdate = Partial<EventCreate>

/** Live against the Express API. */
export const eventsApi = createHttpResource<Event, EventCreate, EventUpdate>('/events')
