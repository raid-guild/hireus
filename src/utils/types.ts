export type IBidChange = {
  amount: string;
  changedAt: string;
  increaseTxHash: string;
  increasedAt: string;
  increasedBy: string;
  txHash: string;
}

export type ICombinedBid = {
  airtable_id: string;
  amount: string;
  bidCreated: string;
  bid_id: number;
  changes: IBidChange[];
  createTxHash: string;
  created: string;
  from: string;
  project_name: string;
  status: string;
  submitter: string;
}