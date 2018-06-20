const userApiUrl = "http://localhost:3000/api/v1/users"
const noteApiUrl = "http://localhost:3000/api/v1/notes"

const noteList = document.getElementById("note-list")
const noteTitle = document.getElementById("note-title")
const noteContent = document.getElementById("note-content")
const submitBtn = document.getElementById("submit")
const form = document.getElementById("form")
const singleNoteDetail = document.getElementById("note-detail")



//------- FETCHES -----------------------------------------------------------------


// FETCH ALL USERS
function fetchUsers() {
  fetch(userApiUrl).then(response=>response.json()).then(allUsers=>displayUser(allUsers))
}


// FETCH ALL NOTES
function fetchNotes() {
  fetch(noteApiUrl).then(response=>response.json()).then(allNotes=>displayNotes(allNotes))
}


// FUNCTION TO POST A NEW NOTEOBJECT AND PERSIST TO DATABASE, (ADDS TO BOTTOM)
function makeNewNote(newNote){
  let noteElements = Array.from(newNote.children)

  let configObj = {
    method:"POST",
    body:JSON.stringify({title: `${noteElements[2].value}`, body: `${noteElements[4].value}`,user_id:2}),
    headers:{'Content-Type':'application/json'}
  }

  fetch(noteApiUrl, configObj).then(response=>response.json()).then(fetchNotes)

  noteElements[2].value = ""
  noteElements[4].value = ""
}


//FUNCTION TO DELETE NOTEOBJ FROM DATABASE AND REMOVE FROM OUR LIST
function deleteNote(id){
  let configObj = {
    method:"DELETE"
  }
  fetch(`${noteApiUrl}/${id}`, configObj).then(fetchNotes)
}


//FUNCTION TO UPDATE NOTEOBJ - CURRENTLY TAKING IN VALUE FROM THE NEW NOTEFIELD
function updateNote(note){

  let noteElements = Array.from(note.children)

  let configObj = {
    method:"PATCH",
    body:JSON.stringify({title: `${noteElements[2].value}`, body: `${noteElements[4].value}`,user_id:2}),
    headers:{'Content-Type':'application/json'}
  }

  fetch(`${noteApiUrl}/${noteElements[6].dataset.noteId}`, configObj).then(fetchNotes)


  singleNoteDetail.innerHTML = `<div class="panel-heading"><h1>${noteElements[2].value}</h1></div><div class="panel-body"><p>${noteElements[4].value}</p></div><br>`
}


//------------------------------------------------------------------------------


//-------DISPLAY----------------------------------------------------------------

// DISPLAY USERS IN CONSOLE TABLE
function displayUser(allUsers){
  allUsers.forEach(user=>console.table(user))
}

// DISPLAY NOTES AS A LIST ON PAGE
function displayNotes(allNotes){
  noteList.innerHTML = ""

  allNotes.forEach(note=>noteList.innerHTML +=
    `<a href="#" class="list-group-item list-group-item-action"><h3 class="note-header">${note.title}</h3><p class="note-body" id="body">${note.body}</p> <button type="button" class="btn btn-danger" data-note-id="${note.id}">Delete</button><button type="button" class="btn btn-primary" class="update" data-note-id="${note.id}">Update</button></a>`
  )
}

//DISPLAY TRUNCATED NOTECONTENT ON THE LEFT OF SCREEN *** This alters the text for the note object itself - not just display
function displayTruncatedNotes(){
  let arr = Array.from(noteList.children)
  arr.forEach(obj => {
    newArr = Array.from(obj.children)
    let noteText = newArr[1].innerText;
    if (noteText.length > 10){
      let newNoteText = noteText.substr(0,10) + "..."
      newArr[1].innerHTML = newNoteText
    }
  })
}

function renderNewNoteForm(){

  singleNoteDetail.innerHTML = ""

  singleNoteDetail.innerHTML += `<div class="panel-heading" id="new-note-form"><div class="form-group"><h1>NEW NOTE</h1></div>
    <label for="Title">NOTE TITLE</label>
    <textarea class="form-control" id="new-title" rows="1"></textarea>
    <label for="Content">NOTE CONTENT</label>
    <textarea class="form-control" id="new-body" rows="16"></textarea>
    <br>
    <button type="button" class="btn btn-success">SAVE NOTE</button><br>
  </div>`

  let newNoteTitle = document.getElementById("new-title")
  let newNoteBody = document.getElementById("new-body")
  const newNoteForm = document.getElementById("new-note-form")

  newNoteForm.addEventListener('click', function(event){

    if (event.target.innerText === "SAVE NOTE"){

      makeNewNote(event.target.parentElement)
    }
  })
}

