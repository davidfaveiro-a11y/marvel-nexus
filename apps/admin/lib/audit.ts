import type { Json } from "./database.types";
import { supabase } from "./supabase";

export async function recordAudit(
  action: string,
  entityTable: string,
  entityId: string | null,
  metadata: Json = {},
) {
  const { data } = await supabase.auth.getUser();
  const { error } = await supabase.from("admin_audit_logs").insert({
    actor_id: data.user?.id ?? null,
    action,
    entity_table: entityTable,
    entity_id: entityId,
    metadata,
  });

  if (error) {
    console.warn("Audit log skipped", error.message);
  }
}
