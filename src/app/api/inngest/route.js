import { serve } from "inngest/next";
import { inngest } from "@/lib/Inngest/client";
import { helloWorld } from "@/lib/Inngest/function";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    helloWorld
  ],
});
