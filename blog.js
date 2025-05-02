const renderer = new marked.Renderer();

// Override function
const walkTokens = (token) => {
  if (token.type === 'heading') {
    token.depth += 1;
  }
};

marked.use({ walkTokens });

$(function () {
  $.getJSON("ublog-list.json", function (posts) {
    const postData = [];

    posts.forEach(function (postPath) {
      $.get(postPath, function (markdown) {
        const html = marked.parse(markdown);
	       
	const filename = postPath.split('/').reverse()[0];
	const dt = filename.replace('.md','');
	const postDateTime = new Date(dt);

        // Extract date from the file path (assuming format 'yyyy-mm-dd-title.md')
        const date = $('<i class="date"></i>').append(dt);
        
        const postDiv = $('<div class="post"></div>').append(date).append(html).append("<hr></hr>");
        
	postData.push({ postDiv, postDateTime });

	if (postData.length == posts.length){
	  postData.sort((a,b) => b.postDateTime - a.postDateTime);

	  postData.forEach(function(post){
	    $('#posts').append(post.postDiv);
	  });
	}
      });
    });
  });
});

