import Library from './libdashboard.js'
import User from './userdashboard.js'

export default{
    template: `<div>
    <Library v-if="userrole=='librarian'" />
    <User v-if="userrole=='reader'" />
    </div>`,
    data(){
       console.log(this.$route.query);
        return {
            userrole : localStorage.getItem('role')
        }
    }, 
    components: {
        Library,
        User
    }
}
