const express = require('express');
const bodyParser = require("body-parser");
const UserCrawler = require('./crawler/user_crawler');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/insta', {
  useNewUrlParser: true
});

//username is person's instagram username, and the status should be an array of objects {date:, followers:, following:}
const userSchema = new mongoose.Schema({
  username: String,
  stats: {
    type: Array,
    default: []
  }
});

const User = mongoose.model('User', userSchema);


app.get('/api/users', async (req, res) => {
  try {
    let users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//find or create user
app.post('/api/users', async (req, res) => {
  let user
  try {
    user = await User.findOne({username: req.body.username})
    await user.save()
  } catch (error) {
    user = new User({
      username: req.body.username,
      stats: []
    })
    await user.save()
  }

  const userCrawler = new UserCrawler(req.body.username)
  await userCrawler.crawl().then(results => {
    if (results.error != '') {
      res.sendStatus(500)
    } else {
      user.stats.push(results.stats)
      user.save()
      res.send(user)
    }
  })
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.deleteOne({_id: req.params.id})
    res.send("success deletion")
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// app.put('/api/users/:id', async (req, res) => {
//   try {
//     let item = await Item.findOne({_id: req.params.id})
//     item.title = req.body.title
//     item.description = req.body.description
//     await item.save()
//     res.send(item)
//   } catch (error) {
//     console.log(error)
//     res.sendStatus(500)
//   }
// });


app.listen(3000, () => console.log('Server listening on port 3000!'));
