let products = [
  { id: 1, title: 'Киви', text: "lorem10", price: 20, img: 'https://e1.edimdoma.ru/data/ingredients/0000/1596/1596-ed4_wide.jpg', text: '«Китайский крыжовник» — ворсистый плод коричневого цвета с зеленой мякотью внутри, усеянной в середине черными мелкими зернышками. Конечно же, это киви! А что вы знаете о киви?' },
  { id: 2, title: 'Грецкие орехи', price: 30, img: 'https://e3.edimdoma.ru/data/ingredients/0000/1233/1233-ed4_wide.jpg', text: 'В грецких орехах немало полезного: около 76% масла, 21% растительного белка, углеводы, высокие дозы витаминов и полиненасыщенных кислот.' },
  { id: 3, title: 'Яблоки', price: 40, img: 'https://e3.edimdoma.ru/data/ingredients/0000/2374/2374-ed4_wide.jpg', text: 'Полезные свойства яблок известны всем — яблоки являются отличным источником железа и клетчатки, необходимой для нормальной работы желудочно-кишечного тракта. Применение яблок в народной медицине также очень распространено, так как эти плоды нормализуют артериальное давление, укрепляют костную ткань, освежают лицо и продляют молодость.' },
  { id: 4, title: 'Манго', price: 40, img: 'https://e0.edimdoma.ru/data/ingredients/0000/1089/1089-ed4_wide.jpg', text: 'Экзотический фрукт манго давно полюбился в нашей стране. Он растет на вечнозеленых деревьях, достигающих 40 м в высоту. Только в одной Индии насчитывают до тысячи разных видов манго.' },
]
function render() {
  const templ = product => `
    <div class="col product-card" data-productid="${product.id}">
      <div class="card">
        <img class="card-img-top" style="height:240px" src="${product.img}" alt="${product.title}">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.text}</p>
          <a class="btn btn-primary btn-view" data-id="${product.id}">Посмотреть цену</a>
          <a class="btn btn-${canDelete(product) ? `danger` : `secondary`} btn-delete" data-id="${product.id}">Удалить</a>
        </div>
      </div>
    </div>`
  document.querySelector('#products').innerHTML = products.map(templ).join('')
  document.querySelectorAll('.btn-view').forEach(function (el, i) {
    el.addEventListener('click', (event) => openDialog(event, products[i]))
  })
  document.querySelectorAll('.btn-delete').forEach(function (el, i) {
    el.addEventListener('click', (event) => deleteDialog(event, products[i]))
  })
}

function openDialog(event, product) {
  $.modal({
    animate: "animate__animated animate__fadeInLeft",
    title: `<strong>${product.title}</strong>`,
    closeable: true,
    body: `<p>Цена=${product.price}$</p>`,
    width: '200px',
    footerButtons: [
      {
        text: 'Ok', type: 'primary', ret: 1, handler: (event, ret) => {
          ret.resolve(ret)
        }
      }
    ]
  })
}

canDelete = (product) => product.id > 2
// function canDelete(product) {
//   return product.id > 2
// }
function deleteDialog(event, product) {
  $.modal({
    animate: "animate__animated animate__lightSpeedInRight",
    title: `<strong>${product.title}</strong>`,
    closeable: true,
    body: `<p> Удалить продукт ?</p>`,
    width: 'inherited',
    footerButtons: [
      {
        text: 'No', type: 'primary', ret: 1, handler: (event, ret) => {
          ret.rr = false
          ret.resolve(ret)
        }
      },
      {
        text: 'Yes', type: 'danger', ret: 2, handler: (event, ret) => {
          ret.rr = true
          ret.resolve(ret)
        }
      }
    ],
    onOpen: () => canDelete(product)
  })
    .then((ret) => {
      if (ret.rr) {
        document.querySelector('#products').querySelectorAll('.product-card').forEach(function (el, i) {
          if (el.dataset.productid == product.id && !product.deleted) {
            el.remove()
            product.deleted = true
          }
        })
      }
    })
    .catch((Error, ret) => {
      console.log(Error, ret);
    })
}
render()
