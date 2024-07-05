let editing = false;
function getQueueData() {
  if (editing) return;
  fetch('./queue').then(function(response) {
    return response.json();
  }).then(function(text) {
    let queue = text.queue;
    let map = text.map;
    let playlist = document.querySelector('#results');
    playlist.innerHTML = '';

    queue.forEach(function(id: string) {
      let item = map[id];
      playlist.innerHTML += `
        <div class="result" data-url="https://youtube.com/watch?v=${id}">
          <img alt="thumbnail" src="https://img.youtube.com/vi/${id}/0.jpg"></img>
          <div>
            <h1>${item.title}</h1>
            <p>${item.creator}</p>
          </div>
        </div>
      `;
    });

    document.querySelectorAll('.result').forEach(result => {
      result.addEventListener('click', () => {
        result.setAttribute('selected', 'true');
        if (!editing) setEditorState();
        editing = true;

      })
    })
  });

}
function setEditorState() {
  const alert = document.querySelector("#alert")!! as HTMLElement;
  alert.style.display = "flex"
  alert.setAttribute("accent", "warn");
  alert.querySelector("h1")!!.textContent = "Editing Queue";

  alert.animate([
    { top: "-20rem" },
    { top: "0" }
  ], {
    duration: 500,
    easing: "ease-in-out"
  })
}
getQueueData();
setInterval(getQueueData, 1000)
