

export class GameMath {
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  static toNumShort(n: number): string {
    
    
    
    
    

    if (n >= 1000000000000)
      return Math.floor((n / 1000000000000) * 10) / 10 + '兆'; 
    if (n >= 100000000) return Math.floor((n / 100000000) * 10) / 10 + '亿'; 
    if (n >= 100000) return Math.floor((n / 10000) * 100) / 100 + '万'; 
    

    return n + '';
  }

  
  static random_int(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  
  
  
  
  static random_float(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }




  
  static get_pos_by_auto_layout(max_num: number, idx: number, space: number = 10) {
    let midle = max_num / 2;
    let start = 0

    let pos = start
    if (max_num % 2 == 0) {
      
      start = - (midle + 0.5) * space;
      pos = start + idx * space;
    } else {
      start = - Math.floor(midle) * space
      pos = start + idx * space;

      
      
      
      


      
      
      
      

    }

    return pos;
  }
  
  
  
  
  
  
  

  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  

  
  
  
  
  
  
  

  
  
  
  
  
  
  

  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}
