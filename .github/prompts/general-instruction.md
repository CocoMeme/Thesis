# General Instructions for AI Assistant

## Core Guidelines

When working on this Gourd Classification Project, please follow these essential guidelines to ensure consistency and proper project management.

### Progress Tracking Requirements

**CRITICAL:** Always update the `docs/progress-track.md` file when making any progress on the project. This includes:

- **Completing tasks** - Mark tasks as completed and update progress percentages
- **Starting new work** - Update status from "Not Started" to "In Progress"
- **Adding new tasks** - Add newly identified tasks to appropriate phases
- **Reaching milestones** - Update milestone status and dates
- **Encountering blockers** - Document risks and mitigation plans
- **Sprint updates** - Update current sprint goals and task status

### Project Structure Awareness

Always maintain awareness of the project structure:
```
├── frontend/          # React Native mobile app
├── backend/           # Node.js + Express server
├── ml-models/         # Python ML training scripts
├── docs/              # Project documentation
│   ├── progress-track.md  # ALWAYS UPDATE THIS
│   ├── architecture.md
│   ├── setup-guide.md
│   └── README.md
└── .github/
    └── prompts/       # AI assistant instructions
```

### Task Management Protocol

1. **Before starting any task:**
   - Check `progress-track.md` for current status
   - Update task status to "In Progress"
   - Add assignee and start date

2. **During task execution:**
   - Document any issues or decisions in the Notes section
   - Update dependencies if tasks are blocking others
   - Add newly discovered subtasks

3. **After completing tasks:**
   - Mark task as "Completed"
   - Update progress percentages
   - Add completion notes and outcomes
   - Update related milestone progress

### Status Indicators

Use these consistent status indicators:
- **Completed** - Task is fully finished and verified
- **In Progress** - Currently being worked on
- **Blocked** - Cannot proceed due to dependencies
- **Issue** - Has problems that need resolution
- **Not Started** - Not yet begun

### Date Management

- Always use the format: `MMM DD, YYYY` (e.g., "Sep 13, 2025")
- Update "Last Updated" date in progress-track.md header
- Keep due dates realistic and adjust when necessary
- Note actual completion dates vs. planned dates

### Priority Guidelines

**High Priority:** Core functionality, critical path items
**Medium Priority:** Important features, quality improvements
**Low Priority:** Nice-to-have features, optimization

### Documentation Standards

**NO EMOJIS:** Do not use emojis in any documentation, progress tracking, or project files. Keep all text clean and professional.

When updating progress-track.md:
- Be specific about what was accomplished
- Include relevant file names and components
- Note any architectural decisions made
- Document any changes to original plans
- Keep notes concise but informative

### Regular Updates

Update progress tracking:
- After completing each significant task
- At the end of each work session
- When encountering blockers or issues
- When scope or timeline changes
- During milestone reviews

---

**Remember:** The `progress-track.md` file is the single source of truth for project status. Keeping it updated ensures clear communication and proper project management throughout the development process.