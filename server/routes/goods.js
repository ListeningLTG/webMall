var express=require('express')
var router=express.Router();
var mongoose=require('mongoose')
var Goods=require('../models/goods')

//连接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on("open",function () {
    console.log("MongoDB connected success.")
})

mongoose.connection.on("error",function () {
    console.log("MongoDB connected fail.")
})

mongoose.connection.on("disconnected",function () {
    console.log("MongoDB disconnected.")
})

//查询商品列表
router.get("/",function (req,res,next) {
    let page=parseInt(req.param("page"))
    let pageSize=parseInt(req.param("pageSize"))
    let priceLever=req.param("priceLever")
    let sort=req.param("sort")
    let skip=(page-1)*pageSize
    var priceGt='',priceLte=''
    let params={}
    if (priceLever!='all') {
        switch (priceLever) {
            case '0':priceGt=0;priceLte=500; break;
            case '1':priceGt=500;priceLte=1000; break;
            case '2':priceGt=1000;priceLte=5000; break;
            default:break;
        }
        params={
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }
    
    let goodsModel=Goods.find(params).skip(skip).limit(pageSize)
    goodsModel.sort({"salePrice":sort})

    goodsModel.exec(function (err,doc) {
        if (err) {
            res.json({
                status:'1',
                msg:err.message
            })
        } else {
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            })
        }
    })
});

//添加到购物车
router.post("goods/addCart",function (req,res,next) {
    var userId='100000077',
    var User=require('../models/user')
    
    User.findOne({})
})

module.exports=router;