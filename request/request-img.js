/**
 * 使用request模块
 * 爬取图片
 * img文件夹删后需手动创建文件夹
 */
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

// 目标地址
var targetUrl = 'http://sc.chinaz.com/tupian/beijingtupian.html';

request(targetUrl,(err,res,body)=>{
    // 将body转成jquery可以操作的对象
    var $ = cheerio.load(body);
    $('img').each((i,e)=>{
        // 图片地址
        var imgUrl = $(e).attr("src2");
        // 获取图片格式
        var arr = imgUrl.split('.');
        var suffix = arr[arr.length-1];
        // 图片写入本地
        request(imgUrl).pipe(fs.createWriteStream('img/'+i+'.'+suffix))
    })
})