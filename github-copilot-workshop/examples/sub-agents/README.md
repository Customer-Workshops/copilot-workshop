# Sub-Agent Examples

This directory contains example agent definitions demonstrating a multi-agent workflow pattern where a parent orchestrator agent delegates tasks to specialized sub-agents.

## Agent Files

### 1. orchestrator.agent.md
The parent agent that receives user requests and coordinates between specialized sub-agents.

**Responsibilities:**
- Analyze user requests
- Decompose tasks into sub-tasks
- Delegate to appropriate sub-agents
- Combine results into a final response

### 2. research.agent.md
A specialized agent focused on gathering information and analyzing code.

**Responsibilities:**
- Search and analyze codebase
- Identify existing patterns
- Gather context and requirements
- Provide recommendations

### 3. implementation.agent.md
A specialized agent focused on writing code and building features.

**Responsibilities:**
- Write clean, well-structured code
- Create or modify files
- Write tests and documentation
- Follow existing code patterns

## How to Use These Agents

### Setting Up in VS Code

1. Create a `.github/agents/` directory in your project (or workspace)
2. Copy the desired agent files to this directory
3. In VS Code, open Copilot Chat
4. Reference agents using the `@` symbol (e.g., `@orchestrator`)

### Example Workflow

1. **User**: "@orchestrator I need to add a user profile feature to the app"

2. **Orchestrator**: Analyzes the request and delegates:
   - "@research-agent Please analyze the existing user management setup and identify where profile features should be added"

3. **Research Agent**: Explores the codebase and responds with:
   - Current user model structure
   - Existing UI patterns for user data
   - Database schema considerations
   - Recommendations for implementation

4. **Orchestrator**: Reviews research findings and delegates:
   - "@implementation-agent Based on the research findings, please implement a user profile page with the following features: [details]"

5. **Implementation Agent**: Writes the code:
   - Creates profile component
   - Adds routes
   - Implements data fetching
   - Writes tests

6. **Orchestrator**: Summarizes the complete workflow for the user

## Benefits of Multi-Agent Architecture

- **Separation of Concerns**: Each agent has a clear, focused responsibility
- **Reusability**: Sub-agents can be invoked in different workflows
- **Better Context**: Specialized agents can maintain focused context for their domain
- **Modularity**: Easy to add new specialized agents without modifying existing ones
- **Parallel Execution**: Sub-agents can potentially work on independent tasks simultaneously

## Customization Tips

- Modify agent instructions to match your project's conventions
- Add domain-specific knowledge to agent definitions
- Create additional specialized agents for your workflow (e.g., testing agent, documentation agent, deployment agent)
- Adjust the orchestrator's delegation logic to match your team's processes

## Trade-offs to Consider

**Advantages:**
- More focused and specialized responses
- Better handling of complex, multi-step tasks
- Clearer separation of concerns

**Disadvantages:**
- Increased complexity in coordination
- Higher latency due to multiple agent calls
- Higher token/API costs
- More context management required

## Best Practices

1. **Keep agents focused**: Each sub-agent should have a clear, single responsibility
2. **Document interfaces**: Clearly define what each agent expects and returns
3. **Pass context explicitly**: Don't rely on implicit state between agent calls
4. **Test workflows**: Verify the entire multi-agent workflow works as expected
5. **Monitor costs**: Track token usage across multiple agent invocations
6. **Iterate on instructions**: Refine agent prompts based on real-world usage

## Learn More

- [VS Code Copilot Agent Documentation](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [GitHub Copilot Customization Guide](https://docs.github.com/copilot/customizing-copilot)
