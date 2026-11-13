const sourceArchive = 'docs/shotdrop-—-physics-file-upload-components.zip';
const sourceArchiveSha256 = '626f84638a8596e62ec602c4be4543d2d0aea55a8897e2a54f798d34bebb409d';

export const SHOTDROP_BLOCK_CATALOG = [
  {
    id: 'file-upload-basketball-hoop',
    title: '농구 골대 파일 업로드',
    description: '파일 카드를 드래그하거나 놓고 농구 골대에 던져 넣는 물리 미리보기입니다. 성공 기록은 현재 화면의 로컬 상태로만 유지됩니다.',
    component: 'BasketballUploadBlock',
  },
  {
    id: 'file-upload-soccer-goal',
    title: '축구 골대 파일 업로드',
    description: '파일을 골키퍼가 지키는 축구 골대에 감아 차고 업로드 결과를 확인하는 물리 미리보기입니다. 기록은 현재 화면에만 유지됩니다.',
    component: 'SoccerGoalUploadBlock',
  },
  {
    id: 'file-upload-trash-can',
    title: '휴지통 파일 업로드',
    description: '파일 카드를 구겨 선풍기 바람을 피해 휴지통에 던져 넣는 물리 미리보기입니다. 기록은 현재 화면의 로컬 상태로만 유지됩니다.',
    component: 'TrashCanUploadBlock',
  },
].map(block => ({
  ...block,
  catalogTitle: block.title,
  categoryId: 'app-form',
  categoryName: '폼 양식',
  collection: 'applications',
  implemented: true,
  sourceFile: `components/blocks/${block.component}.tsx`,
  sourceComponent: block.component,
  sourceArchive,
  sourceArchiveSha256,
  variantNote: `${block.component} · KLIC 4계층 토큰 적용 · 로컬 샘플 · project-delivery-record ${sourceArchive}`,
  tags: ['파일 업로드', 'file upload', 'dropzone', 'physics', block.id, block.title],
  origin: 'klic-native',
}));
