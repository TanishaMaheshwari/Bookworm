export default{
    template:`
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
    <a class="navbar-brand" href="#"><span class="logo-text">BOOKWORM</span></a>
    <ul class="nav justify-content-end">
      <li class="nav-item">
        <router-link class="nav-link" to="/login" v-if="!is_login">Login</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/register" v-if="!is_login">Register</router-link>
      </li>
      <li class="nav-item" v-if="role=='librarian'">
        <router-link class="nav-link" to="/">Home</router-link>
      </li>      
      <li class="nav-item" v-if="role=='librarian'">
        <router-link class="nav-link" to="/users">Users</router-link>
      </li>      
      <li class="nav-item">
        <router-link class="nav-link" to="/books" v-if="role=='librarian'">Books</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/section" v-if="role=='librarian'">Sections</router-link>
      </li>
      <li class="nav-item">
      <router-link class="nav-link" to="/requests" v-if="role=='librarian'">Requests</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/payment" v-if="role=='librarian'">Payments</router-link>
      </li>
      <li class="nav-item" v-if="role=='reader'">
        <router-link class="nav-link" to="/">Home</router-link>
      </li> 
      <li class="nav-item" v-if="role=='reader'">
        <router-link class="nav-link" to="/book">Books</router-link>
      </li>      
      <li class="nav-item">
        <router-link class="nav-link" to='/profile' v-if="role=='reader'">Wallet</router-link>
      </li>
      <button type="button" class="btn btn-outline-danger" v-if="is_login" @click='logout'><i class="fas fa-power-off"></i></button>  
    </ul>
    </div>
    </nav>`,
    data() {
      return {

        role: localStorage.getItem('role'),
        is_login: localStorage.getItem('auth-token'),
      }
    },
    methods: {
      logout() {
        localStorage.removeItem('user_id')
        localStorage.removeItem('auth-token')
        localStorage.removeItem('role')
        this.$router.push({ path: '/login' })
      },
    },
}