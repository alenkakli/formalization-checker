import {
  Conjunction, Constant,
  Disjunction, EqualityAtom,
  Equivalence,
  ExistentialQuant,
  FunctionApplication,
  Implication, Negation, PredicateAtom, UniversalQuant,
  Variable
} from "./formula_classes";

export const arrayToArityMap = (symbols) => {
  let arityMap = new Map();
  for (let x of symbols) {
    if (!arityMap.has(x.name)) {
      arityMap.set(x.name, x.arity);
    }
  }
  return arityMap;
}

export const parseLanguageSubset = (input, parser) => {
  try {
    let result = parser(input);
    return {
      array: result,
      error: null
    };
  } catch (error) {
    return {
      array: [],
      error: error
    };
  }
}

const checkArity = (symbol, args, arityMap, {expected}) => {
  const a = arityMap.get(symbol);
  if (args.length !== a) {
    expected(`${a} argument${(a === 1 ? '' : 's')} to ${symbol}`);
  }
}

export const parseFormalization = (input, constants, predicates, functions, parser) => {
  const nonLogicalSymbols = new Set([
    ...constants,
    ...predicates.keys(),
    ...functions.keys()
  ]);

  const language = {
    isConstant: (x) => constants.has(x),
    isPredicate: (x) => predicates.has(x),
    isFunction: (x) => functions.has(x),
    isVariable: (x) => !nonLogicalSymbols.has(x)
  };

  const factories = {
    functionApplication: (symbol, args, ee) => {
      checkArity(symbol, args, functions, ee);
      return new FunctionApplication(symbol, args);
    },
    predicateAtom: (symbol, args, ee) => {
      checkArity(symbol, args, predicates, ee);
      return new PredicateAtom(symbol, args);
    },
    variable: (v, _) =>  new Variable(v , v),
    constant: (c, _) => new Constant(c, c),
    equalityAtom: (lhs, rhs, _) => new EqualityAtom(lhs, rhs),
    negation: (f, _) => new Negation(f),
    conjunction: (lhs, rhs, _) => new Conjunction(lhs, rhs),
    disjunction: (lhs, rhs, _) => new Disjunction(lhs, rhs),
    implication: (lhs, rhs, _) => new Implication(lhs, rhs),
    equivalence: (lhs, rhs, _) => new Equivalence(lhs, rhs),
    existentialQuant: (v, f, _) => new ExistentialQuant(v, f),
    universalQuant: (v, f, _) => new UniversalQuant(v, f),
  };

  try {
    const fvars = parser(input, language, factories).getFreeVariables();
    if (fvars.size > 0) {
      throw ({
        location: {
          start: {
            column: 0, line: 0, offset: 0
          },
          end: {
            column: 0, line: 0, offset: input.length
          }
        },
        message:
          `The formula should be closed, but the following
          variable${fvars.size === 1 ? " is" :  "s are"} free:
          ${Array.from(fvars).join(", ")}.`
      });
    }
    return null;
  } catch (error) {
    return error;
  }
}

export const makeStructure = (iCWithUnnamed, iPF, C_L) => (
  !!iCWithUnnamed
  ? {
    D: Array.from(new Set(Object.values(iCWithUnnamed))).sort(),
    iC: Object.fromEntries(
      Object.entries(iCWithUnnamed).filter(([name, _]) => C_L.has(name))
    ),
    iP: iPF,
    iF: null,
  }
  : undefined
);
