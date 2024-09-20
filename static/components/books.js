export default {
  template: `
    <div>
      <button class='btn btn-primary me-1' @click='downlodResource'><i class="fas fa-download"></i></button>
      <span v-if='isWaiting'> Waiting... </span>
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
            <th style="padding-top: 30px;">Section</th>
            <th style="padding-top: 30px;">Title</th>
            <th style="padding-top: 30px;">Author</th>
            <th style="padding-top: 30px;">Price</th>
            <th style="padding-top: 30px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book.id">
            <td>{{ book.id }}</td>
            <td>{{ book.section }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.price }}</td>
            <td>
              <button class="btn btn-outline-primary" @click="editBook(book.id)">Edit</button>
              <button class="btn btn-outline-danger" @click="deleteBook(book.id)">Delete</button>
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
      isWaiting: null,
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
    editBook(book_id){
      this.$router.push({ path: `/edit_book/${book_id}` })
      localStorage.setItem('BookID', book_id)
    },
    deleteBook(bookId) {
      try {
        fetch(`/api/books/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Authentication-Token': this.token,
          },
        })
        .then(response => {
          if (response.ok) {
            alert("Book deleted.");
            return response.json();
          } else {
            throw new Error('Failed to delete book');
          }
        })
        .then(() => {
          const index = this.allBooks.indexOf(this.allBooks.find(book => book.id === bookId));
          if (index !== -1) {
            this.allBooks.splice(index, 1);
            this.filteredBooks = this.allBooks.filter(book => {
              // Re-apply search filters
              const titleMatch = this.searchTitle ? book.title.toLowerCase().includes(this.searchTitle.toLowerCase()) : true
              const authorMatch = this.searchAuthor ? book.author.toLowerCase().includes(this.searchAuthor.toLowerCase()) : true
              const priceMatch = this.searchPrice ? book.price <= this.searchPrice : true
              return titleMatch && authorMatch && priceMatch
            });
          }
        })
        .catch(error => console.error(error));
      } catch (error) {
        console.error(error);
      }
    },
    async downlodResource() {
      this.isWaiting = true        
      const res = await fetch('/download-csv')
      const data = await res.json()
        if (res.ok) {
          const taskId = data['task-id']
          const intv = setInterval(async () => {
            const csv_res = await fetch(`/get-csv/${taskId}`)
            if (csv_res.ok) {
              this.isWaiting = false
              clearInterval(intv)
              window.location.href = `/get-csv/${taskId}`
            }
          }, 1000)
      }
  },
},
  async mounted() {
    try {
      const res = await fetch('/all_books', {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json()
      if (res.ok) {
        console.log(data)
        this.allBooks = data
        this.filteredBooks = data
      } else {
        this.error = `Error fetching books: ${res.status}`
      }
    } catch (e) {
      console.error(e)
      this.error = 'Error fetching books'
    }
  },
}