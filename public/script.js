function toggleMenu() {
    var nav = document.querySelector('header nav');
    nav.classList.toggle('open');
}

function toggleFilters() {
    const fi = document.querySelector('.fi');
    fi.classList.toggle('open');
}

function startSearch() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        window.location.href = 'filter.html';
    } else {
        alert('You need to sign in first.');
        window.location.href = 'signin.html';
    }
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
};

let observer;

document.addEventListener('DOMContentLoaded', () => {
    observer = new IntersectionObserver(observerCallback, observerOptions);
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(element => observer.observe(element));

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('details-btn')) {
            const details = e.target.nextElementSibling;
            if (details) {
                details.style.display = details.style.display === 'none' ? 'block' : 'none';
            }
        }
    });

    const searchInput = document.getElementById('searchInput');
    const stateFilter = document.getElementById('stateFilter');
    const typeFilter = document.getElementById('typeFilter');
    const feeRange = document.getElementById('feeRange');
    const ratingFilter = document.getElementById('ratingFilter');
    const loadMoreButton = document.getElementById('loadMoreButton');
    const feeValue = document.getElementById('feeValue');

    if (feeRange && feeValue) {
        feeRange.addEventListener('input', (event) => {
            feeValue.textContent = `0 - ₹${event.target.value}`;
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterColleges);
    if (stateFilter) stateFilter.addEventListener('change', filterColleges);
    if (typeFilter) typeFilter.addEventListener('change', filterColleges);
    if (feeRange) feeRange.addEventListener('input', filterColleges);
    if (ratingFilter) ratingFilter.addEventListener('change', filterColleges);
    if (loadMoreButton) loadMoreButton.addEventListener('click', displayColleges);

    if (window.location.pathname.includes('filter.html')) {
        fetchColleges();
    }
});

let allColleges = [];
let filteredColleges = [];
let displayedCount = 0;
const increment = 12;

async function fetchColleges() {
    try {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) loadingSpinner.style.display = 'block';

        const response = await fetch('http://localhost:3800/colleges', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (!Array.isArray(data)) throw new Error('Invalid data format received from server');
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        const uniqueColleges = Array.from(new Map(data.map(c => [c['College Name'], c])).values());

        allColleges = uniqueColleges;
        filteredColleges = uniqueColleges;
        displayedCount = 0;
        displayColleges();
    } catch (error) {
        console.error('Error fetching colleges:', error);
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        const collegeList = document.getElementById('collegeList');
        if (collegeList) {
            collegeList.innerHTML = `<div class="error-message">Error loading colleges. Please try again later.</div>`;
        }
    }
}

function displayColleges() {
    const collegeList = document.getElementById('collegeList');
    const loadMoreButton = document.getElementById('loadMoreButton');

    if (!collegeList) return;

    const collegesToDisplay = filteredColleges.slice(displayedCount, displayedCount + increment);

    collegesToDisplay.forEach(college => {
        const collegeCard = document.createElement('div');
        collegeCard.classList.add('college-card', 'hidden');

        const ratingValue = parseFloat(college['Rating']) || 0;
        const formattedFees = parseInt(college['Average Fees'] || 0).toLocaleString('en-IN');

        collegeCard.innerHTML = `
            <div class="college-header">
                <h3>${college['College Name']}</h3>
                <div class="rating-circle">
                    <div class="rating-value">${ratingValue.toFixed(1)}</div>
                </div>
            </div>
            <div class="college-info">
                <p><strong>Location:</strong> ${college['City']}, ${college['State']}</p>
                <p><strong>Type:</strong> ${college['College Type']}</p>
                <p><strong>Average Fees:</strong> ₹${formattedFees}</p>
            </div>
            <button class="details-btn">View Details</button>
            <div class="details" style="display: none;">
                <p><strong>Campus Size:</strong> ${college['Campus Size']}</p>
                <p><strong>Total Students:</strong> ${college['Total Student Enrollments']}</p>
                <p><strong>Total Faculty:</strong> ${college['Total Faculty']}</p>
                <p><strong>Established:</strong> ${college['Established Year']}</p>
                <p><strong>University:</strong> ${college['University']}</p>
                <div class="courses-section">
                    <h4>Courses Offered</h4>
                    <ul>
                        ${Array.isArray(college['Courses']) 
                            ? college['Courses'].join(', ').split(',').map(c => `<li>${c.trim()}</li>`).join('')
                            : '<li>No courses listed</li>'}
                    </ul>
                </div>
                <div class="facilities-section">
                    <h4>Facilities</h4>
                    <ul>
                        ${Array.isArray(college['Facilities']) 
                            ? college['Facilities'].join(', ').split(',').map(f => `<li>${f.trim()}</li>`).join('')
                            : '<li>No facilities listed</li>'}
                    </ul>
                </div>
            </div>
        `;

        collegeList.appendChild(collegeCard);
        setTimeout(() => collegeCard.classList.add('show'), 50);

        const detailsBtn = collegeCard.querySelector('.details-btn');
        const detailsDiv = collegeCard.querySelector('.details');

        detailsBtn.addEventListener('click', () => {
            const isHidden = detailsDiv.style.display === 'none';
            detailsDiv.style.display = isHidden ? 'block' : 'none';
            detailsBtn.textContent = isHidden ? 'Hide Details' : 'View Details';
            detailsDiv.style.opacity = isHidden ? '1' : '0';

            if (!isHidden) {
                setTimeout(() => {
                    detailsDiv.style.display = 'none';
                }, 200);
            }
        });
    });

    displayedCount += collegesToDisplay.length;

    if (loadMoreButton) {
        loadMoreButton.style.display = displayedCount < filteredColleges.length ? 'block' : 'none';
    }
}

function filterColleges() {
    const searchInput = document.getElementById('searchInput');
    const stateFilter = document.getElementById('stateFilter');
    const typeFilter = document.getElementById('typeFilter');
    const feeRange = document.getElementById('feeRange');
    const ratingFilter = document.getElementById('ratingFilter');

    const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
    const stateValue = stateFilter ? stateFilter.value.toLowerCase() : '';
    const typeValue = typeFilter ? typeFilter.value.toLowerCase() : '';
    const feeValue = feeRange ? feeRange.value : '1000000';
    const ratingValue = ratingFilter ? ratingFilter.value : '';

    filteredColleges = allColleges.filter(college => {
        const collegeName = (college['College Name'] || '').toLowerCase();
        const collegeState = (college['State'] || '').toLowerCase();
        const collegeType = (college['College Type'] || '').toLowerCase();
        const collegeFee = parseInt(college['Average Fees'] || '0');
        const collegeRating = parseFloat(college['Rating'] || '0');

        const matchesSearch = collegeName.includes(searchValue);
        const matchesState = !stateValue || collegeState.includes(stateValue);
        const matchesType = !typeValue || collegeType.includes(typeValue);
        const matchesFee = collegeFee <= parseInt(feeValue);
        const matchesRating = !ratingValue || (collegeRating >= parseFloat(ratingValue) && collegeRating < (parseFloat(ratingValue) + 1));

        return matchesSearch && matchesState && matchesType && matchesFee && matchesRating;
    });

    const collegeList = document.getElementById('collegeList');
    if (collegeList) collegeList.innerHTML = ''; // Clear old list
    displayedCount = 0;
    displayColleges();
}
