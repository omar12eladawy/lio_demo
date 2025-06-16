# Case Procurement System 

## Journey

- **Started with Vercel MongoDB FastAPI boilerplate template** - Provided solid foundation with Next.js frontend and FastAPI backend integration

- **Frontend development accelerated with Claude AI assistance** - Significantly sped up component architecture, TypeScript interfaces, and Tailwind styling patterns

- **MongoDB integration** - Stores both request data and commodity group types/values for classification matching

- **Simplified AI Setup** - Chose against complex LangGraph setup in favor of single, well-structured prompt using task/format/example pattern for faster, reliable results

- **Prompt-based commodity extraction** - Designed prompt to extract commodity groups which then match against database entries to retrieve respective categories instead of trying to get both together. 

- **LLM observability with Langfuse** - Integrated tracing and monitoring for prompt performance and annotation workflows

## Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.12+
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Clone and install dependencies:**
```bash
# Install frontend dependencies
npm install
# or
pnpm install

# Install Python dependencies (using uv - included in project)
uv sync

# or
uv pip install -r requirements.txt

```

2. **Environment variables:**
```bash
# Create .env.local file with:
MONGODB_ATLAS_URI=<connection-string>
OPENAI_API_KEY=<key>

LANGFUSE_SECRET_KEY=sk<key>
LANGFUSE_PUBLIC_KEY=p<key>
LANGFUSE_HOST=https://cloud.langfuse.com 
```

## How to Run

### Development Mode
```bash
pnpm run next-dev    # Frontend on http://localhost:3000
pnpm run fastapi-dev # Backend on http://localhost:8003
```

### Production Build
```bash
pnpm run build
pnpm start
```

## Package Management - UV vs Pip

**Note:** This project uses UV instead of pip for Python package management. The original boilerplate used pip, but we've switched to UV for faster dependency resolution and better development experience.

### Using UV (Recommended)
UV is already configured and ready to use. The FastAPI development server uses UV by default:
```bash
# UV is used automatically when running:
pnpm run fastapi-dev

# To manually install dependencies with UV:
uv sync
# or
uv pip install -r requirements.txt
```

### Using Pip (Alternative)
If you prefer to use pip instead of UV:
1. Install dependencies: `pip install -r requirements.txt`
2. **Important:** You'll need to modify the `fastapi-dev` script in `package.json` from:
   ```json
   "fastapi-dev": "uv run python3 -m uvicorn api.index:app --reload --port 8003"
   ```
   to:
   ```json
   "fastapi-dev": "python3 -m uvicorn api.index:app --reload --port 8003"
   ```

## Frontend Summary

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, React Query, React Hook Form

The frontend is built with modern React patterns and leverages:
- **Component Architecture:** Reusable UI components using shadcn/ui design system
- **State Management:** React Query for server state and form handling with react-hook-form
- **Styling:** Tailwind CSS with custom component variants
- **Type Safety:** Full TypeScript implementation with Zod validation

**Note:** Frontend development was significantly accelerated with Claude AI assistance, particularly for:
- Component structure and TypeScript interfaces
- Tailwind styling and responsive design patterns
- Form validation logic and error handling
- API integration patterns with React Query

## Backend Summary

**Tech Stack:** FastAPI, Python 3.12, MongoDB, LangChain, OpenAI

The backend provides a robust API foundation with:
- **API Framework:** FastAPI with automatic OpenAPI documentation
- **Database:** MongoDB integration with PyMongo driver
- **AI Integration:** LangChain and OpenAI for document processing and AI features
- **Document Processing:** PDF handling with pdfplumber and pypdfium2
- **Tracing:** Langfuse integration for LLM observability and performance monitoring


## Possible Improvements:

### 🎨 **UI/UX Improvements**
• **Dashboard with analytics** - Replace basic list view with spending charts, department breakdowns, and KPI metrics
• **Bulk upload interface** - Drag-and-drop multiple document processing with progress tracking and batch results

### 🤖 **AI/LLM Optimization** 
• **Decomposed LLM pipeline** - Experiment with breaking single prompt into specialized calls for better accuracy and cost control
• **Multi-dimensional scoring** - Expand beyond total cost validation to include field completion accuracy, classification confidence etc..

### 🚀 **Feature Enhancements**
• **Advanced search & filtering** - Add faceted search by date range, department, vendor, status, and amount with saved filter presets  

---

