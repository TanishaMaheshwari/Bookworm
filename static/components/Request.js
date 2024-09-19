export default {
    template: `
      <div>
        <div class="search-bar float-end me-3 d-flex">
          <input type="text" class="form-control me-2" v-model="searchUser" placeholder="User" @keydown.enter="searchBooks">
          <input type="text" class="form-control me-2" v-model="searchBook" placeholder="Book" @keydown.enter="searchBooks">
          <input type="text" class="form-control me-2" v-model="searchSection" placeholder="Section" @keydown.enter="searchBooks">
          <button class="btn btn-secondary" @click="searchBooks">Search</button>
        </div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th style="padding-top: 30px;">ID</th>
              <th style="padding-top: 30px;">User</th>
              <th style="padding-top: 30px;">Book</th>
              <th style="padding-top: 30px;">Author</th>
              <th style="padding-top: 30px;">Section</th>
              <th style="padding-top: 30px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in filteredBooks" :key="book.id">
              <td>{{ book.id }}</td>
              <td>{{ book.user }}</td>
              <td>{{ book.book }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.section }}</td>
              <td>
              <button v-if="!book.approval" class="btn btn-success" @click="approve(book.id)"> Approve </button>
              <p v-else class="text-success ms-3"> Approved </p>
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
        searchUser: '',
        searchBook: '',
        searchSection: '',
        token: localStorage.getItem('auth-token'),
        error: null,
      }
    },
    methods: {
      searchBooks() {
        this.filteredBooks = this.allBooks.filter(book => {
          const userMatch = this.searchUser ? book.user.toLowerCase().includes(this.searchUser.toLowerCase()) : true
          const bookMatch = this.searchBook ? book.book.toLowerCase().includes(this.searchBook.toLowerCase()) : true
          const sectionMatch = this.searchSection ? book.section.toLowerCase().includes(this.searchSection.toLowerCase()) : true
          return userMatch && bookMatch && sectionMatch
        })
      },
      async approve(id) {
        try {
          const bookIndex = this.allBooks.findIndex(book => book.id === id)
          if (bookIndex !== -1) {
            const book = this.allBooks[bookIndex]
            book.approval = true
            const res = await fetch(`/approve/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.token,
              },
              body: JSON.stringify(book),
            })
            const data = await res.json()
            if (res.ok) {
              console.log(data)
              this.allBooks[bookIndex] = book
              this.filteredBooks = this.allBooks.filter(book => {
                const userMatch = this.searchUser ? book.user.toLowerCase().includes(this.searchUser.toLowerCase()) : true
                const bookMatch = this.searchBook ? book.book.toLowerCase().includes(this.searchBook.toLowerCase()) : true
                const sectionMatch = this.searchSection ? book.section.toLowerCase().includes(this.searchSection.toLowerCase()) : true
                return userMatch && bookMatch && sectionMatch
              })
            } else {
              this.error = `Error approving book: ${res.status}`
            }
          } else {
            this.error = 'Book not found'
          }
        } catch (e) {
          console.error(e)
          this.error = 'Error approving book'
        }
      },
    },
    async mounted() {
      try {
        const res = await fetch('/all_requests', {
          headers: {
            'Authentication-Token': this.token,
          },
        })
        const data = await res.json()
        if (res.ok) {
          console.log(data)
          this.allBooks = data.sort((a, b) => b.id - a.id)
          this.filteredBooks = this.allBooks
        } else {
          this.error = `Error fetching books: ${res.status}`
        }
      } catch (e) {
        console.error(e)
        this.error = 'Error fetching books'
      }
    },
  }