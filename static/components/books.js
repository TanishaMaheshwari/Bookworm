export default {
  template: `
    <div>
      <button class='btn btn-success me-3' @click='add_book'>Add Book</button>
      <div class="search-bar float-end me-3 d-flex">
        <input type="text" class="form-control me-2" v-model="searchTitle" placeholder="Title" @keydown.enter="searchBooks">
        <input type="text" class="form-control me-2" v-model="searchAuthor" placeholder="Author" @keydown.enter="searchBooks">
        <input type="number" class="form-control me-2" v-model="searchPrice" placeholder="Price (max)" @keydown.enter="searchBooks">
        <button class="btn btn-secondary" @click="searchBooks">Search</button>
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th style="padding-top: 30px;">ID</th>
            <th style="padding-top: 30px;">Title</th>
            <th style="padding-top: 30px;">Author</th>
            <th style="padding-top: 30px;">Price</th>
            <th style="padding-top: 30px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book.id">
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
    </div>
  `,
  data() {
    return {
      allBooks: [],
      filteredBooks: [],
      searchAuthor: '',
      searchPrice: '',
      searchTitle: '',
      token: localStorage.getItem('auth-token'),
      error: null,
    }
  },
  methods: {
    add_book() {
      this.$router.push({ path: '/add_book' })
    },
    searchBooks() {
      this.filteredBooks = this.allBooks.filter(book => {
        const authorMatch = this.searchAuthor ? book.author.toLowerCase().includes(this.searchAuthor.toLowerCase()) : true
        const priceMatch = this.searchPrice ? book.price <= this.searchPrice : true
        const titleMatch = this.searchTitle ? book.title.toLowerCase().includes(this.searchTitle.toLowerCase()) : true
        return authorMatch && priceMatch && titleMatch
      })
    },
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
      this.filteredBooks = data
    } else {
      this.error = res.status
    }
  },
}