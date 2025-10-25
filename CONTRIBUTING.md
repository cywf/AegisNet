# Contributing to AegisNet

Thank you for your interest in contributing to AegisNet! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [Documentation](#documentation)
7. [Pull Request Process](#pull-request-process)

## Code of Conduct

We expect all contributors to:
- Be respectful and inclusive
- Focus on constructive feedback
- Collaborate openly
- Prioritize security and privacy

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- Git
- Docker and Docker Compose
- Your preferred code editor
- (Optional) Terraform, kubectl for infrastructure work

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/AegisNet.git
   cd AegisNet
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/cywf/AegisNet.git
   ```

3. **Set up local environment**
   ```bash
   ./scripts/setup-local.sh
   # Or
   make dev
   ```

4. **Install pre-commit hooks** (optional but recommended)
   ```bash
   pip install pre-commit
   pre-commit install
   ```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### 2. Make Your Changes

- Write clean, maintainable code
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run validation
make validate

# Test locally
make start
make logs

# Run security scans
make security-scan
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add new deployment configuration for AWS"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions or updates
- `chore:` - Maintenance tasks

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

## Coding Standards

### Terraform

- Use consistent formatting: `terraform fmt`
- Validate before committing: `terraform validate`
- Use variables for configurable values
- Add comments for complex logic
- Document modules with README files

Example:
```hcl
# Good
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

# Bad
variable "env" {
  type = string
}
```

### Docker

- Use multi-stage builds
- Minimize layer count
- Don't run as root in production
- Add health checks
- Use specific version tags

Example:
```dockerfile
# Good
FROM ubuntu:22.04 AS base
RUN apt-get update && apt-get install -y \
    package1 \
    package2 \
    && rm -rf /var/lib/apt/lists/*

# Bad
FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y package1
RUN apt-get install -y package2
```

### Kubernetes

- Use namespaces for isolation
- Define resource limits
- Add health probes
- Use ConfigMaps and Secrets appropriately
- Include labels for organization

### Shell Scripts

- Use `#!/bin/bash` shebang
- Enable error handling: `set -e`
- Add comments for complex operations
- Make scripts executable: `chmod +x`
- Test with shellcheck

## Testing

### Manual Testing

```bash
# Start services locally
make start

# Check logs
make logs

# Test specific service
docker-compose logs -f service-name
```

### Infrastructure Testing

```bash
# Validate Terraform
make tf-validate

# Test Kubernetes manifests
kubectl apply --dry-run=client -f infra/kubernetes/
```

### Security Testing

```bash
# Run security scans
make security-scan

# Check for secrets
git secrets --scan
```

## Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing functionality
- Add new configuration options
- Fix bugs that affect usage
- Improve deployment processes

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Update relevant README files
- Check for broken links

### Documentation Locations

- `README.md` - Project overview and quick start
- `docs/DEPLOYMENT.md` - Deployment instructions
- `docs/ARCHITECTURE.md` - Architecture documentation
- `infra/terraform/README.md` - Terraform usage
- `infra/kubernetes/README.md` - Kubernetes deployment

## Pull Request Process

### Before Submitting

1. ✅ Ensure all tests pass
2. ✅ Update documentation
3. ✅ Run linters and formatters
4. ✅ Verify security scans pass
5. ✅ Rebase on latest main branch
6. ✅ Write clear commit messages

### Creating a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Title Format**
   ```
   [Type] Brief description
   
   Examples:
   [Feature] Add AWS ECS deployment support
   [Fix] Resolve Terraform state locking issue
   [Docs] Update deployment guide for Azure
   ```

4. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tested locally
   - [ ] Tests pass
   - [ ] Documentation updated
   
   ## Related Issues
   Fixes #123
   ```

### Review Process

1. **Automated Checks**: GitHub Actions will run
   - Terraform validation
   - Docker builds
   - Security scans

2. **Code Review**: Maintainers will review
   - Code quality
   - Documentation
   - Test coverage
   - Security implications

3. **Address Feedback**: Make requested changes
   ```bash
   # Make changes
   git add .
   git commit -m "Address review feedback"
   git push origin feature/your-feature-name
   ```

4. **Approval and Merge**: Once approved, maintainers will merge

## Additional Guidelines

### Security

- **Never commit secrets** (API keys, passwords, credentials)
- Use `.env.example` for configuration templates
- Report security vulnerabilities privately to maintainers
- Run security scans before submitting PRs

### Performance

- Consider resource efficiency
- Optimize Docker images
- Use appropriate resource limits in Kubernetes
- Test at scale when possible

### Backwards Compatibility

- Avoid breaking changes when possible
- Document breaking changes clearly
- Provide migration guides
- Use deprecation warnings

## Getting Help

- **Questions**: Open a [GitHub Discussion](https://github.com/cywf/AegisNet/discussions)
- **Bugs**: Open an [Issue](https://github.com/cywf/AegisNet/issues)
- **Security**: Contact maintainers directly

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project acknowledgments

Thank you for contributing to AegisNet! 🚀
