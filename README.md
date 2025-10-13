# Migration Playground: Azure DevOps Pipelines POC

This is a proof-of-concept (POC) project demonstrating CI/CD capabilities using Azure DevOps Pipelines. The project is built with [Next.js](https://nextjs.org) and showcases automated build and test workflows. GitHub Actions workflows are also included for comparison purposes.

## POC Overview

This repository demonstrates key CI/CD features including:

- Automated builds with multiple Node.js versions
- Comprehensive test execution with coverage reporting
- Artifact management and retention
- Pull request automation with labeling
- Workflow status badges and reporting

## Azure DevOps Pipelines

This repository contains three Azure DevOps pipeline configurations:

### 1. Build Pipeline (`.azure/build.yml`)

**Purpose**: Builds the Next.js application with multiple Node.js versions

**Triggers**:

- Push to `main` or `dev` branches
- Pull requests to `main` or `dev` branches

**Key Features**:

- Matrix strategy for Node.js 20.x and 22.x
- `NodeTool@0` - Sets up Node.js environment
- `Cache@2` - Caches npm dependencies for faster builds
- Runs ESLint for code quality (continues on error)
- Builds Next.js application
- `PublishBuildArtifacts@1` - Publishes build artifacts (7-day retention)
  - Publishes `.next/` build output
  - Publishes `package.json` for deployment reference

**Pipeline Steps**:

1. Checkout code
2. Setup Node.js version
3. Cache npm dependencies
4. Install dependencies (`npm ci`)
5. Run linter (`npm run lint`)
6. Build application (`npm run build`)
7. Upload build artifacts (Node 22.x only)

### 2. Test Pipeline (`.azure/test.yml`)

**Purpose**: Runs automated tests and generates coverage reports

**Triggers**:

- Push to `main` or `dev` branches
- Pull requests to `main` or `dev` branches

**Key Features**:

- Runs on Node.js 22.x
- Jest test execution with coverage
- `PublishBuildArtifacts@1` - Publishes coverage reports (30-day retention)
- `PublishCodeCoverageResults@2` - Integrates coverage with Azure DevOps UI
- Coverage visualization directly in the pipeline interface

**Pipeline Steps**:

1. Checkout code
2. Setup Node.js 22.x
3. Cache npm dependencies
4. Install dependencies (`npm ci`)
5. Run tests (`npm test`)
6. Run tests with coverage (`npm run test:coverage`)
7. Upload coverage reports
8. Publish code coverage results for Azure DevOps
9. Display coverage summary in logs

## Azure DevOps Key Features

This POC demonstrates several key Azure DevOps capabilities:

### 1. Pipeline Tasks

- **NodeTool@0**: Sets up Node.js versions in the build environment
- **Cache@2**: Implements intelligent caching for npm dependencies
- **PublishBuildArtifacts@1**: Publishes and manages build artifacts with configurable retention
- **PublishCodeCoverageResults@2**: Integrates test coverage directly into the Azure DevOps UI

### 2. Matrix Strategy

- Build and test across multiple Node.js versions (20.x, 22.x)
- Parallel execution for faster feedback
- Conditional artifact publishing based on matrix variables

### 3. Triggers & PR Integration

- Automated triggering on branch pushes
- Pull request validation
- Manual pipeline execution support

### 4. Artifact Management

- Build artifacts retained for 7 days
- Coverage reports retained for 30 days
- Easy download and deployment from Azure DevOps UI

### 5. Integrated Reporting

- Test results visualization
- Code coverage dashboards
- Pipeline status badges
- Build history and trends

## Comparison with GitHub Actions

For reference, this repository also includes equivalent GitHub Actions workflows (`.github/workflows/`) to compare implementation approaches:

| Feature           | Azure DevOps                                 | GitHub Actions                      |
| ----------------- | -------------------------------------------- | ----------------------------------- |
| **Configuration** | `azure-pipelines-*.yml`                      | `.github/workflows/*.yml`           |
| **Node.js Setup** | `NodeTool@0` task                            | `actions/setup-node` action         |
| **Caching**       | `Cache@2` task                               | `actions/cache` action              |
| **Artifacts**     | `PublishBuildArtifacts@1`                    | `actions/upload-artifact`           |
| **Coverage**      | `PublishCodeCoverageResults@2` (built-in UI) | Third-party actions needed          |
| **Triggers**      | `trigger:` and `pr:`                         | `on:` with event types              |
| **Matrix Syntax** | `strategy.matrix` with variables             | `strategy.matrix` with job outputs  |
| **Conditions**    | `condition:` keyword                         | `if:` keyword                       |
| **Integration**   | Deep Azure integration, work items           | Deep GitHub integration, issues/PRs |

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
├── .github/
│   ├── workflows/
│   │   ├── build.yml              # GitHub Actions build workflow
│   │   ├── test.yml               # GitHub Actions test workflow
│   │   └── label.yml              # GitHub Actions PR labeler workflow
│   └── labeler.yml                # Labeler configuration
├── azure-pipelines-build.yml      # Azure DevOps build pipeline
├── azure-pipelines-test.yml       # Azure DevOps test pipeline
├── azure-pipelines-labeler.yml    # Azure DevOps PR labeler pipeline
├── app/                           # Next.js app directory
├── jest.config.ts                 # Jest configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
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
