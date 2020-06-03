const express = require('express');
const app = express();

const http = require('http');

const server = http.createServer( app );

const bodyParser = require('body-parser');

const fullyStorage = require('fully-storage');

const sessionMiddleware = fullyStorage.sessionStart({
    expires: 1000 * 60 * 60, // 1hours after not update session clean


    // value true for clear session storage between call to session start
    // should be true value in prod
    // can be false in dev for persist session storage between restart app
    isClearBetweenCall: true
});

app.set('view engine', 'ejs');

app
    .use( '/public', express.static('public') )
    .use( bodyParser.urlencoded( { extended: false } ) )

    .use( sessionMiddleware )

    // initialize todos with empty array
    .use( function( request, response, next ) {

        if( !request.session.todos ) {

            request.session.todos = [];

            // should call save method for persist the update session between request
            request.session.save();
        }

        next();

    } )
;

app
    .get('/', function( request, response ) {

        response.status( 200 );
        response.type( 'text/html' );

        response.render('index', {
            todos: request.session.todos
        } );

    } )

    .post('/todo', function( request, response ) {

        const { todo } = request.body;

        const newTodo = {
            text: todo,
            createAt: Date.now()
        };

        // save new todo in user session
        // and persist new state with method save
        request.session.todos.push( newTodo );
        request.session.save();

        response.type( 'json' );

        response.status( 201 );

        response.json( {
            success: true,
            statusCode: 201,
            statusText: 'Created',
            todo: newTodo
        } );

    } )
;

server.listen( 3001, function() {

    console.log('Server http running at: http://localhost:3001/');

} );
