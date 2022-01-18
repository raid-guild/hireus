import './AuctionQueue.scss';

import { useWallet } from 'contexts/WalletContext';
import { useRefresh } from 'hooks/useRefresh';
import { useShares } from 'hooks/useShares';
import React, { useState } from 'react';

import { HiringBoard, OpenBounty } from './components';

const AuctionQueue: React.FC = () => {
  const { bids, isLoadingBids } = useWallet();
  const [, refresh] = useRefresh();
  const { shares, isLoadingShares } = useShares();
  const [selectedConsultation, setSelectedConsultations] = useState<string>('');

  return (
    <div style={{ width: '100%' }}>
      {!selectedConsultation ? (
        <HiringBoard
          consultations={bids}
          isLoadingBids={isLoadingBids}
          isLoadingShares={isLoadingShares}
          shares={shares}
        />
      ) : (
        <OpenBounty
          consultations={bids}
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
