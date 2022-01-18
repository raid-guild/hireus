import './AuctionQueue.scss';

import { useBids } from 'hooks/useBids';
import { useRefresh } from 'hooks/useRefresh';
import React, { useState } from 'react';

import { HiringBoard, OpenBounty } from './components';

const AuctionQueue: React.FC = () => {
  const [refreshCount, refresh] = useRefresh();
  const { consultations } = useBids(refreshCount);
  const [selectedConsultation, setSelectedConsultations] = useState<string>('');

  return (
    <div style={{ width: '100%' }}>
      {/* {!selectedConsultation ? (
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
      )} */}
      <HiringBoard
        consultations={consultations}
        setSelectedConsultations={setSelectedConsultations}
      />
    </div>
  );
};

export default AuctionQueue;
