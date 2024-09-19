export default {
    template: `<div>
    <h1 class="display-5 text-center mt-5">Register Page</h1>
    <div class="form text-center" style="max-width: 400px; padding: 20px; margin: 40px auto; ">
    <div class="form-floating mb-3">
      <input type="text" class="form-control" id="floatingInputUsername" v-model="user.username" placeholder="name" required>
      <label for="username">Username</label>
    </div>

    <div class="form-floating mb-3">
      <input type="email" class="form-control" id="floatingInputEmail" v-model="user.email" placeholder="email" required>
      <label for="email">Email</label>
    </div>

    <div class="form-floating mb-3">
      <input type="password" class="form-control" id="floatingPassword" v-model="user.password" placeholder="password" required>
      <label for="password">Password</label>
    </div>

    <div class="form-floating mb-3">
      <input type="password" class="form-control" id="floatingConfirmPassword" v-model="user.confirm_password" placeholder="password" required>
      <label for="confirm_password"> Confirm Password</label>
    </div>

    <button class="btn btn-primary" @click="create_user">Register</button>
    <router-link :to="{ name: 'Login' }" class="btn btn-secondary" role="button">Login</router-link>
    </div>
    </div>`,
  
    data() {
      return {
        user: {
          username: null,
          email: null,
          password: null,
          confirm_password: null,
        },
      }
    },
  
    methods: {
      async create_user() {
        fetch('/user-register',
                {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(this.user)
                }
            )

                .then(async (res) => {
                    const data = await res.json();
                    if (res.ok) {
                        localStorage.setItem('auth-token', data.token)
                        localStorage.setItem('role', data.role)
                        this.$router.push({path: '/login'})
                        alert(data.message)
                    } else {
                        this.error = data.message
                        alert(data.message)
                    }

                });
      },
    }
}
