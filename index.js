const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Models = require("./models.js"),
  uuid = require("uuid"),
  morgan = require("morgan"),
  passport = require("passport"),
  cors = require("cors"),
  { check, validationResult } = require("express-validator");

require("./passport");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());
app.use(morgan("common"));
app.use(express.static("public"));

let allowedOrigins = [
  "http://localhost:27017",
  "http://localhost:8080",
  "http://testsite.com",
  "https://git.heroku.com/peaceful-waters-12563.git",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

let auth = require("./auth")(app);

// Gets the list of data about ALL Movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
//Send Documentation.html file with endpoints
// app.get("/documentation", function (req, res) {
//   res.sendFile("public/documentation.html", { root: __dirname });
// });

// app.get("/", function (req, res) {
//   res.send("Welcome to the root of my app!");
// });
// Gets the data about a single movie title, by name
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
//Gets the data about a single movie title
//change genre to genres
// app.get("/genre/:Genre", (req, res) => {
//   Movies.findOne({ Genre: req.params.Genre })
//     .then((genre) => {
//       res.status(201).json(genre);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error: " + err);
//     });
// });
app.get(
  "/movies/genres/:Name",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then(function (movies) {
        res.json(movies.Genre);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Gets data about all directors/or one
app.get(
  "/movies/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then(function (movies) {
        res.json(movies.Director);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// app.get("/movies/director/:name", (req, res) => {
//   res.json(
//     movies.find((movie) => {
//       return movie.director.name === req.params.name;
//     })
//   );
// });

//Allows new users to register
app.post(
  "/users",
  [
    check(
      "Username",
      "Username needs to be at least 6 characters long"
    ).isLength({
      min: 6,
    }),
    check(
      "Username",
      "Username contains non alphanumeric charecters - not allowed!"
    ).isAlphanumeric(),
    // check("Username", "Username requires 1 Uppercase character!").contains([
    //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    // ]),
    // check('Password', 'Password field must be filled!').not().isEmpty(),
    check("Password", "Password must be at least 6 characters long!").isLength({
      min: 6,
    }),
    check("Email", "Email does not appear to be valid!").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//Get all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Get user by Username
app.get(
  "/user/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Updates User info
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Add movie to list of favorites
app.post(
  "/users/:Username/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Delete movie from Favorites
app.delete(
  "/users/:Username/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Deregister Current User
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found.");
        } else {
          res.status(200).send(req.params.Username + " was Deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Adds data for a new movie to our list of movies
// app.post("/movies", (req, res) => {
//   let newMovie = req.body;

//   if (!newMovie.name) {
//     const message = "Missing title in request body!";
//     res.status(400).send(newMovie);
//   }
// });
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("There has been an error.");
});
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on port " + port);
});

// var movie3 = {
//   Title: "Ricki and the Flash",
//   Description:
//     "A musician who gave up everything for her dream of rock-and-roll stardom returns home, looking to make things right with her family.",
//   Director: {
//     Name: "Jonathan Demme",
//     Bio:
//       "Robert Jonathan Demme was an American director, producer, and screenwriter.",
//     Bday: "1944-01-01",
//     DeathYear: "2017-01-01",
//   },
//   Genre: {
//     Name: "Comedy",
//     Description:
//       "A comedy film is a category of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.",
//   },
//   Featured: true,
// };
// db.movies.insertOne(movie3);
// id: "5f453fdf1d6ad09438a6fa2f";

// var movie2 = {
//   Title: "Silence of the Lambs",
//   Description:
//     "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
//   Director: {
//     Name: "Jonathan Demme",
//     Bio:
//       "Robert Jonathan Demme was an American director, producer, and screenwriter.",
//     Bday: "1944-01-01",
//     DeathYear: "2017-01-01",
//   },
//   Genre: {
//     Name: "Thriller",
//     Description:
//       "Thriller film, also known as suspense film or suspense thriller, is a broad film genre that involves excitement and suspense in the audience. Tension is created by delaying what the audience sees as inevitable, and is built through situations that are menacing or where escape seems impossible.",
//   },
//   Featured: true,
// };
// db.movies.insertOne(movie2);
// id: "5f454fa8be673d16fbccfcaa";

// var movie4 = {
//   Title: "An American Pickle",
//   Description:
//     "An immigrant worker fallsinto a vat of pickles and is brined for 100 years. The brine preserves himperfectly, and when he emerges in present day Brooklyn, he finds that hehasn't aged a day.",
//   Director: {
//     Name: "Brandon Trost",
//     Bio:
//       "Brandon Scott Trost is an American cinematographer, screenwriter, and film director whose credits include writing and directing The FP 2011 with his brother Jason, as well as being the cinematographer of several films.",
//     Bday: "1981-08-29",
//   },
//   Genre: {
//     Name: "Comedy",
//     Description:
//       "A comedy film is a category of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.",
//   },
//   Featured: true,
// };
// db.movies.insertOne(movie4);
// id: "5f454fb8be673d16fbccfcab";

// var movie5 = {
//   Title: "The Kissing Booth 2",
//   Description:
//     "After a romantic summer together, Noah is off to Harvard, and Elle heads back to high school for her senior year.",
//   Director: {
//     Name: "Vince Marcello",
//     Bio:
//       "Vince Marcello is a director and writer, known for The Kissing Booth 2018, Zombie Prom 2006 and The Kissing Booth 2 2020.",
//     Bday: "1972-12-31",
//   },
//   Genre: {
//     Name: "Romantic Comedy",
//     Description:
//       "Romantic comedy (also known as romcom or rom-com) is a subgenre of comedy and slice-of-life fiction, focusing on lighthearted, humorous plot lines centered on romantic ideas, such as how true love is able to surmount most obstacles.",
//   },
//   Featured: true,
// };
// db.movies.insertOne(movie5);
// id: "5f454fc6be673d16fbccfcac";

// var movie6 = {
//   Title: "You Should Have Left",
//   Description:
//     "Strange events plague a couple and their young daughter when they rent a secluded countryside house that has a dark past.",
//   Director: {
//     Name: "David Koepp",
//     Bio:
//       "David Koepp is an American screenwriter and film director. Koepp is the ninth most successful screenwriter of all time in terms of U.S. box office receipts with a total gross of over $2.3 billion.",
//     Bday: "1963-06-09",
//   },
//   Genre: {
//     Name: "Horror",
//     Description:
//       "A horror film is a film that seeks to elicit fear for entertainment purposes.[1] Initially inspired by literature from authors such as Edgar Allan Poe, Bram Stoker, and Mary Shelley,[2] horror has existed as a film genre for more than a century.",
//   },
//   Featured: true,
// };
// db.movies.insertOne(movie6);
// id: "5f454fd3be673d16fbccfcad";

// var movie7 = {
//   Title: "Made in Italy",
//   Description:
//     "A London artist and his estranged son try to mend their relationship as they work together to repair a dilapidated house in Italy.",
//   Director: {
//     Name: "James D' Arcy",
//     Bio:
//       "James D' Arcy is an English actor. He is known for his portrayals of Howard Stark's butler, Edwin Jarvis, in the Marvel Cinematic Universe television series Agent Carter and the 2019 film Avengers: Endgame, and murder suspect Lee Ashworth in the second series of the ITV series Broadchurch.",
//     Bday: "1975-08-24",
//   },
//   Genre: {
//     Name: "Comedy",
//     Description:
//       "A comedy film is a category of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.",
//   },
//   Featured: true,
// };
// db.movies.insertOne(movie7);
// id: "5f454fe1be673d16fbccfcae";

// var movie8 = {
//   Title: "Scoob",
//   Description:
//     "As they race to stop this global dog-pocalypse, the gang discovers that Scooby has a secret legacy and an epic destiny greater than anyone could have imagined.",
//   Director: {
//     Name: "Tony Cervone",
//     Bio:
//       "Tony Cervone is an American television writing, animation and production team at Warner Bros. Animation and formerly at Nickelodeon Animation Studios.",
//     Bday: "1946-03-12",
//   },
//   Genre: {
//     Name: "Animated",
//     Description:
//       "Animation is a method in which pictures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film.",
//   },
//   Featured: false,
// };
// db.movies.insertOne(movie8);
// id: "5f454ff9be673d16fbccfcaf";

// var movie9 = {
//   Title: "Neighbors",
//   Description:
//     "After they are forced to live next to a fraternity house, a couple with a newborn baby do whatever they can to take them down.",
//   Director: {
//     Name: "Brandon Trost",
//     Bio:
//       "Brandon Scott Trost is an American cinematographer, screenwriter, and film director whose credits include writing and directing The FP 2011 with his brother Jason, as well as being the cinematographer of several films.",
//     Bday: "1981-08-29",
//   },
//   Genre: {
//     Name: "Comedy",
//     Description:
//       "A comedy film is a category of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.",
//   },
//   Featured: true,
// };
// db.movies.insertOne(movie9);
// id: "5f455008be673d16fbccfcb0";

// var movie10 = {
//   Title: "This is 40",
//   Description:
//     "Pete and Debbie are both about to turn 40, their kids hate each other, both of their businesses are failing, they're on the verge of losing their house, and their relationship is threatening to fall apart.",
//   Director: {
//     Name: "Judd Apatow",
//     Bio:
//       "Judd Apatow is an American producer, writer, director, actor and stand-up comedian.",
//     Bday: "1967-01-01",
//   },
//   Genre: {
//     Name: "Romantic Comedy",
//     Description:
//       "Romantic comedy (also known as romcom or rom-com) is a subgenre of comedy and slice-of-life fiction, focusing on lighthearted, humorous plot lines centered on romantic ideas, such as how true love is able to surmount most obstacles.",
//   },
//   Featured: true,
// };
// db.movies.insertOne(movie10);
// id: "5f455014be673d16fbccfcb1";

// var movie11 = {
//   Title: "Tom and Jerry's Giant Adventure",
//   Description:
//     "Tom and Jerry are the faithful servants of Jack, the owner of a struggling storybook amusement park that gets a much-needed boost thanks to some mysterious magical beans.",
//   Director: {
//     Name: "Tony Cervone",
//     Bio:
//       "Tony Cervone is an American television writing, animation and production team at Warner Bros. Animation and formerly at Nickelodeon Animation Studios.",
//     Bday: "1946-03-12",
//   },
//   Genre: {
//     Name: "Animated",
//     Description:
//       "Animation is a method in which pictures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film.",
//   },
//   Featured: false,
// };
// db.movies.insertOne(movie11);
// id: "5f455020be673d16fbccfcb2";
