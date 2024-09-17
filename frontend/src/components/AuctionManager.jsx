import React, { useState } from 'react';
import CurrentAuctions from '../pages/CurrentAuction';
import SelectedAuction from './SelectedAuction';

const AuctionManager = () => {
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);

  const handleSelectAuction = (auctionId) => {
    setSelectedAuctionId(auctionId);
  };

  const handleBackToList = () => {
    setSelectedAuctionId(null);
  };

  return (
    <div>
      {selectedAuctionId === null ? (
        <CurrentAuctions onSelectAuction={handleSelectAuction} />
      ) : (
        <SelectedAuction auctionId={selectedAuctionId} onBackToList={handleBackToList} />
      )}
    </div>
  );
};

export default AuctionManager;