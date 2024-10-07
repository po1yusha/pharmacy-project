$(document).ready(function() {
  $('#search-form').submit(function(event) {
    event.preventDefault(); // Забороняємо типову поведінку форми
    var query = $('#search-bar').val(); // Отримуємо текст пошуку

    $.ajax({
      url: `/pharmacy/index/catalog/medicines`, // URL-адреса, на яку буде відправлений запит
      type: 'GET',
      data: {search_expression:query}, // Передаємо дані запиту (текст пошуку)
      success: function(data) {
        if (!(data instanceof Array) || data.length == 0) {
          $('.medicaments__items').empty();
          var itemHTML = `<p class="title_no_exist">Товари відсутні</p>`
          $('.medicaments__items').append(itemHTML)
          return
        }
        // Empty the existing items
        $('.medicaments__items').empty();

        // Iterate over the data received from the server
        for (var i = 0; i < data.length; i++) {
          var product = data[i];

          // Generate the HTML for each product item using the received data
          var itemHTML = `
            <div class="medicaments-column">
              <div class="medicaments__item item">
                <div class="medicaments__item__img">
                  <img class="medicaments_img" src="${product.product_img}" alt="medicament">
                </div>
                <div class="price_and_rating">
                  <h4 class="medicaments__item__price">
                    ${product.price}
                  </h4>
                  <div class="rating">
                    ${generateStars(product.range_rating, 'checked')}
                    ${generateStars(product.range_gray)}
                  </div>
                </div>
                <h4 class="comments">${product.comment}</h4>
                <h3 class="medicaments__item__title">
                  ${product.name}
                </h3>
                <div class="medicaments__item__button">
                  <a href="#popup__cart" class="popup-link">
                    <button class="medicaments-button"><i class="fa-regular fa-cart-shopping order-cart"></i>Замовити</button>
                  </a>
                </div>
              </div>
            </div>
          `;

          // Append the generated HTML to the container
          $('.medicaments__items').append(itemHTML);
        }
      }
    });
  });
});

function generateStars(count, className = '') {
  var stars = '';
  for (var i = 0; i < count.length; i++) {
    stars += `<i class="fa-solid fa-star ${className}"></i>`;
  }
  return stars;
}