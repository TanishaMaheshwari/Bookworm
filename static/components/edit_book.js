export default{
    template:`<div>
        <h1 class="display-5 text-center mt-5">Update Book</h1>
        <div class="form text-center" style="max-width: 400px; padding: 20px; margin: 40px auto; ">
    
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingInput" v-model= "update.title" placeholder="title" required @keydown.enter="edit">
          <label for="title">Title</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingAuthor" v-model= "update.author" placeholder="author" required @keydown.enter="edit">
          <label for="author">Author</label>
        </div>
        <div class="form-floating mb-3">
          <input type="number" class="form-control" id="floatingPrice" v-model= "update.price" placeholder="price" required @keydown.enter="edit">
          <label for="price">Price</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingSample" v-model= "update.sample" placeholder="sample" required @keydown.enter="edit">
          <label for="sample">Sample</label>
        </div>
        <div class="form-floating mb-3">
          <input type="url" class="form-control" id="floatingurl" v-model= "update.text" placeholder="url" required @keydown.enter="edit">
          <label for="text">URL</label>
        </div>
        <div class="form-floating mb-3">
          <select class="form-select" id="floatingInputSection" v-model="update.section_id" required>
            <option value="section">Select Section</option>
            <option v-for="section in sections" :key="section.id" :value="section.id">{{ section.name }}</option>
          </select>
          <label for="section">Section</label>
        </div>
        
        <p class="text-danger m-4">{{error}}</p>
        <button class="btn btn-primary" @click="edit">Update</button>
        <router-link :to="{ name: 'Book' }" class="btn btn-secondary" role="button">Cancel</router-link>
        </div>
    </div>`
    ,
    data (){
        return{
            update:{
                title: null,
                author: null,
                price: null,
                sample: null,
                text: null,
                section_id: null
            },
            error: null,
            sections:[],
            bookId: null,
            token: localStorage.getItem('auth-token')
        }
    }
    ,
    mounted() {
        this.getSections();
        const bookId = localStorage.getItem('BookID')
        localStorage.removeItem('BookID')
        this.bookId = bookId;
        fetch(`/api/books/${bookId}`)
          .then(response => response.json())
          .then(data => {
            this.update.title = data.title;
            this.update.author = data.author;
            this.update.price = data.price;
            this.update.sample = data.sample;
            this.update.text = data.text;
            this.update.section_id = data.section_id;
          })
          .catch(error => console.error(error));
      },
      methods: {
        edit() {
            fetch(`/api/books/${this.bookId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.token,
              },
              body: JSON.stringify(this.update),
            })
            .then(response => response.json())
            .then(data => {
              this.$router.replace({ path: `/books` });
            })
            .catch(error => console.error(error))
        },
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
      }
    }
        

