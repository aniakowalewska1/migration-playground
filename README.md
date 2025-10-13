# Migration Playground: Azure DevOps vs GitHub Actions

This is a proof-of-concept (POC) project demonstrating CI/CD capabilities using GitHub Actions, designed for comparison with Azure DevOps pipelines. The project is built with [Next.js](https://nextjs.org) and showcases automated build and test workflows.

## POC Overview

This repository demonstrates key CI/CD features including:
- Automated builds with multiple Node.js versions
- Comprehensive test execution with coverage reporting
- Artifact management and retention
- Pull request automation with labeling
- Workflow status badges and reporting

## Azure DevOps vs GitHub Actions Comparison

### Key Differences

| Feature | Azure DevOps | GitHub Actions |
|---------|-------------|----------------|
| **Configuration File** | `azure-pipelines.yml` | `.github/workflows/*.yml` |
| **Workflow Triggers** | Pipelines with stages | Workflows with jobs |
| **Marketplace** | Azure DevOps Extensions | GitHub Marketplace (Actions) |
| **Build Agents** | Microsoft-hosted or self-hosted | GitHub-hosted runners or self-hosted |
| **Artifacts** | Pipeline artifacts | Workflow artifacts |
| **Secrets Management** | Variable groups, Azure Key Vault | Repository/Environment secrets |
| **YAML Syntax** | `stages`, `jobs`, `steps` | `jobs`, `steps` (no stages concept) |
| **Matrix Builds** | Similar syntax | `strategy.matrix` |
| **Conditions** | `condition:` keyword | `if:` keyword |
| **Integration** | Deep Azure integration | Deep GitHub integration |

### GitHub Actions Workflows in This POC

#### 1. Build Workflow (`.github/workflows/build.yml`)
- **Triggers**: Push to main, pull requests, manual dispatch
- **Features**:
  - Matrix strategy for Node.js versions (20.x, 22.x)
  - Dependency caching with npm
  - Linting (with error tolerance)
  - Application build with Next.js
  - Artifact upload for deployment

#### 2. Test Workflow (`.github/workflows/test.yml`)
- **Triggers**: Push to main, pull requests, manual dispatch
- **Features**:
  - Jest test execution
  - Coverage report generation
  - Coverage artifact upload (30-day retention)
  - Summary display in workflow output

#### 3. Labeler Workflow (`.github/workflows/label.yml`)
- **Features**:
  - Automatic PR labeling based on file paths
  - Configured via `.github/labeler.yml`

### Advantages of GitHub Actions

1. **Native Integration**: Built directly into GitHub repository interface
2. **Marketplace**: Extensive collection of community-built actions
3. **Simplicity**: Single YAML file per workflow, easier to manage
4. **Developer Experience**: Integrated with pull requests, issues, and releases
5. **Cost**: Generous free tier for public repositories

### Advantages of Azure DevOps

1. **Enterprise Features**: Advanced security, compliance, and governance
2. **Azure Integration**: Seamless connection with Azure resources
3. **Work Item Tracking**: Integrated project management
4. **Boards & Repos**: Complete ALM solution in one platform
5. **Release Management**: More sophisticated multi-stage deployment pipelines

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

## CI/CD Workflows

### Running Workflows Manually

All workflows support manual triggering via the Actions tab:
1. Go to the "Actions" tab in GitHub
2. Select the workflow (Build or Test)
3. Click "Run workflow"
4. Select the branch and run

### Viewing Workflow Results

- **Build Status**: Check the Build workflow for compilation success
- **Test Results**: Check the Test workflow for test execution and coverage
- **Artifacts**: Download build outputs and coverage reports from workflow runs

## Project Structure

```
migration-playground/
├── .github/
│   ├── workflows/
│   │   ├── build.yml       # Build workflow
│   │   ├── test.yml        # Test workflow
│   │   └── label.yml       # PR labeler workflow
│   └── labeler.yml         # Labeler configuration
├── app/                    # Next.js app directory
├── jest.config.ts          # Jest configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub repository](https://github.com/vercel/next.js)

### GitHub Actions Resources
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

### Azure DevOps Resources
- [Azure Pipelines Documentation](https://docs.microsoft.com/azure/devops/pipelines/)
- [Compare Azure DevOps and GitHub](https://docs.github.com/en/enterprise-cloud@latest/admin/identity-and-access-management/managing-iam-for-your-enterprise/about-authentication-for-your-enterprise)

## License

This is a POC project for demonstration purposes.
