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


    fetchColleges();
});

let allColleges = [];
let filteredColleges = [];
let displayedCount = 0;
const increment = 10;

function fetchColleges() {
    console.log('Fetching colleges');
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    fetch('http://localhost:3800/colleges')
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched colleges:', data);
            loadingSpinner.style.display = 'none';
            allColleges = removeDuplicates(data);
            filteredColleges = [...allColleges];
            displayColleges();
        })
        .catch(error => {
            loadingSpinner.style.display = 'none';
            console.error('Error fetching colleges:', error);
        });
}
function removeDuplicates(colleges) {
    const uniqueColleges = [];
    const seen = new Set();
    colleges.forEach(college => {
        if (!seen.has(college['College Name'])) {
            seen.add(college['College Name']);
            uniqueColleges.push(college);
        }
    });
    return uniqueColleges;
}

function displayColleges() {
    console.log('Displaying colleges:', filteredColleges);
    const collegeList = document.getElementById('collegeList');
    const loadMoreButton = document.getElementById('loadMoreButton');

    if (displayedCount === 0) {
        collegeList.innerHTML = '';
    }

    const collegesToDisplay = filteredColleges.slice(displayedCount, displayedCount + increment);
    collegesToDisplay.forEach(college => {
        const collegeCard = document.createElement('div');
        collegeCard.classList.add('college-card', 'hidden');

        collegeCard.dataset.location = college['City'] || '';
        collegeCard.dataset.rating = college['Rating'] || '';
        collegeCard.dataset.type = college['College Type'] || '';
        collegeCard.dataset.fee = college['Average Fees'] || '0';

        collegeCard.innerHTML = `
            <h3>${college['College Name']}</h3>
            <button class="details-btn">Details</button>
            <div class="details" style="display: none;">
                <p><strong>Campus Size:</strong> ${college['Campus Size']}</p>
                <p><strong>Total Student Enrollments:</strong> ${college['Total Student Enrollments']}</p>
                <p><strong>Total Faculty:</strong> ${college['Total Faculty']}</p>
                <p><strong>Established Year:</strong> ${college['Established Year']}</p>
                <p><strong>Rating:</strong> ${college['Rating']}</p>
                <p><strong>University:</strong> ${college['University']}</p>
<select id="stateFilter" class="select-courses">
    <option value="">Courses Offered</option>
    <optgroup label="Undergraduate Courses">
        <option value="B.Tech Computer Science Engineering">B.Tech Computer Science Engineering</option>
        <option value="B.Tech Electrical and Electronics Engineering">B.Tech Electrical and Electronics Engineering</option>
        <option value="B.Tech Electronics and Communication Engineering">B.Tech Electronics and Communication Engineering</option>
        <option value="B.Tech Mechanical Engineering">B.Tech Mechanical Engineering</option>
        <option value="B.Tech Chemical Engineering">B.Tech Chemical Engineering</option>
        <option value="B.Tech Civil Engineering">B.Tech Civil Engineering</option>
        <option value="B.Tech Metallurgical and Materials Engineering">B.Tech Metallurgical and Materials Engineering</option>
        <option value="B.Arch">B.Arch</option>
        <option value="B.Tech Mining Engineering">B.Tech Mining Engineering</option>
    </optgroup>
    <optgroup label="Postgraduate Courses">
        <option value="M.Sc Chemistry">M.Sc Chemistry</option>
        <option value="M.Sc Mathematics">M.Sc Mathematics</option>
        <option value="M.Sc Physics">M.Sc Physics</option>
        <option value="M.Tech CAD CAM">M.Tech CAD CAM</option>
        <option value="M.Tech Chemical Engineering">M.Tech Chemical Engineering</option>
        <option value="M.Tech Communication System Engineering">M.Tech Communication System Engineering</option>
        <option value="M.Tech Computer Science Engineering">M.Tech Computer Science Engineering</option>
        <option value="M.Tech Construction Technology and Management">M.Tech Construction Technology and Management</option>
        <option value="M.Tech Environmental Engineering">M.Tech Environmental Engineering</option>
        <option value="M.Tech Excavation Engineering">M.Tech Excavation Engineering</option>
        <option value="M.Tech Geotechnical Engineering">M.Tech Geotechnical Engineering</option>
        <option value="M.Tech Heat Power Engineering">M.Tech Heat Power Engineering</option>
        <option value="M.Tech Industrial Engineering">M.Tech Industrial Engineering</option>
        <option value="M.Tech Integrated Power System">M.Tech Integrated Power System</option>
        <option value="M.Tech Materials Engineering">M.Tech Materials Engineering</option>
        <option value="M.Tech Power Electronics and Drives">M.Tech Power Electronics and Drives</option>
        <option value="M.Tech Structural Dynamics and Earthquake Engineering">M.Tech Structural Dynamics and Earthquake Engineering</option>
        <option value="M.Tech Structural Engineering">M.Tech Structural Engineering</option>
        <option value="M.Tech Transportation Engineering">M.Tech Transportation Engineering</option>
        <option value="M.Tech Urban Planning">M.Tech Urban Planning</option>
        <option value="M.Tech VLSI Design">M.Tech VLSI Design</option>
        <option value="M.Tech Water Resource Engineering">M.Tech Water Resource Engineering</option>
    </optgroup>
    <optgroup label="Doctoral Courses">
        <option value="Ph.D Applied Mechanics">Ph.D Applied Mechanics</option>
        <option value="Ph.D Architecture and Planning">Ph.D Architecture and Planning</option>
        <option value="Ph.D Chemical Engineering">Ph.D Chemical Engineering</option>
        <option value="Ph.D Chemistry">Ph.D Chemistry</option>
        <option value="Ph.D Civil Engineering">Ph.D Civil Engineering</option>
        <option value="Ph.D Computer Science and Engineering">Ph.D Computer Science and Engineering</option>
        <option value="Ph.D Electrical and Electronics Engineering">Ph.D Electrical and Electronics Engineering</option>
        <option value="Ph.D Electronics and Communication Engineering">Ph.D Electronics and Communication Engineering</option>
        <option value="Ph.D Humanities and Social Sciences">Ph.D Humanities and Social Sciences</option>
        <option value="Ph.D Materials Engineering">Ph.D Materials Engineering</option>
        <option value="Ph.D Mathematics">Ph.D Mathematics</option>
        <option value="Ph.D Mechanical Engineering">Ph.D Mechanical Engineering</option>
        <option value="Ph.D Metallurgy and Materials Engineering">Ph.D Metallurgy and Materials Engineering</option>
        <option value="Ph.D Mining Engineering">Ph.D Mining Engineering</option>
        <option value="Ph.D Physics">Ph.D Physics</option>
    </optgroup>
</select>
<select id="stateFilter" class="select-Facilities">
    <option value="">Facilities</option>
    <optgroup label="Facilities">
        <option value="Boys Hostel">Boys Hostel</option>
        <option value="Girls Hostel">Girls Hostel</option>
        <option value="Gym">Gym</option>
        <option value="Library">Library</option>
        <option value="Sports">Sports</option>
        <option value="Cafeteria">Cafeteria</option>
        <option value="Auditorium">Auditorium</option>
        <option value="Medical/Hospital">Medical/Hospital</option>
        <option value="Wifi">Wifi</option>
        <option value="IT Infrastructure">IT Infrastructure</option>
        <option value="Laboratories">Laboratories</option>
        <option value="Alumni Associations">Alumni Associations</option>
        <option value="Guest Room">Guest Room</option>
    </optgroup>
</select>

                <p><strong>City:</strong> ${college['City']}</p>
                <p><strong>State:</strong> ${college['State']}</p>
                <p><strong>Country:</strong> ${college['Country']}</p>
                <p><strong>College Type:</strong> ${college['College Type']}</p>
                <p><strong>Average Fees:</strong> ${college['Average Fees']}</p>
                <div class="circular">
                    <div class="inner"></div>
                    <div class="outer"></div>
                    <div class="numb">
                       0%
                    </div>
                    <div class="circle">
                        <div class="dot">
                            <span></span>
                        </div>
                        <div class="bar left">
                            <div class="progress"></div>
                        </div>
                        <div class="bar right">
                            <div class="progress"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const numb = document.querySelector(".numb");
        let counter = 0;
        setInterval(()=>{
          if(counter == 100){
            clearInterval();
          }else{
            counter+=1;
            numb.textContent = counter + "%";
          }
        }, 80);
        collegeList.appendChild(collegeCard);

        const detailsButton = collegeCard.querySelector('.details-btn');
        const detailsDiv = collegeCard.querySelector('.details');
        detailsButton.addEventListener('click', () => {
            const isVisible = detailsDiv.style.display === 'block';
            detailsDiv.style.display = isVisible ? 'none' : 'block';
        });

        observer.observe(collegeCard);
    });

    displayedCount += increment;

    if (displayedCount >= filteredColleges.length) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
}
document.getElementById('feeRange').addEventListener('input', (event) => {
    const feeValue = document.getElementById('feeValue');
    feeValue.textContent = `0 - ₹${event.target.value}`;
});
function filterColleges() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const stateFilter = document.getElementById('stateFilter').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value.toLowerCase();
    const feeRange = document.getElementById('feeRange').value;
    const ratingFilter = document.getElementById('ratingFilter').value;

    filteredColleges = allColleges.filter(college => {
        const collegeName = (college['College Name'] || '').toLowerCase();
        const collegeState = (college['State'] || '').toLowerCase();
        const collegeType = (college['College Type'] || '').toLowerCase();
        const collegeFee = college['Average Fees'] || '0';
        const collegeRating = parseFloat(college['Rating'] || '0');

        const matchesSearch = collegeName.includes(searchInput);
        const matchesState = !stateFilter || collegeState.includes(stateFilter);
        const matchesType = !typeFilter || collegeType.includes(typeFilter);
        const matchesFee = parseInt(collegeFee) <= parseInt(feeRange);
        const matchesRating = !ratingFilter || (collegeRating >= parseFloat(ratingFilter) && collegeRating < (parseFloat(ratingFilter) + 1));

        return matchesSearch && matchesState && matchesType && matchesFee && matchesRating;
    });

    displayedCount = 0;
    displayColleges();
}

document.getElementById('searchInput').addEventListener('input', filterColleges);
document.getElementById('stateFilter').addEventListener('change', filterColleges);
document.getElementById('typeFilter').addEventListener('change', filterColleges);
document.getElementById('feeRange').addEventListener('input', filterColleges);
document.getElementById('ratingFilter').addEventListener('change', filterColleges);

document.getElementById('loadMoreButton').addEventListener('click', () => {
    displayColleges();
});
