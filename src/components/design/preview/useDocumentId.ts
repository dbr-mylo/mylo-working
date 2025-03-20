
import { useParams } from 'react-router-dom';

export const useDocumentId = (): string | null => {
  const { documentId } = useParams();
  return documentId || null;
};
