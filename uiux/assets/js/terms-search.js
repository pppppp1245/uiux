/**
 * UI/UX Terms Search - 용어 검색 기능
 */

document.addEventListener('DOMContentLoaded', function() {
    initTermsSearch();
});

/**
 * 용어 검색 기능 초기화
 */
function initTermsSearch() {
    const searchInput = document.querySelector('.search-box input[data-search-target="term-name"]');
    
    if (!searchInput) return;
    
    // 검색 입력 이벤트
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        performTermsSearch(searchTerm);
    });
    
    // 엔터키로 검색
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.toLowerCase().trim();
            performTermsSearch(searchTerm);
        }
    });
}

/**
 * 용어 검색 수행
 */
function performTermsSearch(term) {
    const termCards = document.querySelectorAll('.term-card');
    const termSections = document.querySelectorAll('.term-section');
    const resultMessage = document.querySelector('.search-result-message');
    const noResults = document.querySelector('.no-results');
    
    let matchCount = 0;
    
    if (term.length < 1) {
        // 검색어가 없으면 모든 항목 표시
        termCards.forEach(card => {
            card.style.display = 'block';
        });
        termSections.forEach(section => {
            section.style.display = 'block';
        });
        if (resultMessage) resultMessage.style.display = 'none';
        if (noResults) noResults.style.display = 'none';
        return;
    }
    
    termCards.forEach(card => {
        const termName = card.getAttribute('data-term-name') || '';
        const termDefinition = card.querySelector('.term-definition')?.textContent || '';
        const termExample = card.querySelector('.term-example')?.textContent || '';
        
        // 검색어와 매칭
        const searchText = (termName + ' ' + termDefinition + ' ' + termExample).toLowerCase();
        
        if (searchText.includes(term)) {
            card.style.display = 'block';
            matchCount++;
            
            // 검색어 하이라이트
            highlightTermSearch(card, term);
        } else {
            card.style.display = 'none';
            removeHighlight(card);
        }
    });
    
    // 섹션 표시/숨김 처리 (빈 섹션 숨기기)
    termSections.forEach(section => {
        const visibleCards = section.querySelectorAll('.term-card[style="display: block"], .term-card:not([style*="display"])');
        const hasVisibleCards = Array.from(section.querySelectorAll('.term-card')).some(
            card => card.style.display !== 'none'
        );
        section.style.display = hasVisibleCards ? 'block' : 'none';
    });
    
    // 결과 메시지 표시
    if (resultMessage) {
        if (term.length > 0) {
            resultMessage.style.display = 'block';
            resultMessage.querySelector('.result-count').textContent = 
                `"${term}" 검색 결과: ${matchCount}개`;
        } else {
            resultMessage.style.display = 'none';
        }
    }
    
    // 검색 결과 없음 메시지
    if (noResults) {
        noResults.style.display = matchCount === 0 && term.length > 0 ? 'block' : 'none';
    }
}

/**
 * 검색어 하이라이트
 */
function highlightTermSearch(card, term) {
    const elements = card.querySelectorAll('.term-name, .term-definition, .term-example');
    
    elements.forEach(el => {
        const text = el.innerHTML;
        const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
        el.innerHTML = text.replace(regex, '<mark class="search-highlight">$1</mark>');
    });
}

/**
 * 하이라이트 제거
 */
function removeHighlight(card) {
    const marks = card.querySelectorAll('mark.search-highlight');
    marks.forEach(mark => {
        mark.outerHTML = mark.textContent;
    });
}

/**
 * 정규식 이스케이프
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}