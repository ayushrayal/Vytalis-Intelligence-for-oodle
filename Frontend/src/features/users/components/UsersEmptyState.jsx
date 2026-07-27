import React from 'react';
import { EmptyState } from '../../../components/common/EmptyState.jsx';

export default function UsersEmptyState({ onReset }) {
  return (
    <EmptyState
      title="No Users Segment Found"
      description="No platform or gender breakdown segment matches your currently applied filter selection."
      onReset={onReset}
    />
  );
}
