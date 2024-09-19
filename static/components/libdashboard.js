export default {
    template: `
      <div>
        <h1 class="text-muted text-center m-3">Welcome Librarian !!</h1>
        <div class="container text-center mt-5">
          <div class="row w-100"> 
            <div class="col border border-dark rounded p-3 me-3">
              <h2>Section Analysis</h2>
              <canvas id="genresChart"></canvas>
            </div>   
            <div class="col border border-dark rounded p-3">
              <h2>Popular Books</h2>
              <canvas id="popularBooksChart"></canvas>
            </div>
          </div>
          <div class="row w-100 border border-dark rounded p-3 mt-3">
            <h1>Balance: <span>{{ balance }}</span></h1>
          </div>
        </div>
      `,
    data() {
      return {
        balance: 0,
        token: localStorage.getItem('auth-token')
      }
    },
    mounted() {
        this.getBalance();

      fetch('/book_chart')
        .then(response => response.json())
        .then(data => {
          const booksData = data;
    
          const popularBooksData = {
            labels: booksData.top_5_books.map(book => book[0]), // extract book titles
            datasets: [{
              label: "Book Genres",
              data: booksData.top_5_books.map(book => book[1]), // extract book counts
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            }]
          };
          const popularBooksChart = new Chart(document.getElementById("popularBooksChart"), {
            type: "line",
            data: popularBooksData,
          });
    
        })
        .catch(error => {
          console.error(error);
        });
  
      fetch('/section_chart')
        .then(response => response.json())
        .then(data => {
          const sectionData = data;
        
          const sectionChartData = {
            labels: sectionData.sections.map(section => section[0]),
            datasets: [{
              label: "Number of Books",
              data: sectionData.sections.map(section => section[1]),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            }]
          };
          const sectionChart = new Chart(document.getElementById("genresChart"), {
            type: "bar",
            data: sectionChartData,
          });
        
        })
        .catch(error => {
          console.error(error);
        });
    },
    methods: {
        async getBalance() {
          try {
            const response = await fetch('/librarian', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.token,
              }
            });
            const data = await response.json();
            if (response.ok) {
              this.balance = data.balance;
            } else {
              this.error = data.message;
              alert(data.message);
            }
          } catch (error) {
            console.error(error);
          }
        },
    }
  };