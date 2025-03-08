import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/neon-http";

const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});
export default db;
