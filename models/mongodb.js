const MongoClient = require('mongodb').MongoClient;

//连接数据库，并回调函数
function _connectDB(callback) {
    const url = 'mongodb://localhost:27017/YW';
    MongoClient.connect(url, function (err, db) {
        callback(err, db);
    })
}

/*封装插入数据的函数*/
exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).insertOne(json, function (err, result) {
            callback(err, result);
            db.close();
        });
    })

};

exports.insertSave = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).save(json, function (err, result) {
            callback(err, result);
            db.close();
        });
    })

};


//删除数据库
exports.deleteMany = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).deleteMany(json, function (err, result) {
            callback(err, result);
            db.close();
        });
    })
};

//修改数据库
exports.updateMany = function (collectionName, json1, json2, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).updateMany(json1, json2, function (err, result) {
            callback(err, result);
            db.close();
        });
    })
};


//查找数据，找到所有数据。args是个对象{"pageamount":10,"page":10}
exports.find = function (collectionName, json, C, D) {
    var result = [];    //结果数组
    if (arguments.length == 3) {
        //那么参数C就是callback，参数D没有传。
        var callback = C;
        var skipnumber = 0;
        //数目限制
        var limit = 0;
    } else if (arguments.length == 4) {
        var callback = D;
        var args = C;
        //应该省略的条数
        var skipnumber = args.pageamount * args.page || 0;
        //数目限制
        var limit = args.pageamount || 0;
        //排序方式
        var sort = args.sort || {};
    } else {
        throw new Error("find函数的参数个数，必须是3个，或者4个。");
        return;
    }

    //连接数据库，连接之后查找所有
    _connectDB(function (err, db) {
        var cursor = db.collection(collectionName).find(json).skip(skipnumber).limit(limit).sort({"messageTime": -1});
        cursor.each(function (err, doc) {
            if (err) {
                callback(err, null);
                db.close(); //关闭数据库
                return;
            }
            if (doc != null) {
                result.push(doc);   //放入结果数组
            } else {
                //遍历结束，没有更多的文档了
                callback(null, result);
                db.close(); //关闭数据库
            }
        });
    });
};

