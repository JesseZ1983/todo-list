var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();

var shortid = require('shortid');
// shortid.generate()


var hide = require('./git_ignore/hide.js')
var db = require('orchestrate')(hide.dbkey);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));


// db.post('todo-users', {
//   "user": "test",
//   "password": "password"
// })
// .then(function(result) {
//   console.log(result)
// })
// .fail(function(error) {
//   console.log(err); 
// })



app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
})


app.post('/login', function(req, res) {

  var loginUser = req.body.username.toLowerCase(); 
  var loginPassword = req.body.password.toLowerCase(); 

  db.search('todo-users', 'value.user: ' + ("" + loginUser) )
  .then(function (result) {

    var dbUser = result.body.results[0].value.user.toLowerCase(); 
    var dbPassword = result.body.results[0].value.password.toLowerCase(); 

    if (loginUser == dbUser) {
      if (loginPassword == dbPassword) {
        res.send(true);
      }
      else {
        res.send("incorrect password" );
      }
    }
    else {
      res.send("no record");
    }
  });

});  


app.get('/collection', function(req, res) {

  console.log('get collection request');
  res.send(true)
})


app.post('/collection', function(req, res) {

  console.log('post collection request');
  res.send(true)
})


app.post('/task', function(req, res) {

  console.log(req.body); 
  var key = shortid.generate(); 
  
  var responseKey = {
    serverKey: key
  }

  db.put('todo-tasks', key, req.body)
    .then(function (result) {
      console.log(key);
      res.send(responseKey);
    })
    .fail(function (err) {
      res.send(false); 
    }); 

})



// app.get('/collection/:id', function(req, res) {

//   console.log('task request');
//   res.send(true)
// })


// app.get('/collection/:id', function(req, res) {

//   console.log('task request');
//   res.send(true)
// })



















// app.put('/login', function (req, res) {
//   var loginUser = req.body.name;
//   var loginPassword = req.body.password;
//   console.log(loginUser);

//   db.search('todoUser', 'value.name: ' + ("" + loginUser) )
//   .then(function (result) {
//     var dbPassword = result.body.results[0].value.password;
//     var dbUser = result.body.results[0].value.name;
//     if (loginUser == dbUser) {
//       if (loginPassword == dbPassword) {
//         console.log('match');
//         res.send(true);
//       }
//       else {
//         res.send("incorrect password");
//       }
//     }
//     else {
//       res.send("no record of user");
//     }
//   });
// });


//     console.log(result.body.results.length);
//     console.log(result.body.results[0].value.password);
//     var dbPassword = result.body.results[0].value.password;
//     if (loginPassword == dbPassword) {
//       console.log("match");
//
//       res.send(true);
//
//       // db.search('todoTask', loginUser)
//       // .then(function (result) {
//       //   res.send(result.body.results);
//       //   console.log(result.body.results);
//       // });
//     }
//     else {
//       res.send(false);
//     }
//   })
//   .fail(function (err) {
//     console.log("ERROR ERROR ");
//   });
// });

app.get('/tasks', function (req, res) {
    console.log("app.get/tasks");

    db.list('tasks')
    .then(function (result){
      var tasks = [];
      var resultBody = result.body.results;
      resultBody.map(function(element, index, array) {
        tasks.push(element.value);
      });
      res.send(tasks);
    });
});


// app.get('/tasks/:id', function (req, res) {
//     console.log("counter has been requested");
//     console.log(tasks);
//     res.send(tasks);
// });



// //------------------*Done*----------------------
// app.get('/tasks', function (req, res) {
//     console.log("app.get/tasks");
//
//     db.list('tasks')
//     .then(function (result){
//       var tasks = [];
//       var resultBody = result.body.results;
//       resultBody.map(function(element, index, array) {
//         tasks.push(element.value);
//       });
//       res.send(tasks);
//     });
// });
//
// //------------------*Done*----------------------
// app.put('/tasks/:id', function (req, res) {
//   console.log("this is a put request to /tasks/:id");
//   var object = req.body;
//   // object.id = Date();
//   console.log(object);
//   db.put('tasks', object.id, object)
//   .then(function (result) {
//     res.send(object);
//   })
//   .fail(function (err) {
//     console.log(err);
//   });
// });
//
//
//
// app.patch('/tasks/:id', function (req,res) {
//   console.log("this is a patch request");
//   var id = req.params.id;
//   res.send({id: id});
//   console.log(tasks);
// });
//
//
//
// app.post('/tasks', function(req,res) {
//   console.log('app.post /task');
//   var object = req.body;
//   object.id = Date();
//   db.put('tasks', object.id, object)
//   .then(function (result) {
//     res.send(object);
//   })
//   .fail(function (err) {
//     console.log("failed");
//   });
// });
//
//
// app.post('/users', function(req,res) {
//   var newArr = [];
//
//   console.log("this is app.post/users");
//
//   db.post('users', {
//     'username': req.body.username,
//   })
//   .then(function (result) {
//     db.list('users')
//     .then(function (result) {
//       result.body.results.forEach(function(element, index, array){
//       newArr.push(element.value);
//     }).fail(function(error){console.log(error);});
//     });
//
//   });
//
// });
//
// app.get('/users', function(req,res){
//   var arr = [];
//   db.list('users').then(function(result){
//     console.log("list is running:");
//     var resultBody = result.body.results;
//     resultBody.map(function(element, index, array){
//     console.log(element.value);
//     arr.push(element.value);
//     });
//     res.send(arr);
//   });
// });
// // app.put('/tasks', function (req, res) {
// //
// // });
// //
// // app.put('/counter/1', function (req, res) {
// //     console.log(req.body);
// //     counter1 = req.body.value;
// //     res.send({id: '1'});
// // });
// //
// // app.get('/counter/2', function (req, res) {
// //     console.log("counter has been requested");
// //     res.send("hello");
// // });
// //
// // app.put('/counter/2', function (req, res) {
// //     console.log(req.body);
// //     counter1 = req.body.value;
// //     res.send({id: '2'});
// // });
app.listen(3000, function () {
    console.log("server started");
    console.log(hide.dbkey);
});
