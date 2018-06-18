const userApiUrl = "http://localhost:3000/api/v1/users"
const noteApiUrl = "http://localhost:3000/api/v1/notes"

const noteList = document.getElementById("note-list")
const noteTitle = document.getElementById("note-title")
const noteContent = document.getElementById("note-content")
const submitBtn = document.getElementById("submit")
const form = document.getElementById("form")



// FETCH ALL USERS
function fetchUsers() {
  fetch(userApiUrl).then(response=>response.json()).then(allUsers=>displayUser(allUsers))
}

// FETCH ALL NOTES
function fetchNotes() {
  fetch(noteApiUrl).then(response=>response.json()).then(allNotes=>displayNotes(allNotes))
}

// DISPLAY USERS IN CONSOLE TABLE
function displayUser(allUsers){
  allUsers.forEach(user=>console.table(user))
}

// DISPLAY NOTES AS A LIST ON PAGE
function displayNotes(allNotes){
  noteList.innerHTML = ""
  allNotes.forEach(note=>noteList.innerHTML += `<li><h3>${note.title}</h3><p id="body">${truncateNoteContent(note.body)}</p> <button class="delete" data-note-id="${note.id}">Delete</button><button class="update" data-note-id="${note.id}">Update</button></li>`)
}

function truncateNoteContent(body) {

  var res = body.substring(0, 100) + "...";
  return res;
}

// FUNCTION TO MAKE A NEW NOTEOBJECT AND PERSIST TO DATABASE, AND ADD TO THE BOTTOM OF OUR LIST
function makeNewNote(){
  let configObj = {
    method:"POST",
    body:JSON.stringify({title: `${noteTitle.value}`, body: `${noteContent.value}`,user_id:1}),
    headers:{'Content-Type':'application/json'}
  }

  fetch(noteApiUrl, configObj).then(response=>response.json()).then(fetchNotes)
}

//FUNCTION TO DELETE NOTEOBJ FROM DATABASE AND REMOVE FROM OUR LIST
function deleteNote(id){
  let configObj = {
    method:"DELETE"
  }
  fetch(`${noteApiUrl}/${id}`, configObj).then(fetchNotes)
}

//FUNCTION TO POP UP AN ALERT IN THE WINDOW OBJ TO GET CONFIRMATION THEY WANT TO DELETE NOTEOBJ
function confirmDelete(id){
  var r = confirm("Press OK to delete your note or Cancel to go back");
  if (r == true) {
    deleteNote(id);
    alert("Note has been deleted!")
  } else if (r == false) {
    alert("You did not delete your note!");
  }
}

//FUNCTION TO UPDATE NOTEOBJ - CURRENTLY TAKING IN VALUE FROM THE NEW NOTEFIELD
function updateNote(id){
  let configObj = {
    method:"PATCH",
    body:JSON.stringify({title: `${noteTitle.value}`, body: `${noteContent.value}`,user_id:1}),
    headers:{'Content-Type':'application/json'}
  }
  fetch(`${noteApiUrl}/${id}`, configObj).then(fetchNotes)
}

//EVENT LISTENER FOR CLICKING UPDATE AND DELETE BUTTONS
noteList.addEventListener('click', function(event){

  if (event.target.className === "update"){
    updateNote(event.target.dataset.noteId)
  } else if (event.target.className === "delete"){
    confirmDelete(event.target.dataset.noteId)
  }
})

//EVENT LISTENER FOR CLICKING THE SUBMIT AND MAKING NEW NOTEOBJ AT TOP OF WINDOW
form.addEventListener('submit', function(event){
  event.preventDefault()

  makeNewNote();
  noteContent.value = "";
  noteTitle.value = "";

})

//RUN THE FUNCTION TO DISPLAY NOTES UPON LOADING PAGE

fetchNotes();
fetchUsers();
