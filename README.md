# Migration Playground: Azure DevOps Pipelines POC

This is a proof-of-concept (POC) project demonstrating CI/CD capabilities using Azure DevOps Pipelines. The project is built with [Next.js](https://nextjs.org) and showcases automated build and test workflows. GitHub Actions workflows are also included for comparison purposes.

## Project Features

### Technical Features

- Next.js 15.5 application with TypeScript and Tailwind CSS
- API routes implementation with error handling
- Pokemon API integration with search and display capabilities
- Unit tests with Jest and React Testing Library
- E2E tests with Playwright
- Dynamic styling with Tailwind CSS
- Light/dark theme support with system preference detection

### Demo Pages and Components

- Home page with dynamic item list from API
- Pokemon search functionality with autocomplete
- Pokemon card display with type-based styling
- Responsive layout with mobile-first design

## CI/CD Features

This repository demonstrates key CI/CD capabilities including:

- Automated builds with multiple Node.js versions (20.x, 22.x)
- Comprehensive test execution with coverage reporting
- Artifact management and retention
- Pull request automation with labeling
- Workflow status badges and reporting
- E2E test automation in CI pipeline

## CI/CD Pipeline Configuration

This repository contains parallel CI/CD implementations using both Azure DevOps Pipelines and GitHub Actions.

### Azure DevOps Pipelines

Located in the `.azure/` directory:

#### 1. Build Pipeline (`.azure/build.yml`)

**Purpose**: Builds the Next.js application with multiple Node.js versions

**Triggers**: Manual trigger only (PR builds configured)

- Pull requests to `main` or `dev` branches

**Key Features**:

- Matrix strategy for Node.js 20.x and 22.x
- Uses Ubuntu latest runner
- `NodeTool@0` for Node.js setup
- `Cache@2` for npm dependency caching
- ESLint checks (with continue on error)
- Next.js build with Turbopack
- Artifact publishing for Node 22.x builds:
  - `.next/` build output (7-day retention)
  - `package.json` for deployment

#### 2. Test Pipeline (`.azure/test.yml`)

**Purpose**: Comprehensive test suite execution

**Triggers**: Manual trigger only (PR builds configured)

- Pull requests to `main` or `dev` branches

**Key Features**:

- Single Node.js version (22.x)
- Jest unit tests with coverage
- Playwright E2E tests
- Artifact retention:
  - Coverage reports (30-day retention)
  - Cobertura format for Azure DevOps integration
- Coverage results integration with Azure DevOps UI

### GitHub Actions

Located in `.github/workflows/`:

#### 1. Build Workflow (`build.yml`)

**Triggers**:

- Push to `main`
- Pull requests to `main`
- Manual trigger (workflow_dispatch)

**Features**:

- Matrix build: Node.js 20.x and 22.x
- npm caching via `actions/setup-node`
- ESLint checks
- Build artifacts for 22.x (7-day retention)

#### 2. Test Workflow (`test.yml`)

**Triggers**:

- Push to `main`
- Pull requests to `main`
- Manual trigger (workflow_dispatch)

**Features**:

- Single Node.js version (22.x)
- Jest unit tests
- Coverage reporting
- Playwright E2E tests
- Coverage artifacts (30-day retention)

#### 3. PR Labeler (`label.yml`)

**Purpose**: Automated PR labeling

- Triggered on `pull_request_target`
- Uses `actions/labeler` with custom rules
- Configuration in `.github/labeler.yml`



## Getting Started

### Prerequisites

- Node.js 20.x or 22.x
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

## Setting Up Azure Pipelines

### Prerequisites

- Azure DevOps account and organization
- Azure DevOps project
- Repository connected to Azure DevOps (Azure Repos Git or GitHub)

### Creating Pipelines in Azure DevOps

Follow these steps to set up each pipeline:

1. **Navigate to Pipelines**:

   - Go to your Azure DevOps project
   - Click on "Pipelines" in the left navigation
   - Click "Create Pipeline" or "New Pipeline"

2. **Connect Your Repository**:

   - Select your code source:
     - **Azure Repos Git**: Select your repository
     - **GitHub**: Authorize and select your repository
   - Click "Continue"

3. **Configure Pipeline**:

   - Select "Existing Azure Pipelines YAML file"
   - Choose the branch (typically `main` or `dev`)
   - Select one of the pipeline files:
     - `azure-pipelines-build.yml` - For the build pipeline
     - `azure-pipelines-test.yml` - For the test pipeline
     - `azure-pipelines-labeler.yml` - For the PR labeler pipeline
   - Click "Continue"

4. **Review and Run**:

   - Review the YAML configuration
   - Click "Run" to execute the pipeline for the first time
   - The pipeline will now automatically trigger based on configured triggers

5. **Optional: Rename Pipeline**:
   - After creation, click the three dots (⋯) on the pipeline
   - Select "Rename/move"
   - Give it a descriptive name (e.g., "Build - Next.js", "Test - Jest Coverage")

### Configuring PR Labeler Pipeline

The labeler pipeline requires additional permissions:

1. Go to **Project Settings** (bottom left)
2. Navigate to **Repositories** > Select your repository
3. Go to **Security** tab
4. Find the build service identity: `[Project Name] Build Service ([Organization Name])`
5. Set the following permissions to "Allow":
   - **Contribute to pull requests**
   - **Edit pull request properties** (if available)

### Running Pipelines Manually

To manually trigger a pipeline:

1. Go to **Pipelines** in your Azure DevOps project
2. Select the pipeline you want to run
3. Click **"Run pipeline"** button (top right)
4. Select the branch to run from
5. Click **"Run"**

### Viewing Pipeline Results

#### Pipeline Runs

- **Overview**: View pipeline status, duration, and stages in the run summary
- **Timeline**: See detailed step-by-step execution with logs
- **Logs**: Access full console output for each step

#### Test Results

- Click on the **"Tests"** tab in the pipeline run
- View pass/fail rates, test duration, and trends
- Drill down into individual test failures

#### Code Coverage

- Click on the **"Code Coverage"** tab in the pipeline run
- View coverage percentage and trends over time
- See line-by-line coverage for each file
- Download detailed coverage reports

#### Artifacts

- Click on the **"Artifacts"** section in the pipeline run
- View published artifacts:
  - `build-output` - Next.js build files and package.json
  - `coverage-report` - Detailed test coverage reports
- Click artifact name to download or explore contents

#### Dashboard & Analytics

- Go to **Pipelines** > **Analytics** for trends and insights
- View pipeline success rates, duration trends, and failure patterns
- Create custom dashboard widgets for pipeline monitoring

## Project Structure

```
migration-playground/
├── .github/                       # GitHub configurations
│   ├── workflows/                 # GitHub Actions workflows
│   │   ├── build.yml             # Build workflow
│   │   ├── test.yml              # Test workflow
│   │   └── label.yml             # PR labeler workflow
│   └── labeler.yml               # PR labeler rules
├── .azure/                        # Azure DevOps configurations
│   ├── build.yml                 # Build pipeline
│   └── test.yml                  # Test pipeline
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── items/               # Items API endpoints
│   │   └── pokemon/             # Pokemon API endpoints
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Home page component
├── components/                   # React components
│   ├── Header.tsx
│   ├── ItemList.tsx
│   ├── PokemonCard.tsx
│   └── PokemonSearch.tsx
├── services/                    # Service layer
│   └── pokemon.service.ts       # Pokemon API service
├── tests/                       # Test files
│   ├── e2e/                    # Playwright E2E tests
│   └── unit/                   # Jest unit tests
├── types/                      # TypeScript type definitions
│   └── pokemon.ts              # Pokemon-related types
├── jest.config.ts              # Jest configuration
├── jest.setup.ts              # Jest setup/mocks
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                  # This file
```

## Learn More

### Azure DevOps Resources

- [Azure Pipelines Documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
- [YAML Schema Reference](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/)
- [Pipeline Tasks Reference](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/)
- [Azure DevOps Labs](https://www.azuredevopslabs.com/)
- [Best Practices for Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/pipeline-best-practices)

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)

### GitHub Actions Resources (For Comparison)

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Migrating from GitHub Actions to Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/migrate/from-github-actions)

## License

This is a POC project for demonstration purposes.
