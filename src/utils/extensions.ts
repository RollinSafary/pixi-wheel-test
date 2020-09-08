export type StringIndexedObject<T> = { [key: string]: T };

declare global {
  interface Array<T> {
    contains(element: T): boolean;
    remove(...element: T[]): T[];
    getFirst(): T;
    getLast(): T;
    addAt(index: number, ...elements: T[]): T[];
  }
}
Array.prototype.contains = function<T>(element: T) {
  return this.indexOf(element) !== -1;
};
Array.prototype.remove = function<T>(...elements: T[]) {
  for (const element of elements) {
    this.contains(element) && this.splice(this.indexOf(element), 1);
  }
  return elements;
};
Array.prototype.getLast = function<T>() {
  return this[this.length - 1];
};
Array.prototype.getFirst = function<T>() {
  return this[0];
};
Array.prototype.addAt = function<T>(index: number, ...elements: T[]) {
  const arrayLastPart: T[] = this.splice(index, this.length - index - 1);
  this.remove(...arrayLastPart);
  this.push(...elements, ...arrayLastPart);
  return this;
};
