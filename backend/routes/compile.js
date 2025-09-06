import express from 'express';
import admin from '../firebaseAdmin.js';
import Lexer from '../compiler/lexer.js';
import Parser from '../compiler/parser.js';
import CodeGenerator from '../compiler/codegen.js';
import vm from 'vm';
import { Octokit } from '@octokit/rest';

const router = express.Router();

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Compile and run C code
router.post('/compile', verifyToken, async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // Capture console.log output
    let output = '';
    const originalLog = console.log;
    console.log = (...args) => {
      output += args.join(' ') + '\n';
    };

    // Compile and run
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const generator = new CodeGenerator();
    const jsCode = generator.generate(ast);

    // Execute in VM for safety
    const context = {};
    vm.createContext(context);
    vm.runInContext(jsCode, context, { timeout: 5000 });

    // Restore console.log
    console.log = originalLog;

    res.json({ 
      success: true,
      output,
      compiledCode: jsCode 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message,
      stage: error.stage || 'unknown'
    });
  }
});

// Save code as GitHub gist
router.post('/save', verifyToken, async (req, res) => {
  const { code, description } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const octokit = new Octokit({
      auth: req.user.github_token
    });

    const gist = await octokit.gists.create({
      description: description || 'Created with C Compiler Web IDE',
      public: true,
      files: {
        'main.c': {
          content: code
        }
      }
    });

    res.json({
      success: true,
      gistId: gist.data.id,
      gistUrl: gist.data.html_url
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
