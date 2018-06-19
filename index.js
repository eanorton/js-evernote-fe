const userApiUrl = "http://localhost:3000/api/v1/users"
const noteApiUrl = "http://localhost:3000/api/v1/notes"

const noteList = document.getElementById("note-list")
const noteTitle = document.getElementById("note-title")
const noteContent = document.getElementById("note-content")
const submitBtn = document.getElementById("submit")
const form = document.getElementById("form")
const singleNoteDetail = document.getElementById("note-detail")


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

//h3-data-note-id="${note.id}" data-note-title="${note.title}" data-note-body="${note.body}"
//p - data-note-id="${note.id}" data-note-body="${note.body}" data-note-title="${note.title}"

// DISPLAY NOTES AS A LIST ON PAGE
function displayNotes(allNotes){
  noteList.innerHTML = ""
  allNotes.forEach(note=>noteList.innerHTML += `<li class="list-group-item" ><h3 class="note-header">${note.title}</h3><p class="note-body" id="body">${note.body}</p> <button type="button" class="btn btn-danger" data-note-id="${note.id}">Delete</button><button type="button" class="btn btn-primary" class="update" data-note-id="${note.id}">Update</button></li>`)
}

//FUNCTION TO SHORTEN THE AMOUNT OF NOTECONTENT THAT IS DISPLAYED
function truncateNoteContent(body) {

  var res = body.substring(0, 100) + "...";
  return res;
}

function renderNewNoteForm(){

  singleNoteDetail.innerHTML += `<div class="form-group">
    <label for="Title">NOTE TITLE</label>
    <textarea class="form-control" id="example-title" rows="1"></textarea>
    <label for="Content">NOTE CONTENT</label>
    <textarea class="form-control" id="example-body" rows="3"></textarea>
  </div>`

  makeNewNote();
}

// FUNCTION TO MAKE A NEW NOTEOBJECT AND PERSIST TO DATABASE, AND ADD TO THE BOTTOM OF OUR LIST
function makeNewNote(){
  let configObj = {
    method:"POST",
    body:JSON.stringify({title: `${noteTitle.value}`, body: `${noteContent.value}`,user_id:2}),
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
function updateNote(note){
  let noteElements = Array.from(note.children)

  let configObj = {
    method:"PATCH",
    body:JSON.stringify({title: `${noteElements[0].innerText}`, body: `${noteElements[1].innerText}`,user_id:2}),
    headers:{'Content-Type':'application/json'}
  }

  fetch(`${noteApiUrl}/${noteElements[4].dataset.noteId}`, configObj).then(fetchNotes)
}

//EVENT LISTENER FOR CLICKING UPDATE AND DELETE BUTTONS
noteList.addEventListener('click', function(event){

  if (event.target.className === "btn btn-primary"){
    displaySingleNote(event.target.parentElement)//updateNote(event.target.dataset.noteId)
  } else if (event.target.className === "btn btn-danger"){
    confirmDelete(event.target.dataset.noteId)
  } else if(event.target.className === "note-header" || event.target.className === "note-body"){
    displaySingleNote(event.target.parentElement)
  }
})

//EVENT LISTENER FOR CLICKING THE SUBMIT AND MAKING NEW NOTEOBJ AT TOP OF WINDOW
form.addEventListener('click', function(event){
  event.preventDefault()

  if (event.target.innerText === "NEW NOTE"){
    renderNewNoteForm();
  }
  // noteContent.value = "";
  // noteTitle.value = "";

})
//EVENT LISTENER FOR CLICKING UPDATE OR DELETE ON THE SINGLE NOTEDETAIL
singleNoteDetail.addEventListener('click', function(event){
  if (event.target.className === "btn btn-primary"){
    makeNoteEditable(event.target.parentElement)//updateNote(event.target.dataset.noteId)
    if(event.target.innerText === "Update") {
      updateNote(event.target.parentElement)//updateNote()
    }
  } else if (event.target.className === "btn btn-danger"){
    confirmDelete(event.target.dataset.noteId)
    singleNoteDetail.innerHTML = ""
  } else if(event.target.className === "note-header" || event.target.className === "note-body"){
    displaySingleNote(event.target.parentElement)
  }
})

//FUNCTION TO MAKE SINGLE NOTEDETAIL EDITABLE. IF THEY EDIT, SEND TO PATCH
function makeNoteEditable(note){
  let noteElements = Array.from(note.children)
  noteElements[0].contentEditable = "false"

  if (noteElements[1].contentEditable == "true") {
      noteElements[1].contentEditable = "false";
      noteElements[4].innerText = "Update"
  } else {
      noteElements[0].contentEditable = "true";
      noteElements[1].contentEditable = "true";
      noteElements[4].innerText = "Save"

  }
}

function displaySingleNote(note){
  let noteElements = Array.from(note.children)


  singleNoteDetail.innerHTML =  `<h1>${noteElements[0].innerText}</h1><p>${noteElements[1].innerText}</p><br><button type="button" class="btn btn-danger" data-note-id="${noteElements[2].dataset.noteId}">${noteElements[2].innerText}</button><button type="button" class="btn btn-primary" data-note-id="${noteElements[3].dataset.noteId}">${noteElements[3].innerText}</button>`
}

//RUN THE FUNCTION TO DISPLAY NOTES UPON LOADING PAGE

fetchNotes();
fetchUsers();
