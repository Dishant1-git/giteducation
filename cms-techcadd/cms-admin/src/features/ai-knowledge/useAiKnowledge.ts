import { aiKnowledgeApi } from '../../api'
import { createResourceHooks } from '../shared/createResourceHooks'

export const aiKnowledgeHooks = createResourceHooks('ai_knowledge', aiKnowledgeApi)
