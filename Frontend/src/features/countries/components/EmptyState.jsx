import React from 'react';
import { EmptyState } from '../../../components/common/EmptyState.jsx';

export default function CountriesEmptyState({ onReset }) {
  return (
    <EmptyState
      title="No Country Analytics Found"
      description="No country records match your active search term or sales filter."
      onReset={onReset}
    />
  );
}
