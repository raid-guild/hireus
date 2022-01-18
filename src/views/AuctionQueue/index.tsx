import './AuctionQueue.scss';

import { useBids } from 'hooks/useBids';
import { useRefresh } from 'hooks/useRefresh';
import { useShares } from 'hooks/useShares';
import React, { useState } from 'react';

import { HiringBoard, OpenBounty } from './components';

const AuctionQueue: React.FC = () => {
  const [refreshCount, refresh] = useRefresh();
  const { consultations } = useBids(refreshCount);
  const { shares, isLoadingShares } = useShares();
  const [selectedConsultation, setSelectedConsultations] = useState<string>('');

  return (
    <div style={{ width: '100%' }}>
      {!selectedConsultation ? (
        <HiringBoard
          consultations={consultations}
          isLoadingShares={isLoadingShares}
          setSelectedConsultations={setSelectedConsultations}
          shares={shares}
        />
      ) : (
        <OpenBounty
          consultations={consultations}
          refresh={refresh}
          selectedConsultation={selectedConsultation}
          setSelectedConsultations={setSelectedConsultations}
          shares={shares}
        />
      )}
    </div>
  );
};

export default AuctionQueue;
