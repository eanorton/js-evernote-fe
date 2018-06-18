const userApiUrl = "http://localhost:3000/api/v1/users"
const noteApiUrl = "http://localhost:3000/api/v1/notes"

const noteList = document.getElementById("note-list")

function fetchUsers() {
  fetch(userApiUrl).then(response=>response.json()).then(allUsers=>setUser(allUsers))
}

function fetchNotes() {
  fetch(noteApiUrl).then(response=>response.json()).then(allNotes=>displayNotes(allNotes))
}

//JSON.stringify({body:, title:, user_id: 1})

function setUser(allUsers){
  allUsers.forEach(user=>console.table(user))
}

function displayNotes(allNotes){
  noteList.innerHTML = ""
  allNotes.forEach(note=>noteList.innerHTML += `<li><h1>${note.title}</h1></li>`)
}

fetchNotes();
fetchUsers();
