/* =========================================================
   Saffron Table — gallery (gallery.html), written with jQuery
   - mosaic built from the galleryPhotos array
   - filter buttons with fadeIn / fadeOut
   - lightbox with previous / next and keyboard control
   ========================================================= */

$(function () {
  const $grid = $("#gallery-grid"); // ID selector
  if (!$grid.length) return;

  let currentIndex = 0;

  // Build every <figure> from the array with $.each
  $.each(galleryPhotos, function (index, photo) {
    const $figure = $("<figure>", {
      class: "gallery-item " + photo.size,
      "data-group": photo.group,
      "data-index": index,
      tabindex: 0
    });
    $figure.append($("<img>", { src: photo.src, alt: photo.alt }));
    $figure.append($("<figcaption>").text(photo.caption));
    $grid.append($figure);
  });

  // Filter buttons: class selector + attribute selector
  $(".gallery-filter").on("click", "button[data-filter]", function () {
    const filter = $(this).data("filter");

    // traversal: highlight the clicked button, clear its siblings
    $(this).addClass("active").siblings().removeClass("active");

    $grid.children(".gallery-item").each(function () {
      const matches = filter === "all" || $(this).data("group") === filter;
      if (matches) $(this).fadeIn(300);
      else $(this).fadeOut(300);
    });
  });

  // Fill the lightbox with the photo at a given position
  function showPhoto(index) {
    currentIndex = (index + galleryPhotos.length) % galleryPhotos.length;
    const photo = galleryPhotos[currentIndex];
    $("#lightbox img").attr({ src: photo.src, alt: photo.alt });
    $("#lightbox .lightbox-caption").text(
      photo.caption + "  (" + (currentIndex + 1) + " / " + galleryPhotos.length + ")"
    );
  }

  function openLightbox(index) {
    showPhoto(index);
    $("#lightbox").fadeIn(250).attr("aria-hidden", "false");
  }

  function closeLightbox() {
    $("#lightbox").fadeOut(200).attr("aria-hidden", "true");
  }

  // Open on click or Enter on a figure (descendant selector via find())
  $grid.on("click", ".gallery-item", function () {
    openLightbox(Number($(this).data("index")));
  });
  $grid.on("keydown", ".gallery-item", function (event) {
    if (event.key === "Enter") openLightbox(Number($(this).data("index")));
  });

  $("#lightbox").find(".lightbox-prev").on("click", () => showPhoto(currentIndex - 1));
  $("#lightbox").find(".lightbox-next").on("click", () => showPhoto(currentIndex + 1));
  $("#lightbox").find(".lightbox-close").on("click", closeLightbox);

  // Click on the dark backdrop (not the image) closes the lightbox
  $("#lightbox").on("click", function (event) {
    if (event.target === this) closeLightbox();
  });

  $(document).on("keydown", function (event) {
    if (!$("#lightbox").is(":visible")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
    if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
  });
});
