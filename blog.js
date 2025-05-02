const renderer = new marked.Renderer();

// Override function
const walkTokens = (token) => {
  if (token.type === 'heading') {
    token.depth += 1;
  }
};

marked.use({ walkTokens });

$(function () {
  $.getJSON("post-list.json", function (posts) {
    posts.forEach(function (postPath) {
      $.get(postPath, function (markdown) {
        const html = marked.parse(markdown);
        
        // Extract date from the file path (assuming format 'yyyy-mm-dd-title.md')
        const date = $('<i class="date"></i>').append(postPath.split('/').reverse()[0]);
        
        const postDiv = $('<div class="post"></div>').append(date).append(html);
        
        $('#posts').append(postDiv);
      });
    });
  });
});

