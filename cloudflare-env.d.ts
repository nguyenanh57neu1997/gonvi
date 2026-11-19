declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUDGET_SYNC_KEY?: string;
    BUDGET_OWNER_EMAIL?: string;
    BUCKET?: R2Bucket;
  }
}
