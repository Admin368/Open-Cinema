const {Builder, By, Key, until} = require('selenium-webdriver');
// import Cors from 'cors';

const getEpisodeUrl = async() => {
    var player_data = await driver.executeScript('return player_data');
    return player_data.url;
}
const drivers = [];
var index=0;
export default async function handler(req, res) {
    try{
        index++;
        var link = req.query.link;
        var type = req.query.type;
        if(!link||!type){res.status(200).json({ msg: 'Empty Link / Type', link:null});return}
        console.log(index+'_API/ZXZJ-->REQUEST:'+link);
        switch(type){
            case 'zxzj':
                if(req.query.link.search("zxzjtv.com/video/")==12){
                    const result = await zxzj(link, index);
                    res.status(200).json(result);
                }else{
                    res.status(200).json({ msg: index+'_Empty Link or Wrong Format', link:null});
                }
                break;
            case 'zxzj2':
                if(req.query.link.search("zxzjtv.com/ckplayer.php?")==12){
                    const result = await zxzj2(link, index);
                    res.status(200).json(result);
                }else{
                    res.status(200).json({ msg: index+'_Empty Link or Wrong Format', link:null});
                }
                break;
            default:
                res.status(200).json({ msg: index+'_Type Unknown', link:null});
        }
    }catch(error){
        console.log('MAJOR MAJOR ERROR');
        console.log(error);
    }
}

async function zxzj(link, index){
    console.log(index+'ACCEPTED ');
    try{
        const { Builder } = require('selenium-webdriver');
        const chrome = require('selenium-webdriver/chrome');
        drivers[index] = new Builder()
        .forBrowser('chrome')
        // .setChromeOptions(option)
        .build();
            await drivers[index].get(link);
            const getEpisodeUrl = async() => {
                var player_data = await drivers[index].executeScript('return player_data');
                return player_data.url;       
            }
            const url = await getEpisodeUrl();
            console.log('API/ZXZJ2-->[SUCCESS]-->LINK:'+url);
            drivers[index].close();
            return { 
                link: link,
                videoUrl: url
            }
        }catch(error){
            try{
                drivers[index].close();
                const errorMsg =`REQUEST:${index} ERROR1: Failed to getVideo Link, Check link`;
                console.log(errorMsg);
                // console.log(error);
                return{ msg: errorMsg , link:null};
            }catch{
                const errorMsg =`REQUEST:${index} ERROR2: No Driver`;
                console.log(errorMsg);
                return{ msg: errorMsg, link:null};
            }
        }
        drivers[index].close();
}

async function zxzj2(link, index){
    console.log(index+'ACCEPTED ');
    try{
        const { Builder } = require('selenium-webdriver');
        const chrome = require('selenium-webdriver/chrome');
        drivers[index] = new Builder()
        .forBrowser('chrome')
        // .setChromeOptions(option)
        .build();
            await drivers[index].get(link);
            const getEpisodeUrl = async() => {
                var urls = await drivers[index].executeScript('return urls');
                return urls;
            }
            const url = await getEpisodeUrl();
            console.log('API/ZXZJ2-->[SUCCESS]-->LINK:'+url);
            drivers[index].close();
            return { 
                link: link,
                videoUrl: url
            }
        }catch(error){
            try{
                drivers[index].close();
                const errorMsg =`REQUEST:${index} ERROR1: Failed to getVideo Link, Check link`;
                console.log(errorMsg);
                // console.log(error);
                return{ msg: errorMsg , link:null};
            }catch{
                const errorMsg =`REQUEST:${index} ERROR2: No Driver`;
                console.log(errorMsg);
                return{ msg: errorMsg, link:null};
            }
        }
        drivers[index].close();
}