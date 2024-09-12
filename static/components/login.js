export default{
    template:`<div>
        <h1 class="display-5 text-center mt-5">Login Page</h1>
        <div class="form text-center" style="max-width: 400px; padding: 20px; margin: 40px auto; ">
        <div class="form-floating mb-3">
          <input type="email" class="form-control" id="floatingInput" v-model= "credentials.email" placeholder="email" required @keydown.enter="login">
          <label for="email">Email</label>
        </div>
        <div class="form-floating mb-3">
          <input type="password" class="form-control" id="floatingPassword" v-model= "credentials.password" placeholder="Password" required @keydown.enter="login">
          <label for="Password">Password</label>
        </div>
        <p class="text-danger m-4">{{error}}</p>
        <button class="btn btn-primary" @click="login" >Login</button>
        <router-link :to="{ name: 'Register' }" class="btn btn-secondary" role="button">Register</router-link>
        </div>
    </div>`
    ,
    data (){
        return{
            credentials:{
                email: null,
                password: null
            },
            error: null
        }
    },
    methods:{
        async login(){
            const response = await fetch('/user-login',{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify(this.credentials)
            }
            )
            const data = await response.json()
            if (response.ok){
                console.log(data)
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('role', data.role)
                this.$router.push({ path: '/', query: {role: data.role}})
            }
            else{
                this.error = data.message
            }
        }
    }
}

