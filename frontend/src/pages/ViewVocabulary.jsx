import PageWrapper from '../components/PageWrapper';
import { VocabularyDetailWrapper as VocabularyDetail } from '../components/VocabularyDetail';

export default function ViewVocabulary() {
  return (
    <PageWrapper>
      <div className="vocab-detail-container">
        <VocabularyDetail />
      </div>
    </PageWrapper>
  );
}
