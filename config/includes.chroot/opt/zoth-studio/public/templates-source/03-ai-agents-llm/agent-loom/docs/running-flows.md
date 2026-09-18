# Running Flows

## Setup

1. Add one or more agent nodes
2. Connect nodes with edges
3. Select each node and set model, tools, skills, and instructions
4. Choose loop behavior
5. Click `Run Flow`

## Logs

- Each agent logs execution progress
- Nodes update status: idle, running, done, error
- Errors follow loop settings when retries are enabled

## Behavior

- Source agents run first
- Downstream targets run after upstream completion
- Logs persist until the next flow run
