export default {
    template: `
      <div>
        <table class="table table-striped mt-3">
          <thead>
            <tr>
              <th style="padding-top: 30px;">ID</th>
              <th style="padding-top: 30px;">User</th>
              <th style="padding-top: 30px;">Book</th>
              <th style="padding-top: 30px;">Author</th>
              <th style="padding-top: 30px;">Section</th>
              <th style="padding-top: 30px;">Payed</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in allBooks" :key="book.id">
              <td>{{ book.id }}</td>
              <td>{{ book.username }}</td>
              <td>{{ book.book }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.section }}</td>
              <td>{{ book.price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    data() {
      return {
        allBooks: [],
        token: localStorage.getItem('auth-token'),
        role: localStorage.getItem('role'),
        user_id: localStorage.getItem('user_id'),
        error: null,
      }
    },
    async mounted() {
        const res = await fetch('/all_payments', {
          headers: {
            'Authentication-Token': this.token,
          },
        })
        const data = await res.json().catch((e) => {})
        if (res.ok) {
          console.log(data)
          this.allBooks = data
        } else {
          this.error = res.status
        }
      },
  }