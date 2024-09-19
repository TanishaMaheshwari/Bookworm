// ProfilePage.js
export default {
    template: `
    <div>
    <h1 class="display-5 text-center mt-5">Wallet</h1>
    <div class="form text-center" style="max-width: 400px; padding: 20px; margin: 40px auto;">
        <div class="form-floating mb-3">
            <input type="email" class="form-control" v-model="user.email" placeholder="user.email" required readonly>
            <label for="name">Email</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control" v-model="user.username" placeholder="user.username" required readonly>
            <label for="name">Name</label>
        </div>
        <div class="form-floating mb-3">
            <input type="number" class="form-control" v-model="user.balance" placeholder="user.balance" required>
            <label for="name">Balance</label>
        </div>
        <button class="btn btn-success" @click="update">Add Balance </button>
    </div>
  </div>
    `,
    
        data() {
          return {
            user:{
                username: null,
                email: null,
                active: null,
                balance: 0,
            },
            user_id: null,
            token: localStorage.getItem('auth-token')
          }
        },
    
        mounted() {
            const user_id = localStorage.getItem('user_id')
            this.user_id = user_id;
            fetch(`/api/users/${user_id}`)
              .then(response => response.json())
              .then(data => {
                this.user.username = data.username;
                this.user.email = data.email;
                this.user.active = data.active;
                this.user.balance = data.balance;
                this.$forceUpdate();
              })
              .catch(error => console.error(error));
          },

          methods:{
            update(){
                fetch(`/api/users/${this.user_id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authentication-Token': this.token,
                    },
                    body: JSON.stringify(this.user),
                  })
                  .then(response => response.json())
                  .then(data => {
                    this.$router.replace({ path: `/profile` });
                    alert("Balance Added")
                  })
                  .catch(error => console.error(error))
              },
          }
  }