if(process.env.NODE_ENV == "production"){
    module.exports = {
        //url do banco de dados hospedado
        mongoURI: "mongodb://pedrotunin:pedroadmin@blogapp-prod-shard-00-00-taq5p.mongodb.net:27017,blogapp-prod-shard-00-01-taq5p.mongodb.net:27017,blogapp-prod-shard-00-02-taq5p.mongodb.net:27017/test?ssl=true&replicaSet=blogapp-prod-shard-0&authSource=admin&retryWrites=true&w=majority"
    }
}else{
    module.exports = {
        //url do banco de dados local
        mongoURI: "mongodb://localhost/blogapp"
    }
}