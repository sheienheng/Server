/**
 * Created by hama on 2017/10/23.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Products = require('../models/products');
var db = require('../models/db');
//查询商品列表数据
router.get("/list", function (req,res,next) {
    let productType = req.param("productType");
    let goodsModel = Products.find({productType:productType});
    goodsModel.exec(function (err,doc) {
        if(err){
            res.json({
                status:'1',
                msg:err.message
            });
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc,
                    userName:req.session.userName,
                    userId:req.session.userId,
                }
            });
        }
    })
});
router.get("/list2", function (req,res,next) {
    let _id = req.param("_id");
    let goodsModel = Products.find({_id:_id});
    goodsModel.exec(function (err,doc) {
        if(err){
            res.json({
                status:'1',
                msg:err.message
            });
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            });
        }
    })
});
router.post("/addCart", function (req,res,next) {
    var _id = req.body.userId;
    console.log(_id)
    var productId = req.body.productId;
    var User = require('../models/user');
    User.findOne({_id:_id}, function (err,userDoc) {
        if(err){
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            if(userDoc){
                var goodsItem = '';
                userDoc.cartList.forEach(function (item) {
                    if(item.productId == productId){
                        goodsItem = item;
                        item.productNum ++;
                    }
                });
                if(goodsItem){
                    userDoc.save(function (err2,doc2) {
                        if(err2){
                            res.json({
                                status:"1",
                                msg:'cccccc3'
                            })
                        }else{
                            res.json({
                                status:'0',
                                msg:'你已经成功把商品加入购物车！',
                                result:'suc'
                            })
                        }
                    })
                }else{
                    Products.findOne({productId:productId}, function (err1,doc) {
                        if(err1){
                            res.json({
                                status:"1",
                                msg:'cccccc2'
                            })
                        }else{
                            if(doc){
                                doc.productNum = 1;
                                doc.checked = 1;
                                userDoc.cartList.push(doc);
                                userDoc.save(function (err2,doc2) {
                                    if(err2){
                                        res.json({
                                            status:"1",
                                            msg:'cccccc'
                                        })
                                    }else{
                                        res.json({
                                            status:'0',
                                            msg:'你已经成功把商品加入购物车！',
                                            result:'suc'
                                        })
                                    }
                                })
                            }
                        }
                    });
                }
            }
        }
    })
});


module.exports = router;
