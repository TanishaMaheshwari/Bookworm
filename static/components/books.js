export default{
    template: `<div>
    <button class='btn btn-success float-end me-3' @click='add_book'>Add Book</button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in allBooks" :key="book.id">
          <td>{{ book.id }}</td>
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.price }}</td>
          <td>
            <button class="btn btn-outline-primary" @click="editSection(book.id)">Edit</button>
            <button class="btn btn-outline-danger" @click="deleteSection(book.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>`,
    
    data(){
        return {
            allBooks: [],
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },

    methods:{
        add_book(){
            this.$router.push({ path: '/add_book' })
        }
    },
    async mounted() {
        const res = await fetch('/books', {
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

