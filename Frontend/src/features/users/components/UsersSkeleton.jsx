import React from 'react';
import { LoadingSkeleton } from '../../../components/common/LoadingSkeleton.jsx';

export default function UsersSkeleton() {
  return <LoadingSkeleton rows={6} cards={6} title={true} />;
}
