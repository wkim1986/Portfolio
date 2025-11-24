// 모바일 네비게이션 토글
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// 네비게이션 링크 클릭 시 메뉴 닫기
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// 스크롤 시 헤더 스타일 변경
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// 프로젝트 데이터 불러오기 및 렌더링
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        if (!response.ok) {
            throw new Error('프로젝트 데이터를 불러오는데 실패했습니다.');
        }
        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-light);">프로젝트를 불러올 수 없습니다.</p>';
    }
}

// 프로젝트 카드 렌더링
function renderProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!projects || projects.length === 0) {
        projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-light);">표시할 프로젝트가 없습니다.</p>';
        return;
    }
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-image">
                ${project.image 
                    ? `<img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">`
                    : `<div class="project-placeholder"><span>프로젝트 이미지</span></div>`
                }
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.demoUrl ? `<a href="${project.demoUrl}" class="project-link" target="_blank" rel="noopener noreferrer">데모 보기</a>` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener noreferrer">${project.githubUrl.replace(/^https?:\/\//, '').replace(/^www\./, '')}</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // 프로젝트 카드에 애니메이션 적용
    applyProjectAnimations();
}

// 프로젝트 카드 애니메이션 적용
function applyProjectAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// 페이지 로드 시 프로젝트 불러오기
loadProjects();

// Contact 폼 제출 처리
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // 폼 검증
    if (!name || !email || !message) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('올바른 이메일 주소를 입력해주세요.');
        return;
    }
    
    // 이메일 내용 구성
    const subject = encodeURIComponent(`포트폴리오 문의: ${name}`);
    const body = encodeURIComponent(
        `보낸 사람: ${name}\n` +
        `이메일: ${email}\n\n` +
        `메시지:\n${message}`
    );
    
    // mailto 링크 생성 및 열기
    const mailtoLink = `mailto:wkim@bible.ac.kr?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    // 폼 리셋
    contactForm.reset();
});

// 부드러운 스크롤 (네비게이션 링크 클릭 시)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

