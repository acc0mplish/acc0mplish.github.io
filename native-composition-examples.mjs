import {normalizeKlicMarkup} from './native-class-contract.mjs';
const rawNativeCompositionExamples=Object.freeze({
 'data-grid':Object.freeze({
  id:'data-workflow',
  title:'검색·선택·수정이 연결된 프로젝트 표',
  description:'초기 빈 목록에서 샘플을 불러오고 한국어 검색·상태 필터·행 선택·상세·편집·오류 재시도를 확인합니다. 브라우저 안에서만 실행되는 로컬 예제입니다.',
  code:`<section class="x-demo" data-native-composition="data-workflow" aria-label="프로젝트 작업 예제">
  <p class="demo-helper">검색과 저장은 이 브라우저 안에서만 실행합니다. 서버 요청은 보내지 않습니다.</p>
  <div class="x-columns">
    <label class="x-field"><span>프로젝트 검색</span><input class="demo-input" type="search" data-workflow-query placeholder="이름·담당자·팀 검색"></label>
    <label class="x-field"><span>상태 필터</span><select class="demo-input" data-workflow-filter><option value="all">모든 상태</option><option value="진행 중">진행 중</option><option value="검토">검토</option><option value="완료">완료</option></select></label>
    <div class="x-button-row"><button class="btn secondary" type="button" data-native-action="load-workflow">샘플 데이터 불러오기</button><button class="btn secondary" type="button" data-native-action="simulate-workflow-error">오류 상황 보기</button></div>
  </div>
  <p class="x-hint" role="status" aria-live="polite" data-workflow-status>목록이 비어 있습니다. 샘플 데이터를 불러오세요.</p>
  <p class="demo-error" role="alert" data-workflow-error hidden><span data-workflow-error-message></span> <span data-workflow-error-preserved>입력과 선택은 유지됩니다.</span> <button class="btn secondary sm" type="button" data-native-action="retry-workflow">다시 시도</button></p>
  <div class="doc-section" data-workflow-empty>
    <strong data-workflow-empty-title>아직 불러온 프로젝트가 없습니다.</strong>
    <p class="demo-helper" data-workflow-empty-description>샘플 데이터를 불러오면 검색과 선택을 시작할 수 있습니다.</p>
    <button class="btn secondary sm" type="button" data-native-action="clear-workflow-filter" hidden>검색·필터 지우기</button>
  </div>
  <div class="grid-preview" data-workflow-grid aria-busy="false">
    <div style="overflow:auto" tabindex="0" role="region" aria-label="프로젝트 결과 표">
      <table class="table-preview">
        <caption class="sr-only">프로젝트를 선택하고 상세 내용을 확인하는 표</caption>
        <thead><tr><th scope="col">선택</th><th scope="col">프로젝트</th><th scope="col">담당자</th><th scope="col">상태</th></tr></thead>
        <tbody data-workflow-rows></tbody>
      </table>
    </div>
  </div>
  <section class="doc-section" data-workflow-detail hidden aria-label="선택한 프로젝트 상세">
    <h3>선택한 프로젝트</h3>
    <dl><dt>이름</dt><dd data-workflow-detail-name></dd><dt>담당자</dt><dd data-workflow-detail-owner></dd><dt>상태</dt><dd data-workflow-detail-status></dd></dl>
    <button class="btn secondary sm" type="button" data-native-action="edit-workflow">수정</button>
  </section>
  <form class="doc-section" data-workflow-edit hidden>
    <h3>프로젝트 수정</h3>
    <label class="demo-label" for="workflow-edit-name">프로젝트 이름</label>
    <input class="demo-input" id="workflow-edit-name" name="name" required maxlength="80" data-workflow-edit-name>
    <label class="demo-label" for="workflow-edit-owner">담당자</label>
    <input class="demo-input" id="workflow-edit-owner" name="owner" required maxlength="60" data-workflow-edit-owner>
    <label class="demo-label" for="workflow-edit-status">상태</label>
    <select class="demo-input" id="workflow-edit-status" name="status" data-workflow-edit-status><option>진행 중</option><option>검토</option><option>완료</option></select>
    <div class="x-button-row"><button class="btn" type="submit">변경 저장</button><button class="btn secondary" type="button" data-native-action="cancel-workflow-edit">취소</button></div>
  </form>
</section>`
 }),
 form:Object.freeze({
  id:'retry-form',
  title:'첫 실패 뒤 입력을 보존하는 폼',
  description:'첫 저장은 로컬 오류로 실패합니다. 입력을 그대로 둔 채 다시 시도하면 성공하며 중복 제출은 진행 중 차단합니다.',
  code:`<section class="x-demo" data-native-composition="retry-form" aria-label="저장 재시도 폼">
  <p class="demo-helper">로컬 데모입니다. 첫 저장은 의도적으로 실패하고 다시 시도하면 완료됩니다.</p>
  <form data-native-retry-form aria-busy="false">
    <label class="demo-label" for="retry-project-name">프로젝트 이름</label>
    <input class="demo-input" id="retry-project-name" name="name" required maxlength="60" autocomplete="off" aria-describedby="retry-project-hint">
    <p class="demo-helper" id="retry-project-hint">실패 뒤에도 입력은 유지됩니다.</p>
    <label class="demo-label" for="retry-project-owner">담당자 이메일</label>
    <input class="demo-input" id="retry-project-owner" name="email" type="email" required autocomplete="email">
    <button class="btn" type="submit" data-native-form-submit>저장하기</button>
    <p class="demo-error" role="alert" data-native-form-error hidden><span data-native-form-error-message></span> <span data-native-form-error-help>입력은 유지됩니다. 아래 버튼으로 다시 시도하세요.</span></p>
    <p class="badge" role="status" aria-live="polite" data-native-form-success hidden><span aria-hidden="true">✓</span> 저장을 완료했습니다.</p>
    <p class="demo-helper" role="status" aria-live="polite" data-native-form-status></p>
  </form>
</section>`
 }),
 command:Object.freeze({
  id:'search-overlays',
  title:'한글 검색·태그·중첩 대화상자',
  description:'검색 결과와 태그·combobox를 조작하고 중첩된 설정 대화상자를 엽니다. Escape는 조합 중 동작을 막고, 정상 입력에서는 가장 위 대화상자부터 닫습니다.',
  code:`<section class="x-demo" data-native-composition="search-overlays" aria-label="검색과 중첩 대화상자 예제">
  <p class="demo-helper">검색·태그는 로컬 상태입니다. 외부 서비스나 계정에 연결하지 않습니다.</p>
  <button class="btn" type="button" data-native-action="open-search-dialog">검색 열기</button>
  <p class="x-hint" role="status" aria-live="polite" data-overlay-page-status></p>
  <dialog class="demo-dialog" data-native-dialog="search" aria-labelledby="overlay-search-title">
    <div class="dialog-header"><h2 id="overlay-search-title">프로젝트 검색</h2><button class="icon-button" type="button" data-native-action="close-search-dialog" aria-label="검색 닫기">닫기</button></div>
    <div class="dialog-body">
      <label class="demo-label" for="overlay-query">검색어</label>
      <input class="demo-input" id="overlay-query" type="search" data-native-overlay-query placeholder="이름으로 검색" autofocus>
      <ul class="x-search-results" data-native-command-results>
        <li><button class="btn secondary sm" type="button" data-native-command>디자인 시스템 정리</button></li>
        <li><button class="btn secondary sm" type="button" data-native-command>브랜드 리뉴얼 검토</button></li>
        <li><button class="btn secondary sm" type="button" data-native-command>모바일 앱 접근성</button></li>
      </ul>
      <p class="x-hint" role="status" aria-live="polite" data-overlay-status></p>
      <form class="x-stack" data-native-tag-form>
        <label class="demo-label" for="overlay-tag">태그 추가</label>
        <div class="x-button-row"><input class="demo-input" id="overlay-tag" name="tag" maxlength="24" data-native-tag placeholder="입력 후 Enter"><button class="btn secondary" type="submit">추가</button></div>
        <ul class="x-chip-list" data-native-tags aria-label="현재 태그"><li data-native-tag-value="디자인">디자인 <button class="kv-button" type="button" data-native-action="remove-native-tag" aria-label="디자인 삭제">×</button></li></ul>
      </form>
      <div class="x-stack">
        <label class="demo-label" for="overlay-combobox">담당 팀</label>
        <input class="demo-input" id="overlay-combobox" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="overlay-team-options" autocomplete="off" data-native-combobox placeholder="팀 검색">
        <div class="x-combo-options" id="overlay-team-options" role="listbox" aria-label="팀 후보" hidden>
          <button type="button" role="option" id="overlay-team-design" aria-selected="false" tabindex="-1" data-native-combo-option>디자인 팀</button>
          <button type="button" role="option" id="overlay-team-product" aria-selected="false" tabindex="-1" data-native-combo-option>제품 팀</button>
          <button type="button" role="option" id="overlay-team-ops" aria-selected="false" tabindex="-1" data-native-combo-option>운영 팀</button>
        </div>
      </div>
      <button class="btn secondary" type="button" data-native-action="open-filter-dialog">검색 설정 열기</button>
    </div>
    <dialog class="demo-dialog" data-native-dialog="filter" aria-labelledby="overlay-filter-title">
      <div class="dialog-header"><h2 id="overlay-filter-title">검색 설정</h2><button class="icon-button" type="button" data-native-action="close-filter-dialog" aria-label="설정 닫기">닫기</button></div>
      <div class="dialog-body"><p>검색 범위는 현재 예제에서만 유지됩니다.</p><label class="demo-label" for="overlay-filter-kind">검색 범위</label><select class="demo-input" id="overlay-filter-kind"><option>모든 프로젝트</option><option>내 담당 프로젝트</option></select></div>
    </dialog>
  </dialog>
</section>`
 })
});
export const NATIVE_COMPOSITION_EXAMPLES=Object.freeze(Object.fromEntries(Object.entries(rawNativeCompositionExamples).map(([key,example])=>[key,Object.freeze({...example,code:normalizeKlicMarkup(example.code,{blockId:example.id})})])));

export function getNativeCompositionExample(componentId){
 return NATIVE_COMPOSITION_EXAMPLES[componentId]||null;
}
