// jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
// Step 14d. for the mailchimp to be required from node.js https doc
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
// Step 10. So note that the Bootstrap was copied from a remote location and our cutom stylesheet was local (i.e edited) and so it's currently
// a static page in our local file system that we are trying to pull up and same as our images all from signup.html. So in order
// for our server to communicate/serve up static files such as css and images, then we need to use a special of express called static
// and inside the parenthesis we are going to add the name of a folder that we're going to keep called "public"
// so creat a new folder called public from signup.html, create another folder called css, drop styles.css inside css folder. Also
// drop your images folder inside public folder. So now I have all my static files in one place called public
app.use(express.static("public"));
// step 8. So at the moment we can access this website (file:///C:/Users/ipheb/Desktop/Newsletter-Signup/signup.html) as static & dat
// isn't what we want when we have a server but in order for that to work.There is need to set up the get mothod for our home route
  app.get("/", function(req, res) {
// Step 9. Our response is to the send the file that is at the location of our directory name plus the string "/signup.html"
    res.sendFile(__dirname + "/signup.html");
  });

// Step 11. The next step is to program the post route and we are going to be using body-parser to grab the data from the signup form
// Note that you will need to change the code inside the signup.html
app.post("/", function(req, res) {
  // Step 12a. Now considering pulling out those values inside our form in signup.html right here by creating a var.
  // Note that the form got submitted but didn't trigger or submit any log-statement. So turn over to Step 13 in signup.html
  // console.log(req.body.Name) so for the purpose of Mailchimp, change all the var to const
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  //disable this from the previous lessons: console.log(firstName, lastName, email);

// Step 14c. From the mailchump.com, click on parameters, scroll down to "request body parameters" and there you find the below data which
// is a JSON format that mailchamp used to generate "data" i.e
// --data '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}' \
// Mailchimp: Now lets create our data that we want to post as a JSON by creating first a js object i.e creating a
// var equals to data from list/audience scroll down to request body parameter (*members) click on show properties i.e email_addess,
// status, merge_fields...
const data = {
  members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
// You can generate the below formula by clicking on audience, settings, audience fields/merge tags
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
};

// Step 15. so the above is data object and it's js but what we need is to turn this to a flat JSON that we're going to send to Mailchimp
const jsonData = JSON.stringify(data);

// Step 16. from Mailchimp, Get started, parameters, request body parameters, then copy the entire url
// Note: copy/paste the list id generated, replace "X" for API Key i.e 10
// Note:https://usX.api.mailchimp.com/3.0/lists/
const url = "https://us10.api.mailchimp.com/3.0/lists/ae82ca09b6";
const options = {
  method: "POST",
  auth: "daniel1:248904d7343641949b02ad2160b4c874-us10"
}
// Step 17. for the mailchimp to be required from node.js https doc
const request = https.request(url, options, function(response) {
  // Step 18. to figure out the type of response we got after making use of https.request as this we enable your website not to
  // hang - please turn over to failure.html for page Step 19.
    if (response.statusCode === 200) {
//Step 23. Now to send the combination of the success.html and the failure.html using res.sendFile. Head over to
// failure.html for step 24.
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

  response.on("data", function(data) {
    console.log(JSON.parse(data));
  });
});

request.write(jsonData);
request.end();
});

// step 25. in order for your try-again button to work, there is need for a post request for our failure route to be redirected to the
// home route and by the time you click on the try-agin button, it will take you back to the web-home page
app.post("/failure", function(req, res) {
  res.redirect("/");
});

// Step 26. Introduction of Heroku server by removing port 3000 and replacing with process.env.PORT which is a dynamic port that
// heroku will recorgnise on the go or tell our app to listen on 3000 locally. Note that we are not going to make use of
//heroku default settings i.e get clone https://github.com/heroku/node-js-getting-started.git)
// app.listen(3000, function() {
  app.listen(process.env.PORT || 3000, function() {
  console.log("The server is running on port 3000");
});

//Step 14a. Mailchimp API Key
// 248904d7343641949b02ad2160b4c874-us10

// Step 14b. Mailchimp Unique id for audience - list id
// ae82ca09b6
