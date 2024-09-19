export default {
    template: `
    <div>
    <h2 class="text-center m-3">Welcome, Reader!</h2>
      <div v-if="requestedBooks.length > 0 || boughtBooks.length" > 
      <h4>REQUESTED</h4>
        <table class="table table-striped">
    <thead>
      <tr>
        <th>ID</th>
        <th>Book</th>
        <th>Author</th>
        <th>Section</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="book in requestedBooks" :key="book.id">
        <td>{{ book.id }}</td>
        <td>{{ book.book }}</td>
        <td>{{ book.author }}</td>
        <td>{{ book.section }}</td>
        <td>
          <button v-if="book.approval" class="btn btn-outline-primary" @click="readBook(book.id)">Read</button>
          <button v-if="book.approval" class="btn btn-outline-info" @click="returnBook(book.id)">Return</button>
          <p v-else class="text-danger"> pending</p>
        </td>
      </tr>
    </tbody>
  </table>
  <h4>BOUGHT</h4>
        <table class="table table-striped">
    <thead>
      <tr>
        <th>ID</th>
        <th>Book</th>
        <th>Author</th>
        <th>Section</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
    <tr v-for="book in boughtBooks" :key="book.id">
    <td>{{ book.id }}</td>
    <td>{{ book.book }}</td>
    <td>{{ book.author }}</td>
    <td>{{ book.section }}</td>
    <td>
      <button class="btn btn-outline-primary" @click="readBook(book.id)">Read</button>
    </td>
  </tr>
    </tbody>
  </table>
</div>
<div v-else class="text-center">
        <p>Buy or Request a book from the book section in the navbar.</p>
      </div>
   </div>

    </div>
  `,
  data() {
    return {
      requestedBooks: [],
      boughtBooks: [],
      token: localStorage.getItem('auth-token'),
      userId: localStorage.getItem('user_id'),
    }
  },
  methods: {
    async returnBook(id) {
        try {
          fetch(`/users/${this.userId}/return_book/${id}`, {
            method: 'DELETE',
            headers: {
              'Authentication-Token': this.token,
            },
          })
          .then(response => {
            if (response.ok) {
              alert("Book Returned.")
              window.location.reload();
              return response.json();
            } else {
              throw new Error('Failed to return book');
            }
          })
          .catch(error => console.error(error));
          } catch (error) {
            console.error(error);
          }
    },
    async readBook(bookReqId) {
      try {
        const response = await fetch(`/users/${this.userId}/read_book/${bookReqId}`, {
          method: 'GET',
          headers: {
            'Authentication-Token': this.token,
          },
        });
        if (response.ok) {
          const bookData = await response.json();
          // Open the book URL in a new tab or window
          window.open(bookData.url, '_blank');
        } else {
          throw new Error('Failed to read book');
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
    async mounted() {
        try {
          const [requestedResponse, boughtResponse] = await Promise.all([
            fetch(`/all_book_requested/${this.userId}`, {
              headers: {
                'Authentication-Token': this.token,
              },
            }),
            fetch(`/all_book_bought/${this.userId}`, {
              headers: {
                'Authentication-Token': this.token,
              },
            }),
          ]);
      
          const [requestData, boughtData] = await Promise.all([
            requestedResponse.json(),
            boughtResponse.json(),
          ]);
      
          this.requestedBooks = requestData;
          this.boughtBooks = boughtData;
        } catch (error) {
          console.error(error);
        }
      }
  }


