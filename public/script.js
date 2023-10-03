const form = document.querySelector('form');
const imagePreviews = document.getElementById('image-previews');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form input values
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const tags = document.getElementById('tags').value;
    const images = document.getElementById('images').files;

    // Validate that required fields are not empty
    if (!title || !description || !price || !tags || images.length === 0) {
        errorMessage.textContent = 'Please fill in all required fields and select at least one image.';
        return;
    }

    // Clear any previous error messages
    errorMessage.textContent = '';

    // Create a FormData object to send form data
    const formData = new FormData(form);

    try {
        // Send a POST request to the server
        const response = await fetch('/api/items/create', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            // Successful response (e.g., HTTP status 200)
            alert('Item created successfully!');
            // You can redirect to another page or update the UI as needed
        } else {
            // Handle server-side errors (e.g., HTTP status 500)
            errorMessage.textContent = 'Item creation failed. Please try again later.';
        }
    } catch (error) {
        // Handle network errors (e.g., failed to reach the server)
        console.error('Network error:', error);
        errorMessage.textContent = 'A network error occurred. Please try again later.';
    }
});

// Display image previews when files are selected
document.getElementById('images').addEventListener('change', (e) => {
    imagePreviews.innerHTML = '';
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
        const image = document.createElement('img');
        image.src = URL.createObjectURL(files[i]);
        image.classList.add('preview-image');
        imagePreviews.appendChild(image);
    }
});




