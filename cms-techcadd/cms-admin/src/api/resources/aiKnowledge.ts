import type { BaseEntity, AiKnowledge } from '../../types'
import { createHttpResource } from '../http/resource'

export type AiKnowledgeCreate = Omit<AiKnowledge, keyof BaseEntity>
export type AiKnowledgeUpdate = Partial<AiKnowledgeCreate>

export const aiKnowledgeApi = createHttpResource<AiKnowledge, AiKnowledgeCreate, AiKnowledgeUpdate>('/ai-knowledge')
