const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Builder, By, Key, until} = require('selenium-webdriver');
server.listen(3002, () => {
    console.log('listening on *:3002');
});
app.get('/api/', (req, res) => {
    res.send('<p>getLink Apis</p>');
});
app.get('/api/zxzj', async (req, res) => {
    var link = req.query.link;
    
    // if(req.query.link.search("zxzj.fun/video/")==12){
    if(req.query.link.search("zxzjtv.com/video/")==12){
        const { Builder } = require('selenium-webdriver');
        const chrome = require('selenium-webdriver/chrome');
        const driver = new Builder()
        .forBrowser('chrome')
        // .setChromeOptions(option)
        .build();
        try{
            await driver.get(link);
            const getEpisodeUrl = async() => {
                var player_data = await driver.executeScript('return player_data');
                return player_data.url;
            }
            const url = await getEpisodeUrl();
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
    }else{
        res.status(200).json({ msg: 'Empty Link', link:null});
    }
});
app.get('/api/zxzj2', async (req, res) => {
    try{
        var link = req.query.link;
        
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