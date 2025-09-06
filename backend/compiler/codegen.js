class CodeGenerator {
  generate(node) {
    switch (node.type) {
      case 'Program':
        return node.statements.map(stmt => this.generate(stmt)).join('\n');

      case 'VariableDeclaration':
        return `int ${this.generate(node.identifier)} = ${this.generate(node.value)};`;

      case 'BinaryExpression':
        return `(${this.generate(node.left)} ${node.operator} ${this.generate(node.right)})`;

      case 'Identifier':
        return node.name;

      case 'NumberLiteral':
        return node.value;

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}

export default CodeGenerator;
