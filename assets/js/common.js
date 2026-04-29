/**
 * UI/UX Learning Site - Common JavaScript
 * 좌측 메뉴 및 공통 기능 스크립트
 */

document.addEventListener('DOMContentLoaded', function() {
    // 현재 페이지 URL 확인
    const currentPage = window.location.pathname;
    const pageName = currentPage.split('/').pop() || 'index.html';
    
    // 메뉴 활성화 처리
    initActiveMenu(pageName);
    
    // 검색 기능 초기화
    initSearch();
    
    // 코드 복사 기능 초기화
    initCodeCopy();
    
    // 스크롤 효과
    initScrollEffect();
    
    // 서브메뉴 토글 초기화
    initSubmenu();
});

/**
 * 현재 페이지에 맞는 메뉴 활성화
 */
function initActiveMenu(pageName) {
    const menuLinks = document.querySelectorAll('.nav-menu a');
    
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === 'javascript:void(0);') return;

        // href에서 페이지 이름만 추출
        const linkPageName = href.split('/').pop().split('#')[0];
        const currentPageName = pageName.split('#')[0] || 'index.html';

        if (linkPageName === currentPageName) {
            link.classList.add('active');
            
            // 만약 서브메뉴(UI 컴포넌트)라면 부모(.has-submenu)도 활성화해서 펼쳐줌
            const parentLi = link.closest('.has-submenu');
            if (parentLi) {
                parentLi.classList.add('active');
            }
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * 서브메뉴 아코디언 토글
 */
function initSubmenu() {
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parentLi = this.parentElement;
            parentLi.classList.toggle('active');
        });
    });
}

/**
 * 검색 기능
 */
function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
            clearHighlight();
            return;
        }
        
        performSearch(searchTerm);
    });
    
    // 엔터키로 검색
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.toLowerCase().trim();
            if (searchTerm.length >= 2) {
                performSearch(searchTerm);
            }
        }
    });
}

/**
 * 검색 수행
 */
function performSearch(term) {
    // 기존 하이라이트 제거
    clearHighlight();
    
    // 검색어 하이라이트
    const content = document.querySelector('.main-content');
    if (!content) return;
    
    const walker = document.createTreeWalker(
        content,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        if (node.textContent.toLowerCase().includes(term)) {
            textNodes.push(node);
        }
    }
    
    textNodes.forEach(textNode => {
        highlightText(textNode, term);
    });
    
    // 검색 결과 개수 표시
    const highlightCount = document.querySelectorAll('.search-highlight').length;
    showSearchResultCount(highlightCount, term);
}

/**
 * 텍스트 하이라이트
 */
function highlightText(textNode, term) {
    const text = textNode.textContent;
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    const parts = text.split(regex);
    
    if (parts.length <= 1) return;
    
    const span = document.createElement('span');
    parts.forEach(part => {
        if (part.toLowerCase() === term.toLowerCase()) {
            const highlight = document.createElement('span');
            highlight.className = 'search-highlight';
            highlight.textContent = part;
            span.appendChild(highlight);
        } else {
            span.appendChild(document.createTextNode(part));
        }
    });
    
    textNode.parentNode.replaceChild(span, textNode);
}

/**
 * 정규식 이스케이프
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 하이라이트 제거
 */
function clearHighlight() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const text = document.createTextNode(highlight.textContent);
        highlight.parentNode.replaceChild(text, highlight);
    });
    
    // 검색 결과 메시지 제거
    const resultMsg = document.querySelector('.search-result-message');
    if (resultMsg) {
        resultMsg.remove();
    }
}

/**
 * 검색 결과 개수 표시
 */
function showSearchResultCount(count, term) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // 기존 메시지 제거
    const existingMsg = document.querySelector('.search-result-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'search-result-message';
    message.style.cssText = `
        padding: 12px 16px;
        background-color: #e8f4fd;
        border-radius: 8px;
        margin-bottom: 20px;
        color: #2c3e50;
        font-size: 14px;
    `;
    message.textContent = `"${term}" 검색 결과: ${count}개 발견`;
    
    mainContent.insertBefore(message, mainContent.firstChild);
}

/**
 * 코드 복사 기능
 */
function initCodeCopy() {
    const copyButtons = document.querySelectorAll('.code-copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block');
            const codeContent = codeBlock.querySelector('code');
            
            if (codeContent) {
                const text = codeContent.textContent;
                copyToClipboard(text, this);
            }
        });
    });
}

/**
 * 클립보드에 복사
 */
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '복사됨!';
        button.style.backgroundColor = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        console.error('복사 실패:', err);
        button.textContent = '복사 실패';
        button.style.backgroundColor = '#e74c3c';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    });
}

/**
 * 스크롤 효과
 */
function initScrollEffect() {
    const sections = document.querySelectorAll('.content-section');
    
    if (sections.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(section);
    });
}

/**
 * 부드러운 스크롤
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * 모바일 메뉴 토글 (반응형)
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (!menuToggle || !sidebar) return;
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
}

// 모바일 메뉴 초기화
initMobileMenu();

/**
 * 페이지 로드 애니메이션
 */
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

/**
 * 도움말 함수 (콘솔에서 사용)
 */
window.uiuxHelp = function() {
    console.log(`
╔══════════════════════════════════════════╗
║     UI/UX Learning Site - 도움말          ║
╠══════════════════════════════════════════╣
║  사용 가능한 함수:                        ║
║  - uiuxHelp()          : 이 도움말 표시   ║
║  - scrollToSection(id) : 섹션으로 스크롤  ║
╚══════════════════════════════════════════╝
    `);
};

/**
 * 섹션으로 스크롤
 */
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};