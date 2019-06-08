export class Comparator<T> {

    public compare : ComparatorFunction<T>;

    constructor(compareFunction?: ComparatorFunction<T>) {
        this.compare = compareFunction || Comparator.defaultCompareFunction;
    }
  

    static defaultCompareFunction<T>(a : T, b : T) {
      if (a === b) {
        return 0;
      }
  
      return a < b ? -1 : 1;
    }
  
    public equal(a : T, b : T) : boolean {
      return this.compare(a, b) === 0;
    }
  
    public lessThan(a: T, b: T) : boolean{
      return this.compare(a, b) < 0;
    }
  

    public greaterThan(a : T, b : T) {
      return this.compare(a, b) > 0;
    }
  
    public lessThanOrEqual(a : T, b : T) {
      return this.lessThan(a, b) || this.equal(a, b);
    }
  

    public greaterThanOrEqual(a : T, b : T) {
      return this.greaterThan(a, b) || this.equal(a, b);
    }

    public reverse() {
      const compareOriginal = this.compare;
      this.compare = (a, b) => compareOriginal(b, a);
    }
  }

  export type ComparatorFunction<T> = (arg0: T, arg1: T, arg2?: T, arg3?: T) => number;