function displaySingleNote(note){

  let noteElements = Array.from(note.children)


  singleNoteDetail.innerHTML =  `<div class="panel-heading"><h1>${noteElements[0].innerText}</h1></div><div class="panel-body"><p>${noteElements[1].innerText}</p></div><br><button type="button" class="btn btn-danger" data-note-id="${noteElements[2].dataset.noteId}">${noteElements[2].innerText}</button><button type="button" class="btn btn-primary" data-note-id="${noteElements[3].dataset.noteId}">${noteElements[3].innerText}</button><br></div>`
}

//------------------------------------------------------------------------------





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




//------------ EVENT LISTENERS -----------------------------------------------------------

//EVENT LISTENER FOR CLICKING UPDATE AND DELETE BUTTONS
noteList.addEventListener('click', function(event){

  if (event.target.className === "btn btn-primary"){
    makeNoteEditable(event.target.parentElement)
    //updateNote(event.target.dataset.noteId)
  } else if (event.target.className === "btn btn-danger"){
    confirmDelete(event.target.dataset.noteId)
  } else if(event.target.className === "note-header" || event.target.className === "note-body"){
    displaySingleNote(event.target.parentElement)
  }
})

//EVENT LISTENER FOR CLICKING THE SUBMIT AND MAKING NEW NOTEOBJ AT TOP OF WINDOW
form.addEventListener('click', function(event){
  event.preventDefault()

  if (event.target.className === "btn btn-success"){

    renderNewNoteForm();
  }
  // noteContent.value = "";
  // noteTitle.value = "";

})
//EVENT LISTENER FOR CLICKING UPDATE OR DELETE ON THE SINGLE NOTEDETAIL
singleNoteDetail.addEventListener('click', function(event){
  if (event.target.className === "btn btn-primary"){
    makeNoteEditable(event.target.parentElement)//updateNote(event.target.dataset.noteId)
    if(event.target.innerText === "Save") {
      updateNote(event.target.parentElement)//updateNote()
    }
  } else if (event.target.className === "btn btn-danger"){
    confirmDelete(event.target.dataset.noteId)
    singleNoteDetail.innerHTML = ""
  } else if(event.target.className === "note-header" || event.target.className === "note-body"){
    displaySingleNote(event.target.parentElement)
  }
})

//----------------------------------------------------------------------------------------




// //FUNCTION TO UPDATE NOTEDETAIL. IF THEY EDIT, SEND TO PATCH
function makeNoteEditable(note){

  let noteElements = Array.from(note.children)


  singleNoteDetail.innerHTML = `<div class="panel-heading"><div class="form-group"><h1>Update Note</h1></div>
    <label for="Title">NOTE TITLE</label>
    <textarea class="form-control" id="new-title" rows="1">${noteElements[0].innerText}</textarea>
    <label for="Content">NOTE CONTENT</label>
    <textarea class="form-control" id="new-body" rows="16">${noteElements[1].innerText}</textarea>
    <br>
    <button type="button" class="btn btn-success" id="update-btn" data-note-id="${noteElements[3].dataset.noteId}">SAVE NOTE</button>
  </div>`

  let updateBtn = document.getElementById("update-btn")

  updateBtn.addEventListener('click', function(event){

    if (event.target.innerText === "SAVE NOTE"){
      updateNote(event.target.parentElement)

    }
  })
}

// //FUNCTION TO MAKE SINGLE NOTEDETAIL EDITABLE (ONLY BY DOING CONTENT EDITABLE FUNCTION STRAIGHT IN DOM). IF THEY EDIT, SEND TO PATCH
// function makeNoteEditable(note){
//   let noteElements = Array.from(note.children)
//   noteElements[0].contentEditable = "false"
//
//   if (noteElements[1].contentEditable == "true") {
//       noteElements[1].contentEditable = "false";
//       noteElements[4].innerText = "Update"
//   } else {
//       noteElements[0].contentEditable = "true";
//       noteElements[1].contentEditable = "true";
//       noteElements[4].innerText = "Save"
//
//   }
// }



//RUN THE FUNCTION TO DISPLAY NOTES UPON LOADING PAGE

fetchNotes();
fetchUsers();
