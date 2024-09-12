export default{
  template: `<div>
  <h1 class="display-5 text-center mt-5">ADD BOOK</h1>
  <div class="form text-center" >

  <div class="form-floating mb-3">
    <input type="text" class="form-control" id="floatingInputName" v-model="books.title" placeholder="name" required>
    <label for="name">Title</label>
  </div>

  <div class="form-floating mb-3">
    <input type="text" class="form-control" id="floatingInputDescription" v-model="books.author" placeholder="description" required>
    <label for="description">Author</label>
  </div>

  <div class="form-floating mb-3">
    <input type="number" class="form-control" id="floatingInputDescription" v-model="books.price" placeholder="description" required>
    <label for="description">Price</label>
  </div>

  <div class="form-floating mb-3">
    <input type="text" class="form-control" id="floatingInputSample" v-model="books.sample" placeholder="sample" required>
    <label for="sample">Sample</label>
  </div>

  <div class="form-floating mb-3">
    <input type="text" class="form-control" id="floatingInputtext" v-model="books.text" placeholder="text" required>
    <label for="text">URL</label>
  </div>

  <div class="form-floating mb-3">
    <select class="form-select" id="floatingInputSection" v-model="books.section" required>
      <option value="section">Select Section</option>
      <option v-for="section in sections" :key="section.id" :value="section.name">{{ section.name }}</option>
    </select>
    <label for="description">Section</label>
  </div>

  <button class="btn btn-success m-3" @click="add_books">ADD</button>
  </div>
  </div>`,

  data(){
      return{
          books: {
              title: null,
              author: null,
              price: null,
              sample: null,
              text: null,
              section: null,
          },
          sections:[],
          token: localStorage.getItem('auth-token'),
          error: null
      }
  },

  mounted() {
    this.getSections();
  },

  methods: {
    async getSections() {
      try {
        const response = await fetch('/sections', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.token,
          }
        });
        const data = await response.json();
        if (response.ok) {
          this.sections = data;
        } else {
          this.error = data.message;
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
  
    async add_books(){
      const add_book = await fetch('/add_book',
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token,
          },
          body: JSON.stringify(this.books)
      })
      .then(async (res) => {
          const data = await res.json();
          if (res.ok) {
              this.$router.push({path: '/books'})
              alert(data.message)
          } else {
              this.error = data.message
              alert(data.message)
          }
      });
    }
  },
}