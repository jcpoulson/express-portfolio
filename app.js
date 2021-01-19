const express = require('express');
const data = require('./data/data.json');

const app = express();

app.use('/static', express.static('public'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    req.locals = data.projects
    const userData = req.locals
    res.render('index.pug', { userData })
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/projects/:id', (req, res, next) => {
    const project = data.projects[req.params.id]
    if ( project ) {
        res.render('project.pug', { project })
    } else {
        const error = new Error("Page not found")
        error.status = 404;
        next(error)
    }
})

// Routes that catches non-existent routes
app.get('/:nonExistentRoute', (req, res, next) => {
    const error = new Error("Page not found")
    error.status = 404;
    next(error)
})

app.get('/:nonExistentRoute/:nonExistentPath', (req, res, next) => {
    const error = new Error("Page not found")
    error.status = 404;
    next(error)
})


//404 Error handler
app.use((err, req, res, next) => {
    if (err.status == 404) {
        err = new Error("404, Page not found");
        err.status = 404;
        err.message = "Error 404 Page was not able to be located";
        console.log(err.status)
        console.log(err.message)
        res.render('page-not-found.pug', {err});
    } else {
        next(err);
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
	err.status = 500;
	err.message = 'An unknown error has occured';
	console.log(err.status);
	console.log(err.message);
	res.locals.error = err;
	res.status(err.status);
	res.render('error', {err});
});


app.listen(3000)
console.log("Running on port 3000")