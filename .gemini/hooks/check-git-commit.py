import sys
import json
import subprocess
import os

def main():
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)
        
        # Check if it's the right tool
        if input_data.get('tool_name') == 'run_shell_command':
            tool_input = input_data.get('tool_input', {})
            command = tool_input.get('command', '')
            
            # Check if command contains 'git commit'
            if 'git commit' in command:
                # Run the pre-commit check script
                # Use absolute path or relative to project root
                script_path = os.path.join(os.getcwd(), '.gemini/hooks/pre-commit-check.sh')
                
                print(f"🔒 Intercepted git commit. Running pre-commit checks...", file=sys.stderr)
                
                try:
                    subprocess.run([script_path], check=True)
                except subprocess.CalledProcessError:
                    # If check fails, we should ideally prevent the tool execution
                    # But since this is a 'command' hook type (side effect), we can only warn/error
                    # For strict blocking, we'd need a 'decision' based hook if supported, 
                    # or just let the user see the error output.
                    print("❌ Pre-commit checks failed! Stopping commit.", file=sys.stderr)
                    # Returning error exit code might stop the tool chain depending on CLI implementation
                    sys.exit(1)
                    
    except Exception as e:
        # If something goes wrong in the hook, log it but don't break everything
        print(f"Hook error: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()
