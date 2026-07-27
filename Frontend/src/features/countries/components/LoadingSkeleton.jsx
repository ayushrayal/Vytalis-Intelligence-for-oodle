import React from 'react';
import { LoadingSkeleton } from '../../../components/common/LoadingSkeleton.jsx';

export default function CountriesSkeleton() {
  return <LoadingSkeleton rows={10} cards={4} title={true} />;
}
