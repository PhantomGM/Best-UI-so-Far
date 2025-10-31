# Digital Narrative Alchemist (DNA)

A powerful, intuitive tool for TTRPG Game Masters to generate unique, structured game content by decoding a "DNA" string using the Google Gemini API.

## ✨ Features

*   **Dynamic Content Generation**: Create rich, detailed content for your TTRPG campaigns, including Worlds, NPCs, Factions, Quests, Settlements, Magic Items, and Travel Scenarios.
*   **Unique "DNA" System**: Each piece of content is generated from a unique "DNA" string, allowing for complex, emergent, and reproducible results.
*   **Multiple Generation Methods**:
    *   **Fully Random**: Let the AI take the wheel for maximum surprise.
    *   **Narrative Guidance**: Guide the AI with a few keywords or a short sentence.
    *   **Highly Detailed**: Provide a detailed prompt for fine-grained control over the output.
*   **Project Management**: Organize your generated content into projects. Create new projects, save your work, and load existing projects from a file.
*   **Interactive Narrative Graph**: Visualize the relationships and connections between all the elements in your project with an interactive force-directed graph.
*   **Contextual Generation**: Build a living world by generating new content in context. Create a new faction based on your world's lore, or generate a quest hook from an NPC's description.
*   **Export & Share**: Save your entire project or individual content items as JSON files to back them up or share them with others.

### 🧪 AI Alchemist Toolkit (New!)

Harness the full power of Gemini with a suite of advanced AI tools:
*   **AI Chatbot**: A built-in chat interface powered by `gemini-2.5-flash` for brainstorming, asking questions, and getting instant feedback on your ideas.
*   **AI Image Editor**: Use text prompts to edit and transform your images. Need to add a retro filter or remove a background element? The `gemini-2.5-flash-image` model can do it.
*   **Deep Thought Mode**: For your most complex queries, this tool uses `gemini-2.5-pro` with a maximum thinking budget to tackle intricate problems, generate deep lore, or resolve complex plot points.
*   **Google Search Grounding**: When generating Worlds or Regions, you can enable search grounding to allow the AI to pull in up-to-date, real-world information for more accurate and relevant results.

## 🚀 Getting Started

### Prerequisites

*   A modern web browser that supports ES6 modules and `importmap`.
*   An API key for the Google Gemini API. This key must be available as an environment variable named `API_KEY` in the execution environment. The application is designed to read this key directly from the environment.

### Running the Application

This is a frontend-only application that can be run by serving its files with a local web server.

1.  Clone or download the project files.
2.  Ensure the `API_KEY` environment variable is set in the terminal session you will use to launch the server. The application code expects this to be available at runtime.
3.  From the project's root directory, start a simple local web server (e.g., `python -m http.server` or `npx serve`).
4.  Open the local server's URL in your browser (e.g., `http://localhost:8000`).

## 🕹️ How to Use

1.  **Welcome Screen**:
    *   To start a new world, enter a project name and click "Create New Project".
    *   To work on a previous project, click "Load Project from File" and select your project's `.json` file.
    *   For immediate inspiration, use the "Quick Generation" section to create any content type without needing a project first.

2.  **Dashboard View**:
    *   Once you have content in a project, it will be displayed as an interactive graph.
    *   Nodes represent content items (Worlds, NPCs, etc.) and are color-coded by type.
    *   Click on a node to open a modal with its full details.
    *   If your project is empty, you'll see a welcome message with shortcuts to create your first piece of content.

3.  **Sidebar**:
    *   Your project's content is organized by type in collapsible sections.
    *   Click the `+` icon next to a category to generate a new item of that type.
    *   Click on any item to view its details in the main dashboard modal.
    *   Access the **AI Alchemist** tools (Chatbot, Image Editor, etc.) from their dedicated section in the sidebar.
    *   Use the buttons at the top and bottom to create, load, or save projects.

4.  **Generation Form**:
    *   Choose a **Generation Method** to control how much input you provide.
    *   For "Guided" or "Detailed" methods, provide a text prompt to steer the AI.
    *   Click "Transmute" to begin generation.

5.  **Output Display**:
    *   Review the generated content.
    *   If you're in a project, you can "Add to Project".
    *   If you're not in a project, you can "Save to New Project" or "Add to Existing..." project file.
    *   You can also save the individual item as a `.json` file.

6.  **Linking Items**:
    *   From the details modal (opened by clicking a node on the graph), you can manage an item's links.
    *   Click "Add Link" to create a connection to another item in your project. This will draw a line between them on the graph.
    *   This helps you visualize relationships, like which NPCs belong to a faction, or which quests take place in a settlement.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript
*   **AI**: Google Gemini API (`@google/genai`)
*   **Styling**: Tailwind CSS
*   **Graph Visualization**: `react-force-graph-2d`
*   **Markdown Parsing**: `marked`