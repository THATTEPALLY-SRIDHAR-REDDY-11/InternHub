# GitHub Setup Commands

After creating your repository on GitHub, run these commands:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/intern-insight-vault.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Create repository and push (replace YOUR_USERNAME)
gh repo create intern-insight-vault --public --description "A comprehensive platform for students and professionals to manage internships, projects, and career development"
git remote add origin https://github.com/YOUR_USERNAME/intern-insight-vault.git
git branch -M main
git push -u origin main
```