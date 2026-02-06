---
name: noir-developer
description: Develop, test, and compile Noir (.nr) smart contracts for blockchain development.
metadata:
  {
    "openclaw": { "emoji": "🔒", "requires": { "bins": ["nargo"] }, "notes": "Requires WSL on Windows systems" },
  }
---

# Noir Developer Skill

This skill provides tools for developing, testing, and compiling Noir smart contracts. Noir is a domain-specific language for zero-knowledge proofs, making it easier to write privacy-preserving applications on the blockchain.

## Important Note for Windows Users
Noir cannot be installed natively on Windows. You must install Windows Subsystem for Linux (WSL) to use this skill. See Installation section below.

## Prerequisites

- Nargo (Noir's package manager and compiler) must be installed
- Node.js and npm (for additional tooling support)

### Installing on Windows (via WSL)

Since Noir doesn't support native Windows installation, you need to use Windows Subsystem for Linux (WSL):

1. Install WSL by running in PowerShell as Administrator:
   ```powershell
   wsl --install
   ```

2. Install Rust in your WSL environment:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.bashrc
   ```

3. Install Nargo:
   ```bash
   cargo install --locked nargo
   ```

### Installing on Linux/macOS

1. Install Rust:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.bashrc
   ```

2. Install Nargo:
   ```bash
   cargo install --locked nargo
   ```

## Core Tools

### Nargo Commands

Nargo is the primary tool for Noir development. Always use it with appropriate flags:

```bash
# Compile Noir code
bash command:"nargo compile"

# Run tests
bash command:"nargo test"

# Execute Noir programs
bash command:"nargo execute <program-name>"

# Prove and verify
bash command:"nargo prove <proof-name>"
bash command:"nargo verify <proof-name>"

# Create new Noir project
bash command:"nargo new <project-name>"
```

### Basic Usage Patterns

#### Creating a new Noir project
```bash
bash command:"nargo new my_noir_project"
```

#### Developing in a Noir project
```bash
# Navigate to project directory first
bash workdir:~/my_noir_project command:"nargo compile"
bash workdir:~/my_noir_project command:"nargo test"
```

#### Running tests
```bash
# Run all tests
bash workdir:~/my_noir_project command:"nargo test"

# Run specific test
bash workdir:~/my_noir_project command:"nargo test <test-function-name>"
```

### Project Structure

A typical Noir project includes:
- `src/main.nr` - Main Noir source file
- `src/lib.nr` - Library functions
- `tests/` - Test files
- `Prover.toml` - Prover inputs
- `Verifier.toml` - Verifier inputs
- `Nargo.toml` - Project configuration

### Zero-Knowledge Development Workflow

1. Write Noir code (.nr files) implementing the desired logic
2. Compile with `nargo compile` to generate ACIR circuit
3. Test with `nargo test` to verify correctness
4. Create proof with `nargo prove` 
5. Verify proof with `nargo verify`

### Error Handling

When compilation or test failures occur:
- Examine the error output carefully
- Check for syntax errors in .nr files
- Ensure all dependencies are properly imported
- Verify that the constraint system is properly defined

### Integration with Blockchain

Noir-generated proofs can be integrated with various blockchain platforms:
- Ethereum (via Aragon's tools or custom verifiers)
- Aztec Network (native support)
- Other EVM-compatible chains

---

## Common Operations

### Initialize new Noir project
```bash
bash command:"nargo new <project-name>"
```

### Compile project
```bash
bash workdir:~/project-name command:"nargo compile"
```

### Run all tests
```bash
bash workdir:~/project-name command:"nargo test"
```

### Generate proof
```bash
bash workdir:~/project-name command:"nargo prove my_proof"
```

### Verify proof
```bash
bash workdir:~/project-name command:"nargo verify my_proof"
```

---

## Tips for Noir Development

1. **Start Simple**: Begin with basic arithmetic circuits before moving to complex zk-SNARKs
2. **Test Thoroughly**: Write comprehensive tests as Noir debugging can be challenging
3. **Understand Constraints**: Remember that every operation adds constraints to the proving system
4. **Optimize Later**: Focus on correctness first, optimization second
5. **Check Gas Costs**: Complex circuits result in higher gas costs when deployed

---

## Troubleshooting

If `nargo` command is not found:
- On Linux/macOS: Install Nargo following official documentation: `cargo install --locked nargo`
- On Windows: Install WSL first, then install Nargo in the WSL environment as described above
- Ensure Rust is installed: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

If running on Windows without WSL:
- You will see "command not found" errors
- Install WSL as described in the Prerequisites section to use this skill

If compilation fails:
- Check for syntax errors in .nr files
- Verify all variables are properly constrained
- Ensure function signatures match expected types

For performance issues:
- Simplify complex logical operations
- Reduce the number of constraints where possible
- Consider circuit size limitations