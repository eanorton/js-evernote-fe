const userApiUrl = "http://localhost:3000/api/v1/users"
const noteApiUrl = "http://localhost:3000/api/v1/notes"

const noteList = document.getElementById("note-list")
const noteContent = document.getElementById("note-content")

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
  allNotes.forEach(note=>noteList.innerHTML += `<li><h3>${note.title}</h3><p>${note.body}</p> <button class="delete" data-note-id="${note.id}">Delete</button><button class="update" data-note-id="${note.id}">Update</button></li>`)
}

function makeNewNote(){

}

document.addEventListener('click', function(event){
  event.preventDefault()
  if (event.target.className === "update"){
    console.log("hi")
  } else if (event.target.className === "delete"){
    console.log("NO")
  }
})

fetchNotes();
fetchUsers();
