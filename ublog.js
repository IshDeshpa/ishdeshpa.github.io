async function getRecentCommits(username) {
  const maxCommits = 5;
  const maxPages = 5; // avoid infinite loops
  const commits = [];
  const excludedRepo = `IshDeshpa/ishdeshpa.github.io`;

  for (let page = 1; page <= maxPages && commits.length < maxCommits; page++) {
    const response = await fetch(`https://api.github.com/users/${username}/events/public?page=${page}`);
    const events = await response.json();

    if (!Array.isArray(events)) {
      console.error("Error fetching events:", events.message);
      break;
    }

    for (const event of events) {
      if (event.type === "PushEvent" && event.repo.name !== excludedRepo) {
        const repoName = event.repo.name;
        const date = new Date(event.created_at);

        for (const commit of event.payload.commits) {
          // Skip commits with "Co-authored-by" in the message
          if (/Co-authored-by:/i.test(commit.message)) {
            continue;
          }

          commits.push({
            message: commit.message,
            url: commit.url.replace("api.", "").replace("/repos", "").replace("commits", "commit"),
            repo: repoName,
            date: date,
          });

          if (commits.length >= maxCommits) break;
        }
      }
      if (commits.length >= maxCommits) break;
    }
  }

  commits.sort((a, b) => b.date - a.date);

  commits.forEach(commit => {
    console.log(`[${commit.date.toISOString()}] ${commit.repo}`);
    console.log(`  - ${commit.message}`);
    console.log(`  - ${commit.url}`);

    const ghDiv = $(`
      <div class="gh-event">
        <i>${commit.date.toISOString()}</i><br>
        <b>${commit.repo}</b><br>
        <p><a href="${commit.url}" target="_blank">${commit.message}</a></p>
      </div>
    `);

    $('#gh').append(ghDiv);
  });
}
getRecentCommits("ishdeshpa");

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

