const mongoose=require('mongoose');
const dotenv=require('dotenv');

process.on('uncaughtException',err=>{
    console.log('UNCAUGHT REJECTION💥Shutting down......');
    console.log(err.name,err.message);
   process.exit(1);
    
})

dotenv.config({path:'./config.env'});
const app=require('./app')

const DB=process.env.DATABASE
.replace('<PASSWORD>',
process.env.DATABASEPASSWORD
);

mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(con=>{
    console.log('DB connection succesfull')
    
})

const port=process.env.PORT || 3000;
const server = app.listen(port,()=>{
    console.log(`App running on port ${port}... `);
});

process.on('unhandledRejection',err=>{
    
    console.log('UNHANDLED REJECTION💥Shutting down......');
    
    server.close(()=>{
        process.exit(1);
    });   
});
