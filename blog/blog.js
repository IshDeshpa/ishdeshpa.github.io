$(function () {
  $.getJSON("blog-list.json", function (posts) {
    posts.forEach(function (postPath) {
      // Remove trailing slash if any
      postPath = postPath.replace(/\/$/, '');

      // Find the markdown filename (without extension) from the folder name
      // Assuming folder contains one markdown file
      $.get(postPath, function() {}, 'text')  // placeholder to avoid errors, real file name is derived below

      const folderName = postPath.split('/').pop();  // e.g., "my-post"
      const htmlFile = postPath + "/" + folderName + ".html"; // e.g., "my-post/my-post.html"

      // Create a list item with a link
      $('#posts').append(
        $('<li>').append(
          $('<a>')
            .attr('href', htmlFile)
            .text(folderName.replace(/[-_]/g, ' ')) // Make it more readable
        )
      );
    });
  });
});
