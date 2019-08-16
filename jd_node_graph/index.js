
/** Use node to run a server - i.e. an application that runs and listens */ 
var fs = require('fs');

//Node package for add-ons and library is called Express
const express = require('express');
const app = express();


// First thing to do with a web serve is listening
app.listen(3000, () => console.log('listening at 3000'));

/** 
 * Things I want to do with the server
 * 1.Serve Webpages
 * 1.1. use express to host static files
 * 
 * 
*/
app.use(express.static('public'));


// It parses incoming requests with JSON payloads and is based on body-parser
//Parse incoming JSON Data
app.use(express.json({ limit: '1mb'}));

//Routes HTTP POST requests to the specified path with the specified callback functions.
//Setup where client side will send data
app.post('/api', (request, response) => {
    console.log('I got a request!');
    const myData = request.body; 

    myData.hasChildren = myData.hasChildren === "true";
    myData.expanded = myData.expanded === "true";
    myData.removeAllowed = myData.removeAllowed === "true";
    myData.addingSubItemAllowed = myData.addingSubItemAllowed === "true";

    response.json({
        status : 'success',
        id: myData.key
    });
    

    fs.readFile('mobile.json', function (err, data){
        var nodesData = JSON.parse(data);
        nodesData.nodes.push(myData);
        console.log(myData);
        if (err){
            console.log('unable to add node');
        }
        
        fs.writeFile("mobile.json", JSON.stringify(nodesData, null, "  "), err => {
            if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file')
                    }
        });
    });
    
});

// GET method route
app.get('/api', (request, response) => {

    fs.readFile('mobile.json', (err, data) => {
        var graphData = JSON.parse(data);
        // console.log(graphData.nodes)
        if (err){
            console.log('unable to get nodes');
        }
        response.json(graphData);
    });

});


