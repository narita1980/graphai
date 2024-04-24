import { forkAgent, stringTemplateAgent } from "@/experimental_agents";
import { defaultTestContext } from "~/agents/utils";

import test from "node:test";
import assert from "node:assert";

test("test fork_agent", async () => {
  const result = await forkAgent({
    ...defaultTestContext,
    agents: { forkAgent, stringTemplateAgent },
    params: { 
      injectionTo: "node1", 
      resultFrom: "node2",
      graph: {
        nodes: {
          node1: {
            value: { fruit: "none" }
          },
          node2: {
            agentId: "stringTemplateAgent",
            params: {
              template: "I love ${0}."
            },
            inputs: ["node1.fruit"],
          }
        }
      }
    },
    inputs: [[{ fruit:"apple" }, { fruit: "orange" }]],
  });
  console.log(result);
  assert.deepStrictEqual(result, {
    contents: [ { content: 'I love apple.' }, { content: 'I love orange.' } ]
  });
});

