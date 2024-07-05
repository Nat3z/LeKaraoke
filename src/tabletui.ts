document.querySelector('#search_button').addEventListener('click', function() {
  let search = document.querySelector('#search') as HTMLInputElement;
  let search_text = search.value;

  fetch('./search?q=' + search_text).then(function(response) {
    return response.json();
  }).then(function(text) {
    // json response looks like this: [{"title":"When the Moon's Reaching Out Stars (Lyrics) | Persona 3 Reload","url":"/watch?v=GcGFMV1h9WY&pp=ygUbd2hlbiB0aGUgbW9vbiByZWFjaGVzIHN0YXJz","creator":"while"},{"title":"Persona 3 OST - When the Moon's Reaching Out Stars (With Lyrics)","url":"/watch?v=3ko-0jUzF4U&pp=ygUbd2hlbiB0aGUgbW9vbiByZWFjaGVzIHN0YXJz","creator":"minakosenpai"},{"title":"When The Moon's Reaching Out Stars","url":"/watch?v=Iupq4GUgiQ8&pp=ygUbd2hlbiB0aGUgbW9vbiByZWFjaGVzIHN0YXJz","creator":"Release - Topic"},{"title":"When The Moon's Reaching Out Stars -Reload- | Persona 3 Reload ~ Extended Soundtrack","url":"/watch?v=_8Swl5GX38s&pp=ygUbd2hlbiB0aGUgbW9vbiByZWFjaGVzIHN0YXJz","creator":"Nael's Orchestrion Roll"},{"title":"\"When the Moon Reaches Out to the Stars\" - Persona 3 (Cover by Sapphire)","url":"/watch?v=3r6dnhuO_nM&pp=ygUbd2hlbiB0aGUgbW9vbiByZWFjaGVzIHN0YXJz","creator":"Sapphire"},{"title":"When the Moon’s Reaching Out Stars -Reload- | Persona 3 Reload OST [Extended]","url":"/watch?v=v819NhVXNdM&pp=ygUbd2hlbiB0aGUgbW9vbiByZWFjaGVzIHN0YXJz","creator":"Pollux"},{"title":"Deep Sleep | Third Eye Chakra | 432Hz | Binaural Beats | Black Screen","url":"/watch?v=hXmFgsVvV5M&pp=ygUbd2hlbiB0aGUgbW9vbiByZWFjaGVzIHN0YXJz","creator":"Phi Tribe"},{"title":"Persona 3 Reload Full Moon, Full Life (P3R Mini-Live Concert)","url":"/watch?v=EuIG3XwrQys&pp=ygUbd2hlbiB0aGUgbW9vbiByZWFjaGVzIHN0YXJz","creator":"Jasper Pena"},{"title":"Persona 3 Reload Best Tracks","url":"/watch?v=CGbca3HeBq0&pp=ygUbd2hlbiB0aGUgbW9vbiByZWFjaGVzIHN0YXJz","creator":"Dayker"},{"title":"Persona 3: Dancing in Moonlight + Advanced CD Full OST","url":"/watch?v=S_XrahozcQ4&pp=ygUbd2hlbiB0aGUgbW9vbiByZWFjaGVzIHN0YXJz","creator":"PhoisgoodVGM"}]

    let results = document.querySelector('#results');
    results.innerHTML = '';

    text.forEach(function(item: any) {
      // parse the youtube id from the url
      // add elipses to title if it's too long
      let title = item.title.text!!;
      title = title.length > 30 ? title.slice(0, 30) + '...' : title;
      let id = item.id;
      if (item.author)
        results.innerHTML += `
          <div class="result" data-url="https://youtube.com/watch?v=${id}">
            <img alt="thumbnail" src="https://img.youtube.com/vi/${id}/0.jpg"></img>
            <div>
              <h1>${title}</h1>
              <p>${item.author.name}</p>
            </div>
           
            <button class="add_to_playlist">
              <span class="material-symbols-outlined">
              playlist_add
              </span>
            </button>
          </div>
        `;
    });

    // add event listeners to the add to playlist buttons
    document.querySelectorAll('.add_to_playlist').forEach(function(button) {
      button.addEventListener('click', function() {
        let result = button.parentElement as HTMLElement;
        let url = result.getAttribute('data-url');
        let title = result.querySelector('h1').textContent;
        let creator = result.querySelector('p').textContent;
        console.log("CLICKED ADD TO PLAYLSIT!")
        fetch('./add_to_queue?url=' + url, {
          method: 'POST',
        }).then(function(response) {
          return response.text();
        }).then(function(text) {
          if (text === '1') {
            let material_symbols = result.querySelector('.material-symbols-outlined');
            material_symbols.textContent = 'playlist_add_check';
          }
          else {
            let material_symbols = result.querySelector('.material-symbols-outlined');
            material_symbols.textContent = 'playlist_remove';
          }
        });
      });
    });
  });
});
