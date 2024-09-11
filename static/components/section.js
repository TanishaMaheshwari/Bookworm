export default{
    template:`<div>
    <button class='btn btn-success float-end me-3' @click='add_section'>Add Section</button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Books</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="section in allSections" :key="section.id">
          <td>{{ section.id }}</td>
          <td>{{ section.name }}</td>
          <td>{{ section.description }}</td>
          <td>{{ section.num_books }}</td>
          <td>
            <button class="btn btn-outline-primary" @click="editSection(section.id)">Edit</button>
            <button class="btn btn-outline-danger" @click="deleteSection(section.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>`,
    data() {
        return {
          allSections: [],
          token: localStorage.getItem('auth-token'),
          error: null,
        }
      },
    methods:{
        add_section(){
            this.$router.push({ path:'/add_section'})
        }
    },
    async mounted() {
        const res = await fetch('/sections', {
          headers: {
            'Authentication-Token': this.token,
          },
        })
        const data = await res.json().catch((e) => {})
        if (res.ok) {
          console.log(data)
          this.allSections = data
        } else {
          this.error = res.status
        }
      },
}