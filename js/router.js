let pageUrls = {
    about: '/index.html?about',
    contact: '/index.html?contact',
    home: '/index.html?home',
    gallery: '/index.html?gallery'
};


const galleryImages = [
    { id: 1, url: 'https://picsum.photos/id/10/800/800', title: 'Nature 1' },
    { id: 2, url: 'https://picsum.photos/id/11/800/800', title: 'Nature 2' },
    { id: 3, url: 'https://picsum.photos/id/12/800/800', title: 'Nature 3' },
    { id: 4, url: 'https://picsum.photos/id/13/800/800', title: 'Nature 4' },
    { id: 5, url: 'https://picsum.photos/id/14/800/800', title: 'Nature 5' },
    { id: 6, url: 'https://picsum.photos/id/15/800/800', title: 'Nature 6' },
    { id: 7, url: 'https://picsum.photos/id/16/800/800', title: 'Nature 7' },
    { id: 8, url: 'https://picsum.photos/id/17/800/800', title: 'Nature 8' },
    { id: 9, url: 'https://picsum.photos/id/18/800/800', title: 'Nature 9' },
    { id: 10, url: 'https://picsum.photos/id/16/800/800', title: 'Nature 7' },
    { id: 11, url: 'https://picsum.photos/id/17/800/800', title: 'Nature 8' },
    { id: 12, url: 'https://picsum.photos/id/18/800/800', title: 'Nature 9' },
    { id: 13, url: 'https://picsum.photos/id/16/800/800', title: 'Nature 7' },
    { id: 14, url: 'https://picsum.photos/id/17/800/800', title: 'Nature 8' },
    { id: 15, url: 'https://picsum.photos/id/18/800/800', title: 'Nature 9' },
    { id: 16, url: 'https://picsum.photos/id/16/800/800', title: 'Nature 7' },
    { id: 17, url: 'https://picsum.photos/id/17/800/800', title: 'Nature 8' },
    { id: 18, url: 'https://picsum.photos/id/18/800/800', title: 'Nature 9' }
];

function OnStartUp() {
    popStateHandler();
    setupDarkMode();
    
}
OnStartUp();

document.querySelector('#main-link').addEventListener('click', (event) => {
    let stateObj = { page: 'home' };
    document.title = 'Home';
    history.pushState(stateObj, "home", "?home");
    RenderMainPage();
});

document.querySelector('#about-link').addEventListener('click', (event) => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', (event) => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

document.querySelector('#gallery-link').addEventListener('click', (event) => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

function RenderMainPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Hello World!</h1>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `
    <h1 class="title">About Me</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Contact with me</h1>
        <form id="contact-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
        <div class="g-recaptcha" id="recaptcha-re" data-sitekey="6Le0EA4rAAAAAB5SKh9-wSBSPdAd0c514PfgAdm3"></div>
        <button type="submit">Send</button>
        </form>`;

    if(document.getElementById('recaptcha-re')) {
        grecaptcha.render('recaptcha-re', {
            'sitekey': '6Le0EA4rAAAAAB5SKh9-wSBSPdAd0c514PfgAdm3',
        });
        
    } 

    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Form submitted!');
    });
}

function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Photo Gallery</h1>
        <div class="gallery" id="gallery-container"></div>
        <div id="image-modal" class="modal">
                <span class="close">&times;</span>
                <img class="modal-content" id="modal-image">
        </div>`;
    setupModal();
    
    const galleryContainer = document.getElementById('gallery-container');
    
    galleryImages.forEach(image => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img class="gallery-img lazy" 
                 data-src="${image.url}" 
                 data-id="${image.id}"
                 loading="lazy">
        `;
        galleryContainer.appendChild(item);
    });

    
    initLazyLoading();
}

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
                
                // Pobierz obraz jako BLOB
                fetch(img.dataset.src)
                    .then(response => response.blob())
                    .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        img.src = blobUrl;
                    });
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

function setupModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.close');

    // Otwieranie modala po kliknięciu na zdjęcie
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-img')) {
            modal.classList.add('modalflex');
            modalImg.src = e.target.src;
        }
    });

    // Zamykanie modala
    closeBtn.onclick = function() {
        modal.classList.remove('modalflex');
    };

    // Zamykanie po kliknięciu poza obrazem
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.classList.remove('modalflex');
        }
    };
}

function setupDarkMode() {
    document.getElementById('toggle-button').addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkMode', isDark);
    });

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.body.classList.add('dark-theme');
    }
}


function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];
        if (loc === pageUrls.contact){ RenderContactPage(); }
        if(loc === pageUrls.about){ RenderAboutPage(); }
        if(loc === pageUrls.main){ RenderMainPage(); }
        if(loc === pageUrls.gallery){ RenderGalleryPage(); }
}
window.onpopstate = popStateHandler;