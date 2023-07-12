import express from 'express';
import path from 'path';
import router from './routes.js';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('views', path.join(__dirname, 'public/ejs/'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/genetic-algorithm', router);

app.use('*', function(req, res){
    res.render('404.ejs');
})

export { app };
