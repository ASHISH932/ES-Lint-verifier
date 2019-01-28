# ES Lint verifier

This tool is used to check the deprecated and removed rules after migration to a newer version of ESlint

## Problem Statement
The scipt file required in problem statement is `eslintScript.js`
It return three list  
    - Deprecated Rules list    
    - Removed rules list    
    - New Rules list(List of rules which could replace derecated rule and supported by ESlint)  

### Implementation
It requires no input, by default it searches for default eslint config files.
User can provide the config file path using `-p` or `--path` flag
If user has some self made rules it should include the path to that rule using `-r` or `--rule` flag
For more information on using flag use help
```bash
    node eslint_script --help
```

## Installation

```bash
git clone https://github.com/ASHISH932/ES-Lint-verifier.git
cd ES-Lint-verifier
npm intsall
```

## Usage

```bash
node eslint_script [options]
```

### Available options
Options:
      
    -h, --help                 output usage information
    -r, --rule <ruleFolderPath>  The path to custom rules folder(optional)
    -p, --path <configPath>  Path to project's config file path(optional)
