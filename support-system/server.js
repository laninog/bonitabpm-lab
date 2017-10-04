'use strict';

const Hapi = require('hapi');
const Good = require('good');

// Create server
const server = new Hapi.Server();

server.connection({ 
    host: 'localhost', 
    port: 8000 
});

// Add route
server.route({
    method: 'GET',
    path: '/',
    handler: function(req, res) {
        res('Support System');
    }
});

// Add route
server.route({
    method: 'POST',
    path:'/appointments',
    handler: function (req, res) {

        console.log(req.payload);

        res({
            code: '200',
            message: 'OK'
        });
    }
});

server.register({
    register: Good,
    options: {
        reporters: {
            console: [
                {
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [
                        {
                            response: '*',
                            log: '*'
                        }
                    ]
                },
                {
                    module: 'good-console'
                },
                'stdout'
            ]
        }
    }
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    // Start the server
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
    
});

