export default {
  template: `
    <div>
      <button class='btn btn-success me-3' @click='add_section'>Add Section</button>
      <div class="search-bar float-end me-3 d-flex">
        <input type="text" class="form-control me-2" v-model="searchName" placeholder="Name" @keydown.enter="searchSections">
        <input type="text" class="form-control me-2" v-model="searchDescription" placeholder="Description" @keydown.enter="searchSections">
        <button class="btn btn-secondary" @click="searchSections">Search</button>
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th style="padding-top: 30px;">ID</th>
            <th style="padding-top: 30px;">Name</th>
            <th style="padding-top: 30px;">Description</th>
            <th style="padding-top: 30px;">Books</th>
            <th style="padding-top: 30px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="section in filteredSections" :key="section.id">
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
    </div>
  `,
  data() {
    return {
      allSections: [],
      filteredSections: [],
      searchName: '',
      searchDescription: '',
      error: null,
      sectionId: null,
      token: localStorage.getItem('auth-token'),
    }
  },
  methods: {
    add_section() {
      this.$router.push({ path: `/add_section` })
    },
    editSection(sectionId){
      this.sectionId = sectionId;
      localStorage.setItem('sectionId',sectionId)
      this.$router.push({ path: `/edit_section/${sectionId}`})
    },
    searchSections() {
      this.filteredSections = this.allSections.filter(section => {
        const nameMatch = this.searchName ? section.name.toLowerCase().includes(this.searchName.toLowerCase()) : true
        const descriptionMatch = this.searchDescription ? section.description.toLowerCase().includes(this.searchDescription.toLowerCase()) : true
        return nameMatch && descriptionMatch
      })
    },
    deleteSection(sectionId) {
      try {
        fetch(`/sections/${sectionId}`, {
          method: 'DELETE',
          headers: {
            'Authentication-Token': this.token,
          },
        })
        .then(response => {
          if (response.ok) {
            alert("Section deleted.")
            return response.json();
          } else {
            throw new Error('Failed to delete section');
          }
        })
         .then(() => {
           const index = this.allSections.indexOf(this.allSections.find(section => section.id === sectionId));
           if (index !== -1) {
             this.allSections.splice(index, 1);
             this.filteredSections = this.allSections.filter(section => {
               // Re-apply search filters
               const nameMatch = this.searchName ? section.name.toLowerCase().includes(this.searchName.toLowerCase()) : true
               const descriptionMatch = this.searchDescription ? section.description.toLowerCase().includes(this.searchDescription.toLowerCase()) : true
               return nameMatch && descriptionMatch
             });
           }
         })
        .catch(error => console.error(error));
        } catch (error) {
          console.error(error);
        }
      },
    },
    async mounted() {
      const res = await fetch('/sections', {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json().catch((e) => {})
      if (res.ok) {
        this.allSections = data
        this.filteredSections = data
      } else {
        this.error = res.status
      }
    }
  }