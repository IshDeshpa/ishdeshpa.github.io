$(function () {
  $.getJSON("blog-list.json", function (posts) {
    posts.forEach(function (postPath) {
      // Get file name without extension
      const fileName = postPath.split('/').pop();             // e.g., "my-post.md"
      const title = fileName.replace(/\.md$/, '');            // e.g., "my-post"
      const htmlFile = title + ".html";                       // e.g., "my-post.html"

      // Create a list item with a link
      $('#posts').append(
	$('<li>').append(
	  $('<a>')
	  .attr('href', htmlFile)
	  .text(title.replace(/[-_]/g, ' ')) // Make it more readable
	)
      );
    });
  });
});
