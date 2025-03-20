
import { Document, Template } from "@/lib/types";

/**
 * Transform template data from Supabase to Document format
 */
export function transformToDocuments(data: Template[]): Document[] {
  return data.map(template => ({
    id: template.id,
    title: template.name,
    content: template.styles,
    updated_at: template.updated_at,
    meta: {
      template_id: template.id,
      status: template.status,
      category: template.category,
      version: template.version,
      owner_id: template.owner_id
    }
  }));
}
