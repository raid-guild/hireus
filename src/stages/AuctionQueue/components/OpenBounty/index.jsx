import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { shortenAddress } from '../../../../utils';
import { AppContext } from '../../../../context/AppContext';

export const OpenBounty = ({
  consultations,
  selectedConsultation,
  setSelectedConsultations,
}) => {
  const { account, connectWallet } = useContext(AppContext);
  const [consultationDetails, setConsultationDetails] = React.useState(null);
  React.useEffect(() => {
    if (selectedConsultation && consultations.length > 0) {
      const consultationDetails = consultations.filter(consultation => {
        return consultation.fields['Project Name'] === selectedConsultation;
      })
      setConsultationDetails(consultationDetails[0]);
    } else {
      setSelectedConsultations(null);
    }
  }, [consultations, selectedConsultation]);

  return (
    <div className="hiringboard-container">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Open Bounty
      </motion.h1>
      {consultationDetails?.fields && <div className="hiringboard-card-container">
        <div className="hiringboard-card">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Project Name: {consultationDetails.fields['Project Name']}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Submitted On: {new Date(consultationDetails.fields['Created']).toLocaleDateString()}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Total Bounty: 0 $RAID
          </motion.p>
        </div>
        {!account ? (
          <div
            className="hiringboard-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Connect a wallet to add or remove $RAID to this bounty
            </motion.p>
            <button
              className='consultation-button consultation-button--close'
              initial={{ x: '100vw' }}
              animate={{ x: 0 }}
              transition={{ delay: 1.3 }}
              onClick={() => {
                connectWallet()
              }}
              style={{
                width: '200px',
              }}
            >
              Connect
            </button>
          </div>
        ) : (
          <div className="hiringboard-card">
            <motion.p
              className="connected-account"
              style={{
                margin: 0,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              connected as:
            </motion.p>
            <motion.p
              className="connected-account"
              style={{
                margin: 0,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {shortenAddress(account)}
            </motion.p>
          </div>
        )}
      </div>}
      <button
        className='consultation-button consultation-button--close'
        initial={{ x: '100vw' }}
        animate={{ x: 0 }}
        transition={{ delay: 1.3 }}
        onClick={() => {
          setSelectedConsultations(null);
        }}
      >
        Close
      </button>
    </div>
  )
}
