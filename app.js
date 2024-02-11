const path=require('path')
const express=require('express');
const morgan=require('morgan');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const cookieParser = require('cookie-parser');

const AppError=require('./utils/appError')
const globalErrorHandler=require('./controllers/errorController')
const tourRouter=require('./routes/tourRoutes')
const userRouter=require('./routes/userRoutes')
const reviewRouter=require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes');

const app=express();
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

// app.use((req, res, next) => {
//     res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' ws://127.0.0.1:52606/;");
//     next();
// });

// Other middleware and routes...

// 1)GLOBAL Middlewares
//Serving static files
//app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname,'public')));
//Set security HTTP headers
app.use(helmet());

//Development logging
if(process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'));
}
//Limit requests from same API
const limiter=rateLimit({
    max:100,
    windowMs:60*60 *1000,
    message:'Too many requests from this IP,please try again in an hour!'
});
app.use('/api',limiter);
//Body parser,reading data from body into req.body
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
    whitelist:[
        'duration',
        'ratingsQuantity',
        'ratingAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));


//Test Middleware
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    //console.log(req.cookies);
    next();
});

//app.get('/api/v1/tours',getAllTours);
// app.get('/api/v1/tours/:id',getTour);
// app.post('/api/v1/tours',createTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);

// 3) Routes
app.use('/',viewRouter);
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:'fail',
    //     message:`Cant find ${req.originalUrl} on this server`
    // })

    // const err=new Error(`Cant find ${req.originalUrl} on this server`)
    // err.status='fail';
    // err.statusCode=404;


    next(new AppError(`Cant find ${req.originalUrl} on this server`,404));
});

app.use(globalErrorHandler);

//4) Start Server
module.exports=app;
