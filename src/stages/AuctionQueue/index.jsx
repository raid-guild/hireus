import React, { useState } from 'react';
import './AuctionQueue.scss'

import { useBids } from '../../hooks/useBids';
import { HiringBoard, OpenBounty } from './components';

const AuctionQueue = () => {
  const { consultations } = useBids();
  const [selectedConsultation, setSelectedConsultations] = useState(null);

  return (
    <div style={{ width: '100%' }}>
      {!selectedConsultation ? <HiringBoard
        consultations={consultations}
        setSelectedConsultations={setSelectedConsultations}
      /> : (
      <OpenBounty
        consultations={consultations}
        selectedConsultation={selectedConsultation}
        setSelectedConsultations={setSelectedConsultations}
      />
      )}
    </div>
  );
};

export default AuctionQueue;
