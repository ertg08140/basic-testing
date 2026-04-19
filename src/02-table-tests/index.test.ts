// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  // Add
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },

  // Subtract
  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 3, b: 4, action: Action.Subtract, expected: -1 },
  { a: 0, b: 3, action: Action.Subtract, expected: -3 },

  // Multiply
  { a: 1, b: 2, action: Action.Multiply, expected: 2 },
  { a: 3, b: 0, action: Action.Multiply, expected: 0 },
  { a: -2, b: 4, action: Action.Multiply, expected: -8 },

  // Divide
  { a: 6, b: 2, action: Action.Divide, expected: 3 },
  { a: 5, b: 2, action: Action.Divide, expected: 2.5 },
  { a: 2, b: 4, action: Action.Divide, expected: 0.5 },

  // Exponate
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 0, action: Action.Exponentiate, expected: 1 },
  { a: 9, b: 0.5, action: Action.Exponentiate, expected: 3 },

  // Invalid
  { a: '2', b: 3, action: Action.Add, expected: null },
  { a: 2, b: '3', action: Action.Subtract, expected: null },
  { a: 2, b: 3, action: 'Fake' as Action, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return $expected for $a $action $b',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toEqual(expected);
    },
  );
});
