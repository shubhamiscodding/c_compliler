class CodeGenerator {
  constructor() {
    this.output = [];
  }

  generate(node) {
    switch (node.type) {
      case 'Program':
        return `
          (function() {
            const output = [];
            const printf = (...args) => {
              const format = args[0];
              const params = args.slice(1);
              let result = format.replace(/%(d|s|f)/g, () => params.shift());
              output.push(result);
              return result;
            };
            ${node.statements.map(stmt => this.generate(stmt)).join('\n')}
            return output.join('\\n');
          })();
        `;

      case 'PreprocessorDirective':
        // Skip preprocessor directives in JS output
        return '';

      case 'FunctionDeclaration':
        if (node.name === 'main') {
          return `
            function main() {
              ${node.body.map(stmt => this.generateStatement(stmt)).join('\n')}
            }
            main();
          `;
        }
        return `
          function ${node.name}(${node.params.join(', ')}) {
            ${node.body.map(stmt => this.generateStatement(stmt)).join('\n')}
          }
        `;

      case 'FunctionCall':
        // Handle function calls - no semicolon (will be added by statement handler if needed)
        return `${node.name}(${node.arguments.map(arg => this.generate(arg)).join(', ')})`;

      case 'StringLiteral':
        return `"${node.value}"`;

      case 'ReturnStatement':
        return `return ${this.generate(node.argument)};`;

      case 'NumberLiteral':
        return node.value.toString();

      case 'IfStatement':
        let result = `if (${this.generate(node.condition)}) `;
        if (node.consequent.type === 'BlockStatement') {
          result += `{\n${node.consequent.body.map(stmt => this.generate(stmt)).join('\n')}\n}`;
        } else {
          result += this.generate(node.consequent);
        }
        if (node.alternate) {
          result += ' else ';
          if (node.alternate.type === 'BlockStatement') {
            result += `{\n${node.alternate.body.map(stmt => this.generate(stmt)).join('\n')}\n}`;
          } else {
            result += this.generate(node.alternate);
          }
        }
        return result;

      case 'BinaryExpression':
        return `${this.generate(node.left)} ${node.operator} ${this.generate(node.right)}`;

      case 'BlockStatement':
        return node.body.map(stmt => this.generate(stmt)).join('\n');

      case 'Identifier':
        return node.name;

      case 'ForStatement':
        let forCode = '';
        if (node.init) {
          forCode += `let ${node.init.identifier.name} = ${this.generate(node.init.value)};\n`;
        }
        forCode += `for (; ${this.generate(node.condition)}; `;
        if (node.update) {
          forCode += `${node.update.left.name} = ${this.generate(node.update.right)}`;
        }
        forCode += ') ';
        if (node.body.type === 'BlockStatement') {
          forCode += `{\n${node.body.body.map(stmt => this.generateStatement(stmt)).join('\n')}\n}`;
        } else {
          forCode += this.generateStatement(node.body);
        }
        return forCode;

      case 'AssignmentStatement':
        return `${node.left.name} = ${this.generate(node.right)};`;

      case 'VariableDeclaration':
        if (this.isInFunction) {
          return `let ${node.identifier.name} = ${this.generate(node.value)};`;
        }
        return `var ${node.identifier.name} = ${this.generate(node.value)};`;

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  generateStatement(node) {
    if (node.type === 'FunctionCall') {
      return this.generate(node) + ';';
    }
    return this.generate(node);
  }
}

export default CodeGenerator;
