export default {
  template: `
    <div>
      <div class="search-bar float-end m-3 d-flex">
        <input type="text" class="form-control me-2" v-model="searchSection" placeholder="Section" @keydown.enter="searchBooks">
        <input type="text" class="form-control me-2" v-model="searchTitle" placeholder="Title" @keydown.enter="searchBooks">
        <input type="text" class="form-control me-2" v-model="searchAuthor" placeholder="Author" @keydown.enter="searchBooks">
        <input type="number" class="form-control me-2" v-model="searchPrice" placeholder="Price(max)" @keydown.enter="searchBooks">
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
            <button class="btn btn-outline-info" @click="readsample(book.id)"><i class="fas fa-info"></i></button>
            <button class="btn btn-outline-primary" @click="readbook(book.id, book.section_id)"><i class="fas fa-book"></i></button>
            <button class="btn btn-outline-success" @click="buybook(book.id)"><i class="fas fa-shopping-cart"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
        <div class="modal fade" id="sample-modal" ref="sampleModal" tabindex="-1" role="dialog" aria-labelledby="sample-modal-label" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="sample-modal-label">Book Intro</h5>
              </div>
              <div class="modal-body">
                <p>{{ sampleText }}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-danger" @click="closeModal" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
      </div>
    
      <div class="modal fade" id="sample-modal2" ref="sampleModal2" tabindex="-1" role="dialog" aria-labelledby="sample-modal2-label" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="sample-modal-label">Payment</h5>
          </div>
          <div class="modal-body">
            <p>Account Balance: INR {{ User_Balance }}</p>
            <p>Price of Book: INR {{ bookPrice }}</p>
            <p v-if="bookPrice > User_Balance" class="text-danger">You need to add INR {{ bookPrice - User_Balance }} to your balance to buy this book.</p>
            <p v-else class="text-muted"> Tentative Balance* : INR {{ User_Balance - bookPrice }}</p>
          </div>
          <div class="modal-footer">
            <button v-if="bookPrice > User_Balance" class="btn btn-primary" @click="addBalance">Add Balance</button>
            <button v-else type="button" class="btn btn-success" @click="pay" data-dismiss="modal">Pay</button>
            <button type="button" class="btn btn-outline-secondary" @click="closeModal2" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
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
      sampleText: '',
      bookPrice: 0,
      User_Balance: 0,
      bookId: 0,
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
    async readsample(id) {
      try {
        const response = await fetch(`/api/books/${id}`);
        const data = await response.json();
        this.sampleText = data.sample;
        this.$refs.sampleModal.classList.add('show');
        this.$refs.sampleModal.style.display = 'block';
      } catch (error) {
        console.error(error);
      }
    },
    readbook(bookId, sectionId) {
      this.requestBook(bookId, sectionId)
    },
    async buybook(id) {
      try {
        const response = await fetch(`/api/books/${id}`);
        const data = await response.json();
        this.bookPrice = data.price;
        this.bookId = data.id;
        const uid = localStorage.getItem('user_id')
        const response2 = await fetch(`/api/users/${uid}`);
        const data2 = await response2.json();
        this.User_Balance = data2.balance;
        this.$refs.sampleModal2.classList.add('show');
        this.$refs.sampleModal2.style.display = 'block';
      } catch (error) {
        console.error(error);
      }
    },
    closeModal() {
      this.$refs.sampleModal.classList.remove('show');
      this.$refs.sampleModal.style.display = 'none';
    },
    closeModal2() {
      this.$refs.sampleModal2.classList.remove('show');
      this.$refs.sampleModal2.style.display = 'none';
    },
    async requestBook(bookId, sectionId) {
      try {
        const userId = localStorage.getItem('user_id'); 
        const response = await fetch('/book_request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.token,
          },
          body: JSON.stringify({ book_id: bookId, section_id: sectionId, user_id: userId }),
        });
    
        if (!response.ok) {
          if (response.status === 400) {
          alert('Already Requested');
          } }
          else {
            alert('Request sent to librarian successfully!');
          }
      } catch (error) {
        console.error(error);
        alert('Failed to request book. Please try again later.');
      }
    },
    addBalance(){
      this.$router.push('/profile')
    },
    async pay() {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch('/api/book_bought', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.token,
          },
          body: JSON.stringify({ user_id: userId, price: this.bookPrice, book_id: this.bookId }),
        });
    
        if (response.ok) {
          this.User_Balance -= this.bookPrice;
          alert('Payment successful!');
          this.closeModal2();
        } else {
          alert('Failed to make payment. Please try again later.');
        }
      } catch (error) {
        console.error(error);
        alert('Failed to make payment. Please try again later.');
      }
    }
  },
  async mounted() {
    const res = await fetch('/all_books', {
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