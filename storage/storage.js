import cookie from 'react-cookies';
export function cookies_setUserInfo(key, value){
    const template ={
        userIsAdmin:'',
        userToken:'',
    }
    try{
        cookie.save(key, value, { path: '/' });
    } catch {
        debug('ERROR: failed to cookies_setUserInfo key:'+key+' value:'+value);
    }
}
export function cookies_getUserInfo(key){
    // console.log('key:'+key);
    try{
        const value = cookie.load(key);
        // console.log('value:'+value);
        switch(value){
            case 'true':
                return true;
                break;
            case 'false':
                return false;
            default:
                return value;
        }
        // return value;
    } catch {
        debug('ERROR: failed to cookies_getUserIsAdmin:'+key);
    }
}