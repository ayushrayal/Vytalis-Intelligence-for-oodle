import React from 'react';
import { ErrorState } from '../../../components/common/ErrorState.jsx';

export default function UsersErrorState({ message, onRetry }) {
  return (
    <ErrorState
      title="Failed to Load Users Analytics"
      message={message}
      onRetry={onRetry}
    />
  );
}
