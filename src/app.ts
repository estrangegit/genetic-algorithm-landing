import express from 'express';
import path from 'path';
import router from './routes';

const app = express();

app.set('views', path.join(__dirname, 'public/ejs/'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/genetic-algorithm', router);

app.use('*', function(req, res){
    res.render('404.ejs');
})

export default app;
