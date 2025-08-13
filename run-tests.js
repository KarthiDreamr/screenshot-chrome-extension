#!/usr/bin/env node

/**
 * Test runner script for clipboard functionality tests
 * Executes all test suites and provides comprehensive reporting
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Running Clipboard Functionality Test Suite\n');

// Test configuration
const testSuites = [
  {
    name: 'Clipboard API Availability Detection',
    file: 'tests/clipboard-functionality.test.js',
    description: 'Tests clipboard API detection across different browser environments'
  },
  {
    name: 'Preference Persistence',
    file: 'tests/preference-persistence.test.js',
    description: 'Tests clipboard preference storage and retrieval across browser sessions'
  },
  {
    name: 'Integration Scenarios',
    file: 'tests/integration-scenarios.test.js',
    description: 'Tests end-to-end clipboard functionality with different background settings'
  }
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function runTestSuite(suite) {
  console.log(`${colors.blue}${colors.bold}📋 ${suite.name}${colors.reset}`);
  console.log(`${colors.yellow}   ${suite.description}${colors.reset}\n`);
  
  try {
    // Check if test file exists
    if (!fs.existsSync(suite.file)) {
      console.log(`${colors.red}❌ Test file not found: ${suite.file}${colors.reset}\n`);
      return false;
    }
    
    // Run the specific test suite
    const result = execSync(`npx jest ${suite.file} --verbose --no-coverage`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(`${colors.green}✅ ${suite.name} - PASSED${colors.reset}\n`);
    return true;
    
  } catch (error) {
    console.log(`${colors.red}❌ ${suite.name} - FAILED${colors.reset}`);
    console.log(`${colors.red}Error output:${colors.reset}`);
    console.log(error.stdout || error.message);
    console.log('');
    return false;
  }
}

function runAllTests() {
  console.log(`${colors.bold}Running all test suites with coverage...${colors.reset}\n`);
  
  try {
    const result = execSync('npx jest --coverage --verbose', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(result);
    console.log(`${colors.green}${colors.bold}🎉 All tests completed successfully!${colors.reset}\n`);
    return true;
    
  } catch (error) {
    console.log(`${colors.red}${colors.bold}❌ Some tests failed${colors.reset}`);
    console.log(error.stdout || error.message);
    console.log('');
    return false;
  }
}

// Main execution
async function main() {
  console.log(`${colors.bold}Full Screenshot Selector - Clipboard Functionality Tests${colors.reset}`);
  console.log('=' .repeat(60) + '\n');
  
  // Check if package.json and dependencies exist
  if (!fs.existsSync('package.json')) {
    console.log(`${colors.red}❌ package.json not found. Please run npm install first.${colors.reset}`);
    process.exit(1);
  }
  
  // Install dependencies if node_modules doesn't exist
  if (!fs.existsSync('node_modules')) {
    console.log(`${colors.yellow}📦 Installing dependencies...${colors.reset}`);
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log(`${colors.green}✅ Dependencies installed${colors.reset}\n`);
    } catch (error) {
      console.log(`${colors.red}❌ Failed to install dependencies${colors.reset}`);
      process.exit(1);
    }
  }
  
  // Run individual test suites first for detailed reporting
  let allPassed = true;
  
  for (const suite of testSuites) {
    const passed = runTestSuite(suite);
    if (!passed) {
      allPassed = false;
    }
  }
  
  // Run all tests with coverage
  console.log(`${colors.bold}📊 Generating Coverage Report${colors.reset}`);
  console.log('-'.repeat(40) + '\n');
  
  const coveragePassed = runAllTests();
  
  // Final summary
  console.log(`${colors.bold}📋 Test Summary${colors.reset}`);
  console.log('=' .repeat(30));
  
  testSuites.forEach(suite => {
    console.log(`${colors.blue}• ${suite.name}${colors.reset}`);
  });
  
  if (allPassed && coveragePassed) {
    console.log(`\n${colors.green}${colors.bold}🎉 All clipboard functionality tests passed!${colors.reset}`);
    console.log(`${colors.green}✅ Clipboard API availability detection working${colors.reset}`);
    console.log(`${colors.green}✅ Clipboard operations with different backgrounds working${colors.reset}`);
    console.log(`${colors.green}✅ Error handling for clipboard failures working${colors.reset}`);
    console.log(`${colors.green}✅ Preference persistence across sessions working${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}${colors.bold}❌ Some tests failed. Please review the output above.${colors.reset}`);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node run-tests.js [options]

Options:
  --help, -h     Show this help message
  --suite <name> Run specific test suite
  --coverage     Run with coverage report (default)
  --watch        Run in watch mode

Available test suites:
${testSuites.map(s => `  • ${s.name}`).join('\n')}
  `);
  process.exit(0);
}

if (args.includes('--suite')) {
  const suiteName = args[args.indexOf('--suite') + 1];
  const suite = testSuites.find(s => s.name.toLowerCase().includes(suiteName.toLowerCase()));
  
  if (suite) {
    runTestSuite(suite);
  } else {
    console.log(`${colors.red}❌ Test suite not found: ${suiteName}${colors.reset}`);
    console.log(`Available suites: ${testSuites.map(s => s.name).join(', ')}`);
    process.exit(1);
  }
} else if (args.includes('--watch')) {
  console.log(`${colors.blue}👀 Running tests in watch mode...${colors.reset}`);
  execSync('npx jest --watch', { stdio: 'inherit' });
} else {
  main().catch(error => {
    console.error(`${colors.red}❌ Unexpected error:${colors.reset}`, error);
    process.exit(1);
  });
}