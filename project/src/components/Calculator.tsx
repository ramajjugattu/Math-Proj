import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { evaluate, derivative, parse, simplify, integral, abs } from 'mathjs';

const Calculator: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const solveQuestion = async () => {
    try {
      if (!input.trim()) {
        setResponse("Please enter a mathematical expression or question.");
        return;
      }

      let answer = '';
      const userInput = input.toLowerCase().trim();

      // Clean and prepare the input for mathematical expressions
      let cleanInput = input.trim()
        .replace(/\s+/g, '')
        .replace(/([0-9])([a-zA-Z])/g, '$1*$2');

      // Handle different types of mathematical questions
      if (userInput.includes('solve') || userInput.includes('calculate') || userInput.includes('evaluate')) {
        // Basic evaluation
        try {
          const result = evaluate(cleanInput.replace(/solve|calculate|evaluate/gi, '').trim());
          answer = `The result is: ${result}`;
        } catch (e) {
          // If direct evaluation fails, try parsing as an equation
          const equationParts = cleanInput.split('=');
          if (equationParts.length === 2) {
            try {
              const leftSide = parse(equationParts[0]);
              const rightSide = parse(equationParts[1]);
              answer = `This is an equation. Try rearranging it to standard form.`;
            } catch (eqError) {
              throw new Error("Couldn't parse the equation");
            }
          }
        }
      } else if (userInput.includes('derivative') || userInput.includes('differentiate')) {
        // Handle derivatives
        const expr = userInput.replace(/(find|the|derivative|of|differentiate|with|respect|to|d\/dx)/gi, '').trim();
        const parsed = parse(expr);
        const der = derivative(parsed, 'x');
        const simplified = simplify(der);
        answer = `The derivative of ${expr} is:\n${simplified.toString()}`;
      } else if (userInput.includes('integral') || userInput.includes('integrate')) {
        // Handle basic integrals
        const expr = userInput.replace(/(find|the|integral|of|integrate|with|respect|to)/gi, '').trim();
        answer = `For the integral of ${expr}:\n`;
        answer += `1. This is an indefinite integral\n`;
        answer += `2. Remember to add + C for the constant of integration`;
        
        // Add common integral patterns
        if (expr.includes('x^')) {
          answer += `\n3. For x^n, the integral is (x^(n+1))/(n+1) + C`;
        }
      } else {
        // Try to evaluate as a mathematical expression
        try {
          const expr = parse(cleanInput);
          const result = evaluate(expr);
          answer = `The result is: ${result}`;
        } catch (e) {
          // If all else fails, provide a general response
          answer = "I can help you with:\n" +
                  "1. Derivatives (e.g., 'derivative of x^2')\n" +
                  "2. Basic calculations (e.g., '2 + 2')\n" +
                  "3. Evaluating expressions (e.g., '3x^2 when x = 2')\n" +
                  "4. Basic integrals (e.g., 'integral of x^2')\n\n" +
                  "Please rephrase your question using one of these formats.";
        }
      }

      setResponse(answer);
    } catch (err) {
      setResponse(
        "I can help you with these types of questions:\n\n" +
        "1. Derivatives:\n" +
        "   - 'derivative of x^2'\n" +
        "   - 'differentiate 2x^3 + 3x'\n\n" +
        "2. Basic Calculations:\n" +
        "   - '2 + 2'\n" +
        "   - '3 * 4'\n\n" +
        "3. Expressions:\n" +
        "   - 'solve 3x^2 when x = 2'\n" +
        "   - 'evaluate 2x + 3 when x = 4'\n\n" +
        "4. Integrals:\n" +
        "   - 'integral of x^2'\n" +
        "   - 'integrate 2x'\n\n" +
        "Please use proper mathematical notation:\n" +
        "- Multiplication: 2*x or 2x\n" +
        "- Powers: x^2 or x^3\n" +
        "- Addition/Subtraction: + or -"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-800">Math AI Assistant</h1>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Ask me to solve math problems! Try these:
                <br />• "derivative of x^2"
                <br />• "solve 2 + 2"
                <br />• "evaluate 3x^2 when x = 2"
                <br />• "integral of x^2"
              </p>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your math question here..."
              className="w-full p-4 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-indigo-500 font-mono"
            />

            <button
              onClick={solveQuestion}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Solve
            </button>

            {response && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <pre className="whitespace-pre-wrap font-mono text-gray-800">
                  {response}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;