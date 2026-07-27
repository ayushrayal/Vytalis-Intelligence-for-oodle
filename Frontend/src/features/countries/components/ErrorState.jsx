import React from 'react';
import { ErrorState } from '../../../components/common/ErrorState.jsx';

export default function CountriesErrorState({ message, onRetry }) {
  return (
    <ErrorState
      title="Failed to Load Countries Analytics"
      message={message}
      onRetry={onRetry}
    />
  );
}
