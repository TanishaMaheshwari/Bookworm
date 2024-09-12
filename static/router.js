import Home from './components/home.js'
import Login from './components/login.js'
import Users from './components/Users.js'
import RegistrationForm from './components/register.js'
import Books from './components/books.js'
import Add_Book from './components/add_book.js'
import Section from './components/section.js'
import Add_section from './components/add_section.js'
import book4user from './components/books4user.js'

const routes=[
    { path: '/', component: Home, name: 'Home' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/register', component: RegistrationForm, name: 'Register' },
    { path: '/users', component: Users },
    { path: '/books', component: Books},
    { path: '/add_book', component: Add_Book},
    { path: '/section', component: Section},
    { path: '/add_section', component: Add_section},
    { path: '/book', component: book4user }
]

export default new VueRouter({
    routes,
  })