const isDebuging = true;

//CONSOLE COLORS & PRESETS
const clr_Reset = "\x1b[0m";
const clr_Bright = "\x1b[1m";
const clr_Dim = "\x1b[2m";
const clr_Underscore = "\x1b[4m";
const clr_Blink = "\x1b[5m";
const clr_Reverse = "\x1b[7m";
const clr_Hidden = "\x1b[8m";
const clr_FgBlack = "\x1b[30m";
const clr_FgRed = "\x1b[31m";
const clr_FgGreen = "\x1b[32m";
const clr_FgYellow = "\x1b[33m";
const clr_FgBlue = "\x1b[34m";
const clr_FgMagenta = "\x1b[35m";
const clr_FgCyan = "\x1b[36m";
const clr_FgWhite = "\x1b[37m";
const clr_BgBlack = "\x1b[40m";
const clr_BgRed = "\x1b[41m";
const clr_BgGreen = "\x1b[42m";
const clr_BgYellow = "\x1b[43m";
const clr_BgBlue = "\x1b[44m";
const clr_BgMagenta = "\x1b[45m";
const clr_BgCyan = "\x1b[46m";
const clr_BgWhite = "\x1b[47m";

export function debug(msg){
    if(isDebuging==true){
        var text_color=clr_FgCyan;
        var text_type=clr_Reset;
        if(msg.search('ERROR:')==0){text_color=clr_FgRed;text_type=clr_Bright}
        if(msg.search('SERVER:')==0){text_color=clr_FgMagenta;text_type=clr_Underscore}
        if(msg.search('SUCCESS:')==0){text_color=clr_FgGreen;text_type=clr_Bright}
        if(msg.search('WAITING:')==0){text_color=clr_FgYellow;text_type=clr_Reset}
        if(msg.search('CONNECTED:')==0){text_color=clr_FgBlue;text_type=clr_Bright}
        if(msg.search('DISCONNECTED:')==0){text_color=clr_FgYellow;text_type=clr_Bright}
        if(msg.search('CLEAR:')==0){text_color=clr_FgWhite;text_type=clr_Reset}
        var caller = 'App';
        // if(caller!=null){
        //     caller = debug.caller.name;
        //     // console.log(text_type+text_color+text);
        // }
        // const text = caller+'()->'+msg;
        const text = '()->'+msg;
        console.log(text_type+text_color+text);
    }
}
