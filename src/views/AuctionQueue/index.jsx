import React, { useState } from 'react';
import './AuctionQueue.scss';

import { useBids } from '../../hooks/useBids';
import { useRefresh } from '../../hooks/useRefresh';
import { HiringBoard, OpenBounty } from './components';

const AuctionQueue = () => {
  const [refreshCount, refresh] = useRefresh();
  const { consultations } = useBids(refreshCount);
  const [selectedConsultation, setSelectedConsultations] = useState(null);

  return (
    <div style={{ width: '100%' }}>
      {!selectedConsultation ? (
        <HiringBoard
          consultations={consultations}
          setSelectedConsultations={setSelectedConsultations}
        />
      ) : (
        <OpenBounty
          consultations={consultations}
          refresh={refresh}
          selectedConsultation={selectedConsultation}
          setSelectedConsultations={setSelectedConsultations}
        />
      )}
    </div>
  );
};

export default AuctionQueue;
