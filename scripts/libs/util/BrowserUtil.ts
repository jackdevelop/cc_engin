
export default class BrowserUtil {

    
    public static clearUrlParam(): void {
        if (!window || !window.history) return;
        window.history.replaceState({}, null, '.');
    }

    
    public static setUrlParam(param: string): void {
        if (!window || !window.history) return;
        window.history.replaceState({}, null, `?${param}`);
    }

    
    public static getUrlParam(key: string): string {
        if (!window || !window.location) return;
        const query = window.location.search.replace('?', '');
        if (query === '') return null;
        const keyValues = query.split('&');
        for (let i = 0; i < keyValues.length; i++) {
            const strings = keyValues[i].split('=');
            if (decodeURIComponent(strings[0]) === key) return decodeURIComponent(strings[1]);
        }
        return null;
    }

    
    public static copy(value: string): boolean {
        if (!document) return false;
        
        let element = document.createElement('textarea');
        element.readOnly = true;
        element.style.opacity = '0';
        element.value = value;
        document.body.appendChild(element);
        
        element.select();
        
        let range = document.createRange();
        range.selectNodeContents(element);
        let selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        let result = document.execCommand('copy');
        element.remove();
        return result;
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

}
