# NEO Scheduler Component

A custom Nintex Forms plugin that provides a weekly schedule viewer for work items.

## Features

- **Week Navigation**: Navigate between different weeks with previous/next controls
- **Weekly Calendar View**: Display work items organized by days of the week
- **Work Item Details**: Show title, time, duration, and priority for each item
- **Priority Indicators**: Visual color coding for different priority levels (high, medium, low)
- **Item Selection**: Click on work items to select them
- **Responsive Design**: Clean, modern interface that works across devices

## Component Properties

### Plugin Configuration
- **scheduleData**: JSON string containing schedule data with work items
- **value**: JSON string of selected work items (output field)

### Standard Properties
- **fieldLabel**: Display label for the component
- **description**: Help text for the component

## Data Structure

### Schedule Data Format
```json
{
  "week": "2025-09-08",
  "items": [
    {
      "id": 1,
      "title": "Project Review",
      "description": "Review quarterly project status",
      "day": "Monday",
      "time": "09:00",
      "duration": 60,
      "priority": "high",
      "category": "meetings"
    }
  ]
}
```

### Work Item Properties
- **id**: Unique identifier for the work item
- **title**: Display title of the work item
- **description**: Optional detailed description
- **day**: Day of the week (Monday, Tuesday, etc.)
- **time**: Start time in HH:MM format
- **duration**: Duration in minutes
- **priority**: Priority level (high, medium, low)
- **category**: Optional category for grouping

## Development

### Prerequisites
- Node.js
- pnpm package manager

### Setup
```bash
# Install dependencies
pnpm install

# Build the component
pnpm build

# Start development server
pnpm dev
```

### Testing
The component includes a test page for local development:

1. Run `pnpm dev` to build and start the development server
2. Open http://localhost:3000/test in your browser
3. Use the test controls to interact with the component

### Project Structure
```
neo-scheduler/
├── src/
│   └── neo-scheduler.ts    # Main component implementation
├── dist/
│   └── neo-scheduler.js    # Built component (generated)
├── test.html               # Test page for local development
├── server.js               # Development server
├── package.json            # Dependencies and scripts
└── webpack.config.js       # Build configuration
```

## Usage in Nintex Forms

1. Deploy the built `neo-scheduler.js` file to your web server
2. Register the plugin in your Nintex Forms environment
3. Configure the `scheduleData` property with your work items
4. The component will display the schedule and output selected items to the `value` field

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires modern browser support for Web Components and ES6+ features.

## License

UNLICENSED - For internal use only.
