# Scripts Organization

This directory contains all the scripts for managing and maintaining the UNC Chatbot system.

## Directory Structure

### 📁 `data/`
Scripts for managing FAQs and data operations:
- `add-*.js` - Scripts to add specific FAQ categories
- `import-*.js` - Data import utilities
- `insert-*.js` - Database insertion scripts
- `load-*.js` - Data loading utilities

### 🔧 `fixes/`
Critical hallucination fixes and corrections:
- `fix-*.js` - Scripts that correct specific misinformation
- Applied when the system provides incorrect information

### 🧪 `tests/`
Testing and validation scripts:
- `*test*.js` - Unit and integration tests
- `*validation*.js` - Comprehensive validation suites
- Quality assurance and regression testing

### ⚙️ `setup/`
System setup and initialization:
- `setup-*.js` - Initial system configuration
- `init-*.js` - Database and service initialization
- `embedding-server.py` - Embedding service setup

### 🔧 `maintenance/`
System maintenance and debugging:
- `debug-*.js` - Debugging utilities
- `verify-*.js` - System verification scripts
- `scrape-*.js` - Web scraping tools

## Key Scripts

### Root Level Scripts
- `agregar-faqs.js` - General FAQ addition utility
- `apply-critical-fixes.js` - Apply all critical hallucination fixes

### Quick Access Commands

```bash
# Test the system
node scripts/tests/100-comprehensive-validation.js

# Apply critical fixes
node scripts/apply-critical-fixes.js

# Add new FAQs
node scripts/data/add-current-student-faqs.js

# Fix hallucinations
node scripts/fixes/fix-ia-admission-hallucination.js
```

## Development Workflow

1. **Testing**: Run validation tests before changes
2. **Development**: Make changes in appropriate category
3. **Testing**: Run tests again to ensure no regressions
4. **Maintenance**: Use maintenance scripts for cleanup

## File Naming Convention

- `snake_case.js` for script names
- Descriptive names indicating purpose
- Category prefixes where appropriate

## Safety Notes

- All scripts include error handling
- Database operations are transactional where possible
- Backups recommended before major data operations
- Test scripts are non-destructive
