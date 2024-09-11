export default{
    template: `<div>
    <h1 class="display-5 text-center mt-5" @click="showModal = true">ADD SECTION</h1>
    <div class="form text-center" >

    <div class="form-floating mb-3">
      <input type="text" class="form-control" id="floatingInputName" v-model="section.name" placeholder="name" required>
      <label for="name">Name</label>
    </div>

    <div class="form-floating mb-3">
      <input type="text" class="form-control" id="floatingInputDescription" v-model="section.description" placeholder="description" required>
      <label for="description">Description</label>
    </div>

    <button class="btn btn-success m-3" @click="add_section">ADD</button>
    </div>
    </div>`,

    data(){
        return{
            section: {
                name: null,
                description: null
            },
            token: localStorage.getItem('auth-token'),
            error: null
        }
    },

    methods: {
        async add_section(){
            fetch('/add_section',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token,
                },
                body: JSON.stringify(this.section)
            })
            .then(async (res) => {
                const data = await res.json();
                if (res.ok) {
                    this.$router.push({path: '/section'})
                    alert(data.message)
                } else {
                    this.error = data.message
                    alert(data.message)
                }
            });
        }
    },
}