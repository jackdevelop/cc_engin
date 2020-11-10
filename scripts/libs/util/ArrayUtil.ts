export default class ArrayUtil {
  public static copy2DArray(array: any[][]): any[][] {
    let newArray: any[][] = [];
    for (let i = 0; i < array.length; i++) {
      newArray.push(array[i].concat());
    }
    return newArray;
  }
  public static fisherYatesShuffle(array: any[]): any[] {
    let count = array.length;
    while (count) {
      let index = Math.floor(Math.random() * count--);
      let temp = array[count];
      array[count] = array[index];
      array[index] = temp;
    }
    return array;
  }
  public static confound(array: []): any[] {
    let result = array.slice().sort(() => Math.random() - 0.5);
    return result;
  }
  public static flattening(array: any[]) {
    for (; array.some((v) => Array.isArray(v)); ) {
      array = [].concat.apply([], array);
    }
    return array;
  }
  public static combineArrays(array1: any[], array2: any[]): any[] {
    let newArray = [...array1, ...array2];
    return newArray;
  }
  public static getRandomValueInArray(array: any[]): any {
    let newArray = array[Math.floor(Math.random() * array.length)];
    return newArray;
  }
}
