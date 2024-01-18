import { Trigger } from "deno-slack-sdk/types.ts";
import GreetingWorkflow from "../workflows/greeting_workflow.ts";

const greetingTrigger: Trigger<typeof GreetingWorkflow.definition> = {
  type: "shortcut",
  name: "Send a greeting",
  description: "Send a greeting",
  workflow: "#/workflows/greeting_workflow",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
  },
};

export default greetingTrigger;
