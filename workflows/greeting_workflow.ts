import {
  DefineWorkflow,
  Schema,
} from "https://deno.land/x/deno_slack_sdk@2.5.0/mod.ts";
import { GreetingFunctionDefinition } from "../functions/greeting_function.ts";
//import { Connectors } from "deno-slack-hub/mod.ts";

const GreetingWorkflow = DefineWorkflow({
  callback_id: "greeting_workflow",
  title: "Send a greeting",
  description: "Send a greeting",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

const inputForm = GreetingWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Send a greeting",
    interactivity: GreetingWorkflow.inputs.interactivity,
    submit_label: "Send greeting",
    fields: {
      elements: [
        {
          name: "recipient",
          title: "Recipient",
          type: Schema.slack.types.user_id,
        },
        {
          name: "message",
          title: "Message",
          type: Schema.types.string,
          long: true,
        },
      ],
      required: ["recipient", "message"],
    },
  },
);

const greetingFunctionStep = GreetingWorkflow.addStep(
  GreetingFunctionDefinition,
  {
    recipient: inputForm.outputs.fields.recipient,
    message: inputForm.outputs.fields.message,
  },
);

GreetingWorkflow.addStep(
  Schema.slack.functions.SendDm,
  {
    user_id: inputForm.outputs.fields.recipient,
    message: greetingFunctionStep.outputs.greeting,
  },
);

export default GreetingWorkflow;
