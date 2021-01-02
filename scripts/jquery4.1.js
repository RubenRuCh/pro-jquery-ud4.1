$(() => {
  // Para saber cuál es la última página cargada
  var pageNum = 1;

  $('#more-photos').click((e) => {
    e.preventDefault();
    // Se obtiene la siguiente página a cargar
    const $link = $(e.target);
    const url = $link.attr('href');

    // Si se han cargado ya las 19 páginas, se elimina el link
    if (pageNum > 19) {
      $link.remove();
      return;
    }

    // Se actualiza el link para que cargue una página más.
    $link.attr('href', `pages/${++pageNum}.html`);

    // Se obtiene (con Ajax) la siguiente página y se añade a la galería
    $.get(url)
      .then((data) => {
        $('#gallery').append(data);
      })
      .catch(({ statusText }) => {
        $('#gallery').append(`<strong>${statusText}</strong>`);
      });
  });
});
