const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;

//
//mongoimport --uri mongodb+srv://Miles0569:Dreamy0569@moviedatabase.aiga7.mongodb.net/myFlixDB --collection user_movies --type json --file ../Collections/User_Movies.json
//mongo "mongodb+srv://moviedatabase.aiga7.mongodb.net/myFlixDB" --username Miles0569
// mongodb+srv://Miles0569:Dreamy0569@moviedatabase.aiga7.mongodb.net/myFlixDB?retryWrites=true&w=majority
