const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const server = http.createServer(app);
const {Builder, By, Key, until} = require('selenium-webdriver');
var corsOptions = {
    origin: '*',
    // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const drivers = [];
var index=0;
try{
    server.listen(3002, () => {
        console.log('listening on *:3002');
    });
    app.get('/api/', (req, res) => {
        res.send('<p>getLink Apis</p>');
    });

    app.get('/api/zxzj', cors(corsOptions), async (req, res) => {
        index++;
        var link = req.query.link;
        console.log(index+'_API/ZXZJ-->REQUEST:'+link);
        // if(req.query.link.search("zxzj.fun/video/")==12){
        if(req.query.link.search("zxzjtv.com/video/")==12){
            const result = await zxzj(link, index);
            res.status(200).json(result);
        }else{
            res.status(200).json({ msg: 'Empty Link', link:null});
        }
    });

    app.get('/api/zxzj2', cors(corsOptions), async (req, res) => {
        try{
            var link = req.query.link;
            console.log('API/ZXZJ2-->REQUEST:'+link);
            
            if(req.query.link.search("zxzjtv.com/ckplayer.php?")==12){
                const { Builder } = require('selenium-webdriver');
                const chrome = require('selenium-webdriver/chrome');
                const driver = new Builder()
                .forBrowser('chrome')
                // .setChromeOptions(option)
                .build();
                try{
                    await driver.get(link);
                    const getEpisodeUrl = async() => {
                        var url = await driver.executeScript('return urls');
                        return url;
                    }
                    const url = await getEpisodeUrl();
                    console.log('API/ZXZJ2-->[SUCCESS]-->LINK:'+url);

                    res.status(200).json(
                        { 
                            link: link,
                            videoUrl: url
                        }
                    );
                }catch(error){
                    res.status(200).json({ msg: error , link:null});
                    try{
                        driver.close();
                    }catch{
                        console.log('No Driver');
                    }
                }
                driver.quit();
                // driver.close();
            }else{
                res.status(200).json({ msg: 'Empty Link', link:null});
            }
        }catch(error){
            console.log('fatal Error');
            console.log(error);
            res.status(200).json({ msg: 'fatal Error', link:null});
        }
    });
}catch(error){
    console.log('MAJOR MAJOR ERROR');
    console.log(error);
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