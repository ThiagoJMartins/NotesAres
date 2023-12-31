const addBox = document.querySelector('.add-box'),
popupBox = document.querySelector('.popup-box'),
popupTitle = popupBox.querySelector('header p'),
closeIcon = popupBox.querySelector('header i'),
titleTag = popupBox.querySelector('input'),
descTag = popupBox.querySelector('textarea'),
addBtn = popupBox.querySelector('button');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// Getting localstorage notes if exist and parsing them to 
// js object else passing an empty array to notes
const notes = JSON.parse(localStorage.getItem('notes') || '[]');
let isUpdate = false, updateiD;

addBox.addEventListener('click', () => {
    titleTag.focus();
    popupBox.classList.add('show');
});

closeIcon.addEventListener('click', () => {
    isUpdate = false;
    titleTag.value = '';
    descTag.value = '';
    addBtn.innerText = 'Add note';
    popupTitle.innerText = 'Add a new note';
    popupBox.classList.remove('show');
});

function showNotes(){
    document.querySelectorAll('.note').forEach(note => note.remove());
    notes.forEach((note, index) => {
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${note.description}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML('afterend', liTag);
    });
}
showNotes();

function showMenu(elem){
    elem.parentElement.classList.add('show');
    document.addEventListener('click', e => {
        // Removing show class from the settings menu on document click
        if(e.target.tagName != 'I' || e.target != elem){
            elem.parentElement.classList.remove('show');
        }
    });
}

function deleteNote(noteId){
    let confirmDel = confirm('Are you sure you want to delete this note?');
    if(!confirmDel) return;
    notes.splice(noteId, 1); // Removing selected note from array/tasks
    // Saving updated notes to localstorage
    localStorage.setItem('notes', JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, desc){
    isUpdate = true;
    updateiD = noteId
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = 'Update note';
    popupTitle.innerText = 'Edit a note';
}

addBtn.addEventListener('click', e => {
    e.preventDefault();
    let noteTitle = titleTag.value,
    noteDesc = descTag.value;

    if(noteTitle || noteDesc){
        // Getting month, day, year from the current date
        let dateObj = new Date(),
        month = months[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();

        let noteInfo = {
            title: noteTitle, description: noteDesc,
            date: `${month} ${day}, ${year}`
        }
        if (!isUpdate){
            notes.push(noteInfo); // Adding new note to notes
        }else{
            isUpdate = false;
            notes[updateiD] = noteInfo; // Updating specified note
        }

        // Saving notes to localstorage
        localStorage.setItem('notes', JSON.stringify(notes));
        closeIcon.click();
        showNotes();
    }

})
