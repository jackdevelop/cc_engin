
var _ = require('Underscore');


export class NetHttp {
  
  
  

  
  static async fetch_get_json(url: string): Promise<object> {
    try {
      let response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      
      return null;
    }
  }

  
  static async fetch_post_json(url: string, body: object): Promise<object> {
    try {
      let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      
      return null;
    }
  }

  
  static xhr_get_json(
    url: string,
    param,
    header_data: object
  ): Promise<object> {
    let new_url = url + '?';
    for (var key in param) {
      if (param[key]) {
        new_url += key + '=' + param[key] + '&';
      }
    }

    return new Promise((res) => {
      try {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', new_url, true);
        
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onerror = () => {
          throw new Error('xhr-on-error');
        };
        xhr.ontimeout = () => {
          throw new Error('xhr-on-timeout');
        };
        xhr.onreadystatechange = () => {
          if (xhr.readyState != 4) {
            return;
          }
          if (xhr.status >= 200 && xhr.status < 400) {
            res(xhr.response);
          } else {
            throw new Error('xhr-status-not-200-400');
          }
        };
        xhr.send();
      } catch (error) {
        cc.log('xhr_get_json:' + error);
        
        res(null);
      }
    });
  }

  
  static async xhr_post_json(
    url: string,
    body: object,
    header_data: object
  ): Promise<object> {
    return new Promise((res) => {
      try {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('POST', url, true);

        
        
        
        
        
        
        
        
        

        _.each(header_data, function (v, k) {
          xhr.setRequestHeader(k, v);
        });

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onerror = () => {
          res(null);
          throw new Error('xhr-on-error');
        };
        xhr.ontimeout = () => {
          res(null);
          throw new Error('xhr-on-timeout');
        };
        
        xhr.onreadystatechange = () => {
          if (xhr.readyState != 4) {
            return;
          }
          if (xhr.status >= 200 && xhr.status < 400) {
            cc.log(JSON.stringify(xhr));
            res(xhr.response);
          } else {
            res(null);
            
          }
        };
        xhr.send(JSON.stringify(body));
      } catch (error) {
        cc.log('xhr_post_json:' + error);
        
        res(null);
      }
    });
  }

  
  static async xhr_put_json(url: string, body: object): Promise<object> {
    return new Promise((res) => {
      try {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('PUT', url, true);
        
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onerror = () => {
          throw new Error('xhr-on-error');
        };
        xhr.ontimeout = () => {
          throw new Error('xhr-on-timeout');
        };
        
        xhr.onreadystatechange = () => {
          if (xhr.readyState != 4) {
            return;
          }
          if (xhr.status >= 200 && xhr.status < 400) {
            res(xhr.response);
          } else {
            res(null);
            throw new Error('xhr-status-not-200-400');
          }
        };
        xhr.send(JSON.stringify(body));
      } catch (error) {
        
        res(null);
      }
    });
  }

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}
