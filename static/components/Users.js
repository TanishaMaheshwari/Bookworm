export default {
    template: `
    <div>
        <div v-if="error"> {{error}}</div>
        <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in allUsers" :key="user.id">
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
    </div>`,
    data() {
      return {
        allUsers: [],
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
        }
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
      } else {
        this.error = res.status
      }
    },
  }