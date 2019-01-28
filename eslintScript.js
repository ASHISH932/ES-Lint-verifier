/**
 * This script is made for finding out deprecated rules of ESLint
 * It supports js, json and YAML configuration format
 * If no configuration file is provided during runtime the script would search for
 * default config file
 * To provide external config file use "-p" or "--path" flag
 * If you have some of your custom made rules you should provide the path of the
 * folder it is contained so that it does not show up remove
 * To provide path of rules folder use "-f" or "--rule"
 */


const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

let customRuleFilePath;
let configFilePath;

const genrateHelp = () => {
    console.log(`Usage: node eslint_script [options]

        Options:
      
          -h, --help                 output usage information
          -r, --rule <ruleFolderPath>  THe path to custom rules folder(optional)
          -p, --path <configPath>  Path to project's config file path(optional)
          `)
}

// Reading Flags
if(process.argv.length > 0) {
    const helpIndex = process.argv.indexOf('-h') || process.argv.indexOf('--help');
    if (helpIndex !== -1) {
        genrateHelp();
        process.exit(0);
    }
    const fileIndex = process.argv.indexOf('-f') || process.argv.indexOf('--rule');
    fileIndex !== -1 ? customRuleFilePath = process.argv[fileIndex + 1] : false;
    const configIndex = process.argv.indexOf('-p') || process.argv.indexOf('--path')
    configIndex !== -1 ? configFilePath = process.argv[configIndex + 1] : false;
}

// Config file content
let es;
if(!!configFilePath && fs.existsSync(configFilePath)) {
    const fileJS = configFilePath.search(/([a-zA-Z0-9\s_\\.\-\(\):])+(.js|.json)$/i);
    const fileYAML = configFilePath.search(/([a-zA-Z0-9\s_\\.\-\(\):])+(.yml|.yaml)$/i);
    if(fileJS !== -1) {
        es = require(configFilePath);
    } else if(fileYAML !== -1) {
        es = yaml.safeLoad(fs.readFileSync(configFilePath));
    } else {
        throw new Error("File Extension not supported.(Supported etensions -> yaml,yml,js,json)");
    }
} else if(fs.existsSync('./.eslintrc.json')){
    console.log('default');
    es = require('./.eslintrc.json');
} else if (fs.existsSync('./.eslintrc.js')) {
    es = require('./.eslintrc.js');
} else if (fs.existsSync('./.eslintrc.yaml')){
    es = yaml.safeLoad(fs.readFileSync('./.eslintrc.yaml'));
} else {
    throw new Error("Configuration file not found");
}

// Extracting the rules used 
const rules = Object.keys(es.rules)
const deprecated = [];
const removed = [];
const newRule = new Set();

rules.forEach(r => {
    let rule_file;
    if(customRuleFilePath && fs.existsSync(path.join(customRuleFilePath,`${r}.js`))){
        // Custom made rule found
        return;
    } else if(fs.existsSync(`node_modules/eslint/lib/rules/${r}.js`)) {
        rule_file = require(`eslint/lib/rules/${r}.js`);
    } else {
        // File not found means the rule must have been removed
        removed.push(r);
        return;
    }
    const d = rule_file.meta.deprecated;
    const rB = rule_file.meta.replacedBy;
    if(d) {
        deprecated.push(r);
        rB.forEach (b => newRule.add(b));
    }
})

if(deprecated.length > 0) {
    console.log("\n Deprecated Rules:-");
    deprecated.forEach(d => console.log(` * ${d}`));
}

if(removed.length > 0) {
    console.log("\n Removed Rules:-");
    removed.forEach(r => console.log(` * ${r}`));
}

if(newRule.size > 0) {
    console.log("\n New Rules:- ");
    newRule.forEach(n => console.log(` * ${n}`));
}
