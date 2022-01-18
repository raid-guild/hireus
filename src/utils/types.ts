export type IBidChange = {
  amount: string;
  changedAt: string;
  increaseTxHash: string;
  increasedAt: string;
  increasedBy: string;
  txHash: string;
  withdrawnAt: string;
  withdrawTxHash: string;
};

export type ICombinedBid = {
  airtable_id: string;
  consultation_hash: string;
  amount: string;
  bidCreated: string;
  bid_id: string;
  changes: IBidChange[];
  createTxHash: string;
  created: string;
  from: string;
  project_name: string;
  status: string;
  submitter: string;
};

export type IBid = {
  id: string;
  amount: string;
  submitter: {
    id: string;
  };
  createdAt: string;
  createTxHash: string;
  details: string;
  status: string;
  increases: IBidChange[];
  withdraws: IBidChange[];
};

export type IConsultation = {
  project_name: string;
  consultation_hash: string;
  created: string;
  id: string;
};
