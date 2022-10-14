export class BinaryFormula {
  constructor(lhs, rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
  }

  getFreeVariables() {
    let a = addAll(new Set(), this.lhs.getFreeVariables());
    return addAll(a, this.rhs.getFreeVariables())
  }
}

export class QuantifiedFormula {
  constructor(originalSymbol, subf) {
    this.originalSymbol = originalSymbol;
    this.subf = subf;
  }
  getFreeVariables() {
    const res = this.subf.getFreeVariables()
    res.delete(this.originalSymbol);
    return res;
  }
}

export class Variable {
  constructor(originalSymbol) {
    this.originalSymbol = originalSymbol;
  }

  getFreeVariables(){
    return new Set([this.originalSymbol]);

  }
}

export class Constant {
  constructor(originalSymbol) {
    this.originalSymbol = originalSymbol;
  }

  getFreeVariables(){
    return new Set();
  }
}

export class FunctionApplication {
  constructor(originalSymbol, args) {
    this.originalSymbol = originalSymbol;
    this.args = args;
  }
  getFreeVariables(){
    return this.args.reduce(
        (fvs, arg) => addAll(fvs, arg.getFreeVariables()),
        new Set()
    );
  }
}

export class PredicateAtom {
  constructor(originalSymbol, args) {
    this.originalSymbol = originalSymbol;
    this.args = args;
  }
  getFreeVariables() {
    return this.args.reduce(
        (fvs, arg) => addAll(fvs, arg.getFreeVariables()),
        new Set()
    );
  }
}

export class EqualityAtom extends BinaryFormula{
}

export class Negation {
  constructor(subf) {
    this.subf = subf;
  }

  getFreeVariables(){
    return this.subf.getFreeVariables();
  }
}

export class Conjunction extends BinaryFormula{
}

export class Disjunction extends BinaryFormula{
}

export class Implication extends BinaryFormula{
}

export class Equivalence extends BinaryFormula{
}

export class ExistentialQuant extends QuantifiedFormula{
}

export class UniversalQuant extends QuantifiedFormula{
}

function addAll(a, b) {
  b.forEach((elem) => a.add(elem));
  return a;
}
