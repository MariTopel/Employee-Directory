//this is where build and export Express application will be

//this brings in the Express library
import express from "express";

//employee array import
//pulls in the placeholder data array
import employees from "#db/employees";

//this creates the app instance which will be used to define routes
const app = express();

//this line makes app available to other modules like server.js
//this uses ES moduel default export, watching the import app from '#app' in server.js
export default app;

//when i do the above (const app and export default app), what i am doing is i am creating
// an app object that knows how to register routes (app.get(...) and app.post(...), ...)
// can run middleware in sqquence
// listens to HTTP requests when you call app.listen(...) which our server.js does

//app.get(...) registers a handler for incoming GET requests
//a handler AKA a router handler or callback, is the function you pass to Express that gets invoked whenever a request matches a aprticular route. it "handles" the incoming request and devides what to send back
// (req, res) => {...} is the handler/ so app.get registers the (req, res) => {...}
// req is the request object (info about the HTTP request URL, headers, body,)
// res is the Response object (methods to set headers, status codes, send JSON or text)
// "/" is the path or the "root" of my API
//res.send('Hello employees!') sends that string as the HTTP response bopdy and automaticaly sets the appropriate header/status
app.get("/", (req, res) => {
  res.send("Hello employees!");
});

//http headers are key-values pairs sent at the start of a request or response that describe the metadata about the message. They are like the envelope info on a letter. who it is from, how big it is, what format it is in.
//headers just describe the content inside the package

//this gets a random employee
// this needs to be before the /:id route because Express matches routes in the order you register them.
//
app.get("/employees/random", (req, res) => {
  //picks a random index from 0 to employees.length -1
  const randomIndex = Math.floor(Math.random() * employees.length);

  //grabs the random employee calculated in the previous step
  const randomEmployee = employees[randomIndex];

  //sends it back as aJSON
  res.json(randomEmployee);
});

//register the GET /employees route
//res.json sends JSON and Express automatically sets the Content-Type: application/json header
app.get("/employees", (req, res) => {
  res.json(employees);
});

//with :id in the path tells Express to capture that segment into req.params.id
app.get("/employees/:id", (req, res) => {
  //grab the "id" param from the URL (always a string)
  //converts it into a number because route params are strings by default
  const id = Number(req.params.id);

  //find the matching employess in the array
  //.find scans through the array from start to finish and returns the FIRST element for which the callbak returns true
  //if it finds a match it returns that object
  //emp => emp.id === id is an arrow function callback that i pass into .find. it runs once for each element
  //emp is the current employee object
  //emp.id access that object's ID property
  // === id comparest is strictly to the id variable extracted from the URL.
  // all together thyis says go through each object and compare the object's ID exactly to the id i requested
  const employee = employees.find((emp) => emp.id === id);

  //if none are found then respons wit 404
  if (!employee) {
    return res.status(404).send("Employee with id ${id} not found");
  }

  //otherwise send the employee object as JSON
  res.json(employee);
});
