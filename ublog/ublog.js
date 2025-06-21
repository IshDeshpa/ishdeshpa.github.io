async function getRecentCommits(username) {
  const maxCommits = 5;
  const maxPages = 5;
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
          if (/Co-authored-by:/i.test(commit.message)) continue;

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

const walkTokens = (token) => {
  if (token.type === 'heading') {
    token.depth += 1;
  }
};

marked.use({ walkTokens });

$(function () {
  $.getJSON("ublog-list.json", function (posts) {
    const postData = [];
    let loadedCount = 0;

    posts.forEach(function (postPath) {
      $.get(postPath, function (markdown) {
        const filename = postPath.split('/').reverse()[0];
        const dt = filename.replace('.md', '');
        const postDateTime = new Date(dt);

        const html = marked.parse(markdown);
        const date = $('<i class="date"></i>').append(dt);
        const postDiv = $('<div class="post"></div>').append(date).append(html).append("<hr>");

        postData.push({ postDiv, postDateTime });
        loadedCount++;

        if (loadedCount === posts.length) {
          postData.sort((a, b) => b.postDateTime - a.postDateTime);
          const fragment = $(document.createDocumentFragment());

          postData.forEach(post => fragment.append(post.postDiv));
          $('#posts').append(fragment);
        }
      });
    });
  });
});
