      document.addEventListener('alpine:init', () => {
        Alpine.store('table', {
          data: [{"id":1,"first_name":"Anthony","last_name":"Linbohm","city":"Makui","department":"Business Development","title":"Quality Engineer"},
{"id":2,"first_name":"Richard","last_name":"Moult","city":"Xihu","department":"Legal","title":"Budget/Accounting Analyst IV"},
{"id":3,"first_name":"Chance","last_name":"Dallas","city":"Moncton","department":"Support","title":"Product Engineer"},
{"id":4,"first_name":"Rozamond","last_name":"Abbatucci","city":"Chico","department":"Legal","title":"Software Consultant"},
{"id":5,"first_name":"Ashely","last_name":"Petrozzi","city":"Lafia","department":"Services","title":"Staff Accountant III"},
{"id":6,"first_name":"Bron","last_name":"Siuda","city":"Mora","department":"Accounting","title":"Marketing Manager"},
{"id":7,"first_name":"Marena","last_name":"Geraldi","city":"Karanganyar","department":"Support","title":"Compensation Analyst"},
{"id":8,"first_name":"Tomas","last_name":"Donneely","city":"Meirinhas","department":"Services","title":"Research Associate"},
{"id":9,"first_name":"Umberto","last_name":"Cohalan","city":"Cuamba","department":"Research and Development","title":"Chemical Engineer"},
{"id":10,"first_name":"Nicola","last_name":"Flippelli","city":"Faqīrwāli","department":"Human Resources","title":"VP Quality Control"},
{"id":11,"first_name":"Jemie","last_name":"McLafferty","city":"Lagoa de Albufeira","department":"Human Resources","title":"Junior Executive"},
{"id":12,"first_name":"Glen","last_name":"Edinborough","city":"Chicago","department":"Accounting","title":"Associate Professor"},
{"id":13,"first_name":"Malachi","last_name":"Broadbridge","city":"Az Zaytūnīyah","department":"Human Resources","title":"Paralegal"},
{"id":14,"first_name":"Yale","last_name":"Milnes","city":"Shuangjie","department":"Accounting","title":"Account Representative III"},
{"id":15,"first_name":"Galvin","last_name":"Morrill","city":"Gaocun","department":"Engineering","title":"Account Representative II"},
{"id":16,"first_name":"Cesar","last_name":"Pinnegar","city":"Drahichyn","department":"Marketing","title":"VP Sales"},
{"id":17,"first_name":"Harlan","last_name":"Aldin","city":"Hulan","department":"Legal","title":"Paralegal"},
{"id":18,"first_name":"Thadeus","last_name":"Tressler","city":"Indaial","department":"Services","title":"Product Engineer"},
{"id":19,"first_name":"Marjie","last_name":"Agiolfinger","city":"Tatarbunary","department":"Marketing","title":"Environmental Specialist"},
{"id":20,"first_name":"Amie","last_name":"Dupoy","city":"Thị Trấn Mường Khến","department":"Accounting","title":"Legal Assistant"},
{"id":21,"first_name":"Marylinda","last_name":"Kidson","city":"Ondoy","department":"Business Development","title":"Community Outreach Specialist"},
{"id":22,"first_name":"Karlen","last_name":"Capun","city":"Buda-Kashalyova","department":"Engineering","title":"Assistant Media Planner"},
{"id":23,"first_name":"Horatius","last_name":"Giovanizio","city":"Kham Sakae Saeng","department":"Marketing","title":"Director of Sales"},
{"id":24,"first_name":"Eleni","last_name":"Tale","city":"Montpellier","department":"Engineering","title":"Tax Accountant"},
{"id":25,"first_name":"Chester","last_name":"Theuss","city":"Panshan","department":"Legal","title":"Account Executive"},
{"id":26,"first_name":"Morey","last_name":"Demangel","city":"Stoney Ground","department":"Support","title":"Human Resources Manager"},
{"id":27,"first_name":"Tedda","last_name":"Rawlin","city":"Erfangping","department":"Sales","title":"Editor"},
{"id":28,"first_name":"Rennie","last_name":"Finnan","city":"Tuusula","department":"Human Resources","title":"Paralegal"},
{"id":29,"first_name":"Merry","last_name":"Wisedale","city":"Renxian","department":"Services","title":"Systems Administrator IV"},
{"id":30,"first_name":"Melodie","last_name":"Hayzer","city":"Hưng Nguyên","department":"Support","title":"Media Manager I"},],
          // definition: [
          //   {
          //     key: "id",
          //   },
          //   {
          //     key: "first_name",
          //   },
          //   {
          //     key: "department"
          //   }
          // ],
          filter: '',
          page: 1,
          itemsPerPage: 10,
          primaryKey: 'id',
          filteredItemsCount: 0,
          // onFilter(filteredData) {
          //   this.filteredItemsCount = filteredData.length
          // },
          init() {
            this.onFilter = () => (filteredData) => {
              this.filteredItemsCount = filteredData.length
            }
            // setTimeout(() => {
            //   this.data.splice(0, 5)
            // }, 1000)
            // setTimeout(() => {
            //   this.definition.splice(2, 1)
            // }, 5000)
          }
        })
      })
