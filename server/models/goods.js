var mongoose=require('mongoose')
var Schema=mongoose.Schema

var produtSchema=new Schema({
    "productID":String,
    "productName":String,
    "salePrice":Number,
    "productImage":String
});

module.exports=mongoose.model('Goods',produtSchema)
