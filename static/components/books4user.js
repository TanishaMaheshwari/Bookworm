export default {
  template: `
    <div>
      <div class="search-bar float-end m-3 d-flex">
        <input type="text" class="form-control me-2" v-model="searchSection" placeholder="Section" @keydown.enter="searchBooks">
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
            <td>INR {{ book.price }}</td>
            <td>
            <button class="btn btn-outline-info" @click="readbook(book.id)"><i class="fas fa-info"></i></button>
            <button class="btn btn-outline-primary" @click="readbook(book.id)"><i class="fas fa-book"></i></button>
            <button class="btn btn-outline-success" @click="buybook(book.id)"><i class="fas fa-shopping-cart"></i></button>
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
      searchSection: '',
      searchTitle: '',
      searchAuthor: '',
      searchPrice: '',
      token: localStorage.getItem('auth-token'),
      error: null,
    }
  },
  methods: {
    searchBooks() {
      this.filteredBooks = this.allBooks.filter(book => {
        const sectionMatch = this.searchSection ? book.section.toLowerCase().includes(this.searchSection.toLowerCase()) : true
        const titleMatch = this.searchTitle ? book.title.toLowerCase().includes(this.searchTitle.toLowerCase()) : true
        const authorMatch = this.searchAuthor ? book.author.toLowerCase().includes(this.searchAuthor.toLowerCase()) : true
        const priceMatch = this.searchPrice ? book.price <= this.searchPrice : true
        return sectionMatch && titleMatch && authorMatch && priceMatch
      })
    },
    readbook(id) {
      // implement read book functionality
    },
    buybook(id) {
      // implement buy book functionality
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