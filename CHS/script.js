document.addEventListener("DOMContentLoaded", function() {
    const homeLink = document.getElementById('home-link');
    const aboutLink = document.getElementById('about-link');
    const galleryLink = document.getElementById('gallery-link');
    const newsLink = document.getElementById('news-link');
    const contentDiv = document.getElementById('content');

    let currentPage = 1;
    const postsPerPage = 6; 

    function loadHomeContent() {
        contentDiv.innerHTML = `
            <div class="carousel">
                <button class="carousel-arrow left" onclick="moveCarousel(-1)">&#9664;</button>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="websitepics/car1.png" alt="Image 1">
                    </div>
                    <div class="carousel-item">
                        <img src="websitepics/car2.png" alt="Image 2">
                    </div>
                    <div class="carousel-item">
                        <img src="websitepics/car3.png" alt="Image 3">
                    </div>
                </div>
                <button class="carousel-arrow right" onclick="moveCarousel(1)">&#9654;</button>
            </div>
            <div class="carousel-buttons">
                <span class="carousel-button active" onclick="moveCarouselTo(0)"></span>
                <span class="carousel-button" onclick="moveCarouselTo(1)"></span>
                <span class="carousel-button" onclick="moveCarouselTo(2)"></span>
            </div>
            <section>
                <h2>Welcome to Calangitan High School</h2>
                <p>
                    The Calangitan High School is a Junior and Senior High School with approximately 500 students located within the far-flung area of the Capas East District. In line with the DepEd Core Values and school vision, we are committed to meeting the educational needs of our learning community.
                </p>
                <p>
                    Our facilities are designed to provide a conducive environment for learning, ensuring that our students have access to the resources they need to succeed. Our new building is a testament to our commitment to providing the best possible education for our students.
                </p>
                <h3>Our Mission</h3>
                <p>
                    We inspire, empower, and support everyone, every day, in every way that we can. This can be seen through our adherence to the policies and guidelines of IATF and the Department of Education.
                </p>
                <h3>Our Approach</h3>
                <ul>
                    <li>Professional Learning Communities</li>
                    <li>Collaborative Lesson Planning</li>
                    <li>Data-driven Instruction</li>
                    <li>Student-focused Intervention Programs</li>
                </ul>
                <p>
                    Our teachers collaborate to plan lessons such as DLLs, Weekly Home Learning Plans, and in line with MELCs and the Learning Continuity Plan. We continuously review data to identify the needs of our students and utilize best instructional practices.
                </p>
                <p>
                    The school has implemented possible intervention, learning modalities/enrichment periods at each grade level. This intervention/enrichment program allows all students to receive the data-driven assistance they need, especially during these extraordinary times of the pandemic.
                </p>
                <blockquote>
                    "Our commitment is to inspire, empower, and support every student, every day, in every way possible."
                </blockquote>
            </section>
        `;
        updateCarousel(); 
    }

    homeLink.addEventListener('click', function(event) {
        event.preventDefault();
        loadHomeContent();
        setActiveLink(homeLink);
    });

    aboutLink.addEventListener('click', function(event) {
        setActiveLink(aboutLink);
        event.preventDefault();
        contentDiv.innerHTML = `
        <center><img src="websitepics/organizational.png" alt="CHS ORGANIZATIONAL CHART" style="max-width: 100%; height: auto;"></center>
`;
    });

    galleryLink.addEventListener('click', function(event) {
        event.preventDefault();
        loadGalleryContent();
        setActiveLink(galleryLink);
    });

    newsLink.addEventListener('click', function(event) {
        event.preventDefault();
        currentPage = 1;
        loadNewsContent();
        setActiveLink(newsLink);
    });

    function setActiveLink(activeLink) {
        const links = document.querySelectorAll('nav ul li a');
        links.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    let currentIndex = 0;

    window.moveCarousel = function(direction) {
        const items = document.querySelectorAll('.carousel-item');
        const totalItems = items.length;
        currentIndex = (currentIndex + direction + totalItems) % totalItems;
        updateCarousel();
    }

    window.moveCarouselTo = function(index) {
        currentIndex = index;
        updateCarousel();
    }

    function updateCarousel() {
        const innerCarousel = document.querySelector('.carousel-inner');
        const buttons = document.querySelectorAll('.carousel-button');
        innerCarousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        buttons.forEach((button, index) => {
            button.classList.toggle('active', index === currentIndex);
        });
    }

    function loadGalleryContent() {
        const galleryImages = [];
        for (let i = 1; i <= 20; i++) {
            galleryImages.push(`<div class="gallery-item"><img src="gallerypics/${i}.png" alt="Gallery Image ${i}"></div>`);
        }
        contentDiv.innerHTML = `<div id="gallery">${galleryImages.join('')}</div>`;
    }

    function loadNewsContent() {
        fetch('login/admin/fetch_posts.php')
            .then(response => response.json())
            .then(data => {
                renderNewsPosts(data);
            })
            .catch(error => console.error('Error fetching news posts:', error));
    }

    function renderNewsPosts(data) {
        const totalPages = Math.ceil(data.length / postsPerPage);
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const newsContent = data.slice(start, end).map(post => {
            const postDate = post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Date not available';
            const imagePath = post.image ? post.image.replace('../../', '') : '';
            return `
                <div class="news-post" onclick="openNewsModal('${post.title}', '${imagePath}', \`${post.description.replace(/'/g, "\\'")}\`, '${postDate}')">
                    <h2 class="news-title">${post.title}</h2>
                    <p class="news-description">${post.description.slice(0, 100)}...</p>
                    <p class="read-more">Read more</p>
                    <p class="news-date">${postDate}</p>
                </div>`;
        }).join('');
        contentDiv.innerHTML = `<div class="news-container">${newsContent}</div>${renderPagination(totalPages)}`;
    }

    function renderPagination(totalPages) {
        let paginationHTML = '<div class="pagination">';
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button ${i === currentPage ? 'class="active"' : ''} onclick="changePage(${i})">${i}</button>`;
        }
        paginationHTML += '</div>';
        return paginationHTML;
    }

    window.changePage = function(page) {
        currentPage = page;
        loadNewsContent();
    }

    window.openNewsModal = function(title, image, description, date) {
        const modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <span class="close-modal" onclick="closeNewsModal()">&times;</span>
                </div>
                <div class="modal-date">${date}</div>
                ${image ? `<img src="${image}" alt="${title}" class="modal-image">` : ''}
                <div class="modal-body">
                    <p>${description}</p>
                </div>
            </div>
        `;
        const modalDiv = document.createElement('div');
        modalDiv.classList.add('modal');
        modalDiv.innerHTML = modalContent;
        document.body.appendChild(modalDiv);
        modalDiv.style.display = 'flex';
    }

    window.closeNewsModal = function() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }

    loadHomeContent();
});
