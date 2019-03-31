var app = new Vue({
  el: '#insta',
  data: {
    username: "",
    addUser: null,
    noUser: false,
    users: [],
    findUsername: "",
    findUser: null,
  },
  created() {
    this.loadUsers();
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        let response = await axios.post('/api/users', {
          username: this.username
        });
        this.addUser = response.data
        this.noUser = false
      } catch (error) {
        console.log(error);
        this.noUser = true
      }
    },
    async loadUsers() {
      try {
        let response = await axios.get("/api/users");
        this.users = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectUser(user) {
      this.findUsername = "";
      this.findUser = user;
    },
    async deleteUser(user) {
      try {
        let response = axios.delete("/api/users/" + user._id);
        this.findUser = null;
        this.loadUsers();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    suggestions() {
      return this.users.filter(user => user.username.toLowerCase().startsWith(this.findUsername.toLowerCase()));
    }
  },
});
