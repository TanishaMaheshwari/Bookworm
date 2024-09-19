import Home from './components/home.js'
import Login from './components/login.js'
import Users from './components/Users.js'
import RegistrationForm from './components/register.js'
import Books from './components/books.js'
import Add_Book from './components/add_book.js'
import Section from './components/section.js'
import Add_section from './components/add_section.js'
import book4user from './components/books4user.js'
import edit_section from './components/edit_section.js'
import edit_book from './components/edit_book.js'
import Request from './components/Request.js'
import Profile from './components/Profile.js'
import Payment from './components/Payment.js'

const routes=[
    { path: '/', component: Home, name: 'Home' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/register', component: RegistrationForm, name: 'Register' },
    { path: '/users', component: Users },
    { path: '/books', component: Books, name:'Book'},
    { path: '/add_book', component: Add_Book},
    { path: '/section', component: Section, name: 'Section'},
    { path: '/add_section', component: Add_section},
    { path: '/book', component: book4user },
    { path: '/edit_section/:id', component: edit_section},
    { path: '/edit_book/:id', component: edit_book},
    { path: '/requests', component: Request},
    { path: '/profile', component: Profile},
    { path: '/payment', component: Payment}
]

export default new VueRouter({
    routes,
  })