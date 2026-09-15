import { z } from 'zod/v4';
import { PromptIRSchema } from './ir.js';
import { PromptStateInputSchema } from './adapter.js';
/** Generate discovery from runtime input schemas, including nested shot overrides. */
export const promptIRJsonSchema = z.toJSONSchema(PromptIRSchema, { io: 'input', target: 'draft-7' });
export const promptStateJsonSchema = z.toJSONSchema(PromptStateInputSchema, { io: 'input', target: 'draft-7' });
