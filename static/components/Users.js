export default {
  template: `
    <div>
      <div class="search-bar float-end d-flex">
        <input type="text" class="form-control me-2" v-model="searchQuery" placeholder="Name or Email" @keydown.enter="searchUsers">
        <button class="btn btn-secondary" @click="searchUsers">Search</button>
      </div>
      <div v-if="error"> {{error}}</div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th style="padding-top: 30px;">ID</th>
            <th style="padding-top: 30px;">Name</th>
            <th style="padding-top: 30px;">Email</th>
            <th style="padding-top: 30px;">Balance</th>
            <th style="padding-top: 30px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.balance }}</td>
            <td>
              <button 
                :class="user.active ? 'btn btn-outline-danger' : 'btn btn-outline-primary'"
                @click="user.active ? disable(user.id) : enable(user.id)">
                {{ user.active ? 'Disable' : 'Enable' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() {
    return {
      allUsers: [],
      filteredUsers: [],
      searchQuery: '',
      token: localStorage.getItem('auth-token'),
      error: null,
    }
  },
  methods: {
    async disable(user_id) {
      const res = await fetch(`/disable/user/${user_id}`, {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        const user = this.allUsers.find(user => user.id === user_id)
        if (user) {
          user.active = false
        }
        this.$forceUpdate()
      }
    },
    async enable(user_id) {
      const res = await fetch(`/enable/user/${user_id}`, {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        const user = this.allUsers.find(user => user.id === user_id)
        if (user) {
          user.active = true
        }
        this.$forceUpdate()
      }
    },
    searchUsers() {
      this.filteredUsers = this.allUsers.filter(user => {
        return user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      })
    },
  },
  async mounted() {
    const res = await fetch('/users', {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json().catch((e) => {})
    if (res.ok) {
      console.log(data)
      this.allUsers = data
      this.filteredUsers = data
    } else {
      this.error = res.status
    }
  },
}