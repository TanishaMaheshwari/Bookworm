export default{
    template:`<div>
        <h1 class="display-5 text-center mt-5">Update Section</h1>
        <div class="form text-center" style="max-width: 400px; padding: 20px; margin: 40px auto; ">
    
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingInput" v-model= "update.name" placeholder="name" required @keydown.enter="edit">
          <label for="text">Name</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingPassword" v-model= "update.description" placeholder="description" required @keydown.enter="edit">
          <label for="description">Description</label>
        </div>
        <p class="text-danger m-4">{{error}}</p>
        <button class="btn btn-primary" @click="edit">Update</button>
        <router-link :to="{ name: 'Section' }" class="btn btn-secondary" role="button">Cancel</router-link>
        </div>
    </div>`
    ,
    data (){
        return{
            update:{
                name: null,
                description: null
            },
            error: null,
            sectionId: null,
            token: localStorage.getItem('auth-token')
        }
    }
    ,
    mounted() {
        const sectionId = localStorage.getItem('sectionId')
        localStorage.removeItem('sectionID')
        this.sectionId = sectionId;
        fetch(`/api/sections/${sectionId}`)
          .then(response => response.json())
          .then(data => {
            this.update.id = data.id;
            this.update.name = data.name;
            this.update.description = data.description;
          })
          .catch(error => console.error(error));
      },
      methods: {
        edit() {
            fetch(`/api/sections/${this.sectionId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.token,
              },
              body: JSON.stringify(this.update),
            })
            .then(response => response.json())
            .then(data => {
              this.$router.replace({ path: `/section` });
            })
            .catch(error => console.error(error))
        }
      }
    }
        

