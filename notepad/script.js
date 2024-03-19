function generateUniqueCode() {
    return Math.random().toString(36).substring(2, 8);
}

function saveNote() {
    const noteTitle = document.getElementById('noteTitle').value;
    const noteContent = document.getElementById('noteContent').value;

    if (noteTitle.trim() !== '' || noteContent.trim() !== '') {
        const uniqueCode = generateUniqueCode();
        const note = {
            title: noteTitle,
            content: noteContent
        };

        localStorage.setItem(uniqueCode, JSON.stringify(note));
        copyToClipboard(uniqueCode);
        showNotification('ID copied', `"${uniqueCode}" has been copied to your clipboard!`);
    } else {
        showNotification('Nothing to save', 'There isn\'t anything to save yet, write something!');
    }
}

function loadNote() {
    const loadCodeInput = document.getElementById('loadCodeInput');
    const uniqueCode = loadCodeInput.value.trim();

    if (uniqueCode !== '') {
        const storedNote = localStorage.getItem(uniqueCode);

        if (storedNote) {
            const note = JSON.parse(storedNote);
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            updateWordCount(); // Update word count when loading note
            showNotification('Loaded', 'Your note was loaded!');
        } else {
            showNotification('ID not found', 'That note ID doesn\'t seem to exist!');
        }
    } else {
        showNotification('Invalid', 'That isn\'t a valid note ID! They are formatted like this: "abc1a1".');
    }
}

function deleteNote() {
    const loadCodeInput = document.getElementById('loadCodeInput');
    const uniqueCode = loadCodeInput.value.trim();

    if (uniqueCode !== '') {
        const storedNote = localStorage.getItem(uniqueCode);

        if (storedNote) {
            // Show confirmation modal
            const confirmationModal = document.getElementById('confirmationModal');
            confirmationModal.style.display = 'block';

            // Handle confirmation
            const confirmButton = document.getElementById('confirmDelete');
            confirmButton.onclick = function() {
                localStorage.removeItem(uniqueCode);
                document.getElementById('noteTitle').value = '';
                document.getElementById('noteContent').value = '';
                updateWordCount(); // Update word count to 0
                showNotification('Note Deleted', 'The note has been successfully deleted.');
                confirmationModal.style.display = 'none'; // Hide modal
            };

            const cancelButton = document.getElementById('cancelDelete');
            cancelButton.onclick = function() {
                confirmationModal.style.display = 'none'; // Hide modal
            };
        } else {
            showNotification('ID not found', 'That note ID doesn\'t seem to exist!');
        }
    } else {
        showNotification('Invalid', 'Please provide a valid note ID to delete.');
    }
}

function showNotification(title, message) {
    const notificationElement = document.getElementById('notification');

    // Set title and message
    notificationElement.innerHTML = `<div class="notification-title">${title}</div>${message}`;

    // Show notification
    notificationElement.classList.add('show-notification');

    // Hide notification after 5 seconds
    setTimeout(() => {
        notificationElement.classList.remove('show-notification');
    }, 5000);
}

function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

function updateWordCount() {
    const content = document.getElementById('noteContent').value;
    const wordCount = content.split(/\s+/).filter(word => word !== '').length;
    document.getElementById('wordCount').textContent = `Words: ${wordCount}`;
    document.title = `Notepad | Words: ${wordCount}`; // Update document title with word count
}
