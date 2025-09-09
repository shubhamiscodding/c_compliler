class CodeGenerator {
  constructor() {
    this.output = [];
  }

  generate(node) {
    switch (node.type) {
      case 'Program':
        return `
          const output = [];
          const printf = (...args) => {
            const format = args[0];
            const params = args.slice(1);
            let result = format.replace(/%(d|s|f)/g, () => params.shift());
            output.push(result);
          };
          ${node.statements.map(stmt => this.generate(stmt)).join('\n')}
          output.join('\\n');
        `;

      case 'PreprocessorDirective':
        // Skip preprocessor directives in JS output
        return '';

      case 'FunctionDeclaration':
        if (node.name === 'main') {
          return `
            function main() {
              ${node.body.map(stmt => this.generate(stmt)).join('\n')}
            }
            main();
          `;
        }
        return `
          function ${node.name}(${node.params.join(', ')}) {
            ${node.body.map(stmt => this.generate(stmt)).join('\n')}
          }
        `;

      case 'FunctionCall':
        return `${node.name}(${node.arguments.map(arg => this.generate(arg)).join(', ')})`;

      case 'StringLiteral':
        return `"${node.value}"`;

      case 'ReturnStatement':
        return `return ${this.generate(node.argument)};`;

      case 'NumberLiteral':
        return node.value.toString();

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}

export default CodeGenerator;
